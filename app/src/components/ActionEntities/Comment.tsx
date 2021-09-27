import classNames from 'classnames';
import {
  TrelloMarkdown,
  MarkdownContentType,
} from 'app/src/components/TrelloMarkdown';
import React from 'react';
import { CommentEntity } from './types';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { NotificationTestIds } from '@trello/test-ids';

import styles from './Comment.less';

interface CommentProps extends Pick<CommentEntity, 'text' | 'actionUrl'> {
  isTruncated?: boolean;
  isFullWidth?: boolean;
  reactionAdded?: boolean;
  onClick?: () => void;
}

interface CommentState {
  isTruncated?: boolean;
}
// TODO: Friendly links
// TODO: EDIT comment

export class Comment extends React.Component<CommentProps, CommentState> {
  constructor(props: CommentProps) {
    super(props);

    this.state = {
      isTruncated: this.props.isTruncated || false,
    };
  }

  renderCommentContent() {
    const { text } = this.props;

    return (
      <div className={classNames(styles.currentComment, 'js-friendly-links')}>
        <TrelloMarkdown text={text} contentType={MarkdownContentType.Comment} />
      </div>
    );
  }

  render() {
    const {
      actionUrl,
      isFullWidth = false,
      reactionAdded = false,
      onClick,
    } = this.props;
    const { isTruncated } = this.state;

    return (
      <div
        className={styles.commentContainer}
        data-test-id={NotificationTestIds.CommentContainer}
      >
        <div
          className={classNames({
            [styles.comment]: true,
            [styles.isTruncated]: isTruncated,
            [styles.isFullWidth]: isFullWidth,
            [styles.reactionAdded]: reactionAdded,
          })}
        >
          {isTruncated ? (
            <div
              className={styles.fadeButton}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => this.setState({ isTruncated: false })}
              role="button"
            />
          ) : null}
          {actionUrl ? (
            <RouterLink href={actionUrl} onClick={onClick}>
              {this.renderCommentContent()}
            </RouterLink>
          ) : (
            this.renderCommentContent()
          )}
        </div>
      </div>
    );
  }
}
