#!/bin/bash

if [ -f ./.env ]; then
  source ./.env
fi

REMOTE="r2:alexgu-art"
PREFIX="https://r2.alexgu.art"

find docs -type f ! -name "*_lq*" \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read file; do
  echo "UPLOADING $file to $REMOTE/${file}"
  if rclone copyto --progress --ignore-existing "$file" "$REMOTE/${file}"; then
    rm "$file"
    echo "UPLOADED and REMOVED: $file"
  else
    echo "FAILED TO UPLOAD: $file (keeping local copy)"
  fi
done