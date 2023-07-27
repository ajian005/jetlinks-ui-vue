<template>
  <div class="json-param">
    <div class="list-item" v-for="(item, index) in _value" :key="`object_${index}`">
      <div class="item-left">
        <AIcon type="MenuOutlined" class="item-drag item-icon" />
        {{ `#${index + 1}.` }}
      </div>
      <div class="item-middle item-editable">
        <j-popover :visible="editIndex === index" placement="left" @visible-change="change" trigger="click">
          <template #title>
            <div class="edit-title" style="display: flex; justify-content: space-between; align-items: center;">
              <div style="width: 150px;">{{t('Metadata.MetricsParam.index.5rlcgeizw900')}}</div>
              <AIcon type="CloseOutlined" @click="handleClose" />
            </div>
          </template>
          <template #content>
            <div>
              <div class="ant-form-vertical">
                <j-form-item :label="t('Metadata.MetricsParam.index.5rlcgeizx680')" :name="name.concat([index, 'id'])" :rules="[
                  { required: true, message: t('Metadata.MetricsParam.index.5rlcgeizxcg0') },
                  { max: 64, message: t('Metadata.MetricsParam.index.5rlcgeizxh00') },
                  {
                    pattern: /^[a-zA-Z0-9_\-]+$/,
                    message: t('Metadata.MetricsParam.index.format'),
                  },
                ]">
                  <j-input v-model:value="_value[index].id" size="small" :placeholder="t('Metadata.MetricsParam.index.5rlcgeizxcg0')"></j-input>
                </j-form-item>
                <j-form-item :label="t('Metadata.MetricsParam.index.5rlcgeizxmc0')" :name="name.concat([index, 'name'])" :rules="[
                  { required: true, message: t('Metadata.MetricsParam.index.5rlcgeizxs00') },
                  { max: 64, message: t('Metadata.MetricsParam.index.5rlcgeizxh00') },
                ]">
                  <j-input v-model:value="_value[index].name" size="small" :placeholder="t('Metadata.MetricsParam.index.5rlcgeizxs00')"></j-input>
                </j-form-item>
                <j-form-item :label="t('Metadata.MetricsParam.index.5rlcgeizxyo0')" :name="name.concat([index, 'value'])" :rules="[
                  { required: true, validator: () => validateIndicator(_value[index]), message: t('Metadata.MetricsParam.index.5rlcgeizyeo0') }
                ]">
                  <JIndicators v-model:value="_value[index]" :type="type" size="small" :enum="enum" />
                </j-form-item>
              </div>
            </div>
          </template>
          <div class="item-edit" @click="handleEdit(index)">
            <Ellipsis>{{ item.name || t('Metadata.MetricsParam.index.5rlcgeizw900') }}</Ellipsis>
            <AIcon type="EditOutlined" class="item-icon" />
          </div>
        </j-popover>
      </div>
      <div class="item-right">
        <AIcon type="DeleteOutlined" @click="handleDelete(index)" />
      </div>
    </div>
    <j-button type="dashed" block @click="handleAdd">
      <template #icon>
        <AIcon type="PlusOutlined" class="item-icon" />
      </template>
      {{t('Metadata.MetricsParam.index.5rlcgeizyoc0')}}
    </j-button>
  </div>
</template>
<script setup lang="ts" name="MetricsParam">
import { PropType } from 'vue'
import JIndicators from '@/components/JIndicators/index.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
interface Emits {
  (e: 'update:value', data: Record<any, any>[]): void;
}
const emit = defineEmits<Emits>()
const props = defineProps({
  value: {
    type: Object as PropType<Record<any, any>[]>,
    default: () => ([])
  },
  type: {
    type: String,
    default: ''
  },
  enum: {
    type: Object,
    default: () => ({})
  },
  name: {
    type: Array as PropType<(string | number)[]>,
    default: () => ([])
  }
})

const _value = ref<Record<any, any>[]>([])
watchEffect(() => {
  _value.value = props.value
})

watch(_value,
  () => {
    emit('update:value', _value.value)
  },
  { deep: true })

const editIndex = ref<number>(-1)
const handleEdit = (index: number) => {
  editIndex.value = index
}
const handleDelete = (index: number) => {
  editIndex.value = -1
  _value.value.splice(index, 1)
}
const handleClose = () => {
  editIndex.value = -1
}
const handleAdd = () => {
  _value.value.push({})
  emit('update:value', _value.value)
}

const validateIndicator = (value: any) => {
  if (value?.range) {
    if (!value?.value || (!value?.value[0] && value?.value[0] !== 0) || (!value?.value[1] && value?.value[1] !== 0)) {
      return Promise.reject(new Error(this.t('Metadata.MetricsParam.index.5rlcgeizyeo0')));
    }
  } else {
    if (!value?.value && value?.value !== 0) {
      return Promise.reject(new Error(this.t('Metadata.MetricsParam.index.5rlcgeizyeo0')));
    }
  }
  return Promise.resolve();
}

const change = (visible: boolean) => {
  if (!visible) {
    editIndex.value = -1
  }
}
</script>
<style lang="less" scoped>
.json-param {
  .list-item {
    border: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    color: rgba(0, 0, 0, 0.85);
    padding: 3px 6px;
    margin-bottom: 10px;
    background-color: #fff;
    line-height: 26px;
    font-size: 14px;

    // .item-left {
    //   .item-drag {
    //     cursor: move;
    //   }
    // }
    .item-edit {
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 240px;
    }

    .item-icon {
      color: rgb(136, 136, 136);
      font-size: 12px;
    }
  }
}

:deep(.ant-form-item-label) {
  line-height: 1;

  >label {
    font-size: 12px;

    &.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
      font-size: 12px;
    }
  }
}

:deep(.ant-form-item-explain) {
  font-size: 12px;
}

:deep(.ant-form-item-with-help) {
  .ant-form-item-explain {
    min-height: 20px;
    line-height: 20px;
  }
}

:deep(.ant-form-item) {
  margin-bottom: 20px;

  &.ant-form-item-with-help {
    margin-bottom: 0;
  }

  input {
    font-size: 12px;
  }
}

:deep(.ant-input),
:deep(.ant-select) {
  font-size: 12px;
}

:deep(input) {
  height: 22px;
}
</style>