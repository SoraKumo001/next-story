const express = require("express");
const request = require("request");
const open = require("open");

//クライアントキー(自分で用意することを推奨)
const CLIENT_ID = "3b0235e2f088add6922e";
//シークレットキー(自分で用意することを推奨)
const CLIENT_SECRET = "f719f65187f2320698e9878cc764c91d1c9fed15";
//OAuth用リダイレクトポート
const PORT = 9002;
//OAuth用リダイレクトURL
const REDIRECT_URI = `http://localhost:${PORT}/api/token`;

const CODEGEN_SETTING = {
  overwrite: true,
  documents: "src/**/*.{ts,tsx}",
  generates: {
    "src/generated/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo"
      ]
    },
    "graphql/graphql.schema.json": { plugins: ["introspection"] }
  }
};

module.exports = new Promise(resolve => {
  console.log("OAuth login");
  const app = express();
  const server = app.listen(PORT, () => {
    open(
      `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`
    );
  });

  app.get("/api/token", function(req, res) {
    const code = req.query.code;
    if (code) {
      console.log("Recv onetime token");
      request(
        {
          method: "POST",
          url: "https://github.com/login/oauth/access_token",
          form: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
            state: "token"
          },
          headers: {
            accept: "application/json"
          }
        },
        function(_error, _response, body) {
          const { access_token } = JSON.parse(body);
          if (access_token) {
            console.log("Recv access token");
            res.end("<HTML><HEAD><SCRIPT>window.close()</SCRIPT></HEAD></HTML>");
            server.close(() => {
              setting = {
                ...CODEGEN_SETTING,
                schema: {
                  "https://api.github.com/graphql": {
                    headers: {
                      Authorization: `bearer ${access_token}`
                    }
                  }
                }
              };
              resolve(setting);
            });
          }
        }
      );
    }
  });
});
