import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpdateCheckItemState"}}
export type UpdateCheckItemStateMutationVariables = Types.Exact<{
  cardId: Types.Scalars['ID'];
  checklistId: Types.Scalars['ID'];
  checkItemId: Types.Scalars['ID'];
  state: Types.CheckItem_State;
  traceId: Types.Scalars['String'];
}>;


export type UpdateCheckItemStateMutation = (
  { __typename: 'Mutation' }
  & { updateCheckItemState?: Types.Maybe<(
    { __typename: 'CheckItem' }
    & Pick<Types.CheckItem, 'id' | 'state'>
  )> }
);


export const UpdateCheckItemStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCheckItemState"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checklistId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"checkItemId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"state"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CheckItem_State"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCheckItemState"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"cardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"checklistId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checklistId"}}},{"kind":"Argument","name":{"kind":"Name","value":"checkItemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"checkItemId"}}},{"kind":"Argument","name":{"kind":"Name","value":"state"},"value":{"kind":"Variable","name":{"kind":"Name","value":"state"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"state"}}]}}]}}]} as unknown as DocumentNode;
export type UpdateCheckItemStateMutationFn = Apollo.MutationFunction<UpdateCheckItemStateMutation, UpdateCheckItemStateMutationVariables>;

/**
 * __useUpdateCheckItemStateMutation__
 *
 * To run a mutation, you first call `useUpdateCheckItemStateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCheckItemStateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCheckItemStateMutation, { data, loading, error }] = useUpdateCheckItemStateMutation({
 *   variables: {
 *      cardId: // value for 'cardId'
 *      checklistId: // value for 'checklistId'
 *      checkItemId: // value for 'checkItemId'
 *      state: // value for 'state'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useUpdateCheckItemStateMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCheckItemStateMutation, UpdateCheckItemStateMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCheckItemStateMutation, UpdateCheckItemStateMutationVariables>(UpdateCheckItemStateDocument, options);
      }
export type UpdateCheckItemStateMutationHookResult = ReturnType<typeof useUpdateCheckItemStateMutation>;
export type UpdateCheckItemStateMutationResult = Apollo.MutationResult<UpdateCheckItemStateMutation>;
export type UpdateCheckItemStateMutationOptions = Apollo.BaseMutationOptions<UpdateCheckItemStateMutation, UpdateCheckItemStateMutationVariables>;