import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"RemoveBoardStar"}}
export type RemoveBoardStarMutationVariables = Types.Exact<{
  memberId: Types.Scalars['ID'];
  boardStarId: Types.Scalars['ID'];
}>;


export type RemoveBoardStarMutation = (
  { __typename: 'Mutation' }
  & Pick<Types.Mutation, 'removeBoardStar'>
);


export const RemoveBoardStarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveBoardStar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardStarId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"removeBoardStar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"memberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"memberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"boardStarId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardStarId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]}]}}]} as unknown as DocumentNode;
export type RemoveBoardStarMutationFn = Apollo.MutationFunction<RemoveBoardStarMutation, RemoveBoardStarMutationVariables>;

/**
 * __useRemoveBoardStarMutation__
 *
 * To run a mutation, you first call `useRemoveBoardStarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveBoardStarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeBoardStarMutation, { data, loading, error }] = useRemoveBoardStarMutation({
 *   variables: {
 *      memberId: // value for 'memberId'
 *      boardStarId: // value for 'boardStarId'
 *   },
 * });
 */
export function useRemoveBoardStarMutation(baseOptions?: Apollo.MutationHookOptions<RemoveBoardStarMutation, RemoveBoardStarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveBoardStarMutation, RemoveBoardStarMutationVariables>(RemoveBoardStarDocument, options);
      }
export type RemoveBoardStarMutationHookResult = ReturnType<typeof useRemoveBoardStarMutation>;
export type RemoveBoardStarMutationResult = Apollo.MutationResult<RemoveBoardStarMutation>;
export type RemoveBoardStarMutationOptions = Apollo.BaseMutationOptions<RemoveBoardStarMutation, RemoveBoardStarMutationVariables>;