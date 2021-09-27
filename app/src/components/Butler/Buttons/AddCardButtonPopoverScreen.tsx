import React from 'react';
import { Updater } from 'use-immer';
import { ActionType } from '@atlassian/butler-command-parser';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { isSubmitEvent } from '@trello/keybindings';
import { Button } from '@trello/nachos/button';
import { PopoverScreen } from '@trello/nachos/popover';
import { forNamespace } from '@trello/i18n';
import { hydrateAction, useAvailableActions } from '../CommandEditors';
import { formatActionLabel, formatFasIcon } from '../CommandMetadata';
import { ButlerTab, ButlerNewCommandId } from '../showButlerDirectory';
import { EditableButlerButton, Screen } from './CardPopoverProps';
// eslint-disable-next-line
import styles from './AddCardButtonPopover.less';

const format = forNamespace(['butler', 'add card button popover']);

interface Props {
  idCard: string;
  idBoard: string;
  idOrganization: string;
  push: (screen: number) => void;
  pop: (depth?: number) => void;
  hide: () => void;
  goToButlerDirectory: (butlerTab?: ButlerTab, butlerCmdEdit?: string) => void;
  buttonDraft: EditableButlerButton;
  setButton: Updater<EditableButlerButton>;
  homepage: Screen;
}

export const AddCardButtonPopoverScreen: React.FunctionComponent<Props> = ({
  idCard,
  idBoard,
  idOrganization,
  push,
  goToButlerDirectory,
  buttonDraft,
  setButton,
  homepage,
}) => {
  const availableActions = useAvailableActions(buttonDraft.cmd, 'card-button');

  const selectActionTemplate = (type: ActionType) => {
    setButton((draft) => {
      draft.cmd.ACTION = [hydrateAction(type)];
    });
    push(Screen.Edit);
    Analytics.sendClickedButtonEvent({
      buttonName: 'butlerCardButtonTemplateButton',
      source: 'addButlerCardButtonInlineDialog',
      containers: formatContainers({ idCard, idBoard, idOrganization }),
      attributes: { type },
    });
  };

  const onClickButlerDirectoryLink = () => {
    Analytics.sendClickedLinkEvent({
      linkName: 'openButlerLink',
      source: 'addButlerCardButtonInlineDialog',
      containers: formatContainers({ idCard, idBoard, idOrganization }),
    });
    goToButlerDirectory();
  };

  const onClickCreateCustomCardButton = () => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'createCustomButlerCardButtonButton',
      source: 'addButlerCardButtonInlineDialog',
      containers: formatContainers({ idCard, idBoard, idOrganization }),
    });
    goToButlerDirectory(ButlerTab.CardButton, ButlerNewCommandId);
  };
  return (
    <PopoverScreen id={homepage} title={format('add button')}>
      <div className={styles.popoverContent}>
        <p className={styles.heading}>{format('button templates')}</p>
        {availableActions.map((type) => {
          const label = formatActionLabel(type);
          if (!label) {
            return null;
          }
          return (
            <a
              key={`add-butler-card-button-template-${type}`}
              className="button-link"
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => selectActionTemplate(type)}
              role="button"
            >
              <span
                className="icon-sm plugin-icon"
                style={{
                  backgroundImage: `url(${formatFasIcon(type)})`,
                }}
              />
              {label}
            </a>
          );
        })}
        <p className={styles.subtext}>
          {format('default visibility settings', {
            butlerDirectoryLink: (
              <a
                // HACK: extra slash intentional; normally the link should be
                // `/b/${shortLink}/${boardName}/butler`, but we don't have
                // those fields trivially accessible; `idBoard` works in place
                // of `shortLink`, and `boardName` can be safely omitted.
                href={`/b/${idBoard}//butler`}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={(e) => {
                  e.preventDefault();
                  onClickButlerDirectoryLink();
                }}
                // eslint-disable-next-line react/jsx-no-bind
                onKeyDown={(e) => {
                  if (isSubmitEvent(e)) {
                    e.preventDefault();
                    onClickButlerDirectoryLink();
                  }
                }}
                key="butler-add-card-button-popover-butler-directory-link"
              >
                {format('butler directory')}
              </a>
            ),
          })}
        </p>
      </div>
      <Button
        size="fullwidth"
        // eslint-disable-next-line react/jsx-no-bind
        onClick={onClickCreateCustomCardButton}
        // eslint-disable-next-line react/jsx-no-bind
        onKeyPress={(e) => {
          if (isSubmitEvent(e)) {
            onClickCreateCustomCardButton();
          }
        }}
      >
        {format('create a custom button')}
      </Button>
    </PopoverScreen>
  );
};
