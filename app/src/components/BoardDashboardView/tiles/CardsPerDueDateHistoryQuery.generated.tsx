import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CardsPerDueDateHistory"}}
export type CardsPerDueDateHistoryQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
  from?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CardsPerDueDateHistoryQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { history?: Types.Maybe<(
      { __typename: 'Board_History' }
      & { cardsPerDueDateStatus: (
        { __typename: 'Board_History_CardsPerDueDateStatus' }
        & Pick<Types.Board_History_CardsPerDueDateStatus, 'complete'>
        & { series: (
          { __typename: 'Board_History_CardsPerDueDateStatus_Series' }
          & { noDueDate: Array<(
            { __typename: 'Board_History_CardsPerDueDateStatus_Series_DataPoint' }
            & Pick<Types.Board_History_CardsPerDueDateStatus_Series_DataPoint, 'dateTime' | 'value'>
          )>, dueSoon: Array<(
            { __typename: 'Board_History_CardsPerDueDateStatus_Series_DataPoint' }
            & Pick<Types.Board_History_CardsPerDueDateStatus_Series_DataPoint, 'dateTime' | 'value'>
          )>, dueLater: Array<(
            { __typename: 'Board_History_CardsPerDueDateStatus_Series_DataPoint' }
            & Pick<Types.Board_History_CardsPerDueDateStatus_Series_DataPoint, 'dateTime' | 'value'>
          )>, done: Array<(
            { __typename: 'Board_History_CardsPerDueDateStatus_Series_DataPoint' }
            & Pick<Types.Board_History_CardsPerDueDateStatus_Series_DataPoint, 'dateTime' | 'value'>
          )>, overdue: Array<(
            { __typename: 'Board_History_CardsPerDueDateStatus_Series_DataPoint' }
            & Pick<Types.Board_History_CardsPerDueDateStatus_Series_DataPoint, 'dateTime' | 'value'>
          )> }
        ) }
      ) }
    )> }
  )> }
);


export const CardsPerDueDateHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardsPerDueDateHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardsPerDueDateStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"complete"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"noDueDate"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateTime"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dueSoon"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateTime"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"dueLater"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateTime"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"done"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateTime"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}},{"kind":"Field","name":{"kind":"Name","value":"overdue"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateTime"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCardsPerDueDateHistoryQuery__
 *
 * To run a query within a React component, call `useCardsPerDueDateHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardsPerDueDateHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardsPerDueDateHistoryQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *      from: // value for 'from'
 *   },
 * });
 */
export function useCardsPerDueDateHistoryQuery(baseOptions: Apollo.QueryHookOptions<CardsPerDueDateHistoryQuery, CardsPerDueDateHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardsPerDueDateHistoryQuery, CardsPerDueDateHistoryQueryVariables>(CardsPerDueDateHistoryDocument, options);
      }
export function useCardsPerDueDateHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardsPerDueDateHistoryQuery, CardsPerDueDateHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardsPerDueDateHistoryQuery, CardsPerDueDateHistoryQueryVariables>(CardsPerDueDateHistoryDocument, options);
        }
export type CardsPerDueDateHistoryQueryHookResult = ReturnType<typeof useCardsPerDueDateHistoryQuery>;
export type CardsPerDueDateHistoryLazyQueryHookResult = ReturnType<typeof useCardsPerDueDateHistoryLazyQuery>;
export type CardsPerDueDateHistoryQueryResult = Apollo.QueryResult<CardsPerDueDateHistoryQuery, CardsPerDueDateHistoryQueryVariables>;