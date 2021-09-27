import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"ReopenBoard"}}
export type ReopenBoardMutationVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type ReopenBoardMutation = (
  { __typename: 'Mutation' }
  & { reopenBoard?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
  )> }
);


export const ReopenBoardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ReopenBoard"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reopenBoard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"boardId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode;
export type ReopenBoardMutationFn = Apollo.MutationFunction<ReopenBoardMutation, ReopenBoardMutationVariables>;

/**
 * __useReopenBoardMutation__
 *
 * To run a mutation, you first call `useReopenBoardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReopenBoardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reopenBoardMutation, { data, loading, error }] = useReopenBoardMutation({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useReopenBoardMutation(baseOptions?: Apollo.MutationHookOptions<ReopenBoardMutation, ReopenBoardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReopenBoardMutation, ReopenBoardMutationVariables>(ReopenBoardDocument, options);
      }
export type ReopenBoardMutationHookResult = ReturnType<typeof useReopenBoardMutation>;
export type ReopenBoardMutationResult = Apollo.MutationResult<ReopenBoardMutation>;
export type ReopenBoardMutationOptions = Apollo.BaseMutationOptions<ReopenBoardMutation, ReopenBoardMutationVariables>;