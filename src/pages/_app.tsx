import React from "react";
import App, { AppContext, AppInitialProps, createUrl } from "next/app";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloLink,
  from
} from "apollo-boost";
import fetch from "isomorphic-fetch";
import { ApolloProvider } from "react-apollo";

const IS_BROWSER = !!process.browser;
const URI_ENDPOINT = "https://api.github.com/graphql";

const apolloLinkToken = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    return {
      headers: {
        ...headers,
        authorization: `bearer ${token}` || null
      }
    };
  });
  return forward(operation);
});

function createClient() {
  return new ApolloClient({
    connectToDevTools: IS_BROWSER,
    ssrMode: !IS_BROWSER,
    ssrForceFetchDelay:1000,
    link: from([
      apolloLinkToken,
      new HttpLink({
        fetch,
        uri: URI_ENDPOINT,
        credentials: "same-origin"
      })
    ]),
    cache: new InMemoryCache()
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
let client = createClient();
var token = "";

export default class _App extends App<{ token?: string }> {
  static token: string = "";
  static async getInitialProps(context: AppContext) {
    const { ctx } = context;
    const req = ctx.req as express.Request | undefined;
    if (!req) return App.getInitialProps(context);
    return new Promise<AppInitialProps>(resolv => {
      session(req, ctx.res as express.Response, async () => {
        token = req.session["token"] || "";
        console.log(token)
        resolv({
          pageProps: {
            ...((await App.getInitialProps(context)).pageProps),
            token
          }
        });
      });
    });
  }
  render() {
    const { router, Component, pageProps } = this.props;
    const url = createUrl(router);
    token = pageProps.token;

    return (
      <ApolloProvider client={client}>
        <Component {...pageProps} url={url} />
      </ApolloProvider>
    );
  }
}
