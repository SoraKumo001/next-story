import React from "react";
import App, { AppContext, createUrl } from "next/app";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject
} from "apollo-boost";
import fetch from "isomorphic-unfetch";
import { ApolloProvider, getMarkupFromTree } from "react-apollo";
import { initialSession } from "@components/next-session";
import axios from "axios";
const IS_BROWSER = !!process.browser;
const URI_ENDPOINT = "https://api.github.com/graphql";

function createClient(
  token: string | undefined | null,
  initialState: any = {}
) {
  return new ApolloClient({
    connectToDevTools: IS_BROWSER,
    ssrMode: !IS_BROWSER,
    link: new HttpLink({
      fetch,
      uri: URI_ENDPOINT,
      headers: {
        authorization: `bearer ${token}`
      }
    }),
    cache: new InMemoryCache().restore(initialState)
  });
}

export interface PagesProps {
  url: ReturnType<typeof createUrl>;
  graphqlToken?: string;
}
export interface Props {
  pageProps: PagesProps;
}
interface State {
  client?: ApolloClient<NormalizedCacheObject>;
}

export default class _App extends App<Props, PagesProps, State> {
  static async getInitialProps({ ctx, Component }: AppContext) {
    if (IS_BROWSER)
      return {
        pageProps:
          (Component.getInitialProps && Component.getInitialProps(ctx)) || {}
      };

    const session = await initialSession(ctx);
    const graphqlToken = session && session.graphqlToken;
    const client = createClient(graphqlToken);
    const pageProps =
      Component.getInitialProps && (await Component.getInitialProps(ctx));
    await getMarkupFromTree({
      tree: (
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      )
    }).catch(() => {});
    return {
      pageProps: {
        ...pageProps,
        graphqlToken,
        apolloCache: client.extract()
      }
    };
  }
  state: State = {};
  onMessage(event: MessageEvent) {
    if (event?.data?.action === "UPDATE_GRAPHQL_TOKEN") {
      const token = event?.data?.token;
      if (token) localStorage.setItem("graphqlToken", token);
      else localStorage.removeItem("graphqlToken");
      this.setState({ client: createClient(token) });
      this.forceUpdate();
    }
  }
  componentDidMount() {
    const graphqlToken =
      typeof window !== "undefined" && localStorage.getItem("graphqlToken");
    if (graphqlToken) {
      if (!this.props.pageProps.token) {
        axios.post("/api/token", {
          graphqlToken
        });
      }
    }
    if (!this.state.client) {
      this.setState({
        client: createClient(
          this.props.pageProps.token || graphqlToken,
          this.props.pageProps.apolloCache
        )
      });
      this.forceUpdate();
    }
    addEventListener("message", e => this.onMessage(e));
  }
  render() {
    const { router, Component, pageProps } = this.props;
    const url = createUrl(router);

    return (
      <>
        {this.state.client && (
          <ApolloProvider client={this.state.client}>
            <Component {...pageProps} url={url} />
          </ApolloProvider>
        )}
      </>
    );
  }
}
