/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Checkbox } from '@trello/nachos/checkbox';
import { Textfield } from '@trello/nachos/textfield';
import { TestId } from '@trello/test-ids';

import { forTemplate } from '@trello/i18n';
import styles from './DateField.less';

const format = forTemplate('views');

interface DateFieldProps {
  enabled: boolean;
  label: string;
  onChange: (value: number) => void;
  onFocus?: () => void;
  onToggle?: () => void;
  showTime?: boolean;
  timestamp?: number;
  testId?: TestId;
  showToggle?: boolean;
}
const DateField = React.forwardRef<HTMLInputElement, DateFieldProps>(
  (
    {
      showTime = false,
      enabled,
      onToggle,
      label,
      timestamp,
      onChange,
      onFocus,
      testId,
      showToggle = true,
    }: DateFieldProps,
    ref,
  ) => {
    // moment defaults to now() for undefined
    const dateTime = moment(timestamp || (enabled ? undefined : ''));
    const currentLocaleData = moment.localeData();
    let date = currentLocaleData.longDateFormat('l');
    let time = currentLocaleData.longDateFormat('LT');

    if (dateTime.isValid()) {
      date = dateTime.format('L');
      time = dateTime.format('LT');
    }

    // localized and human readable date and time
    const [currentDate, setCurrentDate] = useState<string>(date);
    const [currentTime, setCurrentTime] = useState<string>(time);

    // this is to ensure that if there is a different timestamp
    // then the values in the text field are updated.
    useEffect(() => {
      setCurrentDate(date);
      setCurrentTime(time);
    }, [date, time]);

    const changeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentDate(e.target.value);
    };

    const changeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentTime(e.target.value);
    };

    const onKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === 13) {
        validateAndPropagate();
      }
    };

    // this method is called on the `onBlur` of the textfield
    // so that we don't validate each time the user types
    // but rather just update the parent component when the
    // user has finished the change
    const validateAndPropagate = () => {
      if (!enabled) {
        return;
      }

      const dateMoment = moment(currentDate, 'l');
      // Parse the localized time (LT) as well as an AM/PM (A) suffixed so that
      // that 24hr timezones can still input 7pm and have it result in 19:00
      const timeMoment = moment(currentTime, 'LT A');
      let dateTime;

      // if the changed date or time is not valid, then set it to
      // the value before the user changed the field.
      // The state change here is to change the value in the textfield.
      if (!dateMoment.isValid() || !timeMoment.isValid()) {
        dateTime = moment(`${date} ${time}`, 'l LT');
        setCurrentDate(date);
        setCurrentTime(time);
      } else {
        dateTime = dateMoment
          .hour(timeMoment.hour())
          .minute(timeMoment.minute());

        const formattedDate = dateMoment.format('l');
        // Format output only in the localized time. AM/PM will be included
        // if applicable to that locale
        const formattedTime = timeMoment.format('LT');

        setCurrentDate(formattedDate);
        setCurrentTime(formattedTime);
        // if the input would resolve to the same time that is already there,
        // return early to not trigger the onChange, which can cause this bug:
        // https://trello.atlassian.net/browse/TRELP-3705
        if (
          dateMoment.format('L') === date &&
          timeMoment.format('LT') === time
        ) {
          return;
        }
      }

      onChange(dateTime.valueOf());
    };

    return (
      // eslint-disable-next-line react/jsx-no-bind
      <div className={styles.wrapper} onBlur={validateAndPropagate}>
        <label className={styles.label}>{label}</label>
        {showToggle && (
          <Checkbox
            isChecked={enabled}
            onChange={onToggle}
            className={styles.toggleCheckbox}
          />
        )}
        <Textfield
          ref={ref}
          isDisabled={!enabled}
          className={styles.date}
          value={currentDate}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={changeDate}
          onFocus={onFocus}
          placeholder={currentLocaleData.longDateFormat('l')}
          // eslint-disable-next-line react/jsx-no-bind
          onKeyDown={onKeyPress}
          testId={testId}
        />
        {showTime && (
          <Textfield
            isDisabled={!enabled}
            placeholder={format('add-time')}
            className={styles.date}
            value={currentTime}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={changeTime}
            onFocus={onFocus}
            // eslint-disable-next-line react/jsx-no-bind
            onKeyDown={onKeyPress}
          />
        )}
      </div>
    );
  },
);

export { DateField };
