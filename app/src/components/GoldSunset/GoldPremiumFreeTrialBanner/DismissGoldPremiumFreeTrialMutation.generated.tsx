import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"DismissGoldPremiumFreeTrial"}}
export type DismissGoldPremiumFreeTrialMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
  messageId: Types.Scalars['ID'];
}>;


export type DismissGoldPremiumFreeTrialMutation = (
  { __typename: 'Mutation' }
  & { addOneTimeMessagesDismissed?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id' | 'oneTimeMessagesDismissed'>
  )> }
);


export const DismissGoldPremiumFreeTrialDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DismissGoldPremiumFreeTrial"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addOneTimeMessagesDismissed"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"messageId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"messageId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"oneTimeMessagesDismissed"}}]}}]}}]} as unknown as DocumentNode;
export type DismissGoldPremiumFreeTrialMutationFn = Apollo.MutationFunction<DismissGoldPremiumFreeTrialMutation, DismissGoldPremiumFreeTrialMutationVariables>;

/**
 * __useDismissGoldPremiumFreeTrialMutation__
 *
 * To run a mutation, you first call `useDismissGoldPremiumFreeTrialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDismissGoldPremiumFreeTrialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [dismissGoldPremiumFreeTrialMutation, { data, loading, error }] = useDismissGoldPremiumFreeTrialMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useDismissGoldPremiumFreeTrialMutation(baseOptions?: Apollo.MutationHookOptions<DismissGoldPremiumFreeTrialMutation, DismissGoldPremiumFreeTrialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DismissGoldPremiumFreeTrialMutation, DismissGoldPremiumFreeTrialMutationVariables>(DismissGoldPremiumFreeTrialDocument, options);
      }
export type DismissGoldPremiumFreeTrialMutationHookResult = ReturnType<typeof useDismissGoldPremiumFreeTrialMutation>;
export type DismissGoldPremiumFreeTrialMutationResult = Apollo.MutationResult<DismissGoldPremiumFreeTrialMutation>;
export type DismissGoldPremiumFreeTrialMutationOptions = Apollo.BaseMutationOptions<DismissGoldPremiumFreeTrialMutation, DismissGoldPremiumFreeTrialMutationVariables>;