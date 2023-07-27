<template>
  <j-modal
    :maskClosable="false"
    :visible="visible"
    width="800px"
    :title="t('Instance.Import.modal.5rcya2g622g0')"
    @cancel='cancel'
  >
    <div>
      <!--   选择产品   -->
      <div v-if='steps === 0'>
        <Product
          v-model:rowKey='importData.productId'
          @change='productChange'
        />
      </div>
      <div v-else-if='steps === 1'>
        <j-form :layout="'vertical'">
          <j-form-item required :label="t('Instance.Import.modal.5rcya2g63c00')">
            <j-card-select
              :value="[importData.type]"
              :column='typeOptions.length'
              :options="typeOptions"
              @change='typeChange'
            >
              <template #image='{image}'>
                <img :src='image' />
              </template>
            </j-card-select>
          </j-form-item>
        </j-form>
      </div>
      <div v-else>
        <File v-if='importData.type ==="file"' :product='importData.productId' />
        <Plugin v-else :accessId='productDetail.accessId' @change='pluginChange'/>
      </div>
    </div>
    <template #footer>
      <j-button v-if='steps === 0' @click='cancel' >{{t('Instance.Import.modal.5rcya2g63m80')}}</j-button>
      <j-button v-if='steps !== 0' @click='prev' >{{t('Instance.Import.modal.5rcya2g64340')}}</j-button>
      <j-button v-if='steps !== 2' @click='next' type='primary'>{{t('Instance.Import.modal.5rcya2g64gk0')}}</j-button>
      <j-button v-if='steps === 2' @click='save' type='primary'>{{t('Instance.Import.modal.5rcya2g64n80')}}</j-button>
    </template>
  </j-modal>
  <j-modal
    :maskClosable="false"
    :visible="importVisible"
    width="400px"
    :title="t('Instance.Import.modal.5rcya2g64sw0')"
    @cancel='importCancel'
    @ok='importCancel'
  >
    <a-icon type='CheckOutlined' style='color: #2F54EB;' /> {{t('Instance.Import.modal.5rcya2g650w0')}} {{t('Instance.Import.modal.5rcya2g65800')}} <span style='color: #2F54EB;'>{{count}}</span>
  </j-modal>
</template>

<script lang='ts' setup name='DeviceImport'>
import Product from './product.vue'
import { getImage, onlyMessage } from '@/utils/comm'
import File from './file.vue'
import Plugin from './plugin.vue'
import { importDeviceByPlugin } from '@/api/device/instance'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['cancel', 'save']);

const steps = ref(0) // 步骤

const importData = reactive<{productId?: string, type?: string}>({
  productId: undefined,
  type: undefined,
})

const productDetail = ref()
const deviceList = ref<any[]>([])
const visible = ref(true)
const importVisible = ref(false)
const count = ref(0)

const typeOptions = computed(() => {
  const array = [
    {
      value: 'file',
      label: t('Instance.Import.modal.5rcya2g65gg0'),
      subLabel: t('Instance.Import.modal.5rcya2g65ng0'),
      iconUrl: getImage('/device/import1.png'),
    },
  ]
  if (productDetail.value?.accessProvider === 'plugin_gateway') {
    array.push({
      value: 'plugin',
        label: t('Instance.Import.modal.5rcya2g65u40'),
      subLabel: t('Instance.Import.modal.5rcya2g66080'),
      iconUrl: getImage('/device/import2.png'),
    })
  }
  return array
})

const typeChange = (types: string[]) => {
  importData.type = types[0]
}

const productChange = (detail: any) => {
  productDetail.value = detail
}

const next = () => {
  if (steps.value === 0) {
    if (!importData.productId) {
      return onlyMessage(t('Instance.Import.modal.5rcya2g66dk0'), 'error')
    }
    if (productDetail.value?.accessProvider !== 'plugin_gateway') {
      importData.type = 'file'
      importData.productId = productDetail.value?.id
      steps.value = 2
      return
    }
  }
  if (steps.value === 1 && !importData.type) {
    return onlyMessage(t('Instance.Import.modal.5rcya2g66ss0'), 'error')
  }
  steps.value += 1
}

const prev = () => {
  if (productDetail.value?.accessProvider !== 'plugin_gateway') {
    steps.value = 0
  } else {
    steps.value -= 1
  }
}

const cancel = () => {
  emit('cancel')
}

const pluginChange = (options: any[]) => {
  deviceList.value = options
}

const save = () => {
  if (importData.type === 'file') {
    cancel()
    emit('save')
  } else {
    if (deviceList.value.length) {
      importDeviceByPlugin(importData.productId!, deviceList.value).then(res => {
        if (res.success) {
          onlyMessage(t('Instance.Import.modal.5rcya2g67040'))
          // cancel()
          visible.value = false
          importVisible.value = true
          count.value = res.result?.[0]?.result?.updated
        }
      })
    } else {
      onlyMessage(t('Instance.Import.modal.5rcya2g67og0'), 'error')
    }
  }
}

const importCancel = () => {
  importVisible.value = false
  emit('save')
}
</script>

<style scoped>

</style>