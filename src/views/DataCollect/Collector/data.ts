import createI18n from '@/locales/index';
const { t } = createI18n.global
export const colorMap = new Map();
colorMap.set('running', 'success');
colorMap.set('partialError', 'warning');
colorMap.set('partError', 'warning'); // 部分错误
colorMap.set('failed', 'error');
colorMap.set('allError', 'error'); // 全部错误
colorMap.set('stopped', 'default');
colorMap.set('processing', '#cccccc');
colorMap.set('enabled', 'processing');
colorMap.set('disabled', 'error');

export const getState = (record: any) => {
    const enabled = record?.state?.value === 'enabled';
    if (record) {
        return {
            value: enabled ? record?.runningState?.value : 'processing',
            text: enabled ? record?.runningState?.text : '禁用',
        };
    } else {
        return {};
    }
};

export const regOnlyNumber = new RegExp(/^\d+$/);

export const checkProviderData = {
    int8: 1,
    int16: 2,
    int32: 4,
    int64: 8,
    ieee754_float: 4,
    ieee754_double: 8,
    hex: 1,
};

export const ModBusRules = {
    name: [
        {
            required: true,
            message: t('DataCollect.Collector.data.pointName'),
        },
        {
            max: 64,
            message: t('DataCollect.Collector.data.64max'),
        },
    ],
    function: [
        {
            required: true,
            message: t('DataCollect.Collector.data.functionCode'),
        },
    ],
    pointKey: [
        {
            required: true,
            message: t('DataCollect.Collector.data.addressTip'),
        },
        {
            pattern: regOnlyNumber,
            message: t('DataCollect.Collector.data.inputLimit'),
        },
    ],
    quantity: [
        {
            required: true,
            message:  t('DataCollect.Collector.data.register'),
        },
        {
            pattern: regOnlyNumber,
            message: t('DataCollect.Collector.data.inputLimit2'),
        },
    ],
    provider: [
        {
            required: true,
            message: t('DataCollect.Collector.data.dataType'),
        },
    ],
    scaleFactor: [
        {
            required: true,
            message: t('DataCollect.Collector.data.zoom'),
        },
    ],
    accessModes: [
        {
            required: true,
            message: t('DataCollect.Collector.data.interviewType'),
        },
    ],
    writeByteCount: [
        {
            required: true,
            message: t('DataCollect.Collector.data.selectDataArea'),
        },
    ],
    byteCount: [
        {
            required: true,
            message: t('DataCollect.Collector.data.inputDataArea'),
        },
    ],
    interval: [
        {
            required: true,
            message: t('DataCollect.Collector.data.frequency'),
        },
        {
            pattern: regOnlyNumber,
            message: t('DataCollect.Collector.data.inputTip3'),
        },
    ],

    description: [{ max: 200, message: t('DataCollect.Collector.data.200max') }],
};

export const OPCUARules = {
    name: [
        {
            required: true,
            message: t('DataCollect.Collector.data.pointName'),
        },
        {
            max: 64,
            message: t('DataCollect.Collector.data.64max'),
        },
    ],
    type: [
        {
            required: true,
            message: t('DataCollect.Collector.data.dataType'),
        },
    ],
    accessModes: [
        {
            required: true,
            message: t('DataCollect.Collector.data.interviewType'),
        },
    ],
    interval: [
        {
            required: true,
            message:  t('DataCollect.Collector.data.frequency'),
        },
        {
            pattern: regOnlyNumber,
            message: t('DataCollect.Collector.data.inputTip3'),
        },
    ],
    description: [{ max: 200, message: t('DataCollect.Collector.data.200max') }],
};

export const LeftTreeRules = {
    channelId: [{ required: true, message: t('DataCollect.Collector.data.channel'), trigger: 'blur' }],
    name: [
        { required: true, message: t('DataCollect.Collector.data.harvester'), trigger: 'blur' },
        { max: 64, message: t('DataCollect.Collector.data.64max') },
    ],
    unitId: [
        { required: true, message: t('DataCollect.Collector.data.slave'), trigger: 'blur' },
        {
            pattern: regOnlyNumber,
            message: t('DataCollect.Collector.data.inputTip4'),
        },
    ],
    type: [{ required: true, message: t('DataCollect.Collector.data.handle'), trigger: 'blur' }],
    endian: [
        { required: true, message: t('DataCollect.Collector.data.endian'), trigger: 'blur' },
    ],
    endianIn: [
        { required: true, message: t('DataCollect.Collector.data.endianIn'), trigger: 'blur' },
    ],
};

export const FormTableColumns = [
    {
        title: t('DataCollect.Collector.data.name'),
        dataIndex: 'name',
        key: 'name',
        width: 140,
        fixed: 'left',
    },
    {
        title: 'nodeId',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        ellipsis: true,
    },
    {
        title: t('DataCollect.Collector.data.accessType'),
        dataIndex: 'accessModes',
        key: 'accessModes',
        width: 260,
    },
    {
        title: t('DataCollect.Collector.data.interval'),
        key: 'interval',
        dataIndex: 'interval',
        width: 200,
    },
    {
        title: t('DataCollect.Collector.data.features'),
        key: 'features',
        dataIndex: 'features',
        width: 140,
    },
    {
        title: t('DataCollect.Collector.data.action'),
        key: 'action',
        dataIndex: 'action',
        fixed: 'right',
        width: 50,
    },
];
