import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CreateDashboardViewTile"}}
export type CreateDashboardViewTileMutationVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
  tile: Types.CreateDashboardViewTile;
}>;


export type CreateDashboardViewTileMutation = (
  { __typename: 'Mutation' }
  & { createDashboardViewTile: (
    { __typename: 'Board_DashboardViewTile' }
    & Pick<Types.Board_DashboardViewTile, 'id' | 'pos' | 'type' | 'dateLastActivity'>
    & { from?: Types.Maybe<(
      { __typename: 'Board_DashboardViewTile_From' }
      & Pick<Types.Board_DashboardViewTile_From, 'dateType' | 'value'>
    )>, graph: (
      { __typename: 'Board_DashboardViewTile_Graph' }
      & Pick<Types.Board_DashboardViewTile_Graph, 'type'>
    ) }
  ) }
);


export const CreateDashboardViewTileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDashboardViewTile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"tile"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDashboardViewTile"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDashboardViewTile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"idBoard"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}},{"kind":"Argument","name":{"kind":"Name","value":"tile"},"value":{"kind":"Variable","name":{"kind":"Name","value":"tile"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"dateLastActivity"}},{"kind":"Field","name":{"kind":"Name","value":"from"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateType"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"graph"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"type"}}]}}]}}]}}]} as unknown as DocumentNode;
export type CreateDashboardViewTileMutationFn = Apollo.MutationFunction<CreateDashboardViewTileMutation, CreateDashboardViewTileMutationVariables>;

/**
 * __useCreateDashboardViewTileMutation__
 *
 * To run a mutation, you first call `useCreateDashboardViewTileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateDashboardViewTileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createDashboardViewTileMutation, { data, loading, error }] = useCreateDashboardViewTileMutation({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *      tile: // value for 'tile'
 *   },
 * });
 */
export function useCreateDashboardViewTileMutation(baseOptions?: Apollo.MutationHookOptions<CreateDashboardViewTileMutation, CreateDashboardViewTileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateDashboardViewTileMutation, CreateDashboardViewTileMutationVariables>(CreateDashboardViewTileDocument, options);
      }
export type CreateDashboardViewTileMutationHookResult = ReturnType<typeof useCreateDashboardViewTileMutation>;
export type CreateDashboardViewTileMutationResult = Apollo.MutationResult<CreateDashboardViewTileMutation>;
export type CreateDashboardViewTileMutationOptions = Apollo.BaseMutationOptions<CreateDashboardViewTileMutation, CreateDashboardViewTileMutationVariables>;