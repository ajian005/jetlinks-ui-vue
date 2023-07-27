<!-- 绑定设备 -->
<template>
  <j-modal :maskClosable='false' width='1100px' :visible='true' :title="t('iot-card.CardManagement.BindDevice.5rgbfd1lxrk0')" :okText="t('iot-card.CardManagement.BindDevice.5rgbfd1lz8k0')" :cancelText="t('iot-card.CardManagement.BindDevice.5rgbfd1lzok0')" @ok='handleOk'
           @cancel='handleCancel' :confirmLoading='btnLoading'>
    <div style='margin-top: 10px'>
      <pro-search :columns='columns' target='iot-card-bind-device' @search='handleSearch' type='simple' />
      <j-pro-table
        ref='bindDeviceRef'
        :alertRender='false'
        :columns='columns'
        :request='queryUnbounded'
        model='TABLE'
        :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
        :rowSelection="{
          type: 'radio',
          selectedRowKeys: _selectedRowKeys,
          onSelect: onSelectChange,
      }"
        :params='params'
      >
        <template #registryTime='slotProps'>
          {{
            slotProps.registryTime
              ? moment(slotProps.registryTime).format(
                'YYYY-MM-DD HH:mm:ss'
              )
              : ''
          }}
        </template>
        <template #state='slotProps'>
          <j-badge :text='slotProps.state.text' :status='statusMap.get(slotProps.state.value)' />
        </template>
      </j-pro-table>
    </div>
  </j-modal>
</template>

<script setup lang='ts'>
import { queryUnbounded, bind } from '@/api/iot-card/cardManagement'
import moment from 'moment'
import { onlyMessage } from '@/utils/comm'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['change'])

const props = defineProps({
  cardId: {
    type: String
  }
})

const bindDeviceRef = ref<Record<string, any>>({})
const params = ref<Record<string, any>>({})
const _selectedRowKeys = ref<string[]>([])
const btnLoading = ref<boolean>(false)

const statusMap = new Map()
statusMap.set('online', 'processing')
statusMap.set('offline', 'error')
statusMap.set('notActive', 'warning')

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    ellipsis: true,
    fixed: 'left',
    search: {
      type: 'string'
    }
  },
  {
    title: t('iot-card.CardManagement.BindDevice.5rgbfd1lzwo0'),
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    search: {
      type: 'string'
    }
  },
  {
    title: t('iot-card.CardManagement.BindDevice.5rgbfd1m02w0'),
    dataIndex: 'registryTime',
    key: 'registryTime',
    scopedSlots: true,
    search: {
      type: 'date'
    }
    // sorter: true,
  },
  {
    title: t('iot-card.CardManagement.BindDevice.5rgbfd1m09g0'),
    dataIndex: 'state',
    key: 'state',
    scopedSlots: true,
    search: {
      type: 'select',
      options: [
        { label: t('iot-card.CardManagement.BindDevice.5rgbfd1m0fk0'), value: 'notActive' },
        { label: t('iot-card.CardManagement.BindDevice.5rgbfd1m0l00'), value: 'offline' },
        { label: t('iot-card.CardManagement.BindDevice.5rgbfd1m0rk0'), value: 'online' }
      ]
    }
    // filterMultiple: false,
  }
]

const handleSearch = (e: any) => {
  params.value = e
}

const onSelectChange = (record: any) => {
  _selectedRowKeys.value = [record.id]
}

const cancelSelect = () => {
  _selectedRowKeys.value = []
}

const handleOk = () => {
  btnLoading.value = true
  bind(props.cardId, _selectedRowKeys.value[0])
    .then((resp: any) => {
      if (resp.status === 200) {
        onlyMessage(t('iot-card.CardManagement.BindDevice.5rgbfd1m0x80'))
        emit('change', true)
      }
    })
    .finally(() => {
      btnLoading.value = false
    })
}

const handleCancel = () => {
  emit('change', false)
}
</script>

<style scoped lang='less'></style>
