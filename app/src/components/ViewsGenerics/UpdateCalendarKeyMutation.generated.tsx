import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpdateCalendarKey"}}
export type UpdateCalendarKeyMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type UpdateCalendarKeyMutation = (
  { __typename: 'Mutation' }
  & { updateCalendarKey?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { myPrefs: (
      { __typename: 'MyPrefs' }
      & Pick<Types.MyPrefs, 'calendarKey'>
    ) }
  )> }
);


export const UpdateCalendarKeyDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCalendarKey"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCalendarKey"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"myPrefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarKey"}}]}}]}}]}}]} as unknown as DocumentNode;
export type UpdateCalendarKeyMutationFn = Apollo.MutationFunction<UpdateCalendarKeyMutation, UpdateCalendarKeyMutationVariables>;

/**
 * __useUpdateCalendarKeyMutation__
 *
 * To run a mutation, you first call `useUpdateCalendarKeyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCalendarKeyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCalendarKeyMutation, { data, loading, error }] = useUpdateCalendarKeyMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useUpdateCalendarKeyMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCalendarKeyMutation, UpdateCalendarKeyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCalendarKeyMutation, UpdateCalendarKeyMutationVariables>(UpdateCalendarKeyDocument, options);
      }
export type UpdateCalendarKeyMutationHookResult = ReturnType<typeof useUpdateCalendarKeyMutation>;
export type UpdateCalendarKeyMutationResult = Apollo.MutationResult<UpdateCalendarKeyMutation>;
export type UpdateCalendarKeyMutationOptions = Apollo.BaseMutationOptions<UpdateCalendarKeyMutation, UpdateCalendarKeyMutationVariables>;