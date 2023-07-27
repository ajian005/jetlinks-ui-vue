<template>
  <j-form ref='invokeForm' :model='formModel' layout='vertical' :colon='false'>
    <j-row :gutter='24'>
      <j-col :span='10'>
        <j-form-item
          name='functionId'
          :rules="[{ required: true, message: t('Save.Device.InvokeFunction.5rg55550ts00') }]"
        >
          <j-select
            showSearch
            allowClear
            v-model:value='formModel.functionId'
            style='width: 100%'
            :placeholder="t('Save.Device.InvokeFunction.5rg55550ts00')"
            :options='functions'
            :filterOption='filterSelectNode'
            @select='onSelect'
          />
        </j-form-item>
      </j-col>
      <j-col :span='14'>
        <j-form-item>{{t('Save.Device.InvokeFunction.5rg55550v0w0')}}</j-form-item>
      </j-col>
      <j-col :span='24'>
        <j-form-item
          name='functionData'
          :rules="rules"
        >
        <FunctionCall
          v-model:value='formModel.functionData'
          :data='functionData'
          @change='callDataChange'
        />
        </j-form-item>
      </j-col>
    </j-row>
  </j-form>
</template>

<script setup lang='ts' name='InvokeFunction'>
import { filterSelectNode } from '@/utils/comm'
import { FunctionCall } from '../components'
import type { PropType } from 'vue'
import { defineExpose } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
type Emit = {
  (e: 'update:functionParameters', data: Array<Record<string, any>>): void
  (e: 'update:functionId', data: string): void
  (e: 'update:action', data: string): void
}

const props = defineProps({
  functionId: {
    type: String,
    default: undefined
  },
  functionParameters: {
    type: Array as PropType<Record<string, any>[]>,
    default: () => []
  },
  action: {
    type: String,
    default: ''
  },
  functions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits<Emit>()
const invokeForm = ref()
const formModel = reactive({
  functionId: props.functionId,
  functionData: props.functionParameters
})

const handlePropertiesOptions = (propertiesValueType: any) => {
  const _type = propertiesValueType?.type
  if (_type === 'boolean') {
    return [
      { label: propertiesValueType?.falseText || t('Save.Device.InvokeFunction.5rg55550vcc0'), value: propertiesValueType?.falseValue || false },
      { label: propertiesValueType?.trueText || t('Save.Device.InvokeFunction.5rg55550vj40'), value: propertiesValueType?.trueValue || true },
    ]
  } else if (_type === 'enum') {
    return propertiesValueType?.elements?.map((a: any) => ({ ...a, label: a.text }))
  }

  return propertiesValueType?.elements
}

/**
 * 获取当前选择功能属性
 */
const functionData = computed(() => {
  const functionItem: any = props.functions.find((f: any) => f.id === formModel.functionId)
  const arrCache = []

  if (functionItem) {
    const properties = functionItem.input?.properties || functionItem.inputs;
    for (const datum of properties) {
      arrCache.push({
        id: datum.id,
        name: datum.name,
        type: datum.valueType?.type || '-',
        format: datum.valueType?.format || undefined,
        options: handlePropertiesOptions(datum.valueType),
        value: undefined,
        required: datum.expands?.required
      });
    }
  }

  return arrCache
})

const rules = [{
  validator(_: string, value: any) {
    const arr = functionData.value.filter((i: any) => i?.required)
    if(arr.length){
      if (!value?.length) {
        return Promise.reject('请输入功能值')
      } else {
        let hasValue = value.find((item: { name: string, value: any}) => item.value === undefined)
        if (hasValue) {
          const functionItem = arr.find((item: any) => item.id === hasValue.name)
          return Promise.reject(functionItem?.name ? `请输入${functionItem?.name}值` : '请输入功能值')
        }
      }
    }
    return Promise.resolve();
  }
}]

const onSelect = (v: string, item: any) => {
  formModel.functionData = []
  emit('update:action', `${t('Save.Device.InvokeFunction.execute') + item.name}`)
  emit('update:functionId', v)
  emit('update:functionParameters', [])
}

const callDataChange = (v: any[]) => {
  emit('update:functionParameters', v)
}

defineExpose({
  validateFields: () => new Promise(async (resolve)  => {
    const data = await invokeForm.value?.validateFields()
    resolve(data)
  })
})

</script>

<style scoped>

</style>