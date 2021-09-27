import React, { ReactNode, useEffect } from 'react';

import {
  Analytics,
  formatContainers,
  SourceType,
} from '@trello/atlassian-analytics';
import { useWorkspace } from '@trello/workspaces';

import { Dialog, DialogProps } from 'app/src/components/Dialog';

import styles from './WorkspaceNavigationTourModal.less';

interface WorkspaceNavigationTourModalIntroProps extends DialogProps {
  analyticsScreenName?: SourceType;
  footer: ReactNode;
  heading: string;
}

export const WorkspaceNavigationTourModal: React.FC<WorkspaceNavigationTourModalIntroProps> = (
  props,
) => {
  const {
    analyticsScreenName,
    children,
    footer,
    heading,
    ...dialogProps
  } = props;

  const { idBoard, idWorkspace } = useWorkspace();

  useEffect(() => {
    if (dialogProps.isOpen && analyticsScreenName) {
      Analytics.sendScreenEvent({
        containers: formatContainers({ idBoard, idWorkspace }),
        name: analyticsScreenName,
      });
    }
  }, [analyticsScreenName, dialogProps.isOpen, idBoard, idWorkspace]);

  return (
    <Dialog {...dialogProps} size="medium">
      <div className={styles.container}>
        <img
          src={require('resources/images/workspace-navigation-tour/opt-in-illustration.svg')}
          alt=""
          role="presentation"
        />
        <h2 className={styles.header}>{heading}</h2>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>{footer}</div>
      </div>
    </Dialog>
  );
};
