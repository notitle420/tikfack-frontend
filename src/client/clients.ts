import { createConnectTransport, ConnectInterceptor } from '@bufbuild/connect-web';
import { createPromiseClient } from '@bufbuild/connect';
import { VideoService } from '../generated/proto/video/video_connectweb';
import keycloak from '../auth/keycloak';

// Authorization ヘッダーを付与するインターセプタ
const authInterceptor: ConnectInterceptor = {
  wrap(next) {
    return async (req) => {
      req.header.set('authorization', `Bearer ${keycloak.token}`);
      return next(req);
    };
  },
};

// トランスポートの設定
const transport = createConnectTransport({
  baseUrl: 'http://localhost:50051',
  interceptors: [authInterceptor],
});

// VideoService のクライアントを作成
export const VideoServiceClient = createPromiseClient(VideoService, transport);
