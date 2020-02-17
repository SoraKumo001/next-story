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
  static async getInitialProps({ Component, ctx }: AppContext) {
   // ctx.req["session"]["test"] = 'aaaa';
    return (Component.getInitialProps
      ? Component.getInitialProps(ctx)
      : {}) as AppInitialProps;
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
