import { Component } from "react";
import { NextPageContext } from "next";
import { Request } from "express";

export default class Logout extends Component {
  static async getInitialProps({ req }: NextPageContext) {
    if (req) delete (req as Request).session;
    return {};
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
