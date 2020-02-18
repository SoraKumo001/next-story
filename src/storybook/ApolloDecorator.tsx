import * as React from "react";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const URI_ENDPOINT = "https://api.github.com/graphql";
const TOKEN = process.env.GRAPHQL_TOKEN;
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
const apolloDecorator = storyFn => (
  <ApolloProvider client={client}>{storyFn()}</ApolloProvider>
);

export {apolloDecorator}