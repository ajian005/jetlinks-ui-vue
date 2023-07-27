import createI18n from '@/locales/index';
const { t }  = createI18n.global
const MaxLengthStringFn = (len: number = 64) => ({
  max: len,
  message:t('components.Form.rules.Maximum',{length:len}),
})

export const Max_Length_64 = [MaxLengthStringFn()]
export const Max_Length_200 = [MaxLengthStringFn(200)]

export const RequiredStringFn = (name: string, type: string = 'input') => {
  let typeName = t('components.Form.rules.input')
  if (['select', 'date'].includes(type)) {
    typeName = t('components.Form.rules.select')
  }
  return {
    required: true,
    message: t('components.Form.rules.please',{typeName:typeName,name:name}),
  }
}

export const ID_Rule = [
  {
    pattern: /^[a-zA-Z0-9_\-]+$/,
    message:  t('components.Form.rules.IDRule'),
  },
  Max_Length_64[0]
]

export const CreteRuleByType = (type: string) => {
  switch (type){
      case 'int':
        return [
          {
            validator: (_: any, value: number) => {
              const baseNumber = 2147483648
              if (value < -baseNumber) {
                return Promise.reject(t('components.Form.rules.minRule',{baseNumber:baseNumber}));
              }
              if (value > baseNumber) {
                return Promise.reject(t('components.Form.rules.maxRule',{baseNumber:baseNumber}));
              }
              return Promise.resolve();
            }
          }
        ]
      case'long':
        return [
          {
            validator: (_: any, value: number) => {
              const baseNumber = 340282346638528860000000000000000000000
              if (value < -baseNumber) {
                return Promise.reject(t('components.Form.rules.minRule',{baseNumber:baseNumber}));
              }
              if (value > baseNumber) {
                return Promise.reject(t('components.Form.rules.maxRule',{baseNumber:baseNumber}));
              }
              return Promise.resolve();
            }
          }
        ]
      case'float':
        return [
          {
            validator: (_: any, value: number) => {
              const baseNumber = 9223372036854775807
              if (value < -baseNumber) {
                return Promise.reject(t('components.Form.rules.minRule',{baseNumber:baseNumber}));
              }
              if (value > baseNumber) {
                return Promise.reject(t('components.Form.rules.maxRule',{baseNumber:baseNumber}));
              }
              return Promise.resolve();
            }
          }
        ]
      // case'double':
      //   return [
      //     {
      //       max: 1.7976931348623157,
      //       message: '最大可输入64位字符'
      //     }
      //   ]
      case 'string':
        return [MaxLengthStringFn()];
      case 'description':
        return [MaxLengthStringFn(200)]
    default:
      return []
  }
}