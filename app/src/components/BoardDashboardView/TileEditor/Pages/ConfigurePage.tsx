/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useMemo, useCallback } from 'react';
import classNames from 'classnames';
import { Button } from '@trello/nachos/button';
import { DataType } from '@trello/dashboard';
import { forTemplate } from '@trello/i18n';
import { TileInput, Strings } from '../types';
import styles from './ConfigurePage.less';
import { PageContainer } from './PageContainer';
import { typeChoices, getAvailableChoices } from '../typeChoices';

const format = forTemplate('board_report');

interface ConfigurePageProps {
  tile: TileInput;
  strings: Strings;
  onEdit(tile: TileInput): void;
  onBack(): void;
  onSubmit(): void;
  onClose(): void;
}

export const ConfigurePage: React.FC<ConfigurePageProps> = ({
  tile,
  onEdit,
  onSubmit,
  onBack,
  onClose,
  strings,
}) => {
  const configureElement = useMemo(() => {
    if (typeChoices.Bar.isSelected(tile)) {
      return (
        <BarChartConfigure tile={tile} onEdit={onEdit} strings={strings} />
      );
    }
    if (typeChoices.Pie.isSelected(tile)) {
      return (
        <PieChartConfigure tile={tile} onEdit={onEdit} strings={strings} />
      );
    }
    if (typeChoices.Line.isSelected(tile)) {
      return (
        <LineChartConfigure tile={tile} onEdit={onEdit} strings={strings} />
      );
    }
    return null;
  }, [tile, onEdit, strings]);

  return (
    <div className={styles.container}>
      <TypePickerSidebar tile={tile} onEdit={onEdit} strings={strings} />
      <PageContainer onClose={onClose}>
        <div className={styles.configureWrapper}>
          <div className={styles.configureElementWrapper}>
            {configureElement}
          </div>
          <div className={styles.configureButtons}>
            <Button className={styles.button} onClick={onBack}>
              {strings.back}
            </Button>
            <Button
              className={styles.button}
              appearance="primary"
              onClick={onSubmit}
            >
              {strings.submit}
            </Button>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

interface TypePickerSidebarProps {
  tile: TileInput;
  onEdit(tile: TileInput): void;
  strings: Strings;
}
const TypePickerSidebar: React.FC<TypePickerSidebarProps> = ({
  tile,
  onEdit,
  strings,
}) => {
  return (
    <div className={styles.typePickerNav}>
      {getAvailableChoices().map((choice) => {
        const selected = choice.isSelected(tile);
        return (
          <div
            role="button"
            className={classNames(styles.choice, selected && styles.selected)}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => onEdit(choice.select(tile))}
          >
            <img
              src={selected ? choice.imgSrc.color : choice.imgSrc.neutral}
              alt={strings.typePickerChoiceNames[choice.type]}
            />
          </div>
        );
      })}
    </div>
  );
};

interface BarChartConfigureProps {
  tile: TileInput;
  onEdit(tile: TileInput): void;
  strings: Strings;
}

const BarChartConfigure: React.FC<BarChartConfigureProps> = ({
  tile,
  onEdit,
  strings,
}) => {
  const onChange = useCallback(
    (newType: string) => {
      onEdit({
        ...tile,
        type: newType,
      });
    },
    [onEdit, tile],
  );

  const options = [
    {
      label: format('cards-per-list'),
      checked: tile.type === DataType.CardsPerList,
      value: DataType.CardsPerList,
    },
    {
      label: format('cards-per-label'),
      checked: tile.type === DataType.CardsPerLabel,
      value: DataType.CardsPerLabel,
    },
    {
      label: format('cards-per-member'),
      checked: tile.type === DataType.CardsPerMember,
      value: DataType.CardsPerMember,
    },
    {
      label: format('cards-per-due-date'),
      checked: tile.type === DataType.CardsPerDueDate,
      value: DataType.CardsPerDueDate,
    },
  ];

  return (
    <div>
      <div className={styles.title}>{strings.configurePageTitles.bar}</div>
      <RadioSetting
        name={format(['wizard', 'type'])}
        options={options}
        onChange={onChange}
      />
    </div>
  );
};

interface PieChartConfigureProps {
  tile: TileInput;
  onEdit(tile: TileInput): void;
  strings: Strings;
}

const PieChartConfigure: React.FC<PieChartConfigureProps> = ({
  tile,
  onEdit,
  strings,
}) => {
  const onChange = useCallback(
    (newType: string) => {
      onEdit({
        ...tile,
        type: newType,
      });
    },
    [onEdit, tile],
  );

  const options = [
    {
      label: format('cards-per-list'),
      checked: tile.type === DataType.CardsPerList,
      value: DataType.CardsPerList,
    },
    {
      label: format('cards-per-label'),
      checked: tile.type === DataType.CardsPerLabel,
      value: DataType.CardsPerLabel,
    },
    {
      label: format('cards-per-member'),
      checked: tile.type === DataType.CardsPerMember,
      value: DataType.CardsPerMember,
    },
    {
      label: format('cards-per-due-date'),
      checked: tile.type === DataType.CardsPerDueDate,
      value: DataType.CardsPerDueDate,
    },
  ];

  return (
    <div>
      <div className={styles.title}>{strings.configurePageTitles.pie}</div>
      <RadioSetting
        name={format(['wizard', 'type'])}
        options={options}
        onChange={onChange}
      />
    </div>
  );
};

const TimerangeOption = {
  'past-week': {
    dateType: 'relative',
    value: -604800000,
  },
  'past-two-weeks': {
    dateType: 'relative',
    value: -1209600000,
  },
  'past-month': {
    dateType: 'relative',
    value: -2592000000,
  },
};

interface LineChartConfigureProps {
  tile: TileInput;
  onEdit(tile: TileInput): void;
  strings: Strings;
}

const LineChartConfigure: React.FC<LineChartConfigureProps> = ({
  tile,
  onEdit,
  strings,
}) => {
  const onTimerangeChange = useCallback(
    (newOptionKey: keyof typeof TimerangeOption) => {
      const newSelectedAdvancedDate = TimerangeOption[newOptionKey];
      onEdit({
        ...tile,
        from: newSelectedAdvancedDate,
      });
    },
    [onEdit, tile],
  );

  const onTypeChange = (newType: string) => {
    onEdit({
      ...tile,
      type: newType,
    });
  };

  const timerangeOptions = [
    {
      label: format(['wizard', 'past-week']),
      checked: tile.from?.value === TimerangeOption['past-week'].value,
      value: 'past-week',
    },
    {
      label: format(['wizard', 'past-two-weeks']),
      checked: tile.from?.value === TimerangeOption['past-two-weeks'].value,
      value: 'past-two-weeks',
    },
    {
      label: format(['wizard', 'past-month']),
      checked: tile.from?.value === TimerangeOption['past-month'].value,
      value: 'past-month',
    },
  ];

  const typeOptions = [
    {
      label: format('cards-per-list'),
      checked: tile.type === DataType.CardsPerListHistory,
      value: DataType.CardsPerListHistory,
    },
    {
      label: format('cards-per-label'),
      checked: tile.type === DataType.CardsPerLabelHistory,
      value: DataType.CardsPerLabelHistory,
    },
    {
      label: format('cards-per-member'),
      checked: tile.type === DataType.CardsPerMemberHistory,
      value: DataType.CardsPerMemberHistory,
    },
    {
      label: format('cards-per-due-date'),
      checked: tile.type === DataType.CardsPerDueDateHistory,
      value: DataType.CardsPerDueDateHistory,
    },
  ];

  return (
    <div>
      <div className={styles.title}>{strings.configurePageTitles.line}</div>
      <RadioSetting
        name={format(['wizard', 'timeframe'])}
        options={timerangeOptions}
        onChange={onTimerangeChange}
      />
      <RadioSetting
        name={format(['wizard', 'type'])}
        options={typeOptions}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={onTypeChange}
      />
    </div>
  );
};

interface RadioSettingProps {
  name: string;
  options: {
    label: string;
    checked: boolean;
    value: string;
  }[];
  onChange(value: string): void;
}
const RadioSetting: React.FC<RadioSettingProps> = ({
  name,
  options,
  onChange,
}) => {
  const _onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      onChange(evt.target.value);
    },
    [onChange],
  );

  return (
    <fieldset className={styles.configureSection}>
      <legend>{name}</legend>
      {options.map((o) => (
        <label className={styles.label}>
          <input
            type="radio"
            className={styles.radio}
            name={name}
            checked={o.checked}
            onChange={_onChange}
            value={o.value}
          />
          {o.label}
        </label>
      ))}
    </fieldset>
  );
};
