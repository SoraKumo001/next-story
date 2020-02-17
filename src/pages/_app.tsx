import React, { Component } from "react";
import App, { Container, AppContext, AppInitialProps } from "next/app";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from "apollo-boost";
import fetch from "isomorphic-unfetch";
import { ApolloProvider } from "react-apollo";
import session from "express-session";

const s = session({
  secret: "nextjs",
  resave: true,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true, maxAge: 1000 * 60 * 30 }
});

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

export default class _App extends App {
  static getInitialProps({ Component, ctx }: AppContext) {
    return new Promise<AppInitialProps>(resolv => {
      if (ctx.req)
        s(ctx.req as any, ctx.res as any, () => {
          console.log(ctx.req["session"]);
          ctx.req["session"]["test"] = new Date().toLocaleString();
          // s(ctx.req as any, ctx.res as any,()=>{});
          resolv(
            (Component.getInitialProps
              ? Component.getInitialProps(ctx)
              : {}) as AppInitialProps
          );
        });
      else
        resolv(
          (Component.getInitialProps
            ? Component.getInitialProps(ctx)
            : {}) as AppInitialProps
        );
    });
  }
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </Container>
    );
  }
}
