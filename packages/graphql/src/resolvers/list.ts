import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { token } from '@trello/session-cookie';
import { fetch } from '@trello/fetch';

import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';

import { MutationCreateListArgs } from '../generated';
import { ResolverContext } from '../types';
import { getNetworkClient } from '../getNetworkClient';
import { Analytics } from '@trello/atlassian-analytics';

export async function createList(
  obj: object,
  args: MutationCreateListArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl('/1/lists');
  const response = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
      'X-Trello-TraceId': args.traceId,
    },
    body: JSON.stringify({
      idBoard: args.idBoard,
      name: args.name,
      pos: args.pos,
      token: context.token || token,
    }),
  });

  const trelloServerVersion = response.headers.get('X-Trello-Version');
  Analytics.setTrelloServerVersion(args.traceId, trelloServerVersion);

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  const list = await response.json();
  return prepareDataForApolloCache(list, info);
}
