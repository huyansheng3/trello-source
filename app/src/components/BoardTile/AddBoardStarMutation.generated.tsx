import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AddBoardStar"}}
export type AddBoardStarMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
  boardId: Types.Scalars['ID'];
  pos: Types.Scalars['Int'];
}>;


export type AddBoardStarMutation = (
  { __typename: 'Mutation' }
  & { addBoardStar?: Types.Maybe<(
    { __typename: 'BoardStar' }
    & Pick<Types.BoardStar, 'id' | 'idBoard' | 'pos'>
  )> }
);


export const AddBoardStarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddBoardStar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"pos"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addBoardStar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"pos"},"value":{"kind":"Variable","name":{"kind":"Name","value":"pos"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idBoard"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}}]}}]}}]} as unknown as DocumentNode;
export type AddBoardStarMutationFn = Apollo.MutationFunction<AddBoardStarMutation, AddBoardStarMutationVariables>;

/**
 * __useAddBoardStarMutation__
 *
 * To run a mutation, you first call `useAddBoardStarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBoardStarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBoardStarMutation, { data, loading, error }] = useAddBoardStarMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      boardId: // value for 'boardId'
 *      pos: // value for 'pos'
 *   },
 * });
 */
export function useAddBoardStarMutation(baseOptions?: Apollo.MutationHookOptions<AddBoardStarMutation, AddBoardStarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddBoardStarMutation, AddBoardStarMutationVariables>(AddBoardStarDocument, options);
      }
export type AddBoardStarMutationHookResult = ReturnType<typeof useAddBoardStarMutation>;
export type AddBoardStarMutationResult = Apollo.MutationResult<AddBoardStarMutation>;
export type AddBoardStarMutationOptions = Apollo.BaseMutationOptions<AddBoardStarMutation, AddBoardStarMutationVariables>;