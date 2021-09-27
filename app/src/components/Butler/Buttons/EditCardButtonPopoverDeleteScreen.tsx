import React from 'react';
import cx from 'classnames';
import { PopoverScreen } from '@trello/nachos/popover';
import { forNamespace } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { sendErrorEvent } from '@trello/error-reporting';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { Feature } from 'app/scripts/debug/constants';
import { useDeleteButlerButtonMutation } from './DeleteButlerButtonMutation.generated';
import { DeletableButlerButton, Screen } from './CardPopoverProps';
import { ButlerAlert, showButlerAlert } from '../showButlerAlert';

import styles from './EditCardButtonPopoverDeleteScreen.less';

const format = forNamespace(['butler', 'add card button popover']);

interface Props {
  button: DeletableButlerButton;
  idBoard: string;
  idOrganization: string;
  idCard: string;
  hide: () => void;
}

export const EditCardButtonPopoverDeleteScreen: React.FunctionComponent<Props> = ({
  button,
  idBoard,
  idOrganization,
  idCard,
  hide,
}) => {
  const [
    deleteButlerButton,
    { loading: isDeletingButton },
  ] = useDeleteButlerButtonMutation();

  const deleteButton = async () => {
    try {
      await deleteButlerButton({
        variables: {
          idBoard: idBoard,
          idButton: button.id,
          idOrganization: idOrganization,
          scope: button.scope,
        },
      });
      Analytics.sendClickedButtonEvent({
        buttonName: 'confirmDeleteButlerCardButtonButton',
        source: 'confirmDeleteButlerCardButtonInlineDialog',
        containers: formatContainers({ idCard, idBoard, idOrganization }),
      });
      hide();
    } catch (e) {
      sendErrorEvent(e, {
        tags: {
          ownershipArea: 'trello-workflowers',
          feature: Feature.ButlerOnBoards,
        },
      });
      if (e.message?.includes('cannot delete button')) {
        showButlerAlert(ButlerAlert.SomethingWentWrong);
      } else {
        showButlerAlert(ButlerAlert.NetworkError);
      }
    }
  };

  return (
    <PopoverScreen id={Screen.Delete} title={format('delete page title')}>
      <div className={styles.buttonDisplay}>
        <span
          className={cx('icon-sm', 'plugin-icon', styles.icon)}
          style={{ backgroundImage: `url(${button.image})` }}
        />
        {button.label}
      </div>
      <p className={styles.deleteWarning}>
        {format('delete multi-board warning')}
      </p>
      <p className={styles.deleteWarning}>{format('delete warning')}</p>
      <Button
        size="fullwidth"
        appearance="danger"
        isLoading={isDeletingButton}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={deleteButton}
      >
        {format('delete')}
      </Button>
    </PopoverScreen>
  );
};
