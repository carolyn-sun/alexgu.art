#!/bin/bash

# 检查参数
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <remote_name> <branch_name> [<start_commit>] [<batch_size>]"
    echo "Example: $0 backup main abc123 50"
    exit 1
fi

REMOTE=$1
BRANCH=$2
START_COMMIT=${3}  # 获取 START_COMMIT 参数
BATCH_SIZE=${4:-10}  # 如果没有提供 BATCH_SIZE，则默认为10

# 如果 START_COMMIT 为空或为 "-"，则使用最早的提交
if [ -z "$START_COMMIT" ] || [ "$START_COMMIT" == "-" ]; then
    START_COMMIT=$(git rev-list --max-parents=0 HEAD)
fi

# 验证remote是否存在
if ! git remote get-url $REMOTE > /dev/null 2>&1; then
    echo "Error: Remote '$REMOTE' does not exist"
    exit 1
fi

# 验证起始commit是否有效
if ! git rev-parse --verify $START_COMMIT^{commit} > /dev/null 2>&1; then
    echo "Error: Invalid start commit: $START_COMMIT"
    exit 1
fi

# 获取从起始commit到HEAD的所有提交
COMMITS=($(git rev-list --reverse $START_COMMIT..HEAD))
TOTAL_COMMITS=${#COMMITS[@]}

if [ $TOTAL_COMMITS -eq 0 ]; then
    echo "No commits to push after $START_COMMIT"
    exit 0
fi

echo "Found $TOTAL_COMMITS commits to push"
echo "Will push in batches of $BATCH_SIZE commits"

# 计算需要多少批次
BATCHES=$(( (TOTAL_COMMITS + BATCH_SIZE - 1) / BATCH_SIZE ))

for ((i = 0; i < BATCHES; i++)); do
    START_IDX=$((i * BATCH_SIZE))
    if [ $((START_IDX + BATCH_SIZE)) -lt $TOTAL_COMMITS ]; then
        END_COMMIT=${COMMITS[$((START_IDX + BATCH_SIZE - 1))]}
    else
        END_COMMIT=${COMMITS[$((TOTAL_COMMITS - 1))]}
    fi

    START_COMMIT_SHORT=$(git rev-parse --short ${COMMITS[$START_IDX]})
    END_COMMIT_SHORT=$(git rev-parse --short $END_COMMIT)

    echo "Pushing batch $((i + 1))/$BATCHES: $START_COMMIT_SHORT..$END_COMMIT_SHORT"

    # 尝试推送这一批次的提交
    if git push $REMOTE $END_COMMIT:refs/heads/$BRANCH; then
        echo "Successfully pushed batch $((i + 1))"
    else
        echo "Error pushing batch $((i + 1))"
        echo "Failed at commit range: $START_COMMIT_SHORT..$END_COMMIT_SHORT"
        echo "You can resume from the last successful commit"
        exit 1
    fi

    # 添加小延迟，避免触发GitHub的限制
    sleep 2
done

echo "All commits have been pushed successfully!"