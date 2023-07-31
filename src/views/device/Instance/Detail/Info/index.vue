<template>
    <j-descriptions bordered>
        <template #title>
            {{t('Detail.Info.index.5rcyl6fnhtk0')}}
            <PermissionButton
                type="link"
                @click="visible = true"
                hasPermission="device/Instance:update"
            >
                <template #icon><AIcon type="EditOutlined" /></template>
                {{t('Detail.Info.index.5rcyl6fnjsg0')}}
            </PermissionButton>
        </template>
        <j-descriptions-item :label="t('Detail.Info.index.5rcyl6fnk7k0')">
          <div style="display: flex">
            <div style="flex: 1">
              <j-ellipsis> {{ instanceStore.current?.id }} </j-ellipsis>
            </div>
            <div v-if='instanceStore.current?.accessProvider === "plugin_gateway"'>
              <j-tooltip>
                <template #title>
                  <p>{{t('Detail.Info.index.5rcyl6fnl040')}}</p>
                  {{t('Detail.Info.index.5rcyl6fnlnk0')}}
                </template>
                <a v-if="!inklingDeviceId" type='link' @click='giveAnInkling'>
                  {{t('Detail.Info.index.5seyber60j80')}}
                </a>
                <a v-else type='link' @click='inkingVisible = true'>
                  {{t('Detail.Info.index.5seyber63040')}}
                </a>
              </j-tooltip>
            </div>

          </div>
        </j-descriptions-item>
        <j-descriptions-item :label="t('Detail.Info.index.5rcyl6fnm400')">{{
            instanceStore.current?.productName
        }}</j-descriptions-item>
        <j-descriptions-item :label="t('Detail.Info.index.5rcyl6fnmc40')">{{
            instanceStore.current?.deviceType?.text
        }}</j-descriptions-item>
        <j-descriptions-item :label="t('Detail.Info.index.5rcyl6fnn2o0')">{{
            instanceStore.current?.firmwareInfo?.version
        }}</j-descriptions-item>
        <j-descriptions-item :label="t('Detail.Info.index.5rcyl6fnncg0')">{{
            instanceStore.current?.transport
        }}</j-descriptions-item>
        <j-descriptions-item :label="t('Detail.Info.index.5rcyl6fnny80')">{{
            instanceStore.current?.protocolName
        }}</j-descriptions-item>
        <j-descriptions-item :label="t('Detail.Info.index.5rcyl6fno5w0')">{{
            instanceStore.current?.createTime
                ? moment(instanceStore.current?.createTime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    )
                : ''
        }}</j-descriptions-item>
        <j-descriptions-item :label="t('Detail.Info.index.5rcyl6fnodo0')">{{
            instanceStore.current?.registerTime
                ? moment(instanceStore.current?.registerTime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    )
                : ''
        }}</j-descriptions-item>
        <j-descriptions-item :label="t('Detail.Info.index.5rcyl6fnovc0')">{{
            instanceStore.current?.onlineTime
                ? moment(instanceStore.current?.onlineTime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    )
                : ''
        }}</j-descriptions-item>
        <j-descriptions-item
            :label="t('Detail.Info.index.5rcyl6fnp2o0')"
            v-if="
                instanceStore.current?.deviceType?.value === 'childrenDevice'
            "
            >{{ instanceStore.current?.parentId }}</j-descriptions-item
        >
        <j-descriptions-item :label="t('Detail.Info.index.5rcyl6fnpac0')">{{
            instanceStore.current?.description
        }}</j-descriptions-item>
    </j-descriptions>
    <Config />
    <Tags
        v-if="
            instanceStore.current?.tags &&
            instanceStore.current?.tags.length > 0
        "
    />
    <Relation
        v-if="
            instanceStore.current?.relations &&
            instanceStore.current?.relations.length > 0
        "
    />
    <Save
        v-if="visible"
        :data="instanceStore.current"
        @close="visible = false"
        @save="saveBtn"
    />
  <InkingModal
    v-if='inkingVisible'
    :id='inklingDeviceId'
    :accessId='instanceStore.current.accessId'
    @cancel="inkingVisible = false"
    @submit='saveInkling'
  />
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import Save from '../../Save/index.vue';
import Config from './components/Config/index.vue';
import Tags from './components/Tags/index.vue';
import Relation from './components/Relation/index.vue';
import InkingModal from './components/InklingModal'
import moment from 'moment';
import { detail as queryPluginAccessDetail } from '@/api/link/accessConfig'
import { getPluginData } from '@/api/link/plugin'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const visible = ref<boolean>(false);
const inkingVisible = ref<boolean>(false);
const instanceStore = useInstanceStore();
const inklingDeviceId = ref()
const channelId = ref()

const saveBtn = () => {
    if (instanceStore.current?.id) {
        instanceStore.refresh(instanceStore.current?.id);
    }
    visible.value = false;
};

const saveInkling = (id: string) => {
  if (instanceStore.current?.id) {
    instanceStore.refresh(instanceStore.current?.id);
  }
  channelId.value = id
  queryInkling()
  inkingVisible.value = false
}

const giveAnInkling = () => {
  inkingVisible.value = true
}

const queryInkling = () => {
  if (instanceStore.current?.accessProvider === 'plugin_gateway') {
    queryPluginAccessDetail(instanceStore.current?.accessId).then(async res => {
      if (res.success) {
        channelId.value = res.result.channelId
        const pluginRes = await getPluginData('device',instanceStore.current?.accessId, instanceStore.current?.id)
        if (pluginRes.success) {
          inklingDeviceId.value = pluginRes.result?.externalId
        }
      }
    })
  }
}

watch(() => instanceStore.current?.id, () => {
  if (instanceStore.current?.id) {
    queryInkling()
  }
}, { immediate: true })

</script>