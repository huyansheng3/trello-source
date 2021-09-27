import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"RecentBoardsDetail"}}
export type RecentBoardsDetailQueryVariables = Types.Exact<{
  idBoards: Array<Types.Scalars['ID']> | Types.Scalars['ID'];
}>;


export type RecentBoardsDetailQuery = (
  { __typename: 'Query' }
  & { boards: Array<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id' | 'dateLastView' | 'dateLastActivity' | 'closed' | 'name' | 'shortLink'>
    & { organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & Pick<Types.Organization, 'displayName'>
    )>, prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'background' | 'backgroundImage' | 'backgroundColor' | 'backgroundTile' | 'isTemplate'>
      & { backgroundImageScaled?: Types.Maybe<Array<(
        { __typename: 'Board_Prefs_BackgroundImageScaled' }
        & Pick<Types.Board_Prefs_BackgroundImageScaled, 'width' | 'height' | 'url'>
      )>> }
    )> }
  )> }
);


export const RecentBoardsDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"RecentBoardsDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoards"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ids"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoards"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastView"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"closed"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"shortLink"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"displayName"}}]}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"background"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImage"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundImageScaled"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"width"}},{"kind":"Field","name":{"kind":"Name","value":"height"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"backgroundColor"}},{"kind":"Field","name":{"kind":"Name","value":"backgroundTile"}},{"kind":"Field","name":{"kind":"Name","value":"isTemplate"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useRecentBoardsDetailQuery__
 *
 * To run a query within a React component, call `useRecentBoardsDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useRecentBoardsDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRecentBoardsDetailQuery({
 *   variables: {
 *      idBoards: // value for 'idBoards'
 *   },
 * });
 */
export function useRecentBoardsDetailQuery(baseOptions: Apollo.QueryHookOptions<RecentBoardsDetailQuery, RecentBoardsDetailQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RecentBoardsDetailQuery, RecentBoardsDetailQueryVariables>(RecentBoardsDetailDocument, options);
      }
export function useRecentBoardsDetailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RecentBoardsDetailQuery, RecentBoardsDetailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RecentBoardsDetailQuery, RecentBoardsDetailQueryVariables>(RecentBoardsDetailDocument, options);
        }
export type RecentBoardsDetailQueryHookResult = ReturnType<typeof useRecentBoardsDetailQuery>;
export type RecentBoardsDetailLazyQueryHookResult = ReturnType<typeof useRecentBoardsDetailLazyQuery>;
export type RecentBoardsDetailQueryResult = Apollo.QueryResult<RecentBoardsDetailQuery, RecentBoardsDetailQueryVariables>;