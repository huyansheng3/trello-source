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

const SCREEN_NAME = 'workspaceNavigationOptInModal';

const format = forTemplate('workspace_navigation_tour');

interface WorkspaceNavigationTourOptInModalProps
  extends Omit<DialogProps, 'children'> {
  onOptOut?: () => void;
}

export const WorkspaceNavigationTourOptInModal: React.FC<WorkspaceNavigationTourOptInModalProps> = (
  props,
) => {
  const { hide, isOpen, onOptOut } = props;
  const { idBoard, idWorkspace } = useWorkspace();

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useAutoFocus(buttonRef, isOpen);

  const handleDeferOptIn = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'deferOptInButton',
      containers: formatContainers({ idBoard, idWorkspace }),
      source: SCREEN_NAME,
    });
    onOptOut?.();
    hide();
  }, [hide, idBoard, idWorkspace, onOptOut]);

  const handleOptIn = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'optInButton',
      containers: formatContainers({ idBoard, idWorkspace }),
      source: SCREEN_NAME,
    });
    hide();
  }, [hide, idBoard, idWorkspace]);

  const footer = (
    <>
      <Button appearance="subtle" onClick={handleDeferOptIn}>
        {format('opt-in-modal-button-defer')}
      </Button>
      <Button
        appearance="primary"
        className={styles.primaryButton}
        onClick={handleOptIn}
        ref={buttonRef}
      >
        {format('opt-in-modal-button')}
      </Button>
    </>
  );

  return (
    <WorkspaceNavigationTourModal
      {...props}
      analyticsScreenName={SCREEN_NAME}
      footer={footer}
      heading={format('opt-in-modal-heading-v2')}
    >
      <p>{format('opt-in-modal-message')}</p>
    </WorkspaceNavigationTourModal>
  );
};
