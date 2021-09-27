import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"RecentBoardsSlim"}}
export type RecentBoardsSlimQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type RecentBoardsSlimQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & { boards: Array<(
      { __typename: 'Board' }
      & Pick<Types.Board, 'id' | 'dateLastView' | 'closed'>
    )>, boardStars: Array<(
      { __typename: 'BoardStar' }
      & Pick<Types.BoardStar, 'id' | 'idBoard' | 'pos'>
    )> }
  )> }
);


export const RecentBoardsSlimDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentBoardsSlim"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}}]}},{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useRecentBoardsSlimQuery__
 *
 * To run a query within a React component, call `useRecentBoardsSlimQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecentBoardsSlimQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecentBoardsSlimQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useRecentBoardsSlimQuery(baseOptions: Apollo.QueryHookOptions<RecentBoardsSlimQuery, RecentBoardsSlimQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecentBoardsSlimQuery, RecentBoardsSlimQueryVariables>(RecentBoardsSlimDocument, options);
      }
export function useRecentBoardsSlimLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecentBoardsSlimQuery, RecentBoardsSlimQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecentBoardsSlimQuery, RecentBoardsSlimQueryVariables>(RecentBoardsSlimDocument, options);
        }
export type RecentBoardsSlimQueryHookResult = ReturnType<typeof useRecentBoardsSlimQuery>;
export type RecentBoardsSlimLazyQueryHookResult = ReturnType<typeof useRecentBoardsSlimLazyQuery>;
export type RecentBoardsSlimQueryResult = Apollo.QueryResult<RecentBoardsSlimQuery, RecentBoardsSlimQueryVariables>;