import React from "react";
import App, { AppContext, AppInitialProps, createUrl } from "next/app";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from "apollo-boost";
import fetch from "isomorphic-unfetch";
import { ApolloProvider } from "react-apollo";

const IS_BROWSER = !!process.browser;
const URI_ENDPOINT = "https://api.github.com/graphql";
const TOKEN = "";
function createClient(initialState?: NormalizedCacheObject) {
  return new ApolloClient({
    connectToDevTools: IS_BROWSER,
    ssrMode: !IS_BROWSER,
    link: new HttpLink({
      fetch: IS_BROWSER ? fetch : undefined,
      uri: URI_ENDPOINT,
      headers: { Authorization: `bearer ${TOKEN}` },
      credentials: "same-origin"
    }),
    cache: new InMemoryCache().restore(initialState || {})
  });
}

const client = createClient();

import express from "express";
import expressSession from "express-session";
const session = expressSession({
  secret: "nextjs"
});
export interface PagesProps {
  url: ReturnType<typeof createUrl>;
}
export default class _App extends App {
  static async getInitialProps({ Component, ctx }: AppContext) {
    if (!ctx.req) return Component.getInitialProps(ctx) as AppInitialProps;
    return new Promise<AppInitialProps>(resolv => {
      session(ctx.req as express.Request, ctx.res as express.Response, () => {
        resolv(
          (Component.getInitialProps
            ? Component.getInitialProps(ctx)
            : {}) as AppInitialProps
        );
      });
    });
  }
  render() {
    const { router, Component, pageProps } = this.props;
    const url = createUrl(router);
    return (
      <ApolloProvider client={client}>
        <Component {...pageProps} url={url} />
      </ApolloProvider>
    );
  }
}
