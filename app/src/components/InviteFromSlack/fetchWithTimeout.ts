import { clientVersion } from '@trello/config';

interface TimeoutOptions {
  timeout: number;
}

export const fetchWithTimeout = async (
  resource: string,
  cookie: string,
  options: TimeoutOptions,
) => {
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
    headers: {
      Authorization: cookie,
      'Content-Type': 'application/json',
      'X-Trello-Client-Version': clientVersion,
    },
  });
  clearTimeout(id);
  return response;
};
