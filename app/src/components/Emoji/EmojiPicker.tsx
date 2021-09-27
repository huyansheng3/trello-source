import { TrelloBlue500 } from '@trello/colors';
import { forTemplate } from '@trello/i18n';
import NimblePicker from 'emoji-mart/dist-es/components/picker/nimble-picker';
import { PickerProps } from 'emoji-mart/dist-es/utils/shared-props';
import React from 'react';
import { EmojiProviderComponent } from './EmojiProviderComponent';

import styles from './EmojiPicker.less';

const format = forTemplate('reactions');

interface EmojiPickerProps extends PickerProps {
  i18n?: {
    skintext: string;
  } & PickerProps['i18n'];
}

export class EmojiPicker extends React.Component<EmojiPickerProps> {
  static defaultProps: EmojiPickerProps = {
    title: '',
    emoji: '',
    color: TrelloBlue500,
    set: 'twitter',
    i18n: {
      search: format('search'),
      notfound: format('no-emoji-found'),
      skintext: format('skintext'),
      categories: {
        search: format('categories-search-results'),
        recent: format('categories-frequently-used'),
        people: format('categories-smileys-and-people').replace(/&amp;/g, '&'), //escaped ampersands are not handled by emojimart
        nature: format('categories-animals-and-nature').replace(/&amp;/g, '&'),
        foods: format('categories-food-and-drink').replace(/&amp;/g, '&'),
        activity: format('categories-activity'),
        places: format('categories-travel-and-places').replace(/&amp;/g, '&'),
        objects: format('categories-objects'),
        symbols: format('categories-symbols'),
        flags: format('categories-flags'),
        custom: format('categories-custom'),
      },
    },
    style: {
      width: '408px',
    },
    emojiSize: 28,
    skinEmoji: 'v',
    autoFocus: true,

    // @ts-expect-error: Emoji Mart types seem to be wrong
    notFound: () => (
      <div className={styles.noResults}>
        <div className={styles.noResultsLabel}>{format('no-emoji-found')}</div>
        <img
          className={styles.noResultsImg}
          src={require('resources/images/illos.png')}
          alt={format('no-emoji-found')}
        />
      </div>
    ),
  };

  render() {
    return (
      <div className={styles.emojiPicker}>
        <EmojiProviderComponent>
          {(data, backgroundImageFn) => (
            <NimblePicker
              {...this.props}
              data={data}
              backgroundImageFn={backgroundImageFn}
            />
          )}
        </EmojiProviderComponent>
      </div>
    );
  }
}
