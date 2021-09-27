import React from 'react';
import { useImmer } from 'use-immer';
import { Popover, PopoverScreen } from '@trello/nachos/popover';
import { ActionType, Command } from '@atlassian/butler-command-parser';
import { forNamespace } from '@trello/i18n';
import { EditIcon } from '@trello/nachos/icons/edit';
import { Button } from '@trello/nachos/button';
import { TrashIcon } from '@trello/nachos/icons/trash';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useButlerButtons, FormattedButlerButton } from './useButlerButtons';
import { ButlerCardButton } from './ButlerCardButton';
import {
  CardPopoverProps,
  DeletableButlerButton,
  Screen,
} from './CardPopoverProps';
import { parseButlerCommand } from '../parseButlerCommand';
import { EditCardButtonPopoverScreen } from './EditCardButtonPopoverScreen';
import { EditCardButtonPopoverDeleteScreen } from './EditCardButtonPopoverDeleteScreen';
// eslint-disable-next-line
import styles from './AddCardButtonPopover.less';

const format = forNamespace(['butler', 'add card button popover']);

export const EditCardButtonPopover: React.FunctionComponent<CardPopoverProps> = ({
  idCard,
  idBoard,
  idOrganization,
  popoverProps,
  push,
  pop,
  hide,
  goToButlerDirectory,
}) => {
  const [buttonDraft, setButton] = useImmer<DeletableButlerButton>({
    cmd: { ACTION: [] },
    label: '',
    id: '',
    image: '',
    scope: 'boards',
  });

  const firstActionType = buttonDraft.cmd.ACTION[0]?.type as
    | ActionType
    | undefined; // TS bug: https://github.com/Microsoft/TypeScript/issues/13778

  const { buttons } = useButlerButtons({
    type: 'card-button',
    idBoard,
    idOrganization,
  });
  const isEditCardButtonEnabled = useFeatureFlag(
    'workflowers.bob-update-card-button-popover',
    false,
  );
  const cardButtonCallback = (button: FormattedButlerButton) => {
    const cmd: Command =
      parseButlerCommand(String(button.cmd)) || ({ ACTION: [] } as Command);
    setButton((draft) => {
      draft.cmd = cmd;
      draft.label = button.label!;
      draft.image = button.image;
      draft.id = button.id;
      draft.scope = button.scope;
    });

    Analytics.sendClickedButtonEvent({
      buttonName: 'selectButlerCardButtonButton',
      source: 'selectButlerCardButtonInlineDialog',
      containers: formatContainers({ idCard, idBoard, idOrganization }),
    });
    push(isEditCardButtonEnabled ? Screen.Edit : Screen.Delete);
  };

  return (
    <Popover {...popoverProps}>
      <PopoverScreen id={Screen.Start} title={format('edit buttons')}>
        <div>
          {buttons.map((button) => (
            <div className={styles.buttonContainer} key={button.id}>
              <ButlerCardButton
                key={button.id}
                button={button}
                idCard={idCard}
                idBoard={idBoard}
                idOrganization={idOrganization}
                // eslint-disable-next-line react/jsx-no-bind
                cardButtonCallback={() => cardButtonCallback(button)}
                isTooltipEnabled={false}
                runButton={false}
              />
              <a
                className={styles.editButtonLink}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => cardButtonCallback(button)}
                role="button"
              >
                {isEditCardButtonEnabled ? (
                  <EditIcon size="small" />
                ) : (
                  <TrashIcon size="small" />
                )}
              </a>
            </div>
          ))}
        </div>
      </PopoverScreen>
      <EditCardButtonPopoverScreen
        idCard={idCard}
        idBoard={idBoard}
        idOrganization={idOrganization}
        push={push}
        hide={hide}
        buttonDraft={buttonDraft}
        setButton={setButton}
        firstActionType={firstActionType}
      >
        <Button size="fullwidth" appearance="primary">
          {format('update button')}
        </Button>
        <Button size="fullwidth">{format('delete button')}</Button>
        <div className={styles.butlerDirectoryLinkContainer}>
          <a
            role="link"
            className={styles.butlerDirectoryLink}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => goToButlerDirectory}
          >
            {format('advanced customization')}
          </a>
        </div>
      </EditCardButtonPopoverScreen>
      <EditCardButtonPopoverDeleteScreen
        button={buttonDraft}
        idBoard={idBoard}
        idOrganization={idOrganization}
        idCard={idCard}
        hide={hide}
      />
    </Popover>
  );
};
