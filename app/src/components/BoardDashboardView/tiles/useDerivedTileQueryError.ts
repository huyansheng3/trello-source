import { Tile, getTileType } from '@trello/dashboard';
import { sendErrorEvent } from '@trello/error-reporting';

import { useState, useEffect } from 'react';

export class UnknownTileQueryError extends Error {
  constructor(tile: Tile) {
    const message = `Unknown error occurred while resolving data for tile`;
    super(message);
    this.name = 'UnknownTileQueryError';
  }
}

export const useDerivedTileQueryError = (
  tile: Tile,
  data: object | undefined | null,
  loading: boolean,
) => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const queryError =
      (!data || data === {}) && !loading && new UnknownTileQueryError(tile);

    if (queryError) {
      sendErrorEvent(queryError, {
        tags: {
          ownershipArea: 'trello-enterprise',
        },
        extraData: {
          tileType: getTileType(tile),
        },
      });
    }
    setError(queryError || null);
  }, [data, loading, setError, tile]);

  return error;
};
