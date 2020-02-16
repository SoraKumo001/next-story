import React from "react";
import Link from "next/link";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { TestQueryQuery } from "../generated/graphql";
const TEST_QUERY = gql`
  query TestQuery{
    viewer {
      login
    }
  }
`;

export default () => (
  <>
    <div>こんにちは世界！</div>
    <Query<TestQueryQuery> query={TEST_QUERY}>
      {({ loading, data,error }) =>
        loading ? <div>Loading</div> : <div>{JSON.stringify(data||error)}</div>
      }
    </Query>
    <Link href="page02">
      <a>Page2へ</a>
    </Link>
  </>
);
