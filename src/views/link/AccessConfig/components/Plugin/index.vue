<template>
  <div>
    <j-steps :current="current">
      <j-step disabled :key="0" :title="t('components.Plugin.index.5rg386071gw0')" />
      <j-step disabled :key="1" :title="t('components.Plugin.index.5rg386072x80')" />
    </j-steps>
    <div class='steps-content'>
      <div class="steps-box" v-if="current === 0">
        <div class="search">
          <j-input-search
            allowClear
            :placeholder="t('components.Plugin.index.5rg386073740')"
            style="width: 300px"
            @search="pluginSearch"
          />
          <PermissionButton
            v-if='showAddBtn'
            type="primary"
            @click="addPlugin"
            hasPermission="link/plugin:add"
          >
            <template #icon><AIcon type="PlusOutlined" /></template>
            {{t('components.Plugin.index.5rg386073ec0')}}
          </PermissionButton>
        </div>
        <j-scrollbar height="480">
          <j-row
            :gutter="[24, 24]"
            style="width: 100%"
            v-if="pluginList.length > 0"
          >
            <j-col
              :span="8"
              v-for="item in pluginList"
              :key="item.id"
            >
              <AccessCard
                @checkedChange="AccessChange"
                :checked="AccessCurrent"
                :disabled='!showAddBtn'
                :data="{ ...item, type: 'plugin' }"
              >
                <template #other>
                  <div class='plugin-other'>
                    <div class='plugin-id'>
                      <div class="plugin-text">插件ID：</div>
                      <div class='other-content'>
                        <j-ellipsis>
                          {{ item.id }}
                        </j-ellipsis>
                      </div>
                    </div>
                    <div class='plugin-version'>
                     <div class="plugin-text"> 版本号：</div>
                      <div class='other-content'>
                        <j-ellipsis>
                          {{ item.version }}
                        </j-ellipsis>
                      </div>
                    </div>
                  </div>

                </template>
              </AccessCard>
            </j-col>
          </j-row>
          <j-empty
            style="margin-top: 10%"
            v-else
            :description="t('components.Plugin.index.5rg386073z40')"
          />
        </j-scrollbar>
      </div>
      <div class="steps-box" v-else-if="current === 1">
        <div
          class="card-last"
          :style="`max-height:${ clientHeight > 900 ? 750 : clientHeight * 0.7 }px`"
        >
          <j-row :gutter="[24, 24]">
            <j-col :span="16">
              <title-component :data="t('components.Plugin.index.5rg386074680')" />
              <j-form
                ref="formRef"
                :model="formData"
                layout="vertical"
              >
                <j-form-item
                  :label="t('components.Plugin.index.5rg386074c40')"
                  :rules="[
                      { required: true, message: t('components.Plugin.index.5rg386074jc0'), trigger: 'blur' },
                      {
                          max: 64,
                          message: t('components.Plugin.index.5rg386074ro0'),
                      },
                  ]"
                  name='name'
                >
                  <j-input
                    v-model:value="formData.name"
                    allowClear
                    :placeholder="t('components.Plugin.index.5rg386074jc0')"
                  />
                </j-form-item>
                <j-form-item
                  :label="t('components.Plugin.index.5rg386074xs0')"
                  :rules="[{ max: 200, message: t('components.Plugin.index.5rg3860752o0') }]"
                  name='description'
                >
                  <j-textarea
                    :placeholder="t('components.Plugin.index.5rg3860757s0')"
                    :rows="4"
                    v-model:value="formData.description"
                    show-count
                    :maxlength="200"
                  />
                </j-form-item>
                <template v-if='config.length' >
                  <title-component :data="t('components.Plugin.index.5rg386075cg0')" />
                  <j-form-item
                    v-for='item in config'
                    :key='item.name'
                    :name='["configuration", item.name]'
                    :label='item.label'
                    :rules='item.rules'
                    :required='!!item.type?.expands?.required'
                  >
                    <ValueItem v-model:modelValue='formData.configuration[item.name]' :itemType='item.type' />
                  </j-form-item>
                </template>

              </j-form>
            </j-col>
          </j-row>
        </div>
      </div>
    </div>
    <div class="steps-action">
      <j-button
        v-if="current > 0"
        @click="prev"
        style="margin-right: 8px"
      >
        {{t('components.Plugin.index.5rg386075gw0')}}
      </j-button>

      <PermissionButton
        v-if="current === 1 && view === 'false'"
        type="primary"
        style="margin-right: 8px"
        @click="saveData"
        :hasPermission="`link/AccessConfig:${
                    id === ':id' ? 'add' : 'update'
                }`"
        :loading='loading'
      >
        {{t('components.Plugin.index.5rg386075p80')}}
      </PermissionButton>
      <j-button
        v-if="current === 0"
        type="primary"

        @click="next"
      >
        {{t('components.Plugin.index.5rg386075v80')}}
      </j-button>
    </div>
  </div>
</template>

<script lang='ts' setup name='AccessConfigPlugin'>
import {
  save,
  update,
  getPluginList,
  getPluginConfig } from '@/api/link/accessConfig'
import AccessCard from '../AccessCard/index.vue';
import { useMenuStore } from 'store/menu'
import { onlyMessage } from '@/utils/comm';
import { CreteRuleByType } from 'components/Form/rules'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  provider: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Object,
    default: () => {},
  },
  bindProduct: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();
const menuStory = useMenuStore();

const current = ref(0);
const pluginList = ref([])
const AccessCurrent = ref(props.data.channelId)
const paramsId = route.params.id as string;
const view = route.query.view as string;
const clientHeight = document.body.clientHeight;
const loading = ref(false)

const formData = reactive({
  name: undefined,
  description: undefined,
  configuration: {}
})
const formRef = ref();

const config = ref<any>([])

const queryPlugin = (params = {}) => {
  getPluginList({
    ...params,
    sorts: [{ name: 'createTime', order: 'desc' }],
    paging: false
  }).then(res => {
    pluginList.value = []
    if (res.success) {
      pluginList.value = res.result || []
    }
  })
}

const showAddBtn = computed(() => {
  return route.query.view === 'false' && !props.bindProduct
})

const getRules = (item: any) => {
  let typeName = t('components.Plugin.index.5rg386075zk0')
  let rules: any[] = []

  if (['select', 'date'].includes(item.type?.type || 'string')) {
    typeName = t('components.Plugin.index.5rg386076500')
  }

  if (item.type?.expands?.required) {
    rules.push(
        {
          required: true,
          message: `请${typeName}${item.name}`
        }
    )
  }

  const typeRules = CreteRuleByType(item.type?.type)
  rules = [...rules, ...typeRules]
  return rules
}

const queryPluginConfig = (id: string, update: boolean = true) => {
  getPluginConfig(id).then(res => {
    if (res.success) {
      const properties = res.result?.others?.configMetadata?.properties || []
      config.value = properties.map((item: any) => {
        if (update) {
          formData.configuration[item.property] = undefined
        }
        return {
          label: item.name,
          name: item.property,
          type: item.type?.type || 'string',
          rules: getRules(item)
        }
      })
    }
  })
}

const pluginSearch = (val: string) => {
  queryPlugin({
    terms: [{
      column: 'name',
      termType: 'like',
      value: `%${val}%`
    }]
  })
}

const AccessChange = (id: string) => {
  AccessCurrent.value = id;
};

const addPlugin = () => {
  const url = menuStory.menus['link/plugin']?.path;
  const wd: any =  window.open(
    `${window.location.origin + window.location.pathname}#${url}?save=true`,
  );
  wd.onTabSaveSuccess = (value: any) => {
    if (value.success) {
      AccessCurrent.value = value.result?.id;
      pluginList.value.unshift(value.result as any)
    }
  }
}

/**
 * {{t('components.Plugin.index.5rg386075v80')}}
 */
const next = () => {
  if (!AccessCurrent.value) {
    return onlyMessage(t('components.Plugin.index.5rg386076dw0'), 'error');
  }
  current.value += 1
}

/**
 * {{t('components.Plugin.index.5rg386075gw0')}}
 */
const prev = () => {
  current.value -= 1
}

/**
 * {{t('components.Plugin.index.5rg386075p80')}}
 */
const saveData = () => {
  formRef.value.validate().then(async (data: any) => {
    if (data) {
      const params = {
        ...props.data,
        ...data,
        protocol: 'plugin',
        channel: 'plugin', // 网络组件
        channelId: AccessCurrent.value,
        provider: props.provider.id,
        transport: 'plugin'
      };

      loading.value = true
      const resp =
        paramsId === ':id'
          ? await save(params).catch(() => { success: false})
          : await update({ ...params, id: paramsId }).catch(() => { success: false});
      loading.value = false
      if (resp.success) {
        onlyMessage(t('components.Plugin.index.5rg386076hw0'), 'success');
        history.back();
        if ((window as any).onTabSaveSuccess) {
          if (resp.result?.id) {
            (window as any).onTabSaveSuccess(resp);
            setTimeout(() => window.close(), 300);
          }
        }
      }
    }
  })
}

watchEffect(() => {
  if (current.value === 1 && AccessCurrent.value) {

    queryPluginConfig(AccessCurrent.value, AccessCurrent.value !== props.data.channelId)
  }
})

onMounted(() => {
 if (paramsId !== ':id') { // 编辑，回显表单值
    formData.name = props.data.name
   formData.description = props.data.description
   formData.configuration = props.data.configuration
 }
})

queryPlugin()

</script>

<style scoped lang='less'>
.steps-content {
  margin-top: 20px;
}
.steps-box {
  min-height: 400px;
  .card-last {
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
.steps-action {
  width: 100%;
  margin-top: 24px;
}
.alert {
  height: 40px;
  padding-left: 10px;
  color: rgba(0, 0, 0, 0.55);
  line-height: 40px;
  background-color: #f6f6f6;
}
.search {
  display: flex;
  margin: 15px 0;
  justify-content: space-between;
}

.other {
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  .item {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.plugin-other {
  display: flex;
  gap: 16px;
  .plugin-id, .plugin-version {
    color: rgba(0, 0, 0, 0.85);
    opacity: .45;
    display: flex;

    .plugin-text {
      white-space: nowrap;
    }
  }

  .plugin-id {
    width: 50%;
    // .other-content {
    //   display: flex;
    //   width: 0;
    //   flex-grow: 1;
    // }
  }
}

</style>