import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"DeleteButlerButton"}}
export type DeleteButlerButtonMutationVariables = Types.Exact<{
  idButton: Types.Scalars['ID'];
  idBoard: Types.Scalars['ID'];
  idOrganization: Types.Scalars['ID'];
  scope: Types.Scalars['String'];
}>;


export type DeleteButlerButtonMutation = (
  { __typename: 'Mutation' }
  & Pick<Types.Mutation, 'deleteButlerButton'>
);


export const DeleteButlerButtonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteButlerButton"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idButton"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idOrganization"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scope"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteButlerButton"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idButton"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idButton"}}},{"kind":"Argument","name":{"kind":"Name","value":"idBoard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}},{"kind":"Argument","name":{"kind":"Name","value":"idOrganization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idOrganization"}}},{"kind":"Argument","name":{"kind":"Name","value":"scope"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scope"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]}]}}]} as unknown as DocumentNode;
export type DeleteButlerButtonMutationFn = Apollo.MutationFunction<DeleteButlerButtonMutation, DeleteButlerButtonMutationVariables>;

/**
 * __useDeleteButlerButtonMutation__
 *
 * To run a mutation, you first call `useDeleteButlerButtonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteButlerButtonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteButlerButtonMutation, { data, loading, error }] = useDeleteButlerButtonMutation({
 *   variables: {
 *      idButton: // value for 'idButton'
 *      idBoard: // value for 'idBoard'
 *      idOrganization: // value for 'idOrganization'
 *      scope: // value for 'scope'
 *   },
 * });
 */
export function useDeleteButlerButtonMutation(baseOptions?: Apollo.MutationHookOptions<DeleteButlerButtonMutation, DeleteButlerButtonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteButlerButtonMutation, DeleteButlerButtonMutationVariables>(DeleteButlerButtonDocument, options);
      }
export type DeleteButlerButtonMutationHookResult = ReturnType<typeof useDeleteButlerButtonMutation>;
export type DeleteButlerButtonMutationResult = Apollo.MutationResult<DeleteButlerButtonMutation>;
export type DeleteButlerButtonMutationOptions = Apollo.BaseMutationOptions<DeleteButlerButtonMutation, DeleteButlerButtonMutationVariables>;