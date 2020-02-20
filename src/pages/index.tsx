import React from "react";
import Link from "next/link";
import { Test01 } from "@components/Test01";

//import gql from "graphql-tag";
// import { Query } from "react-apollo";
// import { TestQueryQuery } from "../generated/graphql";
// const TEST_QUERY = gql`
//   query TestQuery {
//     viewer {
//       login
//     }
//   }
// `;

export default () => (
  <>
    <div>こんにちは世界！</div>
    <Test01 />
    {/* <Query<TestQueryQuery> query={TEST_QUERY}>
      {({ loading, data, error }) => (
        <>
          {loading && <div>Loading</div>}
      {error && <div>{error.message}</div>}
        </>
      )}
    </Query> */}
    <Link href="login">
    <a>Login</a>
  </Link>
    <Link href="page02">
      <a>Page2へ</a>
    </Link>
  </>
);
