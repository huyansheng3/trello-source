import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismiss"}}
export type ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutationVariables = Types.Exact<{
  messageId: Types.Scalars['ID'];
  memberId: Types.Scalars['ID'];
}>;


export type ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismiss"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
export type ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutationFn = Apollo.MutationFunction<ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation, ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutationVariables>;

/**
 * __useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation__
 *
 * To run a mutation, you first call `useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation, { data, loading, error }] = useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation({
 *   variables: {
 *      messageId: // value for 'messageId'
 *      memberId: // value for 'memberId'
 *   },
 * });
 */
export function useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation(baseOptions?: Apollo.MutationHookOptions<ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation, ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation, ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutationVariables>(ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissDocument, options);
      }
export type ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutationHookResult = ReturnType<typeof useConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation>;
export type ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutationResult = Apollo.MutationResult<ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation>;
export type ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutationOptions = Apollo.BaseMutationOptions<ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutation, ConfluenceAutoProvisioningSwitcherNotificationOneTimeMessageDismissMutationVariables>;