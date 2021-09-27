import React, { FunctionComponent, ReactElement, useCallback } from 'react';
import cx from 'classnames';
import { MemberAvatar } from 'app/src/components/MemberAvatar';
import styles from './Facepile.less';
import { LazyProfileCard } from 'app/src/components/ProfileCard';
import { PopOver } from 'app/scripts/views/lib/pop-over';
import { featureFlagClient } from '@trello/feature-flag-client';

interface FacepileProps {
  className?: string;
  avatarSize?: number;
  maxFaceCount?: number;
  showMore?: boolean;
  memberIds: string[];
  renderAvatar?: (memberId: string) => ReactElement;
  onShowMoreClick?: () => void;
  showMoreRef?: (el: HTMLDivElement) => void;
  showProfileCards?: boolean;
}

export const Facepile: FunctionComponent<FacepileProps> = ({
  className = '',
  avatarSize = 30,
  maxFaceCount = 5,
  showMore = true,
  memberIds,
  renderAvatar,
  onShowMoreClick,
  showMoreRef,
  showProfileCards = true,
}) => {
  const onCloseProfileCard = useCallback(() => PopOver.hide(), []);

  const onOpenProfileCard = useCallback(
    (idMember) => {
      return (e: React.MouseEvent) =>
        PopOver.toggle({
          elem: e.currentTarget,
          hideHeader: true,
          reactElement: (
            <LazyProfileCard onClose={onCloseProfileCard} memberId={idMember} />
          ),
        });
    },
    [onCloseProfileCard],
  );

  const avatars = memberIds.slice(0, maxFaceCount).map((idMember) => {
    if (renderAvatar) {
      return renderAvatar(idMember);
    }
    return (
      <MemberAvatar
        idMember={idMember}
        size={avatarSize}
        {...(featureFlagClient.get('btg.atlaskit-profile-card', false) &&
          showProfileCards && {
            onClick: onOpenProfileCard(idMember),
          })}
      />
    );
  });

  return (
    <div className={cx(styles.facepile, className)}>
      {!!showMore && memberIds.length > maxFaceCount && (
        <div
          ref={showMoreRef}
          onClick={onShowMoreClick}
          className={cx(
            styles.showMore,
            onShowMoreClick && styles.showMoreClickable,
          )}
          style={{ width: avatarSize, height: avatarSize }}
          role="button"
        >
          +{memberIds.length - maxFaceCount}
        </div>
      )}
      {avatars.reverse().map((avatar, index) => (
        <div key={index} className={styles.avatar}>
          {avatar}
        </div>
      ))}
    </div>
  );
};
