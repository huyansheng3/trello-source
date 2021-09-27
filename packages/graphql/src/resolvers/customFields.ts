import {
  prepareDataForApolloCache,
  QueryInfo,
} from '../prepareDataForApolloCache';
import {
  MutationCreateCustomFieldArgs,
  MutationDeleteCustomFieldArgs,
  MutationUpdateCustomFieldArgs,
  MutationDeleteCustomFieldOptionArgs,
  MutationAddCustomFieldOptionArgs,
  MutationUpdateCustomFieldOptionArgs,
  MutationUpdateCustomFieldItemArgs,
} from '../generated';
import { token } from '@trello/session-cookie';
import { fetch } from '@trello/fetch';
import { sendNetworkErrorEvent } from '@trello/error-reporting';
import { parseNetworkError } from '@trello/graphql-error-handling';
import { ResolverContext } from '../types';

export const createCustomField = async (
  obj: object,
  args: MutationCreateCustomFieldArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const { name, idModel, modelType, display, type, options } = args;
  const response = await fetch(`/1/customFields`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      display_cardFront: display.cardFront,
      idModel,
      modelType,
      name,
      options,
      type,
      token: context.token || token,
    }),
  });

  const customField = await response.json();

  return prepareDataForApolloCache(customField, info);
};

export const deleteCustomField = async (
  obj: object,
  args: MutationDeleteCustomFieldArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const { idCustomField } = args;
  const response = await fetch(`/1/customFields/${idCustomField}`, {
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

  const customField = await response.json();

  return prepareDataForApolloCache(customField, info);
};

export const updateCustomField = async (
  obj: object,
  args: MutationUpdateCustomFieldArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const { name, idCustomField, display } = args;
  const response = await fetch(`/1/customFields/${idCustomField}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      'display/cardFront': display?.cardFront,
      name,
      token: context.token || token,
    }),
  });

  const customField = await response.json();

  return prepareDataForApolloCache(customField, info);
};

export const deleteCustomFieldOption = async (
  obj: object,
  args: MutationDeleteCustomFieldOptionArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const { idCustomField, idCustomFieldOption } = args;
  const response = await fetch(
    `/1/customFields/${idCustomField}/options/${idCustomFieldOption}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        token: context.token || token,
      }),
    },
  );

  const customField = await response.json();

  return prepareDataForApolloCache(customField, info);
};

export const addCustomFieldOption = async (
  obj: object,
  args: MutationAddCustomFieldOptionArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const { name, idCustomField } = args;
  const response = await fetch(`/1/customFields/${idCustomField}/options`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      value: { text: name },
      token: context.token || token,
    }),
  });

  const customField = await response.json();

  return prepareDataForApolloCache(customField, info);
};

export const updateCustomFieldOption = async (
  obj: object,
  args: MutationUpdateCustomFieldOptionArgs,
  context: ResolverContext,
  info: QueryInfo,
) => {
  const { idCustomField, idCustomFieldOption, name, color } = args;
  const response = await fetch(
    `/1/customFields/${idCustomField}/options/${idCustomFieldOption}`,
    {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': context.clientAwareness.version,
      },
      body: JSON.stringify({
        color,
        value: name ? { text: name } : undefined,
        token: context.token || token,
      }),
    },
  );

  const customField = await response.json();

  return prepareDataForApolloCache(customField, info);
};

export async function updateCustomFieldItem(
  obj: object,
  { idCard, idCustomField, value, idValue }: MutationUpdateCustomFieldItemArgs,
  context: ResolverContext,
  info: QueryInfo,
) {
  const apiUrl = `/1/card/${idCard}/customField/${idCustomField}/item`;
  const response = await fetch(apiUrl, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': context.clientAwareness.version,
    },
    body: JSON.stringify({
      idValue,
      value,
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

  const customFieldItem = await response.json();

  return prepareDataForApolloCache(customFieldItem, info);
}
