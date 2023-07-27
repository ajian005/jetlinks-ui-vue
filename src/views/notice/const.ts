import { getImage } from '@/utils/comm';
import createI18n from "@/locales/index"
const t = createI18n.global.t
interface INoticeMethod {
    label: string;
    value: string;
}

// 通知方式
export const NOTICE_METHOD: INoticeMethod[] = [
    {
        label: t('views.notice.const.dingding'),
        value: 'dingTalk',
    },
    {
        label:  t('views.notice.const.weixin'),
        value: 'weixin',
    },
    {
        label: t('views.notice.const.email'),
        value: 'email',
    },
    {
        label:  t('views.notice.const.voice'),
        value: 'voice',
    },
    {
        label:  t('views.notice.const.sms'),
        value: 'sms',
    },
    {
        label: 'webhook',
        value: 'webhook',
    },
];

// 类型
export const MSG_TYPE = {
    dingTalk: [
        {
            label: t('views.notice.const.dingTalkMessage'),
            value: 'dingTalkMessage',
            logo: getImage('/notice/dingtalk.png'),
        },
        {
            label: t('views.notice.const.dingTalkRobotWebHook'),
            value: 'dingTalkRobotWebHook',
            logo: getImage('/notice/dingTalk-rebot.png'),
        },
    ],
    weixin: [
        {
            label: t('views.notice.const.corpMessage'),
            value: 'corpMessage',
            logo: getImage('/notice/weixin-corp.png'),
        },
        // {
        //   label: '服务号消息',
        //   value: 'officialMessage'
        //   logo: getImage('/notice/weixin-official.png'),
        // }
    ],
    voice: [
        {
            label: t('views.notice.const.aliyun'),
            value: 'aliyun',
            logo: getImage('/notice/voice.png'),
        },
    ],
    sms: [
        {
            label: t('views.notice.const.aliyunSms'),
            value: 'aliyunSms',
            logo: getImage('/notice/sms.png'),
        },
    ],
    webhook: [
        {
            label: 'webhook',
            value: 'http',
            logo: getImage('/notice/webhook.png'),
        },
    ],
    email: [
        {
            label: t('views.notice.const.email'),
            value: 'embedded',
            logo: getImage('/notice/email.png'),
        },
    ],
}

// 字段关系映射
// 配置
export const CONFIG_FIELD_MAP = {
    dingTalk: {
        dingTalkMessage: {
            appKey: undefined,
            appSecret: undefined,
        },
        dingTalkRobotWebHook: {
            url: undefined,
        }
    },
    weixin: {
        corpMessage: {
            corpId: undefined,
            corpSecret: undefined,
        },
        // officialMessage: {},
    },
    email: {
        embedded: {
            host: undefined,
            port: 25,
            ssl: false,
            sender: undefined,
            username: undefined,
            password: undefined,
        }
    },
    voice: {
        aliyun: {
            regionId: undefined,
            accessKeyId: undefined,
            secret: undefined,
        }
    },
    sms: {
        aliyunSms: {
            regionId: undefined,
            accessKeyId: undefined,
            secret: undefined,
        }
    },
    webhook: {
        http: {
            url: undefined,
            headers: [],
        }
    },

};

// 模板
export const TEMPLATE_FIELD_MAP = {
    dingTalk: {
        dingTalkMessage: {
            agentId: undefined,
            message: undefined,
            departmentIdList: undefined,
            userIdList: undefined
        },
        dingTalkRobotWebHook: {
            message: undefined,
            messageType: 'markdown',
            markdown: {
                text: undefined,
                title: undefined,
            },
            link: {
                title: undefined,
                picUrl: undefined,
                messageUrl: undefined,
                text: undefined,
            },
        }
    },
    weixin: {
        corpMessage: {
            agentId: undefined,
            message: undefined,
            toParty: undefined,
            toUser: undefined,
            toTag: undefined,
        },
        officialMessage: {},
    },
    email: {
        embedded: {
            subject: undefined,
            sendTo: [],
            attachments: [],
            message: undefined,
            text: undefined,
        }
    },
    voice: {
        aliyun: {
            templateType: 'tts',
            templateCode: undefined,
            ttsCode: undefined,
            // message: undefined,
            ttsmessage: undefined,
            playTimes: 1,
            calledShowNumbers: undefined,
            calledNumber: undefined,
        }
    },
    sms: {
        aliyunSms: {
            code: undefined,
            message: undefined,
            phoneNumber: undefined,
            signName: undefined,
        }
    },
    webhook: {
        http: {
            contextAsBody: true,
            body: undefined
        }
    },
};

// 钉钉机器人-消息类型
export const ROBOT_MSG_TYPE = [
    { label: 'markdown', value: 'markdown' },
    { label: 'text', value: 'text' },
    { label: 'link', value: 'link' },
]
// 语音通知类型
export const VOICE_TYPE = [
    { label: t('views.notice.const.notification'), value: 'voice' },
    { label: t('views.notice.const.tts'), value: 'tts' },
]