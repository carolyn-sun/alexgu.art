#!/bin/bash

REMOTE="r2:alexgu-art"
PREFIX="https://r2.alexgu.art"

find docs -type f ! -name "*lq*" \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.gif" \) | while read file; do
  echo "UPLOADING $file TO $REMOTE/${file}"
  rclone copyto --progress --ignore-existing "$file" "$REMOTE/${file}"
  rm "$file"
  echo "UPLOADED AND REMOVED: $file"
done