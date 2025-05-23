import { createConnectTransport} from '@connectrpc/connect-web';
import { createPromiseClient,type Interceptor} from '@connectrpc/connect';
import { VideoService } from '../generated/proto/video/video_connect';
import keycloak from '../auth/keycloak';

// Authorization ヘッダーを付与するインターセプタ
const authInterceptor: Interceptor = (next) => async (req) => {
  req.header.set('authorization', `Bearer ${keycloak.token}`);
  return next(req);
};

// トランスポートの設定
const transport = createConnectTransport({
  baseUrl: 'http://localhost:50051',
  interceptors: [authInterceptor],
});

// VideoService のクライアントを作成
export const VideoServiceClient = createPromiseClient(VideoService, transport);
