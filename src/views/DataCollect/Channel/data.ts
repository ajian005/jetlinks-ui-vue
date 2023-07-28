import { validateField } from '@/api/data-collect/channel';
import { FormDataType } from './type.d';
import type { Rule } from 'ant-design-vue/lib/form';
import createI18n from '@/locales/index';
const { t } = createI18n.global
export const FormState: FormDataType = {
    name: '',
    provider: undefined,
    configuration: {
        host: '',
        port: '502',
        endpoint: '',
        securityPolicy: 'None',
        securityMode: undefined,
        certId: undefined,
        authType: 'anonymous',
        username: '',
        password: '',
    },
    description: '',
};

export const StatusColorEnum = {
    running: 'success',
    disabled: 'error',
    partialError: 'processing',
    failed: 'warning',
    stopped: 'default',
};
export const updateStatus = {
    disabled: {
        state: 'enabled',
        runningState: 'running',
    },
    enabled: {
        state: 'disabled',
        runningState: 'stopped',
    },
};

export const regOnlyNumber = new RegExp(/^\d+$/);

export const regIP = new RegExp(
    /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
);
export const regIPv6 = new RegExp(
    /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
);
export const regDomain = new RegExp(
    /([0-9a-z-]{2,}\.[0-9a-z-]{2,3}\.[0-9a-z-]{2,3}|[0-9a-z-]{2,}\.[0-9a-z-]{2,3})$/i,
);
export const checkEndpoint = (_rule: Rule, value: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if(!value) return resolve('');
        const res: any = await validateField(value);
        return res.result.passed ? resolve('') : reject(res.result.reason);
    });

export const checkHost = (_rule: Rule, value: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if(!value) return resolve('');
        if(!(regIP.test(value) || regIPv6.test(value) || regDomain.test(value))) {
            return reject(t('DataCollect.Channel.data.ModbusIPFormat'))
        }
        return resolve('')
    });
export const FormValidate = {
    name: [
        { required: true, message: t('DataCollect.Channel.data.nameTip'), trigger: 'blur' },
        { max: 64, message: t('DataCollect.Channel.data.64max') },
    ],
    provider: [{ required: true, message: t('DataCollect.Channel.data.agreementTip') }],
    host: [
        {
            required: true,
            message: t('DataCollect.Channel.data.ModbusIP'),
        },
        {
            validator: checkHost,
            trigger: 'blur',
            // message: '请输入正确格式的Modbus主机IP地址',
            pattern: regIP || regIPv6 || regDomain,
            message: t('DataCollect.Channel.data.ModbusIPFormat'),
        },
    ],
    port: [
        {
            required: true,
            message: t('DataCollect.Channel.data.portTip'),
        },
        {
            pattern: regOnlyNumber,
            message: t('DataCollect.Channel.data.inputLimit'),
        },
    ],

    endpoint: [
        {
            required: true,
            message: t('DataCollect.Channel.data.urlTip'),
        },
        {
            validator: checkEndpoint,
            trigger: 'blur',
        },
    ],

    securityPolicy: [
        {
            required: true,
            message: t('DataCollect.Channel.data.tacticsTip'),
        },
    ],
    securityMode: [
        {
            required: true,
            message: t('DataCollect.Channel.data.modeTip'),
        },
    ],
    certId: [
        {
            required: true,
            message: t('DataCollect.Channel.data.certificateTip'),
        },
    ],
    authType: [
        {
            required: true,
            message: t('DataCollect.Channel.data.authenticationTip'),
        },
    ],
    username: [
        { required: true, message: t('DataCollect.Channel.data.userName'), trigger: 'blur' },
        { max: 64, message: t('DataCollect.Channel.data.64max') },
    ],
    password: [
        { required: true, message: t('DataCollect.Channel.data.pwd'), trigger: 'blur' },
        { max: 64, message: t('DataCollect.Channel.data.64max') },
    ],

    description: [{ max: 200, message: t('DataCollect.Channel.data.200max') }],
};
export const columns = [
    {
        title: t('DataCollect.Channel.data.channelName'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: t('DataCollect.Channel.data.provider'),
        dataIndex: 'provider',
        key: 'provider',
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                { label: 'OPC_UA', value: 'OPC_UA' },
                { label: 'MODBUS_TCP', value: 'MODBUS_TCP' },
            ],
        },
    },
    {
        title: t('DataCollect.Channel.data.state'),
        dataIndex: 'state',
        key: 'state',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: t('DataCollect.Channel.data.enabled'), value: 'enabled' },
                { label: t('DataCollect.Channel.data.disabled'), value: 'disabled' },
            ],
        },
    },
    {
        title: t('DataCollect.Channel.data.runningState'),
        dataIndex: 'runningState',
        key: 'runningState',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: t('DataCollect.Channel.data.running'), value: 'running' },
                { label: t('DataCollect.Channel.data.partialError'), value: 'partialError' },
                { label: t('DataCollect.Channel.data.failed'), value: 'failed' },
            ],
        },
    },
    {
        title: t('DataCollect.Channel.data.description'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: t('DataCollect.Channel.data.action'),
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];
