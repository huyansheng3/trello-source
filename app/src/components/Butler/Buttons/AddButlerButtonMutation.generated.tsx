import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AddButlerButton"}}
export type AddButlerButtonMutationVariables = Types.Exact<{
  scope: Types.Scalars['String'];
  idScope: Types.Scalars['ID'];
  butlerButton: Types.InputButlerButton;
}>;


export type AddButlerButtonMutation = (
  { __typename: 'Mutation' }
  & { addButlerButton?: Types.Maybe<(
    { __typename: 'ButlerButton' }
    & Pick<Types.ButlerButton, 'id'>
  )> }
);


export const AddButlerButtonDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddButlerButton"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"scope"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idScope"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"butlerButton"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"InputButlerButton"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addButlerButton"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"scope"},"value":{"kind":"Variable","name":{"kind":"Name","value":"scope"}}},{"kind":"Argument","name":{"kind":"Name","value":"idScope"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idScope"}}},{"kind":"Argument","name":{"kind":"Name","value":"butlerButton"},"value":{"kind":"Variable","name":{"kind":"Name","value":"butlerButton"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type AddButlerButtonMutationFn = Apollo.MutationFunction<AddButlerButtonMutation, AddButlerButtonMutationVariables>;

/**
 * __useAddButlerButtonMutation__
 *
 * To run a mutation, you first call `useAddButlerButtonMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddButlerButtonMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addButlerButtonMutation, { data, loading, error }] = useAddButlerButtonMutation({
 *   variables: {
 *      scope: // value for 'scope'
 *      idScope: // value for 'idScope'
 *      butlerButton: // value for 'butlerButton'
 *   },
 * });
 */
export function useAddButlerButtonMutation(baseOptions?: Apollo.MutationHookOptions<AddButlerButtonMutation, AddButlerButtonMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddButlerButtonMutation, AddButlerButtonMutationVariables>(AddButlerButtonDocument, options);
      }
export type AddButlerButtonMutationHookResult = ReturnType<typeof useAddButlerButtonMutation>;
export type AddButlerButtonMutationResult = Apollo.MutationResult<AddButlerButtonMutation>;
export type AddButlerButtonMutationOptions = Apollo.BaseMutationOptions<AddButlerButtonMutation, AddButlerButtonMutationVariables>;