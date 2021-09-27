import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import {
  MutationAddButlerButtonArgs,
  MutationDeleteButlerButtonArgs,
} from '../generated';
import { token } from '@trello/session-cookie';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { fetch } from '@trello/fetch';
import { ResolverContext } from '../types';
import { getNetworkClient } from '../getNetworkClient';

export const addButlerButton = async (
  obj: object,
  args: MutationAddButlerButtonArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/${args.scope}/${args.idScope}/butlerButtons`,
  );
  // Scope must be 'boards' | 'organizations'.
  const response = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...args.butlerButton,
      token: context.token || token,
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache(await response.json(), info);
};

export const deleteButlerButton = async (
  obj: object,
  args: MutationDeleteButlerButtonArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const apiUrl = `/1/${args.scope}/${
    args.scope === 'boards' ? args.idBoard : args.idOrganization
  }/butlerButton/${args.idButton}`;
  const response = await fetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      token,
    }),
  });

  if (!response.ok) {
    sendNetworkErrorEvent({
      url: apiUrl,
      response: await response.clone().text(),
      status: response.status,
      operationName: context.operationName,
    });
    throw await parseNetworkError(response);
  }

  return prepareDataForApolloCache(await response.json(), info);
};
