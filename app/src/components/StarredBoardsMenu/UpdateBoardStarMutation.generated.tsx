import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpdateBoardStar"}}
export type UpdateBoardStarMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
  boardStarId: Types.Scalars['ID'];
  pos: Types.Scalars['Int'];
}>;


export type UpdateBoardStarMutation = (
  { __typename: 'Mutation' }
  & { updateBoardStar?: Types.Maybe<(
    { __typename: 'BoardStar' }
    & Pick<Types.BoardStar, 'id'>
  )> }
);


export const UpdateBoardStarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateBoardStar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardStarId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pos"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateBoardStar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"boardStarId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardStarId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pos"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pos"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type UpdateBoardStarMutationFn = Apollo.MutationFunction<UpdateBoardStarMutation, UpdateBoardStarMutationVariables>;

/**
 * __useUpdateBoardStarMutation__
 *
 * To run a mutation, you first call `useUpdateBoardStarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBoardStarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBoardStarMutation, { data, loading, error }] = useUpdateBoardStarMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      boardStarId: // value for 'boardStarId'
 *      pos: // value for 'pos'
 *   },
 * });
 */
export function useUpdateBoardStarMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBoardStarMutation, UpdateBoardStarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBoardStarMutation, UpdateBoardStarMutationVariables>(UpdateBoardStarDocument, options);
      }
export type UpdateBoardStarMutationHookResult = ReturnType<typeof useUpdateBoardStarMutation>;
export type UpdateBoardStarMutationResult = Apollo.MutationResult<UpdateBoardStarMutation>;
export type UpdateBoardStarMutationOptions = Apollo.BaseMutationOptions<UpdateBoardStarMutation, UpdateBoardStarMutationVariables>;