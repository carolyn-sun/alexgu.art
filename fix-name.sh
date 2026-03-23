#!/bin/zsh

# This script checks all files under docs/ and ensures that their names
# don't contain spaces, '-', or '_'. If they do, remove those characters.
# It also ensures all file extensions are lowercase.
# Run chmod +x fix-name.sh to make it executable.

# 修改点 1：增加 -name "*.[A-Z]*" 以捕获带有大写字母后缀的文件（如 .JPG）
find docs/ -type f \( -name "* *" -o -name "*-*" -o -name "*_*" -o -name "*.[A-Z]*" \) | while read -r file; do
    if [[ "$file" == *"_lq."* ]]; then
        continue
    fi
    dir=$(dirname "$file")
    base=$(basename "$file")
    
    # 原有的清理特殊字符和增加前缀的逻辑
    if [[ "$base" == _* ]]; then
        new_base="_$(echo "${base:1}" | tr -d ' _-')"
        check_name="${new_base:1}"
        if [[ "$check_name" =~ ^[0-9] ]]; then
            new_base="_IMGG$check_name"
        fi
    else
        new_base=$(echo "$base" | tr -d ' _-')
        if [[ "$new_base" =~ ^[0-9] ]]; then
            new_base="IMGG$new_base"
        fi
    fi

    # 修改点 2：新增扩展名转小写的逻辑
    # 检查文件名中是否包含 "." (即是否有扩展名)
    if [[ "$new_base" == *.* ]]; then
        # 从最后面的 "." 拆分文件名和扩展名 (支持类似 name.test.JPG 格式)
        name="${new_base%.*}"
        ext="${new_base##*.}"
        
        # 使用 zsh 内置的 :l 修饰符将扩展名转换为小写
        ext="${ext:l}"
        
        # 重新拼接
        new_base="${name}.${ext}"
    fi

    # 执行重命名和 git 跟踪
    new_file="$dir/$new_base"
    if [[ "$file" != "$new_file" ]]; then
        mv "$file" "$new_file"
        git add "$new_file"
        echo "Renamed: '$file' to '$new_file'"
    fi
done

echo "FILE RENAMING COMPLETED."