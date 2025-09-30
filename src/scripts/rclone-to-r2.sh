#!/bin/bash

REMOTE="r2:alexgu-art"
PREFIX="https://r2.alexgu.art"

find docs -type f ! -name "*_lq*" \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read file; do
  echo "UPLOADING $file to $REMOTE/${file}"
  rclone copyto --progress --ignore-existing "$file" "$REMOTE/${file}"
  rm "$file"
  echo "UPLOADED and REMOVED: $file"
done