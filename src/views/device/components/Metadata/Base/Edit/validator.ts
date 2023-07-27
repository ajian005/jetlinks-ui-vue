import { Rule } from "ant-design-vue/es/form";
import createI18n from "@/locales/index"
const t = createI18n.global.t
export const validateEnum = async (_rule: Rule, val: Record<any, any>[]) => {
  if (val.length === 0) return Promise.reject(new Error(t('Base.Edit.validator.enumeration')));
  const flag = val.every((item) => {
    return item.value && item.text;
  });
  if (!flag) {
    return Promise.reject(new Error(t('Base.Edit.validator.enumeration')));
  }
  return Promise.resolve();
}

export const validateArray = async (_rule: Rule, val: Record<any, any>) => {
  if (!val) return Promise.reject(new Error(t('Base.Edit.validator.element')));
  await validateValueType(_rule, val)
  return Promise.resolve();
}

export const validateJson = async (_rule: Rule, val: Record<any, any>[], title = t('Base.Edit.validator.argument'), required = true) => {
  if (required && (!val || val.length === 0)) {
    return Promise.reject(new Error(`${t('Base.Edit.validator.input') + title}`));
  }
  for (let item of val) {
    if (!item) return Promise.reject(new Error(`${t('Base.Edit.validator.input') + title}`));
    await validateIdName(_rule, item)
    await validateValueType(_rule, item.valueType)
  }
  return Promise.resolve();
}

export const validateIdName = async (_rule: Rule, val: Record<any, any>) => {
  if (!val.id) {
    return Promise.reject(new Error(t('Base.Edit.validator.identification')))
  }
  if (!val.name) {
    return Promise.reject(new Error(t('Base.Edit.validator.name')))
  }
}

export const validateValueType = async (_rule: Rule, val: Record<any, any>, title = t('Base.Edit.validator.dataType')) => {
  if (!val) return Promise.reject(new Error(t('Base.Edit.validator.element')));
  if (!val?.type) {
    return Promise.reject(new Error(`${t('Base.Edit.validator.select') + title}`))
  }
  if (['enum'].includes(val.type)) {
    await validateEnum(_rule, val.elements)
  }
  if (['array'].includes(val.type)) {
    await validateArray(_rule, val.elementType)
  }
  if (['object'].includes(val.type)) {
    await validateJson(_rule, val.properties)
  }
  if (['file'].includes(val.type) && !val.fileType) {
    return Promise.reject(new Error(t('Base.Edit.validator.fileType')))
  }
  return Promise.resolve();
}