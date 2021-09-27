import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"BoardPermissionsAndDetails"}}
export type BoardPermissionsAndDetailsQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type BoardPermissionsAndDetailsQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'name' | 'idOrganization' | 'idEnterprise'>
    & { organization?: Types.Maybe<(
      { __typename: 'Organization' }
      & { memberships: Array<(
        { __typename: 'Organization_Membership' }
        & Pick<Types.Organization_Membership, 'idMember' | 'memberType'>
      )> }
    )>, memberships: Array<(
      { __typename: 'Board_Membership' }
      & Pick<Types.Board_Membership, 'idMember' | 'memberType'>
    )>, members: Array<(
      { __typename: 'Member' }
      & Pick<Types.Member, 'id' | 'fullName'>
    )> }
  )> }
);


export const BoardPermissionsAndDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"BoardPermissionsAndDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"idOrganization"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"memberships"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idMember"}},{"kind":"Field","name":{"kind":"Name","value":"memberType"}}]}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fullName"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useBoardPermissionsAndDetailsQuery__
 *
 * To run a query within a React component, call `useBoardPermissionsAndDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardPermissionsAndDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardPermissionsAndDetailsQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useBoardPermissionsAndDetailsQuery(baseOptions: Apollo.QueryHookOptions<BoardPermissionsAndDetailsQuery, BoardPermissionsAndDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BoardPermissionsAndDetailsQuery, BoardPermissionsAndDetailsQueryVariables>(BoardPermissionsAndDetailsDocument, options);
      }
export function useBoardPermissionsAndDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BoardPermissionsAndDetailsQuery, BoardPermissionsAndDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BoardPermissionsAndDetailsQuery, BoardPermissionsAndDetailsQueryVariables>(BoardPermissionsAndDetailsDocument, options);
        }
export type BoardPermissionsAndDetailsQueryHookResult = ReturnType<typeof useBoardPermissionsAndDetailsQuery>;
export type BoardPermissionsAndDetailsLazyQueryHookResult = ReturnType<typeof useBoardPermissionsAndDetailsLazyQuery>;
export type BoardPermissionsAndDetailsQueryResult = Apollo.QueryResult<BoardPermissionsAndDetailsQuery, BoardPermissionsAndDetailsQueryVariables>;