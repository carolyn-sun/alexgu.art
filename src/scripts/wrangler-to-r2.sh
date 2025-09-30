#!/bin/bash

BUCKET_NAME="alexgu-art"
PREFIX="https://r2.alexgu.art"

find docs -type f ! -name "*_lq*" \( -iname "*.jpg" -o -iname "*.jpeg" \) | while read file; do
  OBJECT_KEY="${file}"

  echo "UPLOADING $file to $BUCKET_NAME/$OBJECT_KEY"

  npx wrangler r2 object put "$BUCKET_NAME/$OBJECT_KEY" --file "$file"

  if [ $? -eq 0 ]; then
    rm "$file"
    echo "UPLOADED and REMOVED: $file"
  else
    echo "FAILED TO UPLOAD: $file"
  fi
done