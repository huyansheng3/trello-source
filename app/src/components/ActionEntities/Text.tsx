import React from 'react';
import { TextEntity } from './types';

interface TextProps extends Pick<TextEntity, 'text'> {}

export class Text extends React.Component<TextProps> {
  render() {
    const { text } = this.props;

    return <>{text}</>;
  }
}
