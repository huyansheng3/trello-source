import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"MigrationWizardMembershipDropdown"}}
export type MigrationWizardMembershipDropdownMutationVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
  user: Types.MemberOrEmail;
  type?: Types.Maybe<Types.Scalars['String']>;
}>;


export type MigrationWizardMembershipDropdownMutation = (
  { __typename: 'Mutation' }
  & { addMemberToOrg?: Types.Maybe<(
    { __typename: 'InviteMember_Response' }
    & Pick<Types.InviteMember_Response, 'success'>
  )> }
);


export const MigrationWizardMembershipDropdownDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"MigrationWizardMembershipDropdown"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MemberOrEmail"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"type"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMemberToOrg"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}},{"kind":"Argument","name":{"kind":"Name","value":"invitationMessage"},"value":{"kind":"StringValue","value":"","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"type"},"value":{"kind":"Variable","name":{"kind":"Name","value":"type"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"StringValue","value":"","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
export type MigrationWizardMembershipDropdownMutationFn = Apollo.MutationFunction<MigrationWizardMembershipDropdownMutation, MigrationWizardMembershipDropdownMutationVariables>;

/**
 * __useMigrationWizardMembershipDropdownMutation__
 *
 * To run a mutation, you first call `useMigrationWizardMembershipDropdownMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMigrationWizardMembershipDropdownMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [migrationWizardMembershipDropdownMutation, { data, loading, error }] = useMigrationWizardMembershipDropdownMutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      user: // value for 'user'
 *      type: // value for 'type'
 *   },
 * });
 */
export function useMigrationWizardMembershipDropdownMutation(baseOptions?: Apollo.MutationHookOptions<MigrationWizardMembershipDropdownMutation, MigrationWizardMembershipDropdownMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<MigrationWizardMembershipDropdownMutation, MigrationWizardMembershipDropdownMutationVariables>(MigrationWizardMembershipDropdownDocument, options);
      }
export type MigrationWizardMembershipDropdownMutationHookResult = ReturnType<typeof useMigrationWizardMembershipDropdownMutation>;
export type MigrationWizardMembershipDropdownMutationResult = Apollo.MutationResult<MigrationWizardMembershipDropdownMutation>;
export type MigrationWizardMembershipDropdownMutationOptions = Apollo.BaseMutationOptions<MigrationWizardMembershipDropdownMutation, MigrationWizardMembershipDropdownMutationVariables>;