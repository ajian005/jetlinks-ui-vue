<template>
  <j-button type="dashed" block @click="visible = true">
    <j-popover :visible="visible" placement="left">
      <template #title>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div style="width: 150px;">{{t('Metadata.ArrayParam.index.5rlcdyw67z80')}}</div>
          <div @click="visible = false">
            <AIcon type="CloseOutlined" />
          </div>
        </div>
      </template>
      <template #content>
        <div style="max-width: 400px;">
          <div class="ant-form-vertical">
            <value-type-form v-model:value="_value" :name="name" isSub key="sub"></value-type-form>
            <j-form-item :label="t('Metadata.ArrayParam.index.5rlcdyw692c0')" :name="name.concat(['description'])" :rules="[
              { max: 200, message: t('Metadata.ArrayParam.index.5rlcdyw699c0') },
            ]">
              <j-textarea v-model:value="_value.description" size="small" :placeholder="t('Metadata.ArrayParam.index.5rlcdyw69fs0')"></j-textarea>
            </j-form-item>
          </div>
        </div>
      </template>
      {{t('Metadata.ArrayParam.index.5rlcdyw67z80')}}
      <AIcon type="EditOutlined" class="item-icon" />
    </j-popover>
  </j-button>
</template>
<script setup lang="ts" name="ArrayParam">
import ValueTypeForm from '@/views/device/components/Metadata/Base/Edit/ValueTypeForm.vue';
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
type ValueType = Record<any, any>;

const props = defineProps({
  value: {
    type: Object as PropType<ValueType>,
    default: () => ({ expands: {} })
  },
  name: {
    type: Array as PropType<(string | number)[]>,
    required: true
  }
})
interface Emits {
  (e: 'update:value', data: ValueType): void;
}
const emit = defineEmits<Emits>()

const _value = computed({
  get: () => props.value,
  set: val => {
    emit('update:value', val)
  }
})

const visible = ref(false)

onMounted(() => {
  emit('update:value', { expands: {}, ...props.value })
})
</script>
<style lang="less" scoped>
.item-icon {
  color: rgb(136, 136, 136);
  font-size: 12px;
}
</style>