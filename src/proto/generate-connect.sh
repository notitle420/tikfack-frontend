#!/bin/bash

# Connectで使用するプロトファイル生成スクリプト
# このスクリプトを実行すると、protoファイルからTypeScriptコードが生成されます

# 必要な場合、以下のツールをインストール:
# npm install -g @bufbuild/buf @bufbuild/protoc-gen-es @connectrpc/protoc-gen-connect-es

# protoディレクトリに移動
cd "$(dirname "$0")"

# 出力先ディレクトリを作成
mkdir -p generated

# BUFを使用する方法（推奨）
if command -v buf &>/dev/null; then
  echo "BUFを使用してProtobufコードを生成します..."
  buf generate
else
  # BUFがない場合は従来のprotocを使用
  echo "protocを使用してProtobufコードを生成します..."
  protoc \
    --plugin=protoc-gen-es=../../node_modules/.bin/protoc-gen-es \
    --plugin=protoc-gen-connect-es=../../node_modules/.bin/protoc-gen-connect-es \
    --es_out=./generated \
    --es_opt=target=ts \
    --connect-es_out=./generated \
    --connect-es_opt=target=ts \
    ./video.proto
fi

echo "Connectプロトコルファイルが正常に生成されました！"