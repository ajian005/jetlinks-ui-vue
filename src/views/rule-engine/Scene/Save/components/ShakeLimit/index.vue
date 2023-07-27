<template>
    <div class="shakeLimit">
        <j-switch
            :checkedChildren="t('components.ShakeLimit.index.5rg4xv2rnkc0')"
            :unCheckedChildren="t('components.ShakeLimit.index.5rg4xv2rojw0')"
            v-model:checked="shakeLimit.enabled"
            style="margin-right: 12px"
        />
        <template v-if="shakeLimit.enabled">
            <j-input-number :min="1" :max="100" :precision="0" size="small" v-model:value="shakeLimit.time" style="width: 38px" />
            <span>{{t('components.ShakeLimit.index.5rg4xv2ropc0')}}</span>
            <j-input-number :min="1" :max="100" :precision="0" size="small" v-model:value="shakeLimit.threshold" style="width: 38px" />
            <span>{{t('components.ShakeLimit.index.5rg4xv2rotk0')}}</span>
            <j-radio-group :options="alarmFirstOptions" optionType="button" v-model:value="shakeLimit.alarmFirst" size="small" />
        </template>
    </div>
</template>

<script lang="ts" setup>
import { cloneDeep } from "lodash-es";
import { PropType } from "vue";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
type ShakeLimitType = {
    enabled: boolean | undefined,
    time?: number | undefined | null,
    threshold?: number | undefined | null,
    alarmFirst?: boolean | undefined
}

type Emit = {
  (e: 'update:value', data: ShakeLimitType): void
}

const alarmFirstOptions = [
  { label: t('components.ShakeLimit.index.5rg4xv2roxw0'), value: true },
  { label: t('components.ShakeLimit.index.5rg4xv2rp1w0'), value: false },
];

const props = defineProps({
  value: {
    type: Object as PropType<ShakeLimitType>,
    default: () => ({})
  }
})

const emit = defineEmits<Emit>()

const shakeLimit = reactive<ShakeLimitType>({
    enabled: undefined,
    time: 1,
    threshold: 1,
    alarmFirst: undefined
})

Object.assign(shakeLimit, props.value)

watch(() => shakeLimit, () => {
    emit('update:value', {...shakeLimit})
}, {
    deep: true
})

</script>

<style lang="less" scoped>
.shakeLimit {
  display: flex;
  gap: 4px;
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  :deep(.ant-input-number-handler-wrap) {
    display: none;
  }

  :deep(.ant-radio-button-wrapper) {
    padding: 0 16px;
  }

  input {
    padding: 0 4px;
  }
}
</style>