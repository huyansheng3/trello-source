import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CardsPerLabel"}}
export type CardsPerLabelQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type CardsPerLabelQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { cards: Array<(
      { __typename: 'Card' }
      & Pick<Types.Card, 'id' | 'idLabels'>
    )>, labels: Array<(
      { __typename: 'Label' }
      & Pick<Types.Label, 'id' | 'name' | 'color'>
    )> }
  )> }
);


export const CardsPerLabelDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardsPerLabel"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"idLabels"}}]}},{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCardsPerLabelQuery__
 *
 * To run a query within a React component, call `useCardsPerLabelQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardsPerLabelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardsPerLabelQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useCardsPerLabelQuery(baseOptions: Apollo.QueryHookOptions<CardsPerLabelQuery, CardsPerLabelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardsPerLabelQuery, CardsPerLabelQueryVariables>(CardsPerLabelDocument, options);
      }
export function useCardsPerLabelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardsPerLabelQuery, CardsPerLabelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardsPerLabelQuery, CardsPerLabelQueryVariables>(CardsPerLabelDocument, options);
        }
export type CardsPerLabelQueryHookResult = ReturnType<typeof useCardsPerLabelQuery>;
export type CardsPerLabelLazyQueryHookResult = ReturnType<typeof useCardsPerLabelLazyQuery>;
export type CardsPerLabelQueryResult = Apollo.QueryResult<CardsPerLabelQuery, CardsPerLabelQueryVariables>;