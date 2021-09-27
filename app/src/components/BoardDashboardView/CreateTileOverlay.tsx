import React from 'react';
import { forTemplate } from '@trello/i18n';
import { TileInput } from './TileEditor';
import { TileEditorOverlay } from './TileEditor/TileEditorOverlay';

const format = forTemplate('board_report');

interface CreateTileOverlayProps {
  onSubmit(tile: TileInput): void;
  onClose(): void;
}
export const CreateTileOverlay: React.FC<CreateTileOverlayProps> = ({
  onSubmit,
  onClose,
}) => {
  return (
    <TileEditorOverlay
      onSubmit={onSubmit}
      onClose={onClose}
      strings={{
        typePickerPageTitle: format(['wizard', 'add-tile']),
        typePickerChoiceNames: {
          bar: format('bar-graph'),
          pie: format('pie-chart'),
          line: format('line-chart'),
        },
        configurePageTitles: {
          bar: format(['wizard', 'add-bar-graph']),
          pie: format(['wizard', 'add-pie-chart']),
          line: format(['wizard', 'add-line-chart']),
        },
        next: format(['wizard', 'next']),
        back: format(['wizard', 'back']),
        submit: format(['wizard', 'add-tile']),
      }}
    />
  );
};
