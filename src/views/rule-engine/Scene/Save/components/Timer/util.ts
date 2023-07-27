import { isArray } from 'lodash-es'
import type { OperationTimer } from "@/views/rule-engine/Scene/typings";
import createI18n from '@/locales/index';
const { t }  = createI18n.global
export const numberToString = {
  1: t('components.Timer.util.Monday'),
  2: t('components.Timer.util.Tuesday'),
  3: t('components.Timer.util.Wednesday'),
  4: t('components.Timer.util.Thursday'),
  5: t('components.Timer.util.Friday'),
  6: t('components.Timer.util.Saturday'),
  7: t('components.Timer.util.Sunday'),
};

export const timeUnitEnum = {
  seconds: t('components.Timer.util.seconds'),
  minutes: t('components.Timer.util.minutes'),
  hours: t('components.Timer.util.hours'),
};

type continuousValueFn = (data: (string | number)[], type: string) => (number | string)[];

export const continuousValue: continuousValueFn = (data, type) => {
  let start = 0;
  const newArray: (number | string)[] = [];
  const isWeek = type === 'week';
  if (isArray(data)) {
    data.forEach((item, index) => {
      const _item = Number(item);
      const nextValue = data[index + 1];
      const previousValue = data[index - 1];
      const nextItemValue = _item + 1;
      const previousItemValue = _item - 1;
      if (nextItemValue === nextValue && previousItemValue !== previousValue) {
        start = _item;
      } else if (previousItemValue === previousValue && nextItemValue !== nextValue) {
        // 表示前start和item连续，并且item与nextValue不连续
        if (_item - start >= 2) {
          // 至少三位连续
          newArray.push(
            isWeek
              ? `${numberToString[start]} - ${numberToString[_item]}`
              : `${start} - ${_item}号`,
          );
        } else {
          newArray.push(isWeek ? numberToString[start] : `${start}号`);
          newArray.push(isWeek ? numberToString[_item] : `${_item}号`);
        }
      } else if (previousItemValue !== previousValue && nextItemValue !== nextValue) {
        newArray.push(isWeek ? numberToString[_item] : `${_item}号`);
      }
    });
  }
  return newArray;
};

type TimerOption = {
  when?: string
  time?: string
  extraTime?: string
}

export const handleTimerOptions = (timer: OperationTimer):TimerOption => {
  let when = t('components.Timer.util.everyday')
  let time = undefined
  let extraTime = undefined

  if (timer.trigger === 'cron') {
    time = timer.cron
    return { time }
  }

  if (timer.when?.length) {
    when = timer!.trigger === 'week' ? t('components.Timer.util.weekly') : t('components.Timer.util.monthly') ;
    const whenStrArr = continuousValue(timer.when! || [], timer!.trigger);
    const whenStrArr3 = whenStrArr.splice(0, 3);
    when += whenStrArr3.join('、');
    when += t('components.Timer.util.wait',{when:timer.when!.length});
  }

  if (timer.once) {
    time = timer.once.time + t('components.Timer.util.execute');
  } else if (timer.period) {
    time = timer.period.from + '-' + timer.period.to;
    extraTime = t('components.Timer.util.executing',{every:timer.period.every,unit:timeUnitEnum[timer.period.unit]});
  }

  return {
    when,
    time,
    extraTime
  }
}