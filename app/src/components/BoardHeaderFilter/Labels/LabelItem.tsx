import React from 'react';
import classNames from 'classnames';

import { CheckIcon } from '@trello/nachos/icons/check';

import styles from './LabelItem.less';
import { LabelColor, Attributes } from '../types';

interface LabelItemProps {
  id: string;
  name: string;
  color: LabelColor;
  toggleLabel: (idLabel: string) => void;
  isActive: boolean;
  isColorBlind: boolean;
  trackFilterItemClick: (attributes: Attributes) => void;
  onKeyDown: (e: React.KeyboardEvent<Element>) => void;
}

export const LabelItem: React.FunctionComponent<LabelItemProps> = ({
  id,
  name,
  color,
  toggleLabel,
  isActive,
  isColorBlind,
  trackFilterItemClick,
  onKeyDown,
}) => {
  function toggleActive() {
    trackFilterItemClick({
      type: 'label',
      id,
    });
    toggleLabel(id);
  }

  function onKeyUp(e: React.KeyboardEvent<Element>) {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleActive();
    }
  }

  return (
    <li
      className={classNames(styles.labelListItem, isActive && styles.isActive)}
    >
      <a
        className={classNames(styles.labelListItemLink)}
        role="button"
        onClick={toggleActive}
        onKeyUp={onKeyUp}
        onKeyDown={onKeyDown}
        tabIndex={0}
      >
        <div
          className={classNames(
            styles.labelListItemLinkLabel,
            isColorBlind ? 'body-color-blind-mode-enabled' : '',
            isColorBlind ? 'body-new-color-blind-mode-patterns' : '',
          )}
        >
          <span className={`card-label mod-square card-label-${color}`}></span>
        </div>

        <span
          className={classNames(
            styles.labelListItemLinkName,
            !name && styles.modQuiet,
          )}
        >
          {name || `${color} label (default)`}
        </span>
        {isActive && (
          <CheckIcon
            size="small"
            dangerous_className={styles.labelListItemLinkIcon}
          />
        )}
      </a>
    </li>
  );
};
