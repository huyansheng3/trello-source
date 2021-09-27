import * as Types from '@trello/graphql/generated';

import DocumentNode from '@trello/graphql/src/documentNode';
import * as Apollo from '@apollo/client';
const defaultOptions =  {"context":{"operationName":"AutoRenewal"}}
export type AutoRenewalQueryVariables = Types.Exact<{
  orgId: Types.Scalars['ID'];
}>;


export type AutoRenewalQuery = (
  { __typename: 'Query' }
  & { organization?: Types.Maybe<(
    { __typename: 'Organization' }
    & Pick<Types.Organization, 'premiumFeatures'>
    & { paidAccount?: Types.Maybe<(
      { __typename: 'PaidAccount' }
      & Pick<Types.PaidAccount, 'canRenew' | 'ixSubscriber' | 'standing' | 'products' | 'expirationDates' | 'billingDates' | 'paidProduct' | 'trialExpiration'>
      & { previousSubscription?: Types.Maybe<(
        { __typename: 'PreviousSubscription' }
        & Pick<Types.PreviousSubscription, 'ixSubscriptionProductId' | 'dtCancelled'>
      )>, productOverride?: Types.Maybe<(
        { __typename: 'ProductOverride' }
        & Pick<Types.ProductOverride, 'product' | 'dateStart' | 'dateEnd' | 'autoUpgrade'>
      )> }
    )> }
  )> }
);


export const AutoRenewalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"AutoRenewal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"organization"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"orgId"}}}],"directives":[{"kind":"Directive","name":{"kind":"Name","value":"client"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"premiumFeatures"}},{"kind":"Field","name":{"kind":"Name","value":"paidAccount"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"canRenew"}},{"kind":"Field","name":{"kind":"Name","value":"previousSubscription"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ixSubscriptionProductId"}},{"kind":"Field","name":{"kind":"Name","value":"dtCancelled"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ixSubscriber"}},{"kind":"Field","name":{"kind":"Name","value":"standing"}},{"kind":"Field","name":{"kind":"Name","value":"products"}},{"kind":"Field","name":{"kind":"Name","value":"expirationDates"}},{"kind":"Field","name":{"kind":"Name","value":"billingDates"}},{"kind":"Field","name":{"kind":"Name","value":"productOverride"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"product"}},{"kind":"Field","name":{"kind":"Name","value":"dateStart"}},{"kind":"Field","name":{"kind":"Name","value":"dateEnd"}},{"kind":"Field","name":{"kind":"Name","value":"autoUpgrade"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paidProduct"}},{"kind":"Field","name":{"kind":"Name","value":"trialExpiration"}}]}}]}}]}}]} as unknown as DocumentNode;

/**
 * __useAutoRenewalQuery__
 *
 * To run a query within a React component, call `useAutoRenewalQuery` and pass it any options that fit your needs.
 * When your component renders, `useAutoRenewalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAutoRenewalQuery({
 *   variables: {
 *      orgId: // value for 'orgId'
 *   },
 * });
 */
export function useAutoRenewalQuery(baseOptions: Apollo.QueryHookOptions<AutoRenewalQuery, AutoRenewalQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AutoRenewalQuery, AutoRenewalQueryVariables>(AutoRenewalDocument, options);
      }
export function useAutoRenewalLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AutoRenewalQuery, AutoRenewalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AutoRenewalQuery, AutoRenewalQueryVariables>(AutoRenewalDocument, options);
        }
export type AutoRenewalQueryHookResult = ReturnType<typeof useAutoRenewalQuery>;
export type AutoRenewalLazyQueryHookResult = ReturnType<typeof useAutoRenewalLazyQuery>;
export type AutoRenewalQueryResult = Apollo.QueryResult<AutoRenewalQuery, AutoRenewalQueryVariables>;