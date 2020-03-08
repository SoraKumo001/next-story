import { Component } from "react";
import { NextPageContext } from "next";
import { Request } from "express";

export default class Logout extends Component {
  static async getInitialProps({ req }: NextPageContext) {
    if ((req as Request)?.session?.destroy) {
      return new Promise(resolve =>
        (req as Request)?.session?.destroy(() => {
          resolve();
        })
      );
    }
  }
  componentDidMount() {
    if (window.opener) {
      window.opener.postMessage(
        { action: "UPDATE_GRAPHQL_TOKEN" },
        location.href
      );
    }
    close();
  }

  render() {
    return <>logout</>;
  }
}
