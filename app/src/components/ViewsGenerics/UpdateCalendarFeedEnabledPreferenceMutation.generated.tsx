import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpdateCalendarFeedEnabledPreference"}}
export type UpdateCalendarFeedEnabledPreferenceMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
  calendarFeedEnabled: Types.Scalars['Boolean'];
}>;


export type UpdateCalendarFeedEnabledPreferenceMutation = (
  { __typename: 'Mutation' }
  & { updateCalendarFeedEnabledPref?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Board_Prefs' }
      & Pick<Types.Board_Prefs, 'calendarFeedEnabled'>
    )> }
  )> }
);


export const UpdateCalendarFeedEnabledPreferenceDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCalendarFeedEnabledPreference"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calendarFeedEnabled"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCalendarFeedEnabledPref"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}},{"kind":"Argument","name":{"kind":"Name","value":"calendarFeedEnabled"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calendarFeedEnabled"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarFeedEnabled"}}]}}]}}]}}]} as unknown as DocumentNode;
export type UpdateCalendarFeedEnabledPreferenceMutationFn = Apollo.MutationFunction<UpdateCalendarFeedEnabledPreferenceMutation, UpdateCalendarFeedEnabledPreferenceMutationVariables>;

/**
 * __useUpdateCalendarFeedEnabledPreferenceMutation__
 *
 * To run a mutation, you first call `useUpdateCalendarFeedEnabledPreferenceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCalendarFeedEnabledPreferenceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCalendarFeedEnabledPreferenceMutation, { data, loading, error }] = useUpdateCalendarFeedEnabledPreferenceMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *      calendarFeedEnabled: // value for 'calendarFeedEnabled'
 *   },
 * });
 */
export function useUpdateCalendarFeedEnabledPreferenceMutation(baseOptions?: Apollo.MutationHookOptions<UpdateCalendarFeedEnabledPreferenceMutation, UpdateCalendarFeedEnabledPreferenceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateCalendarFeedEnabledPreferenceMutation, UpdateCalendarFeedEnabledPreferenceMutationVariables>(UpdateCalendarFeedEnabledPreferenceDocument, options);
      }
export type UpdateCalendarFeedEnabledPreferenceMutationHookResult = ReturnType<typeof useUpdateCalendarFeedEnabledPreferenceMutation>;
export type UpdateCalendarFeedEnabledPreferenceMutationResult = Apollo.MutationResult<UpdateCalendarFeedEnabledPreferenceMutation>;
export type UpdateCalendarFeedEnabledPreferenceMutationOptions = Apollo.BaseMutationOptions<UpdateCalendarFeedEnabledPreferenceMutation, UpdateCalendarFeedEnabledPreferenceMutationVariables>;