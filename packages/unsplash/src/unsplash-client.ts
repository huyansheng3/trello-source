import { createApi, OrderBy } from 'unsplash-js';

export const DEFAULT_COLLECTION_ID = '317099';
export const DEFAULT_PER_PAGE = 18;
export const DEFAULT_ORDER_BY = OrderBy.LATEST;

function appendUrlParameters(parameters: { [key: string]: string }) {
  return (originalUrl: string) => {
    const url = new URL(originalUrl);
    url.protocol = 'https:';

    for (const [key, value] of Object.entries(parameters)) {
      url.searchParams.append(key, value);
    }

    return url.toString();
  };
}

export const appendAttribution = (originalUrl: string) =>
  appendUrlParameters({
    utm_source: 'trello',
    utm_medium: 'referral',
    utm_campaign: 'api-credit',
  })(originalUrl);

// eslint-disable-next-line @trello/no-module-logic
export const attributionUrl = appendAttribution('https://unsplash.com');

export const appendImageParameters = (originalUrl: string) =>
  appendUrlParameters({
    w: '2560',
    h: '2048',
    q: '90',
  })(originalUrl);

// eslint-disable-next-line @trello/no-module-logic
export const api = createApi({
  apiUrl: `${location.origin}/proxy/unsplash`,
});

export const search = ({
  query,
  page = 1,
  perPage = DEFAULT_PER_PAGE,
}: {
  query: string;
  page?: number;
  perPage?: number;
}) =>
  api.search.getPhotos({
    query,
    page,
    perPage,
    contentFilter: 'high',
  });

export const getDefaultCollection = ({
  page = 1,
  perPage = DEFAULT_PER_PAGE,
}: { page?: number; perPage?: number } = {}) =>
  api.collections.getPhotos({
    collectionId: DEFAULT_COLLECTION_ID,
    orderBy: DEFAULT_ORDER_BY,
    page,
    perPage,
  });

export const trackDownload = async (
  photo: string | { links: { download_location: string } },
) => {
  if (typeof photo === 'string') {
    const { response } = await api.photos.get({ photoId: photo });

    if (response) {
      await api.photos.trackDownload({
        downloadLocation: response.links.download_location,
      });
    }
  } else {
    await api.photos.trackDownload({
      downloadLocation: photo.links.download_location,
    });
  }
};
