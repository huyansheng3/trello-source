import React, { useCallback, useRef } from 'react';

import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { useWorkspace } from '@trello/workspaces';

import { DialogProps } from 'app/src/components/Dialog';

import { useAutoFocus } from './useAutoFocus';
import { WorkspaceNavigationTourModal } from './WorkspaceNavigationTourModal';
// eslint-disable-next-line @trello/less-matches-component
import styles from './WorkspaceNavigationTourModal.less';

const SCREEN_NAME = 'workspaceNavigationIntroModal';

const format = forTemplate('workspace_navigation_tour');

interface WorkspaceNavigationTourIntroModalProps
  extends Omit<DialogProps, 'children'> {}

export const WorkspaceNavigationTourIntroModal: React.FC<WorkspaceNavigationTourIntroModalProps> = (
  props,
) => {
  const { hide, isOpen } = props;
  const { idBoard, idWorkspace } = useWorkspace();

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useAutoFocus(buttonRef, isOpen);

  const handleClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'showMeButton',
      containers: formatContainers({ idBoard, idWorkspace }),
      source: SCREEN_NAME,
    });
    hide();
  }, [hide, idBoard, idWorkspace]);

  const footer = (
    <Button
      appearance="primary"
      className={styles.primaryButton}
      onClick={handleClick}
      ref={buttonRef}
    >
      {format('intro-modal-button')}
    </Button>
  );

  return (
    <WorkspaceNavigationTourModal
      {...props}
      analyticsScreenName={SCREEN_NAME}
      footer={footer}
      heading={format('intro-modal-heading')}
    >
      <p>{format('intro-modal-message')}</p>
    </WorkspaceNavigationTourModal>
  );
};
