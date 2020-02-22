import { PagesProps } from "../_app";
import { Component } from "react";
import { NextPageContext } from "next";
import express from "express";
import url from "url";
import axios from "axios";

//クライアントキー(自分で用意することを推奨)
const CLIENT_ID = "71b833b9368620c06b3e";
//シークレットキー(自分で用意することを推奨)
const CLIENT_SECRET = "088e82da34f2eb7881c5f3b0440d3d265880c39b";
//OAuth用リダイレクトポート
const PORT = 3000;
//OAuth用リダイレクトURL
const REDIRECT_URI = `http://localhost:${PORT}/github/login`;
const GITHUB_URI = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;

export default class Login extends Component<
  PagesProps & { gitHubToken?: string }
> {
  static async getInitialProps({
    req,
    res
  }: {
    req: express.Request;
    res: express.Response;
  }) {
    if (req && res) {
      const code = url.parse(req.url || "", true).query.code as
        | string
        | undefined;
      if (code) {
        const gitHubToken = await getToken(code);
        if (gitHubToken) {
          if (req.session) req.session.graphqlToken = gitHubToken;
          return { gitHubToken };
        }
      } else {
        res.writeHead(302, {
          Location: GITHUB_URI
        });
        res.end();
      }
    } else window.open(GITHUB_URI);
    return {};
  }
  componentDidMount() {
    const { gitHubToken } = this.props;
    if (gitHubToken) {
      if (window.opener) {
        window.opener.postMessage(
          { action: "UPDATE_GRAPHQL_TOKEN", token: gitHubToken },

          location.href
        );
      }
      close();
    }
  }
  render() {
    return null;
  }
}

function getToken(code: string) {
  return axios
    .post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        state: "token"
      },
      {
        headers: {
          accept: "application/json"
        }
      }
    )
    .then<string | undefined>(response => {
      const { access_token } = response.data;
      return access_token;
    });
}
