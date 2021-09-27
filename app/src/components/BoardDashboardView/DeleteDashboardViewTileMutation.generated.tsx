import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"DeleteDashboardViewTile"}}
export type DeleteDashboardViewTileMutationVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
  idTile: Types.Scalars['ID'];
}>;


export type DeleteDashboardViewTileMutation = (
  { __typename: 'Mutation' }
  & Pick<Types.Mutation, 'deleteDashboardViewTile'>
);


export const DeleteDashboardViewTileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteDashboardViewTile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idTile"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteDashboardViewTile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idBoard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}},{"kind":"Argument","name":{"kind":"Name","value":"idTile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idTile"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}]}]}}]} as unknown as DocumentNode;
export type DeleteDashboardViewTileMutationFn = Apollo.MutationFunction<DeleteDashboardViewTileMutation, DeleteDashboardViewTileMutationVariables>;

/**
 * __useDeleteDashboardViewTileMutation__
 *
 * To run a mutation, you first call `useDeleteDashboardViewTileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDashboardViewTileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDashboardViewTileMutation, { data, loading, error }] = useDeleteDashboardViewTileMutation({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *      idTile: // value for 'idTile'
 *   },
 * });
 */
export function useDeleteDashboardViewTileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDashboardViewTileMutation, DeleteDashboardViewTileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDashboardViewTileMutation, DeleteDashboardViewTileMutationVariables>(DeleteDashboardViewTileDocument, options);
      }
export type DeleteDashboardViewTileMutationHookResult = ReturnType<typeof useDeleteDashboardViewTileMutation>;
export type DeleteDashboardViewTileMutationResult = Apollo.MutationResult<DeleteDashboardViewTileMutation>;
export type DeleteDashboardViewTileMutationOptions = Apollo.BaseMutationOptions<DeleteDashboardViewTileMutation, DeleteDashboardViewTileMutationVariables>;