#!/bin/zsh

# This script checks all files under docs/ and ensures that their names
# don't contain spaces, '-', or '_'. If they do, remove those characters
# and rename the files accordingly.
# Run chmod +x fix-name.sh to make it executable.

find docs/ -type f \( -name "* *" -o -name "*-*" -o -name "*_*" \) | while read -r file; do
    if [[ "$file" == *"_lq."* ]]; then
        continue
    fi
    dir=$(dirname "$file")
    base=$(basename "$file")
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
    new_file="$dir/$new_base"
    if [[ "$file" != "$new_file" ]]; then
        mv "$file" "$new_file"
        git add "$new_file"
        echo "Renamed: '$file' to '$new_file'"
    fi
done

echo "FILE RENAMING COMPLETED."