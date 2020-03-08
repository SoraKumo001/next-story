import { Query } from "react-apollo";
import { TestQueryQuery } from "src/generated/graphql";
import gql from "graphql-tag";
import { Head } from "@components/Head";
import { LinkBox } from "@components/LinkBox";

const TEST_QUERY = gql`
  query TestQuery {
    viewer {
      login
    }
  }
`;

export default () => (
  <>
    <style jsx>{`
      .error {
        color: red;
      }
    `}</style>
    <Head />
    <LinkBox href="page02">ページ2へ</LinkBox>
    <Query<TestQueryQuery> query={TEST_QUERY}>
      {({ loading, data, error }) => (
        <>
          {loading && <div>Loading</div>}
          {error && <div className="error">{error.message}</div>}
          {data && <div>ログインユーザ: {data.viewer.login}</div>}
        </>
      )}
    </Query>
  </>
);
