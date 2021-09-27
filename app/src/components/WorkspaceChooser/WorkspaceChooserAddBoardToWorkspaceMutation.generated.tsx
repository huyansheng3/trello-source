import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"WorkspaceChooserAddBoardToWorkspace"}}
export type WorkspaceChooserAddBoardToWorkspaceMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  orgId?: Types.Maybe<Types.Scalars['ID']>;
  keepBillableGuests?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type WorkspaceChooserAddBoardToWorkspaceMutation = (
  { __typename: 'Mutation' }
  & { updateBoardOrg?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
  )> }
);


export const WorkspaceChooserAddBoardToWorkspaceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"WorkspaceChooserAddBoardToWorkspace"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"keepBillableGuests"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardOrg"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"orgId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}},{"kind":"Argument","name":{"kind":"Name","value":"keepBillableGuests"},"value":{"kind":"Variable","name":{"kind":"Name","value":"keepBillableGuests"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type WorkspaceChooserAddBoardToWorkspaceMutationFn = Apollo.MutationFunction<WorkspaceChooserAddBoardToWorkspaceMutation, WorkspaceChooserAddBoardToWorkspaceMutationVariables>;

/**
 * __useWorkspaceChooserAddBoardToWorkspaceMutation__
 *
 * To run a mutation, you first call `useWorkspaceChooserAddBoardToWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWorkspaceChooserAddBoardToWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [workspaceChooserAddBoardToWorkspaceMutation, { data, loading, error }] = useWorkspaceChooserAddBoardToWorkspaceMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      orgId: // value for 'orgId'
 *      keepBillableGuests: // value for 'keepBillableGuests'
 *   },
 * });
 */
export function useWorkspaceChooserAddBoardToWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<WorkspaceChooserAddBoardToWorkspaceMutation, WorkspaceChooserAddBoardToWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WorkspaceChooserAddBoardToWorkspaceMutation, WorkspaceChooserAddBoardToWorkspaceMutationVariables>(WorkspaceChooserAddBoardToWorkspaceDocument, options);
      }
export type WorkspaceChooserAddBoardToWorkspaceMutationHookResult = ReturnType<typeof useWorkspaceChooserAddBoardToWorkspaceMutation>;
export type WorkspaceChooserAddBoardToWorkspaceMutationResult = Apollo.MutationResult<WorkspaceChooserAddBoardToWorkspaceMutation>;
export type WorkspaceChooserAddBoardToWorkspaceMutationOptions = Apollo.BaseMutationOptions<WorkspaceChooserAddBoardToWorkspaceMutation, WorkspaceChooserAddBoardToWorkspaceMutationVariables>;