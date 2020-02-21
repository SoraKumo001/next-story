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

function createClient(token: string, initialState?: NormalizedCacheObject) {
  return new ApolloClient({
    connectToDevTools: IS_BROWSER,
    ssrMode: !IS_BROWSER,
    link: new HttpLink({
      fetch: IS_BROWSER ? fetch : undefined,
      uri: URI_ENDPOINT,
      headers: { Authorization: `bearer ${token}` },
      credentials: "same-origin"
    }),
    cache: new InMemoryCache().restore(initialState || {})
  });
}

import express from "express";
import expressSession from "express-session";
const session = expressSession({
  secret: "nextjs"
});
export interface PagesProps {
  url: ReturnType<typeof createUrl>;
}
export default class _App extends App {
  static token: string = "";
  static async getInitialProps(context: AppContext) {
    const { ctx } = context;
    const req = ctx.req as express.Request | undefined;
    if (!req) return App.getInitialProps(context);
    return new Promise<AppInitialProps>(resolv => {
      session(req, ctx.res as express.Response, () => {
        _App.token = req.session["token"] || "";
        resolv(App.getInitialProps(context));
      });
    });
  }
  render() {
    const client = createClient(_App.token);
    const { router, Component, pageProps } = this.props;
    const url = createUrl(router);
    return (
      <ApolloProvider client={client}>
        <Component {...pageProps} url={url} />
      </ApolloProvider>
    );
  }
}
