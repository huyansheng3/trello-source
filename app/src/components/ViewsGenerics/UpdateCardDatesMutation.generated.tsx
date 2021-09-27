import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpdateCardDates"}}
export type UpdateCardDatesMutationVariables = Types.Exact<{
  idCard: Types.Scalars['ID'];
  due?: Types.Maybe<Types.Scalars['String']>;
  start?: Types.Maybe<Types.Scalars['String']>;
  dueReminder?: Types.Maybe<Types.Scalars['String']>;
  traceId?: Types.Maybe<Types.Scalars['String']>;
}>;


export type UpdateCardDatesMutation = (
  { __typename: 'Mutation' }
  & { updateCardDates?: Types.Maybe<(
    { __typename: 'Card' }
    & Pick<Types.Card, 'id' | 'due' | 'start' | 'dueReminder'>
  )> }
);


export const UpdateCardDatesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCardDates"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"due"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"start"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"dueReminder"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCardDates"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idCard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idCard"}}},{"kind":"Argument","name":{"kind":"Name","value":"due"},"value":{"kind":"Variable","name":{"kind":"Name","value":"due"}}},{"kind":"Argument","name":{"kind":"Name","value":"start"},"value":{"kind":"Variable","name":{"kind":"Name","value":"start"}}},{"kind":"Argument","name":{"kind":"Name","value":"dueReminder"},"value":{"kind":"Variable","name":{"kind":"Name","value":"dueReminder"}}},{"kind":"Argument","name":{"kind":"Name","value":"traceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"traceId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"start"}},{"kind":"Field","name":{"kind":"Name","value":"dueReminder"}}]}}]}}]} as unknown as DocumentNode;
export type UpdateCardDatesMutationFn = Apollo.MutationFunction<UpdateCardDatesMutation, UpdateCardDatesMutationVariables>;

/**
 * __useUpdateCardDatesMutation__
 *
 * To run a mutation, you first call `useUpdateCardDatesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCardDatesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCardDatesMutation, { data, loading, error }] = useUpdateCardDatesMutation({
 *   variables: {
 *      idCard: // value for 'idCard'
 *      due: // value for 'due'
 *      start: // value for 'start'
 *      dueReminder: // value for 'dueReminder'
 *      traceId: // value for 'traceId'
 *   },
 * });
 */
export function useUpdateCardDatesMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCardDatesMutation, UpdateCardDatesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCardDatesMutation, UpdateCardDatesMutationVariables>(UpdateCardDatesDocument, options);
      }
export type UpdateCardDatesMutationHookResult = ReturnType<typeof useUpdateCardDatesMutation>;
export type UpdateCardDatesMutationResult = Apollo.MutationResult<UpdateCardDatesMutation>;
export type UpdateCardDatesMutationOptions = Apollo.BaseMutationOptions<UpdateCardDatesMutation, UpdateCardDatesMutationVariables>;