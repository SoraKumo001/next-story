import { PagesProps } from "./_app";
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
const REDIRECT_URI = `http://localhost:${PORT}/login`;

const login = () => {
  window.open(
    `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`,
    "_blank"
  );
};

export default class Login extends Component<PagesProps & { token?: string }> {
  static async getInitialProps({ req }: NextPageContext) {
    if (req) {
      const code = url.parse(req.url, true).query.code as string | undefined;
      if (code) {
        const token = await getToken(code);
        if (token) {
          (req as express.Request).session.token = token;
          return { token };
        }
      }
    }
    return {};
  }
  componentDidMount() {
    if (this.props.token) {
      window.opener.postMessage({ token: this.props.token }, location.href);
      close();
    } else
      addEventListener(
        "message",
        event => {
          if (location.origin.indexOf(event.origin) === 0)
            if (event.data.token)
              localStorage.setItem("token", event.data.token);
        },
        false
      );
  }
  render() {
    return (
      <>
        <button onClick={login}>ログイン</button>
      </>
    );
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
