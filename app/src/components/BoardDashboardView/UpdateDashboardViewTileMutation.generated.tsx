import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"UpdateDashboardViewTile"}}
export type UpdateDashboardViewTileMutationVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
  tile: Types.UpdateDashboardViewTile;
}>;


export type UpdateDashboardViewTileMutation = (
  { __typename: 'Mutation' }
  & { updateDashboardViewTile: (
    { __typename: 'Board_DashboardViewTile' }
    & Pick<Types.Board_DashboardViewTile, 'id' | 'type'>
    & { from?: Types.Maybe<(
      { __typename: 'Board_DashboardViewTile_From' }
      & Pick<Types.Board_DashboardViewTile_From, 'dateType' | 'value'>
    )>, graph: (
      { __typename: 'Board_DashboardViewTile_Graph' }
      & Pick<Types.Board_DashboardViewTile_Graph, 'type'>
    ) }
  ) }
);


export const UpdateDashboardViewTileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateDashboardViewTile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tile"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateDashboardViewTile"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateDashboardViewTile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idBoard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}},{"kind":"Argument","name":{"kind":"Name","value":"tile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tile"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateType"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"graph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode;
export type UpdateDashboardViewTileMutationFn = Apollo.MutationFunction<UpdateDashboardViewTileMutation, UpdateDashboardViewTileMutationVariables>;

/**
 * __useUpdateDashboardViewTileMutation__
 *
 * To run a mutation, you first call `useUpdateDashboardViewTileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDashboardViewTileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDashboardViewTileMutation, { data, loading, error }] = useUpdateDashboardViewTileMutation({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *      tile: // value for 'tile'
 *   },
 * });
 */
export function useUpdateDashboardViewTileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDashboardViewTileMutation, UpdateDashboardViewTileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDashboardViewTileMutation, UpdateDashboardViewTileMutationVariables>(UpdateDashboardViewTileDocument, options);
      }
export type UpdateDashboardViewTileMutationHookResult = ReturnType<typeof useUpdateDashboardViewTileMutation>;
export type UpdateDashboardViewTileMutationResult = Apollo.MutationResult<UpdateDashboardViewTileMutation>;
export type UpdateDashboardViewTileMutationOptions = Apollo.BaseMutationOptions<UpdateDashboardViewTileMutation, UpdateDashboardViewTileMutationVariables>;