import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CardsPerListHistory"}}
export type CardsPerListHistoryQueryVariables = Types.Exact<{
  idBoard: Types.Scalars['ID'];
  from?: Types.Maybe<Types.Scalars['String']>;
}>;


export type CardsPerListHistoryQuery = (
  { __typename: 'Query' }
  & { board?: Types.Maybe<(
    { __typename: 'Board' }
    & { lists: Array<(
      { __typename: 'List' }
      & Pick<Types.List, 'id' | 'pos' | 'name'>
    )>, history?: Types.Maybe<(
      { __typename: 'Board_History' }
      & { cardsPerList: (
        { __typename: 'Board_History_CardsPerList' }
        & Pick<Types.Board_History_CardsPerList, 'complete'>
        & { series: Array<(
          { __typename: 'Board_History_CardsPerList_Series' }
          & Pick<Types.Board_History_CardsPerList_Series, 'idList'>
          & { dataPoints: Array<(
            { __typename: 'Board_History_CardsPerList_Series_DataPoint' }
            & Pick<Types.Board_History_CardsPerList_Series_DataPoint, 'dateTime' | 'value'>
          )> }
        )> }
      ) }
    )> }
  )> }
);


export const CardsPerListHistoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CardsPerListHistory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"from"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"board"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"idBoard"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"lists"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"pos"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"history"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cardsPerList"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"from"},"value":{"kind":"Variable","name":{"kind":"Name","value":"from"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"complete"}},{"kind":"Field","name":{"kind":"Name","value":"series"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"idList"}},{"kind":"Field","name":{"kind":"Name","value":"dataPoints"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dateTime"}},{"kind":"Field","name":{"kind":"Name","value":"value"}}]}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCardsPerListHistoryQuery__
 *
 * To run a query within a React component, call `useCardsPerListHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useCardsPerListHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCardsPerListHistoryQuery({
 *   variables: {
 *      idBoard: // value for 'idBoard'
 *      from: // value for 'from'
 *   },
 * });
 */
export function useCardsPerListHistoryQuery(baseOptions: Apollo.QueryHookOptions<CardsPerListHistoryQuery, CardsPerListHistoryQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CardsPerListHistoryQuery, CardsPerListHistoryQueryVariables>(CardsPerListHistoryDocument, options);
      }
export function useCardsPerListHistoryLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CardsPerListHistoryQuery, CardsPerListHistoryQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CardsPerListHistoryQuery, CardsPerListHistoryQueryVariables>(CardsPerListHistoryDocument, options);
        }
export type CardsPerListHistoryQueryHookResult = ReturnType<typeof useCardsPerListHistoryQuery>;
export type CardsPerListHistoryLazyQueryHookResult = ReturnType<typeof useCardsPerListHistoryLazyQuery>;
export type CardsPerListHistoryQueryResult = Apollo.QueryResult<CardsPerListHistoryQuery, CardsPerListHistoryQueryVariables>;