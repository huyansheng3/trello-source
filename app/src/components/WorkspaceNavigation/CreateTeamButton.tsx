import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { preloadData } from 'app/src/components/InviteTeamMembers/TeamIllustrationAnimation';
import {
  ExpandableNavigationItemIcon,
  ExpandableNavigationItemText,
} from 'app/src/components/ExpandableNavigation';
import { forTemplate } from '@trello/i18n';
import { isPaidManagedEnterpriseMember as isPaidManagedEnterpriseMemberSelector } from 'app/gamma/src/selectors/enterprises';
import { State } from 'app/gamma/src/modules/types';
import { Analytics, SourceType } from '@trello/atlassian-analytics';
import { WorkspaceNavigationTestIds } from '@trello/test-ids';
import { Auth } from 'app/scripts/db/auth';
import { PopOver } from 'app/scripts/views/lib/pop-over';
import styles from './CreateTeamButton.less';

const format = forTemplate('home');

interface CreateTeamButtonProps {
  fullTab?: boolean;
  analyticsSource: SourceType;
  currentWorkspaceId?: string | null;
  onCreateTeamButtonClick: () => void;
}

export const CreateTeamButton: React.FunctionComponent<CreateTeamButtonProps> = ({
  fullTab,
  analyticsSource,
  currentWorkspaceId,
  onCreateTeamButtonClick,
  ...props
}) => {
  const isPaidManagedEnterpriseMember = useSelector((state: State) =>
    isPaidManagedEnterpriseMemberSelector(state),
  );
  const onClickCreateTeamPaidManaged = (e: React.MouseEvent) => {
    const CreateOrgView = require('app/scripts/views/organization/create-org-view');
    const createOpts = { isEnterprise: false };

    if (isPaidManagedEnterpriseMember) {
      createOpts.isEnterprise = true;
    }

    PopOver.toggle({
      view: CreateOrgView,
      clientx: e.clientX + 29,
      clienty: e.clientY,
      options: {
        model: Auth.me(),
        createOpts,
      },
    });
  };

  // Just opt paid managed enterprise users out of using the teambuilder altogether
  const canShowTeamBuilder = !isPaidManagedEnterpriseMember;
  const onClickCallback = canShowTeamBuilder
    ? onCreateTeamButtonClick
    : onClickCreateTeamPaidManaged;

  useEffect(() => {
    if (canShowTeamBuilder) {
      preloadData();
    }
  });

  return (
    <>
      <button
        className={classNames(styles.createTeamButton, {
          [styles.fullTab]: fullTab,
        })}
        data-test-id={WorkspaceNavigationTestIds.CreateTeamButton}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={(e) => {
          onClickCallback(e);

          Analytics.sendClickedButtonEvent({
            buttonName: 'createWorkspaceButton',
            source: analyticsSource,
            attributes: {
              organization: {
                id: currentWorkspaceId,
              },
            },
          });
        }}
        aria-label={format('home-create-team')}
        {...props}
      >
        <ExpandableNavigationItemIcon iconName="add" />
        {fullTab && (
          <ExpandableNavigationItemText>
            {format('home-create-team')}
          </ExpandableNavigationItemText>
        )}
      </button>
    </>
  );
};
