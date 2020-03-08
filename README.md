# next-session

## 概要

Nest.jsでexpress-sessionを使い、GitHubのGraphQLAPIのOAuthトークンを保存し、  
SSRでApolloを利用するサンプルです  

セッション情報の保存はRedisを使用しています  
RedisはDockerを使用して立ち上げる仕組みになっています  

## コマンド

- 開発用起動コマンド(Redis-Dockerも起動する)  
yarn dev
- 起動コマンド(事前にビルドが必要、Redis-Dockerコンテナは自動起動しない)  
yarn start
- ビルド  
yarn build
- Dockerから起動(Unixドメインソケットを使い、コンテナからアプリを起動する)  
start-docker

## 解説サイト

細かい内容は以下のサイトを参照してください  
[Next.js入門](https://ttis.croud.jp/?uuid=d647e641-61d6-468a-82d7-66fc63df1687)
