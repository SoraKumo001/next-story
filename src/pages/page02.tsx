import { Head } from "@components/Head";
import { LinkBox } from "../components/LinkBox";
import gql from "graphql-tag";
import { RepoListQuery, RepoListQueryVariables } from "@generated/graphql";
import { Query } from "react-apollo";
import { PagesProps } from "./_app";

const TEST_QUERY = gql`
  query RepoList($count: Int = 5, $before: String, $after: String) {
    viewer {
      contributionsCollection {
        repositoryContributions(first: $count, before: $before, after: $after) {
          pageInfo {
            startCursor
            hasPreviousPage
            hasNextPage
            endCursor
          }
          totalCount
          nodes {
            repository {
              id
              name
              url
              createdAt
            }
          }
        }
      }
    }
  }
`;

export default ({ url }: PagesProps) => {
  const outputReps = (data: RepoListQuery) => {
    const repositoryContributions =
      data.viewer.contributionsCollection.repositoryContributions;
    const nodes = repositoryContributions.nodes?.filter(node => node)!;
    const pageInfo = repositoryContributions.pageInfo;
    return (
      <>
        <style jsx>{`
          .error {
            color: red;
          }
          .reps {
            margin: 0.2em;
            display: block;
            text-decoration: none;
            padding: 0.5em;
            border-radius: 2px;
            border: solid 1px gray;
            background-color: aliceblue;
          }
          .reps:nth-child(odd) {
            background-color: ivory;
          }
          .data {
            display: inline-block;
            width: 20em;
          }
        `}</style>
        <div>
          <LinkBox
            key={pageInfo.startCursor || ""}
            enable={pageInfo.hasPreviousPage}
            href={`?before=${pageInfo.startCursor}`}
          >
            前頁
          </LinkBox>

          <LinkBox
            key={pageInfo.endCursor || ""}
            enable={pageInfo.hasNextPage}
            href={`?after=${pageInfo.endCursor}`}
          >
            後頁
          </LinkBox>
        </div>
        <div>
          {nodes.map(node => (
            <a
              className="reps"
              key={node?.repository.id}
              target="_new"
              href={node?.repository.url}
            >
              <span className="date">
                {new Date(node?.repository.createdAt).toLocaleString()}
              </span>
              <span className="name">{node?.repository.name}</span>
            </a>
          ))}
        </div>
      </>
    );
  };
  const { before, after }: RepoListQueryVariables = url?.query || {};
  return (
    <>
      <style jsx>{`
        .error {
          color: red;
        }
      `}</style>
      <Head />
      <LinkBox href="../">Topへ</LinkBox>

      <Query<RepoListQuery, RepoListQueryVariables>
        query={TEST_QUERY}
        variables={{ after, before }}
      >
        {({ loading, data, error }) => (
          <>
            {error && <div className="error">{error.message}</div>}
            {loading ? <div>Loading</div> : data && outputReps(data)}
          </>
        )}
      </Query>
    </>
  );
};
