import React, { useCallback, useRef } from 'react';

import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';

import { DialogProps } from 'app/src/components/Dialog';

import { OptOutFeedbackButton } from './OptOutFeedbackButton';
import { useAutoFocus } from './useAutoFocus';
import { WorkspaceNavigationTourModal } from './WorkspaceNavigationTourModal';

const format = forTemplate('workspace_navigation_tour');

interface WorkspaceNavigationTourOptOutFeedbackModalProps
  extends Omit<DialogProps, 'children'> {
  onOptOut?: () => void;
  orgId?: string;
}

export const WorkspaceNavigationTourOptOutFeedbackModal: React.FC<WorkspaceNavigationTourOptOutFeedbackModalProps> = (
  props,
) => {
  const { hide, isOpen, onOptOut, orgId } = props;

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  useAutoFocus(buttonRef, isOpen);

  const handleHide = useCallback(() => {
    onOptOut?.();
    hide();
  }, [hide, onOptOut]);

  const footer = (
    <>
      <Button appearance="subtle" onClick={handleHide}>
        {format('opt-out-feedback-modal-button-skip')}
      </Button>
      <OptOutFeedbackButton onClick={handleHide} orgId={orgId} ref={buttonRef}>
        {format('opt-out-feedback-modal-button-share')}
      </OptOutFeedbackButton>
    </>
  );

  return (
    <WorkspaceNavigationTourModal
      {...props}
      footer={footer}
      heading={format('opt-out-feedback-modal-heading')}
      hide={handleHide}
    >
      {/* Intentionally hard-coding the value of the gift card to avoid translators
      adjusting it */}
      <p>{format('opt-out-feedback-modal-message', { giftAmount: '$100' })}</p>
    </WorkspaceNavigationTourModal>
  );
};
