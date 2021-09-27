import moment from 'moment';
import React from 'react';
import { DateEntity } from './types';

interface DateProps extends Pick<DateEntity, 'date'> {}

// TODO: Date refreshing ?

export class Date extends React.Component<DateProps> {
  render() {
    const { date } = this.props;
    if (!date) {
      return null;
    }
    const currentDateString = moment(date).calendar();

    return <>{currentDateString}</>;
  }
}
