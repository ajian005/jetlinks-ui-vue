<template>
  <j-advanced-search
    :columns="columns"
    type='simple'
    @search="handleSearch"
    class="scene-search"
    target="scene-triggrt-device-device"
  />
  <j-divider style='margin: 0' />
  <j-pro-table
    ref='actionRef'
    model='CARD'
    :columns='columns'
    :params='params'
    :request='productQuery'
    :gridColumn='2'
    :gridColumns='[2,2,2]'
    :bodyStyle='{
      paddingRight: 0,
      paddingLeft: 0
    }'
  >
    <template #card="slotProps">
      <CardBox
        :value='slotProps'
        :active="rowKey === slotProps.id"
        :status="slotProps.state"
        :statusText="slotProps.state === 1 ? t('Save.Device.Product.5rg55mrnvqg0') : t('Save.Device.Product.5rg55mrnx6c0')"
        :statusNames="{ 1: 'processing', 0: 'error',  }"
        @click="handleClick"
      >
        <template #img>
          <slot name="img">
            <img width='80' height='80' :src="slotProps.photoUrl || getImage('/device-product.png')" />
          </slot>
        </template>
        <template #content>
          <div style='width: calc(100% - 100px)'>
            <Ellipsis>
              <span style="font-size: 16px;font-weight: 600" >
                {{ slotProps.name }}
              </span>
            </Ellipsis>
          </div>
          <j-row>
            <j-col :span="12">
              <div class="card-item-content-text">
                {{t('Save.Device.Product.5rg55mrnxf00')}}
              </div>
              <div>{{t('Save.Device.Product.5rg55mrnxjg0')}}</div>
            </j-col>
          </j-row>
        </template>
      </CardBox>
    </template>
  </j-pro-table>
</template>

<script setup lang='ts' name='Product'>
import { getProviders, queryGatewayList, queryProductList } from '@/api/device/product'
import { queryTree } from '@/api/device/category'
import { getTreeData_api } from '@/api/system/department'
import { isNoCommunity } from '@/utils/utils'
import { getImage } from '@/utils/comm'
import { accessConfigTypeFilter } from '@/utils/setting'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
type Emit = {
  (e: 'update:rowKey', data: string): void
  (e: 'update:detail', data: string): void
  (e: 'change', data: string): void
}

const actionRef = ref()
const params = ref({})
const props = defineProps({
  rowKey: {
    type: String,
    default: ''
  },
  detail: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits<Emit>()
const firstFind = ref(true)

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 300,
    ellipsis: true,
    fixed: 'left',
    search: {
      type: 'string',
    },
  },
  {
    title: t('Save.Device.Product.5rg55mrnxnc0'),
    dataIndex: 'name',
    width: 200,
    ellipsis: true,
    search: {
      type: 'string',
      first: true
    }
  },
  {
    title: t('Save.Device.Product.5rg55mrnxs80'),
    dataIndex: 'accessProvider',
    width: 150,
    ellipsis: true,
    hideInTable: true,
    search: {
      type: 'select',
      options: () => getProviders().then((resp: any) => {
        return accessConfigTypeFilter(resp.result || [])
      })
    }
  },
  {
    title: t('Save.Device.Product.5rg55mrnxw40'),
    dataIndex: 'accessName',
    width: 150,
    ellipsis: true,
    search: {
      type: 'select',
      options: () => queryGatewayList().then((resp: any) =>
        resp.result.map((item: any) => ({
          label: item.name, value: item.id
        }))
      )
    }
  },
  {
    title: t('Save.Device.Product.5rg55mrnxf00'),
    dataIndex: 'deviceType',
    width: 150,
    search: {
      type: 'select',
      options: [
        { label: t('Save.Device.Product.5rg55mrnxjg0'), value: 'device' },
        { label: t('Save.Device.Product.5rg55mrnxzs0'), value: 'childrenDevice' },
        { label: t('Save.Device.Product.5rg55mrny3g0'), value: 'gateway' },
      ]
    }
  },
  {
    title: t('Save.Device.Product.5rg55mrny700'),
    dataIndex: 'state',
    width: '90px',
    search: {
      type: 'select',
      options: [
        { label: t('Save.Device.Product.5rg55mrnx6c0'), value: 0 },
        { label: t('Save.Device.Product.5rg55mrnvqg0'), value: 1 },
      ]
    }
  },
  {
    title: t('Save.Device.Product.5rg55mrnyb40'),
    dataIndex: 'describe',
    ellipsis: true,
    width: 300,
  },
  {
    dataIndex: 'classifiedId',
    title: t('Save.Device.Product.5rg55mrnyes0'),
    hideInTable: true,
    search: {
      type: 'treeSelect',
      options: () => {
        return new Promise((res => {
          queryTree({ paging: false }).then(resp => {
            res(resp.result)
          })
        }))
      },
      componentProps: {
        fieldNames: {
          label: 'name',
          value: 'id',
        }
      }
    }
  },
  {
    dataIndex: 'id$dim-assets',
    title: t('Save.Device.Product.5rg55mrnyik0'),
    hideInTable: true,
    search: {
      type: 'treeSelect',
      options: () => new Promise((resolve) => {
        getTreeData_api({ paging: false }).then((resp: any) => {
          const formatValue = (list: any[]) => {
            return list.map((item: any) => {
              if (item.children) {
                item.children = formatValue(item.children);
              }
              return {
                ...item,
                value: JSON.stringify({
                  assetType: 'product',
                  targets: [
                    {
                      type: 'org',
                      id: item.id,
                    },
                  ],
                }),
              }
            })
          }
          resolve(formatValue(resp.result) || [])
        })
      })
    }
  }
]

const handleSearch = (p: any) => {
  params.value = p
}

const productQuery = async (p: any) => {
  const sorts: any = [];

  if (props.rowKey) {
    sorts.push({
      name: 'id',
      value: props.rowKey,
    });
  }
  sorts.push({ name: 'createTime', order: 'desc' });
  p.sorts = sorts
  const resp = await queryProductList(p)
  if (resp.success && props.rowKey && firstFind.value) {
    const productItem = (resp.result as { data: any[]}).data.find((item: any) => item.id === props.rowKey)
    emit('update:detail', productItem)
    firstFind.value = false
  }
  return {
    ...resp
  }
}

const handleClick = (detail: any) => {
  emit('update:rowKey', detail.id)
  emit('update:detail', detail)
  emit('change', detail)
}

</script>

<style scoped lang='less'>
.search {
  margin-bottom: 0;
  padding-right: 0px;
  padding-left: 0px;
}
</style>