//引导页数据
import createI18n from "@/locales/index"
const t = createI18n.global.t
export const steps = [
  {
    element: '.objectModel',
    popover: {
      className: 'driver',
      title: `<div id='title'>${t('Detail.DeviceAccess.util.allocation')}</div><div id='guide'>1/3</div>`,
      description: t('Detail.DeviceAccess.util.allocationDes'),
      position: 'bottom',
    },
  },
  {
    element: '.ant-switch',
    popover: {
      className: 'driver',
      title: `<div id='title'>${t('Detail.DeviceAccess.util.enable')}</div><div id='guide'>2/3</div>`,
      description: t('Detail.DeviceAccess.util.enableDes'),
      position: 'bottom',
    },
  },
  {
    element: '.ant-descriptions-item-label',
    popover: {
      className: 'driver',
      title: `<div id='title'>${t('Detail.DeviceAccess.util.append')}</div><div id='guide'>3/3</div>`,
      description: t('Detail.DeviceAccess.util.appendDes'),
      position: 'bottom',
    },
  },
];

export const steps1 = [
  {
    element: '.config',
    popover: {
      className: 'driver',
      title: `<div id='title'>${t('Detail.DeviceAccess.util.fillOut')}</div><div id='guide'>1/4</div>`,
      description: t('Detail.DeviceAccess.util.fillOutDes'),
      position: 'right',
    },
  },
  {
    element: '.objectModel',
    popover: {
      className: 'driver',
      title: `<div id='title'>${t('Detail.DeviceAccess.util.allocation')}</div><div id='guide'>2/4</div>`,
      description: t('Detail.DeviceAccess.util.allocationDes'),
      position: 'bottom',
    },
  },
  {
    element: '.ant-switch',
    popover: {
      className: 'driver',
      title: `<div id='title'>${t('Detail.DeviceAccess.util.enable')}</div><div id='guide'>3/4</div>`,
      description: t('Detail.DeviceAccess.util.enableDes'),
      position: 'bottom',
    },
  },
  {
    element: '.ant-descriptions-item-label',
    popover: {
      className: 'driver',
      title: `<div id='title'>${t('Detail.DeviceAccess.util.append')}</div><div id='guide'>4/4</div>`,
      description: t('Detail.DeviceAccess.util.appendDes'),
      position: 'bottom',
    },
  },
];