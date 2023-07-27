import createI18n from '@/locales/index';
const { t } = createI18n.global
export const ParserConfiguration = {
    delimited: '',
    lang: '',
    script: '',
    size: '',
    length: '4',
    offset: undefined,
    little: undefined,
};

export const Configuration = {
    parserType: undefined,
    port: undefined,
    host: undefined,
    publicPort: '',
    publicHost: '',
    remoteHost: '',
    remotePort: '',
    secure: false,
    username: '',
    password: '',
    topicPrefix: '',
    maxMessageSize: 8192,
    certId: undefined,
    privateKeyAlias: '',
    clientId: '',
    parserConfiguration: ParserConfiguration,
};

export const FormStates = {
    name: '',
    type: 'UDP',
    shareCluster: true,
    description: '',
};

export const FormStates2 = {
    serverId: undefined,
    configuration: Configuration,
};

export const TCPList = [
    'TCP_SERVER',
    'WEB_SOCKET_SERVER',
    'HTTP_SERVER',
    'MQTT_SERVER',
];
export const UDPList = ['UDP', 'COAP_SERVER'];

const VisibleMost = [
    'COAP_SERVER',
    'MQTT_SERVER',
    'WEB_SOCKET_SERVER',
    'TCP_SERVER',
    'UDP',
    'HTTP_SERVER',
];

export const VisibleData = {
    parserType: ['TCP_SERVER'],
    port: VisibleMost,
    host: VisibleMost,
    publicPort: VisibleMost,
    publicHost: VisibleMost,
    serverId: ['MQTT_CLIENT'],
    remoteHost: ['MQTT_CLIENT'],
    remotePort: ['MQTT_CLIENT'],
    secure: ['UDP', 'COAP_SERVER'],
    username: ['MQTT_CLIENT'],
    password: ['MQTT_CLIENT'],
    topicPrefix: ['MQTT_CLIENT'],
    maxMessageSize: ['MQTT_SERVER', 'MQTT_CLIENT'],
    clientId: ['MQTT_CLIENT'],
    delimited: ['DELIMITED'],
    lang: ['SCRIPT'],
    script: ['SCRIPT'],
    size: ['FIXED_LENGTH'],
    length: ['LENGTH_FIELD'],
    offset: ['LENGTH_FIELD'],
    little: ['LENGTH_FIELD'],
};

export const ParserTypeOptions = [
    { value: 'DIRECT', label: t('link.Type.data.DIRECT') },
    { value: 'DELIMITED', label: t('link.Type.data.DELIMITED') },
    { value: 'SCRIPT', label: t('link.Type.data.SCRIPT') },
    { value: 'FIXED_LENGTH', label: t('link.Type.data.FIXED_LENGTH') },
    { value: 'LENGTH_FIELD', label: t('link.Type.data.LENGTH_FIELD') },
];
export const LengthOptions = [
    { value: '1', label: '1' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: '4' },
    { value: '8', label: '8' },
];
export const LittleOptions = [
    { label: t('link.Type.data.bigPort'), value: 'false' },
    { label: t('link.Type.data.smallPort'), value: 'true' },
];

export const isVisible = (
    LastName: string,
    dependencies: string | boolean | undefined,
) => VisibleData[LastName].includes(dependencies);

export const Validator = {
    regIpv4: new RegExp(
        /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))\.){3}(([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
    ),
    regIPv6: new RegExp(/^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/),
    regDomain: new RegExp(
        // /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,
        /^[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/
    ),
    regOnlyNumber: new RegExp(/^\d+$/),
};

const validateAddress = (_rule: any, value: string): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const _domainStr = value
        const _domain = _domainStr.replace(/^(https?|ftp):\/\/(www\.)?/i, '')
        if (
            Validator.regIpv4.test(value) ||
            Validator.regIPv6.test(value) ||
            Validator.regDomain.test(_domain)
        ) {
            return resolve('');
        } else {
            return value ? reject(t('link.Type.data.addressTip')) : resolve('');
        }
    });
};

const sizeValidator = (_rule:any, value: number):Promise<any> =>{
    return new Promise(async(resolve,reject)=>{
        const posReg = /^[1-9]\d*$/;
        if(posReg.test(value.toString()) && value > 0 && value <=65535 ){
            return resolve('');
        }else {
            return reject(_rule.message);
        }
    })
} 
export const Rules = {
    name: [
        {
            required: true,
            message: t('link.Type.data.nameTip'),
        },
        {
            max: 64,
            message: t('link.Type.data.64max'),
        },
    ],
    type: [
        {
            required: true,
            message: t('link.Type.data.type'),
        },
    ],
    shareCluster: [
        {
            required: true,
            message: t('link.Type.data.cluster'),
        },
    ],
    serverId: [
        {
            required: true,
            message: t('link.Type.data.nodeName'),
        },
    ],
    host: [
        {
            required: true,
            message: t('link.Type.data.localAddress'),
        },
    ],
    port: [
        {
            required: true,
            message: t('link.Type.data.localPort'),
        },
    ],
    publicHost: [
        {
            required: true,
            message: t('link.Type.data.publicNetwork'),
        },
        {
            validator: validateAddress,
            message: t('link.Type.data.addressTip'),
        },
    ],
    publicPort: [
        {
            required: true,
            message: t('link.Type.data.publicPort'),
        },
        {
            pattern: Validator.regOnlyNumber,
            message: t('link.Type.data.inputTip'),
        },
    ],
    remoteHost: [
        {
            required: true,
            message: t('link.Type.data.longRange'),
        },
        {
            validator: validateAddress,
            message: t('link.Type.data.IPTip'),
        },
    ],
    remotePort: [
        {
            required: true,
            message: t('link.Type.data.longRangePort')
        },
        {
            pattern: Validator.regOnlyNumber,
            message: t('link.Type.data.inputTip'),
        },
    ],
    clientId: [
        {
            required: true,
            message: t('link.Type.data.clientId'),
        },
        {
            max: 64,
            message: t('link.Type.data.64max'),
        },
    ],
    username: [
        {
            required: true,
            message:  t('link.Type.data.userName'),
        },
        {
            max: 64,
            message: t('link.Type.data.64max'),
        },
    ],
    password: [
        {
            required: true,
            message: t('link.Type.data.pwd'),
        },
        {
            max: 64,
            message: t('link.Type.data.64max'),
        },
    ],
    topicPrefix: [
        {
            max: 64,
            message: t('link.Type.data.64max'),
        },
    ],
    maxMessageSize: [
        {
            required: true,
            message: t('link.Type.data.maxLength'),
        },
    ],
    secure: [
        {
            required: true,
        },
    ],
    certId: [
        {
            required: true,
            message: t('link.Type.data.certificate'),
        },
    ],
    privateKeyAlias: [
        {
            required: true,
            message: t('link.Type.data.privateKey'),
        },
        {
            max: 64,
            message: t('link.Type.data.64max'),
        },
    ],
    parserType: [
        {
            required: true,
            message:  t('link.Type.data.rule'),
        },
    ],
    delimited: [
        {
            required: true,
            message: t('link.Type.data.separator'),
        },
        {
            max: 64,
            message: t('link.Type.data.64max'),
        },
    ],
    lang: [
        {
            required: true,
            message: t('link.Type.data.scripitingLan'),
        },
        {
            max: 64,
            message: t('link.Type.data.64max'),
        },
    ],
    script: [
        {
            required: true,
            message: t('link.Type.data.inputScript'),
        },
    ],
    size: [
        {
            required: true,
            message:  t('link.Type.data.lengthValue'),
        },
        {
            validator:sizeValidator,
            message:'请输入0~65535之间的正整数',
            trigger:'change'
        }
    ],
    length: [
        {
            required: true,
            message: t('link.Type.data.selectLength'),
        },
    ],
    offset: [
        {
            pattern: Validator.regOnlyNumber,
            message: t('link.Type.data.inputTip2'),
        },
    ],
};
