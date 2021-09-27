import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { EmojiPicker } from 'app/src/components/Emoji';
import { ReactionAnalyticsContext } from 'app/src/components/ReactionAnalyticsContext';
import { EmojiData } from 'emoji-mart/dist-es/utils/emoji-index/nimble-emoji-index';
import React from 'react';
import _ from 'underscore';

interface EmojiPickerPopoverProps {
  onSelectEmoji: (
    emoji: EmojiData,
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => void;
}

interface EmojiPickerPopoverState {
  didSelectEmoji: boolean;
}

export class EmojiPickerPopover extends React.Component<
  EmojiPickerPopoverProps,
  EmojiPickerPopoverState
> {
  static contextType = ReactionAnalyticsContext;
  eventListenersToRemove: (() => void)[] = [];

  state: EmojiPickerPopoverState = {
    didSelectEmoji: false,
  };

  analyticsContext = {
    containers: {
      board: {
        id: this.context?.boardId,
      },
      card: {
        id: this.context?.cardId,
      },
      list: {
        id: this.context?.listId,
      },
    },
    attributes: {
      actionId: this.context?.actionId,
    },
  };

  componentDidMount() {
    this.addTrackingEventListeners();
    const { containers, attributes } = this.analyticsContext;

    Analytics.sendScreenEvent({
      name: 'emojiPickerInlineDialog',
      containers,
      attributes,
    });
  }

  componentWillUnmount() {
    this.eventListenersToRemove.forEach((removeEventListener) =>
      removeEventListener(),
    );

    // If an emoji wasn't selected, the emoji picker is being closed
    // because the user clicked outsider of the popover
    if (!this.state.didSelectEmoji) {
      const { containers, attributes } = this.analyticsContext;
      Analytics.sendClosedComponentEvent({
        componentName: 'emojiPickerInlineDialog',
        componentType: 'inlineDialog',
        source: getScreenFromUrl(),
        containers,
        attributes: {
          ...attributes,
          method: 'closed by clicking outside',
        },
      });
    }
  }

  addTrackingEventListeners = () => {
    document.addEventListener('click', this.onDocumentClick);
    this.eventListenersToRemove.push(() =>
      document.removeEventListener('click', this.onDocumentClick),
    );

    // delay needed because EmojiMart does not finish updating the
    // searchInput class name by the time this function is called
    setTimeout(() => {
      const searchInput = document.querySelector('.emoji-mart input');
      if (searchInput) {
        searchInput.addEventListener('input', this.onSearch);
        this.eventListenersToRemove.push(() =>
          searchInput.removeEventListener('input', this.onSearch),
        );
      }
    }, 500);
  };

  onDocumentClick = (e: MouseEvent) => {
    e.stopPropagation();

    const eventTarget = e.target;
    if (!(eventTarget instanceof Element)) {
      return;
    }

    const currentTarget = [
      '.emoji-mart-anchor',
      '.emoji-mart-skin-swatches .emoji-mart-skin-swatch',
    ].reduce(
      (current, selector) => current || eventTarget.closest(selector),
      null,
    );

    if (!(currentTarget instanceof HTMLElement)) {
      return;
    }

    const isCategorySelector = currentTarget.classList.contains(
      'emoji-mart-anchor',
    );

    /*
     * NOTE: These selectors appear to be incorrect, but there's
     * A method to the madness. For some reason, this event
     * handler gets called *after* EmojiMart updates the class
     * names of the elements. Thus, we check to see if they match
     * the class names that they take on after being clicked on,
     * rather than the ones they had before being clicked on.
     */
    const isEmojiMartSkinSwatch = currentTarget.matches(
      '.emoji-mart-skin-swatches.opened .emoji-mart-skin-swatch',
    );
    const isEmojiMartSkin = currentTarget.matches(
      '.emoji-mart-skin-swatches:not(.opened) .emoji-mart-skin-swatch',
    );

    const { containers, attributes } = this.analyticsContext;

    if (isEmojiMartSkin) {
      const skinElement = currentTarget.querySelector(
        'span[class^="emoji-mart-skin-tone"]',
      );
      const skin =
        skinElement instanceof HTMLElement ? skinElement.dataset.skin : '';
      const variation = `skin-tone-${skin}`;

      Analytics.sendUIEvent({
        action: 'clicked',
        actionSubject: 'icon',
        actionSubjectId: 'emojiSkinToneIcon',
        source: 'emojiPickerInlineDialog',
        containers,
        attributes: {
          ...attributes,
          variation,
        },
      });
    } else if (isCategorySelector) {
      const category =
        currentTarget?.attributes?.getNamedItem('title')?.value ?? '';

      Analytics.sendClickedButtonEvent({
        buttonName: 'emojiMenuIcon',
        source: 'emojiPickerInlineDialog',
        containers,
        attributes: {
          ...attributes,
          category,
        },
      });
      Analytics.sendViewedComponentEvent({
        componentType: 'tab',
        componentName: 'emojiReactionCategoryTab',
        source: 'emojiPickerInlineDialog',
        containers,
        attributes,
      });
    } else if (isEmojiMartSkinSwatch) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'emojiSkinToneMenuIcon',
        source: 'emojiPickerInlineDialog',
        containers,
        attributes,
      });
      Analytics.sendScreenEvent({
        name: 'emojiSkinToneDrawer',
        containers,
        attributes,
      });
    } else {
      return;
    }
  };

  onSelectEmoji = (
    emoji: EmojiData,
    e: React.MouseEvent<HTMLElement, MouseEvent>,
  ) => {
    this.setState({ didSelectEmoji: true }, () =>
      this.props.onSelectEmoji(emoji, e),
    );
  };

  onSearch = _.debounce((e: KeyboardEvent) => {
    e.stopPropagation();
    if (e.target instanceof HTMLInputElement && e.target.value.trim() !== '') {
      const { containers } = this.analyticsContext;

      Analytics.sendTrackEvent({
        action: 'searched',
        actionSubject: 'reaction',
        source: 'emojiPickerInlineDialog',
        containers,
      });
    }
  }, 1000);

  render() {
    return (
      <ReactionAnalyticsContext.Consumer>
        {(analyticsContext) => {
          this.context = analyticsContext;

          return <EmojiPicker onClick={this.onSelectEmoji} />;
        }}
      </ReactionAnalyticsContext.Consumer>
    );
  }
}
