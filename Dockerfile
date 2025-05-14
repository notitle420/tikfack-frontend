# ======================
# 1. ビルド用ステージ
# ======================
FROM node:22-alpine AS builder

# 作業ディレクトリ設定
WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存ライブラリをインストール
RUN npm install

# 残りのソースをコピー
COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}
RUN npm run build

# 本番用にビルド
RUN npm run build

# ======================
# 2. 配信用(Nginx)ステージ
# ======================
FROM nginx:stable-alpine

# ビルド成果物をNginxの静的配信ディレクトリにコピー
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

# Nginx実行
CMD ["nginx", "-g", "daemon off;"]
