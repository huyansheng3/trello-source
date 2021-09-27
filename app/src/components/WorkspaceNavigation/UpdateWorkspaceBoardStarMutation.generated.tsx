import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpdateWorkspaceBoardStar"}}
export type UpdateWorkspaceBoardStarMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
  boardStarId: Types.Scalars['ID'];
  pos: Types.Scalars['Int'];
}>;


export type UpdateWorkspaceBoardStarMutation = (
  { __typename: 'Mutation' }
  & { updateBoardStar?: Types.Maybe<(
    { __typename: 'BoardStar' }
    & Pick<Types.BoardStar, 'id'>
  )> }
);


export const UpdateWorkspaceBoardStarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWorkspaceBoardStar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardStarId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pos"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardStar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"boardStarId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardStarId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pos"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pos"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type UpdateWorkspaceBoardStarMutationFn = Apollo.MutationFunction<UpdateWorkspaceBoardStarMutation, UpdateWorkspaceBoardStarMutationVariables>;

/**
 * __useUpdateWorkspaceBoardStarMutation__
 *
 * To run a mutation, you first call `useUpdateWorkspaceBoardStarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWorkspaceBoardStarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWorkspaceBoardStarMutation, { data, loading, error }] = useUpdateWorkspaceBoardStarMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      boardStarId: // value for 'boardStarId'
 *      pos: // value for 'pos'
 *   },
 * });
 */
export function useUpdateWorkspaceBoardStarMutation(baseOptions?: Apollo.MutationHookOptions<UpdateWorkspaceBoardStarMutation, UpdateWorkspaceBoardStarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWorkspaceBoardStarMutation, UpdateWorkspaceBoardStarMutationVariables>(UpdateWorkspaceBoardStarDocument, options);
      }
export type UpdateWorkspaceBoardStarMutationHookResult = ReturnType<typeof useUpdateWorkspaceBoardStarMutation>;
export type UpdateWorkspaceBoardStarMutationResult = Apollo.MutationResult<UpdateWorkspaceBoardStarMutation>;
export type UpdateWorkspaceBoardStarMutationOptions = Apollo.BaseMutationOptions<UpdateWorkspaceBoardStarMutation, UpdateWorkspaceBoardStarMutationVariables>;