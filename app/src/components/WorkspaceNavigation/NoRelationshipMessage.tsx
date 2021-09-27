import React, { useCallback } from 'react';
import { Analytics } from '@trello/atlassian-analytics';
import { HouseIcon } from '@trello/nachos/icons/house';
import { PrivateIcon } from '@trello/nachos/icons/private';
import { forTemplate } from '@trello/i18n';
import { WorkspaceDetail } from './WorkspaceDetail';
import { NoRelationshipWorkspace } from './useCurrentWorkspace';
import { ShortcutTooltip } from 'app/src/components/ShortcutTooltip/ShortcutTooltip';
import { Button } from '@trello/nachos/button';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';

import styles from './NoRelationshipMessage.less';
const DoubleChevronCloseSVG = require('resources/images/workspace-navigation/double-chevron-close.svg');

const format = forTemplate('workspace_navigation');

interface NoRelationshipMessageProps {
  toggleVisibility: () => void;
  workspace: NoRelationshipWorkspace;
}

export const NoRelationshipMessage: React.FunctionComponent<NoRelationshipMessageProps> = ({
  toggleVisibility,
  workspace,
}) => {
  const handleClick = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'homePageLink',
      source: 'currentWorkspaceNavigationDrawer',
    });
  }, []);

  return (
    <div data-test-id={WorkspaceNavigationTestIds.NoRelationshipMessage}>
      {workspace.displayName ? (
        <div className={styles.workspaceDetailContainer}>
          <WorkspaceDetail
            displayName={workspace.displayName}
            userRelationshipToWorkspace={workspace.userRelationshipToWorkspace}
            toggleVisibility={toggleVisibility}
            orgProducts={[]}
            logoHash={workspace.logoHash}
          />
        </div>
      ) : (
        <div className={styles.detailContainer}>
          <div className={styles.logoContainer}>
            <PrivateIcon />
          </div>
          <div className={styles.detailInfo}>
            <span>
              <p className={styles.detailText}>{format('private-workspace')}</p>
            </span>
          </div>
          <ShortcutTooltip
            shortcutText={format('collapse-sidebar')}
            shortcutKey="["
            className={styles.tooltipShortcut}
          >
            <Button
              className={styles.workspaceNavToggleButton}
              onClick={toggleVisibility}
            >
              <img
                className={styles.chevronImg}
                src={DoubleChevronCloseSVG}
                alt={format('team-nav-collapse-icon')}
              />
            </Button>
          </ShortcutTooltip>
        </div>
      )}
      <p className={styles.firstParagraph}>
        {format('since-youre-not-a-member')}
      </p>
      <div className={styles.lastParagraphContainer}>
        <span className={styles.houseIcon}>
          <HouseIcon size="large" />
        </span>
        <p className={styles.lastParagraphText}>
          {format('to-see-workspaces', {
            homePageLink: (
              <a
                key="homePageLink"
                href="/"
                target="_blank"
                rel="noreferrer noopener"
                onClick={handleClick}
                className={styles.link}
              >
                {format('home-page')}
              </a>
            ),
          })}
        </p>
      </div>
    </div>
  );
};
