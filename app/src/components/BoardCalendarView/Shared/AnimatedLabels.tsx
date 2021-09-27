import React, { useCallback, useMemo, useState } from 'react';
import cx from 'classnames';

import { CanonicalCard } from '@atlassian/trello-canonical-components';
const { CardLabels } = CanonicalCard;
import {
  CardLabel,
  labelColorToColorBlindPattern,
} from '@atlassian/trello-canonical-components/src/card-front/CardLabel';
import { Tooltip } from '@trello/nachos/tooltip';

import { LabelModel } from 'app/gamma/src/types/models';
import { labelByColor } from 'app/src/components/Label';
import { LabelState } from 'app/scripts/view-models/label-state';
import { ShortenedList } from 'app/src/components/BoardCalendarView/Generics';

interface AnimatedLabelsProps {
  labels: LabelModel[];
  colorBlind?: boolean;
  expandedLabels?: boolean;
}

import styles from './AnimatedLabels.less';

export const AnimatedLabels: React.FC<AnimatedLabelsProps> = ({
  labels,
  colorBlind,
  expandedLabels,
}) => {
  const [isAnimating, updateIsAnimating] = useState(false);

  const toggleLabelText = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!isAnimating) {
        updateIsAnimating(true);
        setTimeout(() => updateIsAnimating(false), 700);
        LabelState.toggleText();
      }
    },
    [isAnimating],
  );

  const sortedLabels = useMemo(
    () => labels.sort(labelByColor).filter((label) => !!label.color),
    [labels],
  );

  const virtualLabels = useMemo(() => {
    return sortedLabels.map((label) => (
      <CardLabel
        key={label.id}
        color={label.color || 'gray'}
        className={cx(
          styles.cardLabel,
          expandedLabels && styles.cardLabelExpanded,
        )}
        pattern={
          colorBlind
            ? labelColorToColorBlindPattern[label.color || 'gray']
            : null
        }
      >
        <span className={styles.labelText}>{label.name}</span>
      </CardLabel>
    ));
  }, [colorBlind, expandedLabels, sortedLabels]);

  const renderLabels = () => {
    return sortedLabels.map((label) => (
      <CardLabel
        key={label.id}
        color={label.color || 'gray'}
        className={cx(
          styles.cardLabel,
          styles.animatableCardLabel,
          expandedLabels && styles.cardLabelExpanded,
        )}
        pattern={
          colorBlind
            ? labelColorToColorBlindPattern[label.color || 'gray']
            : null
        }
        onClick={toggleLabelText}
      >
        <span className={styles.labelText}>{label.name}</span>
      </CardLabel>
    ));
  };

  const renderHiddenLabelsIndicator = useCallback(
    (numberHiddenLabels: number) => {
      if (expandedLabels) {
        return (
          <Tooltip
            tag="span"
            position="top"
            content={sortedLabels
              .slice(sortedLabels.length - numberHiddenLabels)
              .map((label) => label.name || `${label.color} label`)
              .join(', ')}
          >
            <CardLabel
              color="gray"
              className={cx(
                styles.cardLabel,
                styles.cardLabelExpanded,
                styles.showMoreLabel,
              )}
              onClick={toggleLabelText}
            >
              +{numberHiddenLabels}
            </CardLabel>
          </Tooltip>
        );
      } else {
        return <div className={styles.labelGradient} />;
      }
    },
    [expandedLabels, sortedLabels, toggleLabelText],
  );

  return (
    <CardLabels
      className={cx(
        styles.cardLabelsContainer,
        expandedLabels && styles.expandedContainer,
      )}
    >
      <ShortenedList
        itemClassName={styles.labelItem}
        renderMoreElement={renderHiddenLabelsIndicator}
        hideOverflowingItems={!!expandedLabels}
        showAllEvents={isAnimating}
        virtualChildren={virtualLabels}
      >
        {renderLabels()}
      </ShortenedList>
    </CardLabels>
  );
};
