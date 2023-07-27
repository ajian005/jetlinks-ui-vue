import createI18n from '@/locales/index';
const { t } = createI18n.global
export const PROVIDER_OPTIONS = [
    { label: 'GB/T28181', value: 'gb28181-2016' },
    { label: t('media.Device.const.fixed'), value: 'fixed-media' },
]
export const streamMode = [
    { label: 'UDP', value: 'UDP' },
    { label: t('media.Device.const.TCP'), value: 'TCP_PASSIVE' },
]

export const providerType = {
    'gb28181-2016': 'GB/T28181',
    'fixed-media': t('media.Device.cosnt.fixed'),
};