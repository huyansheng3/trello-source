import { useMemo, useContext } from 'react';

import { Tile } from '@trello/dashboard';
import { PermissionsContext } from '../PermissionsContext';
import { forTemplate } from '@trello/i18n';

const format = forTemplate('board_report');

interface Callbacks {
  onEdit(): void;
  onDelete(): void;
}
export function useTileMenuOptions(
  tile: Tile,
  { onEdit, onDelete }: Callbacks,
) {
  const { canEdit } = useContext(PermissionsContext);

  return useMemo(() => {
    if (canEdit()) {
      return [
        {
          name: format('edit'),
          onClick: onEdit,
        },
        {
          name: format('delete'),
          onClick: onDelete,
        },
      ];
    }
    return [];
  }, [onEdit, onDelete, canEdit]);
}
