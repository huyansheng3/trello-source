import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspacesPreambleAddTeamMembers"}}
export type WorkspacesPreambleAddTeamMembersMutationVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
  user: Types.MemberOrEmail;
  traceId: Types.Scalars['String'];
}>;


export type WorkspacesPreambleAddTeamMembersMutation = (
  { __typename: 'Mutation' }
  & { addMemberToOrg?: Types.Maybe<(
    { __typename: 'InviteMember_Response' }
    & Pick<Types.InviteMember_Response, 'success'>
  )> }
);


export const WorkspacesPreambleAddTeamMembersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"WorkspacesPreambleAddTeamMembers"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"user"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MemberOrEmail"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addMemberToOrg"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"user"},"value":{"kind":"Variable","name":{"kind":"Name","value":"user"}}},{"kind":"Argument","name":{"kind":"Name","value":"invitationMessage"},"value":{"kind":"StringValue","value":"","block":false}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]} as unknown as DocumentNode;
export type WorkspacesPreambleAddTeamMembersMutationFn = Apollo.MutationFunction<WorkspacesPreambleAddTeamMembersMutation, WorkspacesPreambleAddTeamMembersMutationVariables>;

/**
 * __useWorkspacesPreambleAddTeamMembersMutation__
 *
 * To run a mutation, you first call `useWorkspacesPreambleAddTeamMembersMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWorkspacesPreambleAddTeamMembersMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [workspacesPreambleAddTeamMembersMutation, { data, loading, error }] = useWorkspacesPreambleAddTeamMembersMutation({
 *   variables: {
 *      orgId: // value for 'orgId'
 *      user: // value for 'user'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useWorkspacesPreambleAddTeamMembersMutation(baseOptions?: Apollo.MutationHookOptions<WorkspacesPreambleAddTeamMembersMutation, WorkspacesPreambleAddTeamMembersMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WorkspacesPreambleAddTeamMembersMutation, WorkspacesPreambleAddTeamMembersMutationVariables>(WorkspacesPreambleAddTeamMembersDocument, options);
      }
export type WorkspacesPreambleAddTeamMembersMutationHookResult = ReturnType<typeof useWorkspacesPreambleAddTeamMembersMutation>;
export type WorkspacesPreambleAddTeamMembersMutationResult = Apollo.MutationResult<WorkspacesPreambleAddTeamMembersMutation>;
export type WorkspacesPreambleAddTeamMembersMutationOptions = Apollo.BaseMutationOptions<WorkspacesPreambleAddTeamMembersMutation, WorkspacesPreambleAddTeamMembersMutationVariables>;