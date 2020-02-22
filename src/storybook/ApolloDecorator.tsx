import * as React from "react";
import router, { Router } from "next/router";

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const URI_ENDPOINT = "https://api.github.com/graphql";
const TOKEN = process.env.STORYBOOK_GITHUB_TOKEN;

router.router = ({
  push: async (url: string) => {
    console.log("router-push", url);
  },
  prefetch: async (url: string) => {
    console.log("router-prefech", url);
  }
} as unknown) as Router;

function createClient(initialState?: NormalizedCacheObject) {
  return new ApolloClient({
    link: new HttpLink({
      uri: URI_ENDPOINT,
      headers: { Authorization: `bearer ${TOKEN}` }
    }),
    cache: new InMemoryCache().restore(initialState || {})
  });
}
const client = createClient();
const apolloDecorator = (story: () => JSX.Element) => (
  <ApolloProvider client={client}>{story()}</ApolloProvider>
);

export { apolloDecorator };
