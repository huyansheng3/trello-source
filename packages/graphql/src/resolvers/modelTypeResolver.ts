import { QueryModelTypeArgs } from '../generated';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { trelloFetch } from '@trello/fetch';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { ResolverContext } from '../types';
import { getNetworkClient } from '../getNetworkClient';

export const modelTypeResolver = async (
  _parent: unknown,
  args: QueryModelTypeArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(`/1/types/${args.idOrName}`);

  const response = await trelloFetch(apiUrl, undefined, {
    clientVersion: context.clientAwareness.version,
    networkRequestEventAttributes: {
      source: 'graphql',
      resolver: 'modelType',
      operationName: context.operationName,
    },
  });

  if (response.ok) {
    return prepareDataForApolloCache(await response.json(), info);
  }

  sendNetworkErrorEvent({
    url: apiUrl,
    response: await response.clone().text(),
    status: response.status,
    operationName: context.operationName,
  });
  throw await parseNetworkError(response);
};
