import React from "react";
import Link from "next/link";

export default () => (
  <>
    <div>こんにちは世界！</div>
    <br />
    <button>ボタンの追加</button>
    <Link href="page02">
      <a>Page2へ</a>
    </Link>
  </>
);
