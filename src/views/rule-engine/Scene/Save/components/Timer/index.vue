<template>
  <j-form
    ref='timerForm'
    :model='formModel'
    layout='vertical'
    :colon='false'
  >
    <j-form-item name='trigger'>
      <j-radio-group
        v-model:value='formModel.trigger'
        :options="[
          { label: t('components.Timer.index.5rg4zm6w1mk0'), value: 'week' },
          { label: t('components.Timer.index.5rg4zm6w2pk0'), value: 'month' },
          { label: t('components.Timer.index.expression'), value: 'cron' },
        ]"
        option-type='button'
        button-style='solid'
        @change='triggerChange'
      />
    </j-form-item>
    <j-form-item v-if='showCron' name='cron' :rules="cronRules">
      <j-input :placeholder="t('components.Timer.index.expression')" v-model:value='formModel.cron' @change='updateValue' />
    </j-form-item>
    <template v-else>
      <j-form-item name='when'>
        <WhenOption v-model:value='formModel.when' :type='formModel.trigger' @change='updateValue' />
      </j-form-item>
      <j-form-item name='mod'>
        <j-radio-group
          v-model:value='formModel.mod'
          :options="[
          { label: t('components.Timer.index.5rg4zm6w2vk0'), value: 'period' },
          { label: t('components.Timer.index.5rg4zm6w2zw0'), value: 'once' },
        ]"
          option-type='button'
          button-style='solid'
          @change='updateValue'
        />
      </j-form-item>
    </template>
    <j-space v-if='showOnce' style='display: flex;gap: 24px'>
      <j-form-item :name="['once', 'time']">
        <j-time-picker
          valueFormat='HH:mm:ss'
          v-model:value='formModel.once.time'
          style='width: 100%'
          format='HH:mm:ss'
          @change='updateValue'
        />
      </j-form-item>
      <j-form-item> {{t('components.Timer.index.5rg4zm6w2zw0')}}</j-form-item>
    </j-space>
    <j-space v-if='showPeriod' style='display: flex;gap: 24px'>
      <j-form-item>
        <j-time-range-picker
          valueFormat='HH:mm:ss'
          :value='[
            formModel.period.from,
            formModel.period.to,
           ]'
          @change='(v) => {
                  formModel.period.from = v[0]
                  formModel.period.to = v[1]
                  updateValue()
              }'
        />
      </j-form-item>
      <j-form-item>{{t('components.Timer.index.5rg4zm6w33s0')}}</j-form-item>
      <j-form-item
        :name='["period", "every"]'
        :rules="[{ required: true, message: t('components.Timer.index.5rg4zm6w38g0') }]"
      >
        <j-input-number
          :placeholder="t('components.Timer.index.5rg4zm6w38g0')"
          style='max-width: 170px'
          :precision='0'
          :min='1'
          :max='unitMax'
          v-model:value='formModel.period.every'
          @change='updateValue'
        >
          <template #addonAfter>
            <j-select
              v-model:value='formModel.period.unit'
              :options="[
                { label: t('components.Timer.index.5rg4zm6w3c80'), value: 'seconds' },
                { label: t('components.Timer.index.5rg4zm6w3fw0'), value: 'minutes' },
                { label: t('components.Timer.index.5rg4zm6w3jo0'), value: 'hours' },
              ]"
              @select='periodUnitChange'
            />
          </template>
        </j-input-number>
      </j-form-item>
      <j-form-item>{{t('components.Timer.index.5rg4zm6w2zw0')}}</j-form-item>
    </j-space>
  </j-form>
</template>

<script setup lang='ts' name='Timer'>
import type { PropType } from 'vue'
import dayjs from 'dayjs'
import WhenOption from './WhenOption.vue'
import {cloneDeep, pick} from 'lodash-es'
import type { OperationTimer } from '../../../typings'
import { isCron } from '@/utils/regular'
import { defineExpose } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
type NameType = string[] | string

type Emit = {
  (e: 'update:value', data: Partial<OperationTimer>): void
}

const props = defineProps({
  name: {
    type: [String, Array] as PropType<NameType>,
    default: ''
  },
  value: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits<Emit>()
const unitMax = ref<number>(99)

const cronRules = [
  { max: 64, message: t('components.Timer.index.5rg4zm6w3ow0') },
  {
    validator: async (_: any, v: string) => {
      if (v) {
        if (!isCron(v)) {
          return Promise.reject(new Error(t('components.Timer.index.5rg4zm6w3sc0')));
        }
      } else {
        return Promise.reject(new Error(t('components.Timer.index.5rg4zm6w3wk0')));
      }
      return Promise.resolve();
    }
  }
]

const formModel = reactive<OperationTimer>({
  trigger: 'week',
  when: props.value.when || [],
  mod: 'period',
  cron: undefined,
  once: {
    time: dayjs(new Date()).format('HH:mm:ss')
  },
  period: {
    from: dayjs(new Date()).startOf('day').format('HH:mm:ss'),
    to: dayjs(new Date()).endOf('day').format('HH:mm:ss'),
    every: 1,
    unit: 'seconds'
  }
})
const timerForm = ref()

const showCron = computed(() => {
  return formModel.trigger === 'cron'
})

const showOnce = computed(() => {
  return formModel.trigger !== 'cron' && formModel.mod === 'once'
})

const showPeriod = computed(() => {
  return formModel.trigger !== 'cron' && formModel.mod === 'period'
})

const updateValue = () => {

  const cloneValue = cloneDeep(formModel)
  let keys: string[] = ['trigger']
  if (cloneValue.trigger === 'cron') {
    keys.push('cron')
  } else {
    keys = keys.concat(['mod', 'when'])

    if (cloneValue.mod === 'period') {
      keys.push('period')
    } else {
      keys.push('once')
    }
  }

  emit('update:value', pick(cloneValue, keys))
}

const triggerChange = () => {
  formModel.when = []
  formModel.cron = undefined
  updateValue()
}

/**
 * 频率单位切换
 * @param v
 */
const periodUnitChange = (v: any) => {
  if(v === 'hours') {
    unitMax.value = 99999
  } else {
    unitMax.value = 99
  }
  formModel.period!.every = 1
  updateValue()
}

defineExpose({
  validateFields: () => new Promise(async (resolve)  => {
    const data = await timerForm.value?.validateFields()
    resolve(data)
  })
})

Object.assign(formModel, props.value)
formModel.when = props.value.when || []

watchEffect(() => {
  if(props.value?.period?.unit === 'hours') {
    unitMax.
      value = 99999
  } else {
    unitMax.value = 99
  }
})


</script>

<style scoped lang='less'>

</style>