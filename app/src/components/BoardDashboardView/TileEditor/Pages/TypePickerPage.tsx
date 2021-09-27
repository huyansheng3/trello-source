/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Button } from '@trello/nachos/button';
import { TileInput, Strings } from '../types';
import { getAvailableChoices } from '../typeChoices';
import { PageContainer } from './PageContainer';
import styles from './TypePickerPage.less';

interface TypePickerPageProps {
  tile: TileInput;
  strings: Strings;
  onEdit(tile: TileInput): void;
  onNext(): void;
  onClose(): void;
}

export const TypePickerPage: React.FC<TypePickerPageProps> = ({
  tile,
  onEdit,
  onNext,
  onClose,
  strings,
}) => {
  const choices = useMemo(() => getAvailableChoices(), []);
  return (
    <PageContainer onClose={onClose}>
      <div className={styles.title}>{strings.typePickerPageTitle}</div>
      <div
        className={classNames(
          styles.content,
          choices.length <= 2 && styles.twoChoices,
          choices.length >= 3 && styles.threePlusChoices,
        )}
      >
        {choices.map((choice) => {
          const selected = choice.isSelected(tile);
          return (
            <TypeChoice
              imgSrc={selected ? choice.imgSrc.color : choice.imgSrc.neutral}
              name={strings.typePickerChoiceNames[choice.type]}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => onEdit(choice.select(tile))}
              selected={selected}
            />
          );
        })}
      </div>
      <Button className={styles.button} appearance="primary" onClick={onNext}>
        {strings.next}
      </Button>
    </PageContainer>
  );
};

interface TypeChoiceProps {
  imgSrc: string;
  name: string;
  onClick(): void;
  selected: boolean;
}
const TypeChoice: React.FC<TypeChoiceProps> = ({
  imgSrc,
  name,
  onClick,
  selected,
}) => {
  return (
    <div
      role="button"
      className={classNames(styles.typeChoice, selected && styles.selected)}
      onClick={onClick}
    >
      <img src={imgSrc} alt="" />
      <div>{name}</div>
    </div>
  );
};
