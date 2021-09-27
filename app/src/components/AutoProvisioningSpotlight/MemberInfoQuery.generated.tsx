import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MemberInfo"}}
export type MemberInfoQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type MemberInfoQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'aaId'>
  )> }
);


export const MemberInfoDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MemberInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"aaId"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useMemberInfoQuery__
 *
 * To run a query within a React component, call `useMemberInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useMemberInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMemberInfoQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useMemberInfoQuery(baseOptions: Apollo.QueryHookOptions<MemberInfoQuery, MemberInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MemberInfoQuery, MemberInfoQueryVariables>(MemberInfoDocument, options);
      }
export function useMemberInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MemberInfoQuery, MemberInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MemberInfoQuery, MemberInfoQueryVariables>(MemberInfoDocument, options);
        }
export type MemberInfoQueryHookResult = ReturnType<typeof useMemberInfoQuery>;
export type MemberInfoLazyQueryHookResult = ReturnType<typeof useMemberInfoLazyQuery>;
export type MemberInfoQueryResult = Apollo.QueryResult<MemberInfoQuery, MemberInfoQueryVariables>;