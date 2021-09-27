import { token } from '@trello/session-cookie';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import {
  MutationCreateOrganizationViewArgs,
  MutationDeleteOrganizationViewArgs,
  MutationUpdateOrganizationViewArgs,
  MutationUpdateViewInOrganizationViewArgs,
} from '../generated';
import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import { fetch } from '@trello/fetch';
import { ResolverContext } from '../types';
import { getNetworkClient } from '../getNetworkClient';

export const createOrganizationView = async (
  obj: object,
  args: MutationCreateOrganizationViewArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl('/1/organizationViews');
  const response = await fetch(apiUrl, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...(args || {}),
      token: context.token || token,
    }),
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

export const updateOrganizationView = async (
  obj: object,
  args: MutationUpdateOrganizationViewArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const body = {
    ...args.organizationView,
  };

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/organizationViews/${args.idOrganizationView}`,
  );
  const response = await fetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...(body || {}),
      token: context.token || token,
    }),
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

export const updateViewInOrganizationView = async (
  obj: object,
  args: MutationUpdateViewInOrganizationViewArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const body = {
    ...args.view,
  };

  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/organizationViews/${args.idOrganizationView}/views/${args.idView}`,
  );

  const response = await fetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      ...(body || {}),
      token: context.token || token,
    }),
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

export const deleteOrganizationView = async (
  obj: object,
  args: MutationDeleteOrganizationViewArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const networkClient = getNetworkClient();
  const apiUrl = networkClient.getUrl(
    `/1/organizationViews/${args.idOrganizationView}`,
  );
  const response = await fetch(apiUrl, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      token: context.token || token,
    }),
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
