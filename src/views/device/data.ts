import { isNoCommunity } from '@/utils/utils';
import createI18n from "@/locales/index"
const t = createI18n.global.t
export const DataTypeList: { label: string; value: string }[] = [
  {
    value: 'int',
    label: 'int(整数型)',
  },
  {
    value: 'long',
    label: 'long(长整数型)',
  },
  {
    value: 'float',
    label: 'float(单精度浮点型)',
  },
  {
    value: 'double',
    label: 'double(双精度浮点数)',
  },
  {
    value: 'string',
    label: 'text(字符串)',
  },
  {
    value: 'boolean',
    label: 'boolean(布尔型)',
  },
  {
    value: 'date',
    label: 'date(时间型)',
  },
  {
    value: 'enum',
    label: 'enum(枚举)',
  },
  {
    value: 'array',
    label: 'array(数组)',
  },
  {
    value: 'object',
    label: 'object(结构体)',
  },
  {
    value: 'file',
    label: 'file(文件)',
  },
  {
    value: 'password',
    label: 'password(密码)',
  },
  {
    value: 'geoPoint',
    label: 'geoPoint(地理位置)',
  },
];

export const PropertySource: { label: string; value: string }[] = isNoCommunity
  ? [
      {
        value: 'device',
        label: t('views.device.data.device'),
      },
      {
        value: 'manual',
        label: t('views.device.data.manual'),
      },
      {
        value: 'rule',
        label: t('views.device.data.rule'),
      },
    ]
  : [
      {
        value: 'device',
        label: t('views.device.data.device'),
      },
      {
        value: 'manual',
        label: t('views.device.data.manual'),
      },
    ];

export const FileTypeList: { label: string; value: string }[] = [
  {
    label: 'URL(链接)',
    value: 'url',
  },
  {
    label: 'Base64(Base64编码)',
    value: 'base64',
  },
  {
    label: 'binary',
    value: 'Binary(二进制)',
  },
];

export const EventLevel: { label: string; value: string }[] = [
  {
    label: t('views.device.data.ordinary'),
    value: 'ordinary',
  },
  {
    label: t('views.device.data.warn'),
    value: 'warn',
  },
  {
    value: 'urgent',
    label: t('views.device.data.urgent'),
  },
];

export const DateTypeList = [
  // {
  //   label: 'String类型的UTC时间戳 (毫秒)',
  //   value: 'string',
  // },
  {
    label: 'yyyy-MM-dd',
    value: 'yyyy-MM-dd',
  },
  {
    label: 'yyyy-MM-DD HH:mm:ss',
    value: 'yyyy-MM-DD HH:mm:ss',
  },
  // {
  //   label: 'yyyy-MM-dd HH:mm:ss EE',
  //   value: 'yyyy-MM-dd HH:mm:ss EE',
  // },
  // {
  //   label: 'yyyy-MM-dd HH:mm:ss zzz',
  //   value: 'yyyy-MM-dd HH:mm:ss zzz',
  // },
];

export const ExpandsTypeList = [
  {
    label: t('views.device.data.read'),
    value: 'read',
  },
  {
    label: t('views.device.data.write'),
    value: 'write',
  },
  {
    label: t('views.device.data.report'),
    value: 'report',
  },
]