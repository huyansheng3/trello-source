import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessage"}}
export type ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQueryVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
}>;


export type ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery__
 *
 * To run a query within a React component, call `useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery` and pass it any options that fit your needs.
 * When your component renders, `useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery({
 *   variables: {
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery(baseOptions: Apollo.QueryHookOptions<ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery, ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery, ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQueryVariables>(ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDocument, options);
      }
export function useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery, ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery, ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQueryVariables>(ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDocument, options);
        }
export type ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQueryHookResult = ReturnType<typeof useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery>;
export type ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageLazyQueryHookResult = ReturnType<typeof useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageLazyQuery>;
export type ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQueryResult = Apollo.QueryResult<ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQuery, ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageQueryVariables>;