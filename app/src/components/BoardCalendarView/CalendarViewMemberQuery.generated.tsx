import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"CalendarViewMember"}}
export type CalendarViewMemberQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CalendarViewMemberQuery = (
  { __typename: 'Query' }
  & { member?: Types.Maybe<(
    { __typename: 'Member' }
    & Pick<Types.Member, 'id'>
    & { prefs?: Types.Maybe<(
      { __typename: 'Member_Prefs' }
      & Pick<Types.Member_Prefs, 'colorBlind'>
    )> }
  )> }
);


export const CalendarViewMemberDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"CalendarViewMember"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"member"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"me","block":false}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"prefs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"colorBlind"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useCalendarViewMemberQuery__
 *
 * To run a query within a React component, call `useCalendarViewMemberQuery` and pass it any options that fit your needs.
 * When your component renders, `useCalendarViewMemberQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCalendarViewMemberQuery({
 *   variables: {
 *   },
 * });
 */
export function useCalendarViewMemberQuery(baseOptions?: Apollo.QueryHookOptions<CalendarViewMemberQuery, CalendarViewMemberQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CalendarViewMemberQuery, CalendarViewMemberQueryVariables>(CalendarViewMemberDocument, options);
      }
export function useCalendarViewMemberLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CalendarViewMemberQuery, CalendarViewMemberQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CalendarViewMemberQuery, CalendarViewMemberQueryVariables>(CalendarViewMemberDocument, options);
        }
export type CalendarViewMemberQueryHookResult = ReturnType<typeof useCalendarViewMemberQuery>;
export type CalendarViewMemberLazyQueryHookResult = ReturnType<typeof useCalendarViewMemberLazyQuery>;
export type CalendarViewMemberQueryResult = Apollo.QueryResult<CalendarViewMemberQuery, CalendarViewMemberQueryVariables>;