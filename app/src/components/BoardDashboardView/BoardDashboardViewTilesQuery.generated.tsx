import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardDashboardViewTiles"}}
export type BoardDashboardViewTilesQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type BoardDashboardViewTilesQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { dashboardViewTiles: Array<(
      { __typename: 'Board_DashboardViewTile' }
      & Pick<Types.Board_DashboardViewTile, 'id' | 'type' | 'pos' | 'dateLastActivity'>
      & { from?: Types.Maybe<(
        { __typename: 'Board_DashboardViewTile_From' }
        & Pick<Types.Board_DashboardViewTile_From, 'dateType' | 'value'>
      )>, graph: (
        { __typename: 'Board_DashboardViewTile_Graph' }
        & Pick<Types.Board_DashboardViewTile_Graph, 'type'>
      ) }
    )> }
  )> }
);


export const BoardDashboardViewTilesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardDashboardViewTiles"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dashboardViewTiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateType"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"graph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardDashboardViewTilesQuery__
 *
 * To run a query within a React component, call `useBoardDashboardViewTilesQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardDashboardViewTilesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardDashboardViewTilesQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useBoardDashboardViewTilesQuery(baseOptions: Apollo.QueryHookOptions<BoardDashboardViewTilesQuery, BoardDashboardViewTilesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardDashboardViewTilesQuery, BoardDashboardViewTilesQueryVariables>(BoardDashboardViewTilesDocument, options);
      }
export function useBoardDashboardViewTilesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardDashboardViewTilesQuery, BoardDashboardViewTilesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardDashboardViewTilesQuery, BoardDashboardViewTilesQueryVariables>(BoardDashboardViewTilesDocument, options);
        }
export type BoardDashboardViewTilesQueryHookResult = ReturnType<typeof useBoardDashboardViewTilesQuery>;
export type BoardDashboardViewTilesLazyQueryHookResult = ReturnType<typeof useBoardDashboardViewTilesLazyQuery>;
export type BoardDashboardViewTilesQueryResult = Apollo.QueryResult<BoardDashboardViewTilesQuery, BoardDashboardViewTilesQueryVariables>;