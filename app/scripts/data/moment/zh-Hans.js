//! moment.js locale configuration
//! locale : chinese (zh-cn)
//! author : suupic : https://github.com/suupic
//! author : Zeno Zeng : https://github.com/zenozeng

const moment = require('moment');
const makeYearAwareCalendar = require('./make-year-aware-calendar');

moment.locale(window.locale, {
  months: [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ],
  monthsShort: [
    '1月',
    '2月',
    '3月',
    '4月',
    '5月',
    '6月',
    '7月',
    '8月',
    '9月',
    '10月',
    '11月',
    '12月',
  ],
  weekdays: [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ],
  weekdaysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  weekdaysMin: ['日', '一', '二', '三', '四', '五', '六'],
  longDateFormat: {
    LT: 'Ah点mm分',
    LTS: 'Ah点m分s秒',
    L: 'YYYY-MM-DD',
    LL: 'YYYY年MMMD日',
    LLL: 'YYYY年MMMD日Ah点mm分',
    LLLL: 'MMMD日',
    l: 'YYYY-MM-DD',
    ll: 'YYYY年MMMD日',
    lll: 'YYYY年MMMD日Ah点mm分',
    llll: 'MMMD日',
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour(hour, meridiem) {
    const mHour = hour === 12 ? 0 : Number(hour);

    if (meridiem === '凌晨' || meridiem === '早上' || meridiem === '上午') {
      return mHour;
    } else if (meridiem === '下午' || meridiem === '晚上') {
      return mHour + 12;
    } else {
      // '中午'
      return mHour >= 11 ? mHour : mHour + 12;
    }
  },
  meridiem(hour, minute, isLower) {
    const hm = hour * 100 + minute;

    if (hm < 600) {
      return '凌晨';
    } else if (hm < 900) {
      return '早上';
    } else if (hm < 1130) {
      return '上午';
    } else if (hm < 1230) {
      return '中午';
    } else if (hm < 1800) {
      return '下午';
    } else {
      return '晚上';
    }
  },
  calendar: makeYearAwareCalendar({
    sameDay() {
      return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
    },
    nextDay() {
      return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
    },
    lastDay() {
      return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
    },
    nextWeek() {
      return 'llll LT';
    },
    lastWeek() {
      return 'llll LT';
    },
    sameYear() {
      return 'llll LT';
    },
    sameElse() {
      const startOfWeek = moment().startOf('week');
      const prefix =
        this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '' : '[本]';

      return `${prefix}ll`;
    },
  }),
  ordinalParse: /\d{1,2}(日|月|周)/,
  ordinal(num, period) {
    switch (period) {
      case 'd':
      case 'D':
      case 'DDD':
        return `${num}日`;
      case 'M':
        return `${num}月`;
      case 'w':
      case 'W':
        return `${num}周`;
      default:
        return number;
    }
  },
  relativeTime: {
    future: '%s内',
    past: '%s前',
    s: '几秒',
    m: '1 分钟',
    mm: '%d 分钟',
    h: '1 小时',
    hh: '%d 小时',
    d: '1 天',
    dd: '%d 天',
    M: '1 个月',
    MM: '%d 个月',
    y: '1 年',
    yy: '%d 年',
  },
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    dow: 1, // Monday is the first day of the week.
    doy: 4, // The week that contains Jan 4th is the first week of the year.
  },
});
