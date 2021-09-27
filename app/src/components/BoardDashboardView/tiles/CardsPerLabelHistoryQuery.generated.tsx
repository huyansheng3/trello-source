import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CardsPerLabelHistory"}}
export type CardsPerLabelHistoryQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
  from?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CardsPerLabelHistoryQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { labels: Array<(
      { __typename: 'Label' }
      & Pick<Types.Label, 'id' | 'name' | 'color'>
    )>, history?: Types.Maybe<(
      { __typename: 'Board_History' }
      & { cardsPerLabel: (
        { __typename: 'Board_History_CardsPerLabel' }
        & Pick<Types.Board_History_CardsPerLabel, 'complete'>
        & { series: Array<(
          { __typename: 'Board_History_CardsPerLabel_Series' }
          & Pick<Types.Board_History_CardsPerLabel_Series, 'idLabel'>
          & { dataPoints: Array<(
            { __typename: 'Board_History_CardsPerLabel_Series_DataPoint' }
            & Pick<Types.Board_History_CardsPerLabel_Series_DataPoint, 'dateTime' | 'value'>
          )> }
        )> }
      ) }
    )> }
  )> }
);


export const CardsPerLabelHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardsPerLabelHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"labels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"color"}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardsPerLabel"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"complete"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idLabel"}},{"kind":"Field","name":{"kind":"Name","value":"dataPoints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateTime"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCardsPerLabelHistoryQuery__
 *
 * To run a query within a React component, call `useCardsPerLabelHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardsPerLabelHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardsPerLabelHistoryQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *      from: // value for 'from'
 *   },
 * });
 */
export function useCardsPerLabelHistoryQuery(baseOptions: Apollo.QueryHookOptions<CardsPerLabelHistoryQuery, CardsPerLabelHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardsPerLabelHistoryQuery, CardsPerLabelHistoryQueryVariables>(CardsPerLabelHistoryDocument, options);
      }
export function useCardsPerLabelHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardsPerLabelHistoryQuery, CardsPerLabelHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardsPerLabelHistoryQuery, CardsPerLabelHistoryQueryVariables>(CardsPerLabelHistoryDocument, options);
        }
export type CardsPerLabelHistoryQueryHookResult = ReturnType<typeof useCardsPerLabelHistoryQuery>;
export type CardsPerLabelHistoryLazyQueryHookResult = ReturnType<typeof useCardsPerLabelHistoryLazyQuery>;
export type CardsPerLabelHistoryQueryResult = Apollo.QueryResult<CardsPerLabelHistoryQuery, CardsPerLabelHistoryQueryVariables>;