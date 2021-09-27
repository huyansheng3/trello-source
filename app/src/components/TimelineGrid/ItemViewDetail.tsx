import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import { NudgeTooltipPulse } from '@atlassiansox/nudge-tooltip';
import { TimelineItem } from './types';
import { ItemSlider } from './ItemSlider';

import { ChecklistBadge } from '@atlassian/trello-canonical-components/src/card-front/Badges';
import { Facepile } from 'app/src/components/Facepile';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import { DragAndDropTimelineEvent } from './DragAndDropTimelineEvent';
import { Tooltip } from '@trello/nachos/tooltip';
import { reformatTooltipTitle } from './utils/itemTooltipUtils';
import {
  AVATAR_SIZE,
  MAX_AVATAR_COUNT,
  TITLE_ONLY_WIDTH,
  SINGLE_FACEPILE_MAX,
} from './constants';

import {
  seesVersionedVariation,
  useFeatureFlag,
} from '@trello/feature-flag-client';
import { useFocusRing } from '@trello/a11y';

// eslint-disable-next-line @trello/less-matches-component
import styles from './ItemView.less';

interface ItemViewDetailProps {
  item: TimelineItem;
  focusRef?: React.RefObject<HTMLDivElement>;
  onClick?: () => void;
  // if this item in the middle of being resized on the grid
  isResizing?: boolean;
  // if this item should have sliding title and facepile.
  isSlidable?: boolean;
  itemWidth: number;
  initialWidth: number;
  setItemWidth?: (val: number) => void;
  initialRenderSideTitle: boolean;
  // Only unscheduled items should be draggable right now.
  // When all timeline items are draggable this should be removed.
  draggable: boolean;
  allowHoverEffects?: boolean;
}

export const ItemViewDetail: React.FunctionComponent<ItemViewDetailProps> = ({
  item,
  focusRef,
  itemWidth,
  onClick,
  isResizing = false,
  isSlidable = false,
  initialWidth,
  setItemWidth,
  initialRenderSideTitle,
  draggable = false,
  allowHoverEffects = true,
}) => {
  const [detailLeftWidth, setDetailLeftWidth] = useState(0);
  const detailLeftRef = useRef<HTMLDivElement>(null);

  // setting the item width here because changing the zoom will not trigger
  // an item width change unless the user initiates resizing
  useEffect(() => {
    if (setItemWidth) setItemWidth(initialWidth);
  }, [initialWidth, setItemWidth]);

  useEffect(() => {
    if (detailLeftRef.current) {
      setTimeout(() => {
        if (detailLeftRef && detailLeftRef.current) {
          setDetailLeftWidth(detailLeftRef.current.offsetWidth);
        }
      }, 0);
    }
  }, [setDetailLeftWidth, item]);

  const isSlidingTitlesEnabled = seesVersionedVariation(
    'ecosystem.timeline-version',
    'stable',
  );

  if (!isSlidingTitlesEnabled) {
    isSlidable = false;
  }

  const isHoverEffectsEnabled = useFeatureFlag(
    'ecosystem.timeline-hover-effects',
    false,
  );
  const isNudgeEnabled = useFeatureFlag(
    'ecosystem.views-add-card-nudge',
    false,
  );
  // we may need to hide certain elements to prioritize showing the title.
  const hideChecklistBadge =
    (item.badges?.checkItems || 0) <= 0 || itemWidth < TITLE_ONLY_WIDTH;
  const hideFacepile = !item.idMembers.length || itemWidth < TITLE_ONLY_WIDTH;
  let idMembersToShow: string[];
  if (hideFacepile) {
    idMembersToShow = [];
  } else if (!hideFacepile && itemWidth <= SINGLE_FACEPILE_MAX) {
    idMembersToShow = [item.idMembers[0]];
  } else {
    idMembersToShow = item.idMembers;
  }
  /*
   * for the "sliding" titles and facepile, each slider needs to know the width of the other's content.
   * i.e. the facepile slider needs to know the title's width, and the title slider needs to know the facepile's width.
   * accessing the DOM to get element width is expensive.
   * we have no choice for getting the title's width. But for the facepile we can approximate it.
   */
  const maxAvatars = Math.min(idMembersToShow.length, MAX_AVATAR_COUNT + 1);
  const avatarSizeWithMargin = AVATAR_SIZE - 2; // avatars have -2 left margin
  const facepilePadding = 8;
  const approxFacepileWidth =
    maxAvatars * avatarSizeWithMargin + facepilePadding;

  const detailLeftComponent = (
    <div className={styles.itemDetailLeft} ref={detailLeftRef}>
      <div
        className={classNames(
          styles.itemTitle,
          hideChecklistBadge && styles.itemTitleNoChecklist,
        )}
      >
        {item.title}
      </div>
      {!hideChecklistBadge && (
        <div className={styles.itemBadges}>
          <ChecklistBadge
            numItems={item.badges?.checkItems}
            numComplete={item.badges?.checkItemsChecked}
            className={styles.badge}
            iconClassName={styles.badgeIcon}
          />
        </div>
      )}
    </div>
  );

  const facepileComponent = (
    <Facepile
      className={styles.facepile}
      memberIds={idMembersToShow}
      maxFaceCount={MAX_AVATAR_COUNT}
      showMore={true}
      // tell Facepile to use preloaded member data to render the avatars,
      // instead of each component doing a query to look that information up.
      // eslint-disable-next-line react/jsx-no-bind
      renderAvatar={(idMember) => {
        const memberData = item.members.find(
          (member) => member.id === idMember,
        );
        return (
          <MemberAvatar
            idMember={idMember}
            memberData={memberData}
            size={AVATAR_SIZE}
          />
        );
      }}
    />
  );

  // if it's slidable, like items on the grid, render them with the sliders.
  // else if not slidable, like items in the unscheduled popover, just render the 2 parts
  let content;
  if (isSlidable) {
    content = (
      <>
        <ItemSlider
          side="left"
          oppositePadding={approxFacepileWidth}
          styles={styles}
        >
          {!initialRenderSideTitle && detailLeftComponent}
        </ItemSlider>
        {!hideFacepile && (
          <ItemSlider
            side="right"
            oppositePadding={detailLeftWidth}
            styles={styles}
          >
            {facepileComponent}
          </ItemSlider>
        )}
      </>
    );
  } else {
    content = (
      <div className={styles.nonSlidableContainer}>
        {detailLeftComponent}
        {facepileComponent}
      </div>
    );
  }

  const onKeyUp = (e: React.KeyboardEvent<Element>) => {
    switch (e.which) {
      case 32: // space bar
      // fallthrough
      case 13: // enter
        onClick?.();
        break;
      default:
        break;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<Element>) => {
    if (e.which === 32) {
      e.preventDefault(); // stop the document from scrolling
    }
  };

  const [hasFocusRing, events] = useFocusRing({
    onKeyUp,
    onKeyDown,
  });
  const isScheduled = item.startTime || item.endTime;
  if (isNudgeEnabled && isScheduled) {
    content = (
      <NudgeTooltipPulse hasPulse={!!item.showPulse} pulseColor="#8BBDD9">
        {content}
      </NudgeTooltipPulse>
    );
  }
  return (
    <DragAndDropTimelineEvent canDrag={draggable}>
      <div
        className={classNames(
          styles.itemDetail,
          isResizing && styles.noPointerEvents,
          !isSlidable && styles.overflowHidden,
          hasFocusRing && styles.withOutline,
        )}
        ref={focusRef}
        // eslint-disable-next-line react/jsx-no-bind
        onFocus={(e) => {
          e.stopPropagation();
        }}
        onClick={onClick}
        role="button"
        tabIndex={0}
        draggable={draggable}
        {...events}
      >
        {isHoverEffectsEnabled && allowHoverEffects ? (
          <Tooltip
            content={reformatTooltipTitle(item.title)}
            position="mouse"
            mousePosition="top"
            hideTooltipOnMouseDown
          >
            {content}
          </Tooltip>
        ) : (
          <>{content}</>
        )}
      </div>
    </DragAndDropTimelineEvent>
  );
};
