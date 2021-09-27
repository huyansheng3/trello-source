import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CardsPerDueDate"}}
export type CardsPerDueDateQueryVariables = Types.Exact<{
  boardId: Types.Scalars['ID'];
}>;


export type CardsPerDueDateQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & Pick<Types.Board, 'id'>
    & { cards: Array<(
      { __typename: 'Card' }
      & Pick<Types.Card, 'id' | 'due' | 'dueComplete'>
    )> }
  )> }
);


export const CardsPerDueDateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardsPerDueDate"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"boardId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"visible"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"due"}},{"kind":"Field","name":{"kind":"Name","value":"dueComplete"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCardsPerDueDateQuery__
 *
 * To run a query within a React component, call `useCardsPerDueDateQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardsPerDueDateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardsPerDueDateQuery({
 *   variables: {
 *      boardId: // value for 'boardId'
 *   },
 * });
 */
export function useCardsPerDueDateQuery(baseOptions: Apollo.QueryHookOptions<CardsPerDueDateQuery, CardsPerDueDateQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardsPerDueDateQuery, CardsPerDueDateQueryVariables>(CardsPerDueDateDocument, options);
      }
export function useCardsPerDueDateLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardsPerDueDateQuery, CardsPerDueDateQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardsPerDueDateQuery, CardsPerDueDateQueryVariables>(CardsPerDueDateDocument, options);
        }
export type CardsPerDueDateQueryHookResult = ReturnType<typeof useCardsPerDueDateQuery>;
export type CardsPerDueDateLazyQueryHookResult = ReturnType<typeof useCardsPerDueDateLazyQuery>;
export type CardsPerDueDateQueryResult = Apollo.QueryResult<CardsPerDueDateQuery, CardsPerDueDateQueryVariables>;