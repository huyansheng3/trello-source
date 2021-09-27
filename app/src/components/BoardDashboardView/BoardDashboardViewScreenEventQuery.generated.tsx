import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardDashboardViewScreenEvent"}}
export type BoardDashboardViewScreenEventQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type BoardDashboardViewScreenEventQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'idOrganization' | 'idEnterprise'>
    & { dashboardViewTiles: Array<(
      { __typename: 'Board_DashboardViewTile' }
      & Pick<Types.Board_DashboardViewTile, 'id' | 'type'>
      & { graph: (
        { __typename: 'Board_DashboardViewTile_Graph' }
        & Pick<Types.Board_DashboardViewTile_Graph, 'type'>
      ) }
    )> }
  )> }
);


export const BoardDashboardViewScreenEventDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardDashboardViewScreenEvent"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"dashboardViewTiles"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"graph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardDashboardViewScreenEventQuery__
 *
 * To run a query within a React component, call `useBoardDashboardViewScreenEventQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardDashboardViewScreenEventQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardDashboardViewScreenEventQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useBoardDashboardViewScreenEventQuery(baseOptions: Apollo.QueryHookOptions<BoardDashboardViewScreenEventQuery, BoardDashboardViewScreenEventQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardDashboardViewScreenEventQuery, BoardDashboardViewScreenEventQueryVariables>(BoardDashboardViewScreenEventDocument, options);
      }
export function useBoardDashboardViewScreenEventLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardDashboardViewScreenEventQuery, BoardDashboardViewScreenEventQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardDashboardViewScreenEventQuery, BoardDashboardViewScreenEventQueryVariables>(BoardDashboardViewScreenEventDocument, options);
        }
export type BoardDashboardViewScreenEventQueryHookResult = ReturnType<typeof useBoardDashboardViewScreenEventQuery>;
export type BoardDashboardViewScreenEventLazyQueryHookResult = ReturnType<typeof useBoardDashboardViewScreenEventLazyQuery>;
export type BoardDashboardViewScreenEventQueryResult = Apollo.QueryResult<BoardDashboardViewScreenEventQuery, BoardDashboardViewScreenEventQueryVariables>;