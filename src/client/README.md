# Video Service Connect-Web Client

このディレクトリには、VideoService のための Connect-Web クライアントが含まれています。

## 使い方

### クライアントのインポート

```typescript
import { videoClient, getVideos, getVideoById } from "../client";
import { Video, User } from "../client";  // 型をインポート
```

### 動画一覧の取得

```typescript
// 便利な関数を使用
const response = await getVideos();
const videos = response.videos;

// または直接クライアントを使用
const response = await videoClient.getVideos({ date: "2023-01-01" });
const videos = response.videos;
```

### 特定の動画の取得

```typescript
// 便利な関数を使用
const response = await getVideoById("video-123");
const video = response.video;

// または直接クライアントを使用
const response = await videoClient.getVideoById({ id: "video-123" });
const video = response.video;
```

## 環境設定

デフォルトでは、クライアントは `http://localhost:8080` に接続するように設定されています。
異なる URL を使用するには、`src/client/index.ts` の `baseUrl` を変更してください。

## エラーハンドリング

Connect-Web クライアントのエラーハンドリングの例：

```typescript
import { ConnectError, Code } from "@connectrpc/connect";

try {
  const response = await getVideos();
  // 成功した場合の処理
} catch (err) {
  if (err instanceof ConnectError) {
    switch (err.code) {
      case Code.NotFound:
        console.error("リソースが見つかりません");
        break;
      case Code.Unauthenticated:
        console.error("認証が必要です");
        break;
      default:
        console.error(`エラー: ${err.code} - ${err.message}`);
    }
  } else {
    console.error("予期しないエラー:", err);
  }
}
```