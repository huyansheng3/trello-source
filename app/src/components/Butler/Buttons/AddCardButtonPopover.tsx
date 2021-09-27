import React from 'react';
import { useImmer } from 'use-immer';
import { Popover, PopoverScreen } from '@trello/nachos/popover';
import { forNamespace } from '@trello/i18n';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { sendErrorEvent } from '@trello/error-reporting';
import { Button } from '@trello/nachos/button';
import { ActionType } from '@atlassian/butler-command-parser';
import { AvailableActions, validateCommand } from '../CommandEditors';
import { AddCardButtonPopoverScreen } from './AddCardButtonPopoverScreen';
import { Feature } from 'app/scripts/debug/constants';
import {
  EditableButlerButton,
  CardPopoverProps,
  Screen,
} from './CardPopoverProps';
import { EditCardButtonPopoverScreen } from './EditCardButtonPopoverScreen';
import { useAddButlerButtonMutation } from './AddButlerButtonMutation.generated';
import { ButlerAlert, showButlerAlert } from '../showButlerAlert';
import { formatFasIcon } from '../CommandMetadata';

const formatCommandEditor = forNamespace(['butler', 'command editor']);
const format = forNamespace(['butler', 'add card button popover']);

export const AddCardButtonPopover: React.FunctionComponent<CardPopoverProps> = ({
  idCard,
  idBoard,
  idOrganization,
  popoverProps,
  push,
  pop,
  hide,
  goToButlerDirectory,
}) => {
  const [buttonDraft, setButton] = useImmer<EditableButlerButton>({
    cmd: { ACTION: [] },
    label: '',
  });
  const isButtonDraftValid = !!(
    buttonDraft.label.trim().length && validateCommand(buttonDraft.cmd)
  );

  const [
    addButlerButton,
    { loading: isAddingButton },
  ] = useAddButlerButtonMutation();

  const firstActionType = buttonDraft.cmd.ACTION[0]?.type as
    | ActionType
    | undefined; // TS bug: https://github.com/Microsoft/TypeScript/issues/13778

  const addCardButton = async () => {
    const butlerButton = {
      label: buttonDraft.label,
      // We know firstActionType is defined, because this flow presupposes
      // validateCommand, which verifies action length.
      image: formatFasIcon(firstActionType!, true),
      cmd: buttonDraft.cmd,
      type: 'card-button',
      shared: true,
      enabled: true,
    };
    const actions = butlerButton.cmd.ACTION.map(({ type }) => type);
    Analytics.sendClickedButtonEvent({
      buttonName: 'addButlerCardButtonButton',
      source: 'addButlerCardButtonInlineDialog',
      containers: formatContainers({ idCard, idBoard, idOrganization }),
      attributes: { actions },
    });
    try {
      await addButlerButton({
        variables: {
          scope: 'boards',
          idScope: idBoard,
          butlerButton,
        },
      });
      Analytics.sendTrackEvent({
        action: 'added',
        actionSubject: 'butlerCardButton',
        source: 'addButlerCardButtonInlineDialog',
        containers: formatContainers({ idCard, idBoard, idOrganization }),
        attributes: { actions },
      });
      hide();
    } catch (e) {
      sendErrorEvent(e, {
        tags: {
          ownershipArea: 'trello-workflowers',
          feature: Feature.ButlerOnBoards,
        },
        extraData: { action: actions.join(',') },
      });
      if (e.message?.includes('invalid value for cmd')) {
        showButlerAlert(ButlerAlert.InvalidCommand);
      } else {
        showButlerAlert(ButlerAlert.NetworkError);
      }
    }
  };
  return (
    <Popover {...popoverProps}>
      <AddCardButtonPopoverScreen
        idCard={idCard}
        idBoard={idBoard}
        idOrganization={idOrganization}
        push={push}
        pop={pop}
        hide={hide}
        goToButlerDirectory={goToButlerDirectory}
        buttonDraft={buttonDraft}
        setButton={setButton}
        homepage={Screen.Start}
      />
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
        <Button
          appearance="primary"
          size="fullwidth"
          isDisabled={!isButtonDraftValid}
          isLoading={isAddingButton}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={addCardButton}
        >
          {format('add button')}
        </Button>
      </EditCardButtonPopoverScreen>
      <PopoverScreen
        id={Screen.AddAction}
        title={formatCommandEditor('add action')}
      >
        <AvailableActions
          command={buttonDraft.cmd}
          commandType="card-button"
          // eslint-disable-next-line react/jsx-no-bind
          onSelectAction={(action) => {
            setButton((draft) => {
              draft.cmd.ACTION.push(action);
            });
            pop();
          }}
        />
      </PopoverScreen>
    </Popover>
  );
};
