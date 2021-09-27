import React from 'react';
import { Tile } from '@trello/dashboard';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { TileErrorState } from './TileErrorState';
import { TileContainer } from './TileContainer';

export const TileErrorBoundary: React.FC<{ tile: Tile }> = ({
  tile,
  children,
}) => {
  return (
    <ErrorBoundary
      // eslint-disable-next-line react/jsx-no-bind
      errorHandlerComponent={() => {
        return (
          <TileContainer>
            <TileErrorState />
          </TileContainer>
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
