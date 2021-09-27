import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceChooserChangeBoardVisibility"}}
export type WorkspaceChooserChangeBoardVisibilityMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  visibility: Types.Board_Prefs_PermissionLevel;
  orgId?: Types.Maybe<Types.Scalars['ID']>;
  keepBillableGuests?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type WorkspaceChooserChangeBoardVisibilityMutation = (
  { __typename: 'Mutation' }
  & { updateBoardVisibility?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
  )> }
);


export const WorkspaceChooserChangeBoardVisibilityDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"WorkspaceChooserChangeBoardVisibility"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"visibility"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Board_Prefs_PermissionLevel"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keepBillableGuests"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardVisibility"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"visibility"},"value":{"kind":"Variable","name":{"kind":"Name","value":"visibility"}}},{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"keepBillableGuests"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keepBillableGuests"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type WorkspaceChooserChangeBoardVisibilityMutationFn = Apollo.MutationFunction<WorkspaceChooserChangeBoardVisibilityMutation, WorkspaceChooserChangeBoardVisibilityMutationVariables>;

/**
 * __useWorkspaceChooserChangeBoardVisibilityMutation__
 *
 * To run a mutation, you first call `useWorkspaceChooserChangeBoardVisibilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceChooserChangeBoardVisibilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [workspaceChooserChangeBoardVisibilityMutation, { data, loading, error }] = useWorkspaceChooserChangeBoardVisibilityMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      visibility: // value for 'visibility'
 *      orgId: // value for 'orgId'
 *      keepBillableGuests: // value for 'keepBillableGuests'
 *   },
 * });
 */
export function useWorkspaceChooserChangeBoardVisibilityMutation(baseOptions?: Apollo.MutationHookOptions<WorkspaceChooserChangeBoardVisibilityMutation, WorkspaceChooserChangeBoardVisibilityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WorkspaceChooserChangeBoardVisibilityMutation, WorkspaceChooserChangeBoardVisibilityMutationVariables>(WorkspaceChooserChangeBoardVisibilityDocument, options);
      }
export type WorkspaceChooserChangeBoardVisibilityMutationHookResult = ReturnType<typeof useWorkspaceChooserChangeBoardVisibilityMutation>;
export type WorkspaceChooserChangeBoardVisibilityMutationResult = Apollo.MutationResult<WorkspaceChooserChangeBoardVisibilityMutation>;
export type WorkspaceChooserChangeBoardVisibilityMutationOptions = Apollo.BaseMutationOptions<WorkspaceChooserChangeBoardVisibilityMutation, WorkspaceChooserChangeBoardVisibilityMutationVariables>;