import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"GuestWorkspaces"}}
export type GuestWorkspacesQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type GuestWorkspacesQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & { guestOrganizations: Array<(
      { __typename: 'GuestOrganization' }
      & Pick<Types.GuestOrganization, 'id' | 'displayName' | 'logoHash'>
    )> }
  )> }
);


export const GuestWorkspacesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GuestWorkspaces"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"guestOrganizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"logoHash"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useGuestWorkspacesQuery__
 *
 * To run a query within a React component, call `useGuestWorkspacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGuestWorkspacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGuestWorkspacesQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useGuestWorkspacesQuery(baseOptions: Apollo.QueryHookOptions<GuestWorkspacesQuery, GuestWorkspacesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GuestWorkspacesQuery, GuestWorkspacesQueryVariables>(GuestWorkspacesDocument, options);
      }
export function useGuestWorkspacesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GuestWorkspacesQuery, GuestWorkspacesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GuestWorkspacesQuery, GuestWorkspacesQueryVariables>(GuestWorkspacesDocument, options);
        }
export type GuestWorkspacesQueryHookResult = ReturnType<typeof useGuestWorkspacesQuery>;
export type GuestWorkspacesLazyQueryHookResult = ReturnType<typeof useGuestWorkspacesLazyQuery>;
export type GuestWorkspacesQueryResult = Apollo.QueryResult<GuestWorkspacesQuery, GuestWorkspacesQueryVariables>;