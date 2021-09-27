import React from 'react';
import { Button } from '@trello/nachos/button';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';
const DoubleChevronCloseSVG = require('resources/images/workspace-navigation/double-chevron-close.svg');
import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip/ShortcutTooltip';
import { forTemplate } from '@trello/i18n';
const format = forTemplate('workspace_navigation');
import styles from './CollapseSidebarButton.less';

interface CollapseSidebarButtonProps {
  onClick: () => void;
}

export const CollapseSidebarButton: React.FC<CollapseSidebarButtonProps> = ({
  onClick,
}) => {
  return (
    <ShortcutTooltip
      shortcutText={format('collapse-sidebar')}
      shortcutKey="["
      className={styles.tooltipShortcut}
    >
      <Button
        className={styles.collapseSidebarButton}
        onClick={onClick}
        data-test-id={
          WorkspaceNavigationTestIds.WorkspaceNavigationCollapseButton
        }
      >
        <img
          className={styles.chevronImg}
          src={DoubleChevronCloseSVG}
          alt={format('team-nav-collapse-icon')}
        />
      </Button>
    </ShortcutTooltip>
  );
};
