import React from 'react';
import { forNamespace } from '@trello/i18n';
import styles from './BoardTemplateBadge.less';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';

const format = forNamespace('board template badge');

export const BoardTemplateBadge = () => {
  return (
    <div
      className={styles.workspaceNavigationBoardTemplateBadge}
      title={format('templates are read-only boards for others to copy')}
      data-test-id={WorkspaceNavigationTestIds.BoardTemplateBadge}
    >
      {format('template')}
    </div>
  );
};
