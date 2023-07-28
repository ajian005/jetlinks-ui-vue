import createI18n from '@/locales/index';
const { t } = createI18n.global
const initData: any[] = [
    {
        provider: 'alarm',
        name: t('Center.components.data.alarm'),
        children: [
            {
                provider: 'alarm-product',
                name: t('Center.components.data.productAlarm'),
                description:
                    t('Center.components.data.productDes'),
            },
            {
                provider: 'alarm-device',
                name: t('Center.components.data.deviceAlarm'),
                description:
                    t('Center.components.data.deviceDes'),
            },
            {
                provider: 'alarm-org',
                name: t('Center.components.data.orgAlarm'),
                description:
                    t('Center.components.data.orgDes'),
            },
            {
                provider: 'alarm-other',
                name: t('Center.components.data.otherAlarm'),
                description:
                    t('Center.components.data.otherDes'),
            },
        ],
    },
    {
        provider: 'system-monitor',
        name: t('Center.components.data.system'),
        children: [
            {
                provider: 'system-event',
                name: t('Center.components.data.systemEvent'),
            },
        ],
    },
    {
        provider: 'system-business',
        name: t('Center.components.data.business'),
        children: [
            {
                provider: 'device-transparent-codec',
                name: t('Center.components.data.transparent'),
            },
        ],
    },
];

export { initData };