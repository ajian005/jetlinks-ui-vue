<template>
    <page-container
        :tabList="list"
        :showBack="true"
        :tabActiveKey="instanceStore.tabActiveKey"
        @tabChange="onTabChange"
    >
        <template #title>
            <div style="display: flex; align-items: center">
                <j-tooltip :title="instanceStore.current?.name">
                    <div class="deviceDetailHead">
                        {{ instanceStore.current?.name }}
                    </div>
                </j-tooltip>
                <j-divider type="vertical" />
                <j-space>
                    <span style="font-size: 14px; color: rgba(0, 0, 0, 0.85)">
                        {{t('Instance.Detail.index.5rcyr31fjkc0')}}
                        <j-badge
                            :status="
                                statusMap.get(
                                    instanceStore.current?.state?.value,
                                )
                            "
                        />
                        {{ instanceStore.current?.state?.text }}
                    </span>
                    <PermissionButton
                        v-if="
                            instanceStore.current?.state?.value === 'notActive'
                        "
                        type="link"
                        style="margin-top: -5px; padding: 0 20px"
                        :popConfirm="{
                            title: t('Instance.Detail.index.5rcyr31fn900'),
                            onConfirm: handleAction,
                        }"
                        hasPermission="device/Instance:action"
                    >
                        {{t('Instance.Detail.index.5rcyr31fnp00')}}
                    </PermissionButton>
                    <PermissionButton
                        v-if="instanceStore.current?.state?.value === 'online'"
                        type="link"
                        style="margin-top: -5px; padding: 0 20px"
                        :popConfirm="{
                            title: t('Instance.Detail.index.5rcyr31fnws0'),
                            onConfirm: handleDisconnect,
                        }"
                        hasPermission="device/Instance:action"
                    >
                        {{t('Instance.Detail.index.5rcyr31fo4s0')}}
                    </PermissionButton>
                    <j-tooltip
                        v-if="
                            instanceStore.current?.accessProvider ===
                                'child-device' &&
                            instanceStore.current?.state?.value === 'offline'
                        "
                        :title="
                            instanceStore.current?.features?.find(
                                (item) => item?.id === 'selfManageState',
                            )
                                ? t('Instance.Detail.index.5rcyr31foe00')
                                : t('Instance.Detail.index.5rcyr31fol00')
                        "
                    >
                        <AIcon
                            type="QuestionCircleOutlined"
                            style="font-size: 14px"
                        />
                    </j-tooltip>
                </j-space>
            </div>
        </template>
        <template #content>
            <j-descriptions size="small" :column="4">
                <j-descriptions-item label="ID">{{
                    instanceStore.current?.id
                }}</j-descriptions-item>
                <j-descriptions-item :label="t('Instance.Detail.index.5rcyr31forc0')">
                    <PermissionButton
                        type="link"
                        style="margin-top: -5px; padding: 0"
                        @click="jumpProduct"
                        hasPermission="device/Product:view"
                    >
                        {{ instanceStore.current?.productName }}
                    </PermissionButton>
                </j-descriptions-item>
            </j-descriptions>
        </template>
        <template #extra>
            <img
                @click="handleRefresh"
                :src="getImage('/device/button.png')"
                style="margin-right: 20px; cursor: pointer"
            />
        </template>
        <FullPage>
            <div style="padding: 24px;height: 100%">
                <component
                    :is="tabs[instanceStore.tabActiveKey]"
                    v-bind="{ type: 'device' }"
                    @onJump="onTabChange"
                />
            </div>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import Info from './Info/index.vue';
import Running from './Running/index.vue';
import Metadata from '../../components/Metadata/index.vue';
import MetadataMap from './MetadataMap/index.vue';
import ChildDevice from './ChildDevice/index.vue';
import Diagnose from './Diagnose/index.vue';
import Function from './Function/index.vue';
import Modbus from './Modbus/index.vue';
import OPCUA from './OPCUA/index.vue';
import EdgeMap from './EdgeMap/index.vue';
import Parsing from './Parsing/index.vue';
import Log from './Log/index.vue';
import { _deploy, _disconnect } from '@/api/device/instance';
import { getImage, onlyMessage } from '@/utils/comm';
import { getWebSocket } from '@/utils/websocket';
import { useMenuStore } from '@/store/menu';
import { useRouterParams } from '@/utils/hooks/useParams';
import { EventEmitter } from '@/utils/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();

const route = useRoute();
const routerParams = useRouterParams();
const instanceStore = useInstanceStore();

const statusMap = new Map();

statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const statusRef = ref();

const initList = [
    {
        key: 'Info',
        tab: t('Instance.Detail.index.5rcyr31foy40'),
    },
    {
        key: 'Running',
        tab: t('Instance.Detail.index.5rcyr31fp4g0'),
    },
    {
        key: 'Metadata',
        tab: t('Instance.Detail.index.5rcyr31fpac0'),
    },
    {
        key: 'Function',
        tab: t('Instance.Detail.index.5rcyr31fpgw0'),
    },
    {
        key: 'Log',
        tab: t('Instance.Detail.index.5rcyr31fpn40'),
    },
];

const list = ref([...initList]);

const tabs = {
    Info,
    Metadata,
    Running,
    ChildDevice,
    Diagnose,
    Function,
    Modbus,
    OPCUA,
    EdgeMap,
    Parsing,
    Log,
    MetadataMap
};

const getStatus = (id: string) => {
    statusRef.value = getWebSocket(
        `instance-editor-info-status-${id}`,
        `/dashboard/device/status/change/realTime`,
        {
            deviceId: id,
        },
    ).subscribe(() => {
        instanceStore.refresh(id);
    });
};

const getDetail = () => {
    const keys = list.value.map((i) => i.key);
    if (
        instanceStore.current?.protocol &&
        !['modbus-tcp', 'opc-ua'].includes(instanceStore.current?.protocol) &&
        !keys.includes('Diagnose')
    ) {
        list.value.push({
            key: 'Diagnose',
            tab: t('Instance.Detail.index.5rcyr31fpx80'),
        });
    }
    if (
        instanceStore.current?.features?.find(
            (item: any) => item?.id === 'transparentCodec',
        ) &&
        !keys.includes('Parsing')
    ) {
        list.value.push({
            key: 'Parsing',
            tab: t('Instance.Detail.index.5rcyr31fq5s0'),
        });
    }
    if (
        instanceStore.current?.protocol === 'modbus-tcp' &&
        !keys.includes('Modbus')
    ) {
        list.value.push({
            key: 'Modbus',
            tab: 'Modbus TCP',
        });
    }
    if (
        instanceStore.current?.protocol === 'opc-ua' &&
        !keys.includes('OPCUA')
    ) {
        list.value.push({
            key: 'OPCUA',
            tab: 'OPC UA',
        });
    }
    if (
        instanceStore.current?.deviceType?.value === 'gateway' &&
        !keys.includes('ChildDevice')
    ) {
        // 产品类型为网关的情况下才显示此模块
        list.value.push({
            key: 'ChildDevice',
            tab: t('Instance.Detail.index.5rcyr31fqes0'),
        });
    }
    if (
        instanceStore.current?.accessProvider === 'edge-child-device' &&
        instanceStore.current?.parentId &&
        !keys.includes('EdgeMap')
    ) {
        list.value.push({
            key: 'EdgeMap',
            tab: t('Instance.Detail.index.5rcyr31fqo80'),
        });
    }

    if (
        instanceStore.current?.features?.find(
            (item: any) => item?.id === 'diffMetadataSameProduct',
        ) &&
        !keys.includes('MetadataMap')
    ) {
        list.value.push({ key: 'MetadataMap', tab: t('Instance.Detail.index.5seyfb6whsg0')});
    }
};

const initPage = async (newId: any) => {
  await instanceStore.refresh(String(newId));
  getStatus(String(newId));
  list.value = [...initList];
  getDetail();
  instanceStore.tabActiveKey = 'Info';
}

onBeforeRouteUpdate((to: any) => {
  if (to.params?.id!==instanceStore.current.id && to.name === 'device/Instance/Detail') {
    initPage(to.params?.id)
  }
})


const getDetailFn = async () => {
    const _id = route.params?.id;
    if (_id) {
        await instanceStore.refresh(String(_id));
        getStatus(String(_id));
        list.value = [...initList];
        getDetail();
    }
    instanceStore.tabActiveKey = routerParams.params.value.tab || 'Info';
};

onMounted(() => {
    getDetailFn();
});

const onTabChange = (e: string) => {
    if (instanceStore.tabActiveKey === 'Metadata') {
      EventEmitter.emit('MetadataTabs', () => {
        instanceStore.tabActiveKey = e;
      })
    } else {
      instanceStore.tabActiveKey = e;
    }
};

const handleAction = async () => {
    if (instanceStore.current?.id) {
        const resp = await _deploy(instanceStore.current?.id);
        if (resp.status === 200) {
            onlyMessage(t('Instance.Detail.index.5rcyr31fqww0'));
            instanceStore.refresh(instanceStore.current?.id);
        }
    }
};

const handleDisconnect = async () => {
    if (instanceStore.current?.id) {
        const resp = await _disconnect(instanceStore.current?.id);
        if (resp.status === 200) {
            onlyMessage(t('Instance.Detail.index.5rcyr31fqww0'));
            instanceStore.refresh(instanceStore.current?.id);
        }
    }
};

const handleRefresh = async () => {
    if (instanceStore.current?.id) {
        await instanceStore.refresh(instanceStore.current?.id);
        onlyMessage(t('Instance.Detail.index.5rcyr31fr5o0'));
    }
};

const jumpProduct = () => {
    menuStory.jumpPage('device/Product/Detail', {
        id: instanceStore.current?.productId,
    });
};

onUnmounted(() => {
    instanceStore.current = {} as any
    statusRef.value && statusRef.value.unsubscribe();
});
</script>

<style lang="less" scoped>
.deviceDetailHead {
    max-width: 400px;
    overflow: hidden;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>