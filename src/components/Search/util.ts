import createI18n from '@/locales/index';
const { t }  = createI18n.global
export const typeOptions = [
  { label: t('components.Search.util.or'), value: 'or' },
  { label: t('components.Search.util.and'), value: 'and' },
]

export const termType = [
  { label: '=', value: 'eq' },
  { label: '!=', value: 'not' },
  { label: t('components.Search.util.like'), value: 'like' },
  { label: t('components.Search.util.nlike'), value: 'nlike' },
  { label: '>', value: 'gt' },
  { label: '>=', value: 'gte' },
  { label: '<', value: 'lt' },
  { label: '<=', value: 'lte' },
  { label: t('components.Search.util.in'), value: 'in' },
  { label: t('components.Search.util.nin'), value: 'nin' },
];