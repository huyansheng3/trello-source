import React from 'react';

import { Button } from '@trello/nachos/button';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';
import { WorkspaceLogo } from 'app/src/components/WorkspaceLogo';
import { DoubleChevronExpand } from './DoubleChevronExpand';
import styles from './WorkspaceNavigationCollapsed.less';
import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip/ShortcutTooltip';
import { forTemplate } from '@trello/i18n';
import { useLocation } from '@trello/router';
import { isOrganizationRoute, getRouteIdFromPathname } from '@trello/routes';
import classNames from 'classnames';

const format = forTemplate('workspace_navigation');
const TrelloLogoSVG = require('resources/images/workspace-navigation/trello-icon-gradient-blue.svg');

interface WorkspaceNavigationCollapsedProps {
  toggleVisibility: () => void;
  isGlobal: boolean;
  isHidden: boolean;
  displayName?: string | null;
  logoHash?: string;
  shouldShowTrelloLogoIcon?: boolean;
}

export const WorkspaceNavigationCollapsed: React.FunctionComponent<WorkspaceNavigationCollapsedProps> = ({
  toggleVisibility,
  displayName,
  logoHash,
  isGlobal,
  isHidden,
  shouldShowTrelloLogoIcon,
}) => {
  const { pathname } = useLocation();
  const isWorkspacePageRoute = isOrganizationRoute(
    getRouteIdFromPathname(pathname),
  );

  if (isGlobal || isHidden) {
    return null;
  }

  return (
    <div
      className={styles.container}
      data-test-id={WorkspaceNavigationTestIds.WorkspaceNavigationCollapsed}
    >
      <Button
        className={classNames(
          styles.containerButton,
          !isWorkspacePageRoute ? styles.gradient : '',
        )}
        onClick={toggleVisibility}
        data-test-id={
          WorkspaceNavigationTestIds.WorkspaceNavigationExpandButton
        }
      >
        <span className={styles.logoContainer}>
          {shouldShowTrelloLogoIcon ? (
            <div className={styles.workspaceIcon}>
              <img
                className={styles.templateLogo}
                src={TrelloLogoSVG}
                alt={format('trello-logo')}
                data-test-id={WorkspaceNavigationTestIds.TrelloLogoImage}
              />
            </div>
          ) : (
            <WorkspaceLogo
              logoHash={logoHash}
              name={displayName}
              size="small"
            />
          )}
        </span>
        <ShortcutTooltip
          shortcutText={format('expand-sidebar')}
          shortcutKey="["
          className={styles.tooltipShortcut}
        >
          <DoubleChevronExpand
            pathClassName={
              isWorkspacePageRoute
                ? styles.workspacePageChevronPath
                : styles.chevronPath
            }
          />
        </ShortcutTooltip>
      </Button>
    </div>
  );
};
