import { getImage } from '@/utils/comm'
import createI18n from '@/locales/index';
const { t }  = createI18n.global
export const TypeName = {
  online: t('Save.Device.util.online'),
  offline: t('Save.Device.util.offline'),
  reportEvent: t('Save.Device.util.reportEvent'),
  reportProperty: t('Save.Device.util.reportProperty'),
  readProperty:  t('Save.Device.util.readProperty'),
  writeProperty: t('Save.Device.util.writeProperty'),
  invokeFunction: t('Save.Device.util.invokeFunction'),
};

export const TypeEnum = {
  reportProperty: {
    label: t('Save.Device.util.reportProperty'),
    value: 'reportProperty',
    img: getImage('/scene/reportProperty.png'),
  },
  reportEvent: {
    label: t('Save.Device.util.reportEvent'),
    value: 'reportEvent',
    img: getImage('/scene/reportProperty.png'),
  },
  readProperty: {
    label: t('Save.Device.util.read'),
    value: 'readProperty',
    img: getImage('/scene/readProperty.png'),
  },
  writeProperty: {
    label: t('Save.Device.util.edit'),
    value: 'writeProperty',
    img: getImage('/scene/writeProperty.png'),
  },
  invokeFunction: {
    label: t('Save.Device.util.invokeFunction'),
    value: 'invokeFunction',
    img: getImage('/scene/invokeFunction.png'),
  },
};

export const getExpandedRowById = (id: string, data: any[]): string[] => {
  const expandedKeys:string[] = []
  const dataMap = new Map()

  const flatMapData = (flatData: any[]) => {
    flatData.forEach(item => {
      dataMap.set(item.id, { pid: item.parentId })
      if (item.children && item.children.length) {
        flatMapData(item.children)
      }
    })
  }

  const getExp = (_id: string) => {
    const item = dataMap.get(_id)
    if (item) {
      expandedKeys.push(_id)
      if (dataMap.has(dataMap)) {
        getExp(item.pid)
      }
    }
  }

  flatMapData(data)

  getExp(id)

  return expandedKeys
}