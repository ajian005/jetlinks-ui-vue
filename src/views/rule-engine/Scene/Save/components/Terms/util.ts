import { BranchesThen } from '@/views/rule-engine/Scene/typings'
import createI18n from '@/locales/index';
const { t }  = createI18n.global
export const ContextKey = 'columnOptions'
export const arrayParamsKey = ['nbtw', 'btw', 'in', 'nin', 'contains_all', 'contains_any', 'not_contains']
export const timeTypeKeys = ['time_gt_now', 'time_lt_now']


export const handleParamsData = (data: any[], key: string = 'column'): any[] => {
  return data?.map(item => {
    return {
      ...item,
      key: item[key],
      disabled: !!item.children,
      children: handleParamsData(item.children, key)
    }
  }) || []
}

export const thenRules = [{
  validator(_: string, value: BranchesThen[]) {
    if (!value || (value && !value.length) || !value.some(item => item.actions && item.actions.length)) {
      return Promise.reject(t('components.Terms.util.execute'))
    }
    return Promise.resolve();
  }
}]