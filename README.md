# TikFack - Video Scrolling App

ビデオスクロールアプリケーションのフロントエンド部分です。

## 機能

- 垂直スクロールによる動画閲覧
- Connect RPC および REST API サポート
- モバイルフレンドリーな UI

## 環境変数

フロントエンドのAPIタイプを指定するには以下の環境変数を設定します：

| 環境変数 | 説明 | デフォルト値 |
|----------|------|-------------|
| REACT_APP_API_URL | REST API のURL | http://localhost:8080 |
| REACT_APP_CONNECT_API_URL | Connect RPC のURL | http://localhost:8080 |
| REACT_APP_API_TYPE | 使用するAPIタイプ ('rest' または 'connect') | rest |

## 開発セットアップ

### Connect RPC 対応のための準備

1. protoc コマンドラインツールをインストールしてください（https://github.com/protocolbuffers/protobuf/releases）

2. Connect RPC 用の protoc プラグインをインストールしてください：
   ```
   npm install -g @bufbuild/protoc-gen-connect-es @bufbuild/protoc-gen-es
   ```

3. Protoファイルからコードを生成するには以下のコマンドを実行します：
   ```
   cd src/proto
   chmod +x generate.sh
   ./generate.sh
   ```

### アプリケーションの起動

```bash
npm install
npm start
```

## Connect RPC とは？

Connect RPC は、直感的で使いやすいRPCフレームワークです。gRPC-Webと比較して以下の利点があります：

- よりシンプルな実装（ボイラープレートコードが少ない）
- 優れたTypeScript体験（型安全性が高い）
- HTTP/1.1およびHTTP/2の両方でのサポート（gRPC-Webが必須ではない）
- ブラウザとサーバー間のやり取りがシンプル
- 典型的なJSON/HTTP APIに比べてパフォーマンスが向上

## Docker での実行

プロジェクトルートディレクトリで以下を実行してください：

```bash
docker-compose up --build
```

これにより、フロントエンド、バックエンド、Envoyプロキシが起動します。

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.