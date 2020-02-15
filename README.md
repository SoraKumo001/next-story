# next-story

## 概要

Visual Regression Testのサンプルです
以下のようなことを行っています

- githubにpushした時点で、コンポーネントのキャプチャデータをcapture/*ブランチに保存
- 元ブランチが削除されたらcapture/*も削除
- pull-request時にgh-pagesに差分データを追加し、スコアと結果リンクをコメントとして保存
- pull-request中に対象のブランチが更新されたら、差分データを追記
- pull-requestがcloseされたら、gh-pagesから対応する結果の削除
- pull-requestがreopenされたら、差分データを再度生成

## 解説サイト

細かい内容は以下のサイトを参照してください
[Next.js入門](https://ttis.croud.jp/?uuid=d647e641-61d6-468a-82d7-66fc63df1687)

## ファイル構成

github-actionsでVisual Regression Testの自動化を行うために以下のファイルが必要となります

```text
.github
├── scripts
│   ├── comment.js
│   └── reg-local.js
└── workflows
    ├── vtest-delete.yml
    ├── vtest-pull-close.yml
    ├── vtest-pull-request.yml
    └── vtest-push.yml
```
