import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"FeedbackLink"}}
export type FeedbackLinkQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type FeedbackLinkQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'id' | 'premiumFeatures' | 'products' | 'idEnterprise'>
    & { credits: Array<(
      { __typename: 'Credit' }
      & Pick<Types.Credit, 'count' | 'type' | 'id'>
    )>, paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<Types.PaidAccount, 'trialExpiration'>
    )> }
  )> }
);


export const FeedbackLinkDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"FeedbackLink"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"idEnterprise"}},{"kind":"Field","name":{"kind":"Name","value":"credits"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"filter"},"value":{"kind":"EnumValue","value":"freeTrial"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"count"}},{"kind":"Field","name":{"kind":"Name","value":"type"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"trialExpiration"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useFeedbackLinkQuery__
 *
 * To run a query within a React component, call `useFeedbackLinkQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeedbackLinkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeedbackLinkQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useFeedbackLinkQuery(baseOptions: Apollo.QueryHookOptions<FeedbackLinkQuery, FeedbackLinkQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FeedbackLinkQuery, FeedbackLinkQueryVariables>(FeedbackLinkDocument, options);
      }
export function useFeedbackLinkLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FeedbackLinkQuery, FeedbackLinkQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FeedbackLinkQuery, FeedbackLinkQueryVariables>(FeedbackLinkDocument, options);
        }
export type FeedbackLinkQueryHookResult = ReturnType<typeof useFeedbackLinkQuery>;
export type FeedbackLinkLazyQueryHookResult = ReturnType<typeof useFeedbackLinkLazyQuery>;
export type FeedbackLinkQueryResult = Apollo.QueryResult<FeedbackLinkQuery, FeedbackLinkQueryVariables>;