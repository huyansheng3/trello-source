import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardStars"}}
export type BoardStarsQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type BoardStarsQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & { boardStars: Array<(
      { __typename: 'BoardStar' }
      & Pick<Types.BoardStar, 'id' | 'idBoard' | 'pos'>
    )> }
  )> }
);


export const BoardStarsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardStars"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"boardStars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardStarsQuery__
 *
 * To run a query within a React component, call `useBoardStarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardStarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardStarsQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useBoardStarsQuery(baseOptions: Apollo.QueryHookOptions<BoardStarsQuery, BoardStarsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardStarsQuery, BoardStarsQueryVariables>(BoardStarsDocument, options);
      }
export function useBoardStarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardStarsQuery, BoardStarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardStarsQuery, BoardStarsQueryVariables>(BoardStarsDocument, options);
        }
export type BoardStarsQueryHookResult = ReturnType<typeof useBoardStarsQuery>;
export type BoardStarsLazyQueryHookResult = ReturnType<typeof useBoardStarsLazyQuery>;
export type BoardStarsQueryResult = Apollo.QueryResult<BoardStarsQuery, BoardStarsQueryVariables>;