import { createConnectTransport } from "@bufbuild/connect-web";
import { createPromiseClient } from "@bufbuild/connect";
import { VideoService } from "../generated/proto/video/video_connectweb";

// トランスポートの設定
const transport = createConnectTransport({
  baseUrl: "http://localhost:50051", // APIサーバーのURLを設定
});

// VideoServiceのクライアントを作成
export const VideoServiceClient = createPromiseClient(VideoService, transport);