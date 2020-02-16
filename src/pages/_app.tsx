import React from "react";
import { Container } from "next/app";
import { ApolloClient,HttpLink,InMemoryCache, NormalizedCacheObject } from "apollo-boost";
import fetch from "isomorphic-unfetch";
import { ApolloProvider } from "react-apollo";

const IS_BROWSER = !!process.browser;
const URI_ENDPOINT = "https://api.github.com/graphql";
const TOKEN = '';
function createClient(initialState?:NormalizedCacheObject) {
  return new ApolloClient({
    connectToDevTools: IS_BROWSER,
    ssrMode: !IS_BROWSER,
    link: new HttpLink({
      fetch: IS_BROWSER ? fetch : undefined,
      uri: URI_ENDPOINT,
      headers:{Authorization: `bearer ${TOKEN}`},
      credentials: "same-origin"
    }),
    cache: new InMemoryCache().restore(initialState || {})
  });
}

const client = createClient();

export default props => {
  const { Component, pageProps, apolloClient } = props;
  return (
    <Container>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Container>
  );
};