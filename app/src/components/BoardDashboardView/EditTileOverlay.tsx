import React from 'react';
import { forTemplate } from '@trello/i18n';
import { TileInput } from './TileEditor';
import { TileEditorOverlay } from './TileEditor/TileEditorOverlay';

const format = forTemplate('board_report');

interface EditTileOverlayProps {
  tile: TileInput;
  onSubmit(tile: TileInput): void;
  onClose(): void;
}
export const EditTileOverlay: React.FC<EditTileOverlayProps> = ({
  tile,
  onSubmit,
  onClose,
}) => {
  return (
    <TileEditorOverlay
      tile={tile}
      onSubmit={onSubmit}
      onClose={onClose}
      strings={{
        typePickerPageTitle: format(['wizard', 'edit-tile']),
        typePickerChoiceNames: {
          bar: format('bar-graph'),
          pie: format('pie-chart'),
          line: format('line-chart'),
        },
        configurePageTitles: {
          bar: format(['wizard', 'edit-bar-graph']),
          pie: format(['wizard', 'edit-pie-chart']),
          line: format(['wizard', 'edit-line-chart']),
        },
        next: format(['wizard', 'next']),
        back: format(['wizard', 'back']),
        submit: format(['wizard', 'edit-tile']),
      }}
    />
  );
};
