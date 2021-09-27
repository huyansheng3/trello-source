import React from 'react';
import cx from 'classnames';
import { Updater } from 'use-immer';
import { ActionType } from '@atlassian/butler-command-parser';
import { Button } from '@trello/nachos/button';
import { PopoverScreen } from '@trello/nachos/popover';
import { Textfield } from '@trello/nachos/textfield';
import { forNamespace } from '@trello/i18n';
import { CommandEditor } from '../CommandEditors';
import { formatActionLabel, formatFasIcon } from '../CommandMetadata';
import { EditableButlerButton, Screen } from './CardPopoverProps';
//eslint-disable-next-line @trello/less-matches-component
import styles from './AddCardButtonPopover.less';

const format = forNamespace(['butler', 'add card button popover']);

interface Props {
  idCard: string;
  idBoard: string;
  idOrganization: string;
  push: (screen: number) => void;
  hide: () => void;
  buttonDraft: EditableButlerButton;
  setButton: Updater<EditableButlerButton>;
  firstActionType: ActionType | undefined;
}

export const EditCardButtonPopoverScreen: React.FunctionComponent<Props> = ({
  idCard,
  idBoard,
  idOrganization,
  push,
  hide,
  buttonDraft,
  setButton,
  firstActionType,
  children,
}) => {
  return (
    <PopoverScreen id={Screen.Edit} title={format('edit button')}>
      <div className={styles.popoverContent}>
        <div className={styles.meta}>
          <div className={styles.iconContainer}>
            <p className={styles.heading}>{format('icon')}</p>
            <Button className={cx('button-link', styles.iconButton)} isDisabled>
              <span
                className="icon-sm plugin-icon"
                style={{
                  backgroundImage: `url(${formatFasIcon(firstActionType)})`,
                }}
              />
            </Button>
          </div>
          <div className={styles.titleContainer}>
            <p className={styles.heading}>{format('title')}</p>
            <Textfield
              maxLength={100}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={(e) => {
                setButton((draft) => {
                  draft.label = e.target.value;
                });
              }}
              placeholder={
                firstActionType ? formatActionLabel(firstActionType) : ''
              }
              value={buttonDraft.label}
              autoFocus={true}
            />
          </div>
        </div>
        <CommandEditor
          command={buttonDraft.cmd}
          commandType="card-button"
          source="addButlerCardButtonInlineDialog"
          // eslint-disable-next-line react/jsx-no-bind
          onUpdateCommand={(updated) => {
            setButton((draft) => {
              draft.cmd = updated;
            });
          }}
          // eslint-disable-next-line react/jsx-no-bind
          onClickAddAction={() => push(Screen.AddAction)}
          idBoard={idBoard}
          idCard={idCard}
          idOrganization={idOrganization}
        />
      </div>
      {children}
    </PopoverScreen>
  );
};
