<template>
    <SaveChild
        v-if="childVisible"
        @close-child-save="closeChildSave"
        :childData="_current"
    />
    <div v-else>
        <pro-search
            :columns="columns"
            target="child-device"
            @search="handleSearch"
            class="device-child-device-search"
        />
        <!-- <j-divider /> -->
        <JProTable
            ref="childDeviceRef"
            :columns="columns"
            :request="query"
            :bodyStyle="{
                padding: 0
            }"
            :defaultParams="{
                terms: [
                    {
                        column: 'parentId',
                        value: detail?.id || '',
                        termType: 'eq',
                    },
                ],
            }"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onChange: onSelectChange,
            }"
            :params="params"
            :model="'TABLE'"
        >
            <template #rightExtraRender>
                <j-space>
                    <PermissionButton
                        type="primary"
                        v-if="
                            detail?.accessProvider === 'official-edge-gateway'
                        "
                        hasPermission="device/Instance:update"
                        @click="
                            _current = {};
                            childVisible = true;
                        "
                        >{{t('Detail.ChildDevice.index.5rcyczrkjyw0')}}</PermissionButton
                    >
                    <PermissionButton
                        type="primary"
                        @click="visible = true"
                        hasPermission="device/Instance:update"
                    >
                        {{t('Detail.ChildDevice.index.5rcyczrkkt40')}}</PermissionButton
                    >
                    <PermissionButton
                        type="primary"
                        hasPermission="device/Instance:update"
                        :popConfirm="{
                            title: t('Detail.ChildDevice.index.5rcyczrkky80'),
                            onConfirm: handleUnBind,
                        }"
                        >{{t('Detail.ChildDevice.index.5rcyczrkl1w0')}}</PermissionButton
                    >
                </j-space>
            </template>
            <template #registryTime="slotProps">
                {{
                    slotProps.registryTime
                        ? moment(slotProps.registryTime).format(
                              'YYYY-MM-DD HH:mm:ss',
                          )
                        : ''
                }}
            </template>
            <template #state="slotProps">
                <j-badge
                    :text="slotProps.state.text"
                    :status="statusMap.get(slotProps.state.value)"
                />
            </template>
            <template #action="slotProps">
                <j-space :size="16">
                    <template
                        v-for="i in getActions(slotProps, 'table')"
                        :key="i.key"
                    >
                        <PermissionButton
                            :disabled="i.disabled"
                            :popConfirm="i.popConfirm"
                            :tooltip="{
                                ...i.tooltip,
                            }"
                            @click="i.onClick"
                            type="link"
                            style="padding: 0px"
                            :hasPermission="'device/Instance:' + i.key"
                        >
                            <template #icon><AIcon :type="i.icon" /></template>
                        </PermissionButton>
                    </template>
                </j-space>
            </template>
        </JProTable>
        <BindChildDevice v-if="visible" :parentIds="parentIds" @change="closeBindDevice" />
    </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import type { ActionsType } from '@/components/Table';
import {query, unbindDevice, unbindBatchDevice, queryByParent} from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { storeToRefs } from 'pinia';
import BindChildDevice from './BindChildDevice/index.vue';
import { usePermissionStore } from '@/store/permission';
import SaveChild from './SaveChild/index.vue';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const instanceStore = useInstanceStore();
const { detail } = storeToRefs(instanceStore);
const router = useRouter();
const childVisible = ref(false);
const permissionStore = usePermissionStore();
// watchEffect(() => {
//     console.log(detail.value);
// });
const statusMap = new Map();
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const childDeviceRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const _selectedRowKeys = ref<string[]>([]);
const visible = ref<boolean>(false);
const _current = ref({});
const parentIds = ref<any[]>([instanceStore.detail.id])

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        search: {
            type: 'string',
            defaultTermType: 'eq',
        },
    },
    {
        title: t('Detail.ChildDevice.index.5rcyczrkl5o0'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('Detail.ChildDevice.index.5rcyczrkl980'),
        dataIndex: 'productName',
        key: 'productName',
        search: {
            type: 'string',
        },
    },
    {
        title: t('Detail.ChildDevice.index.5rcyczrklds0'),
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: t('Detail.ChildDevice.index.5rcyczrklgw0'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: t('Detail.ChildDevice.index.5rcyczrklk40'), value: 'notActive' },
                { label: t('Detail.ChildDevice.index.5rcyczrkln00'), value: 'offline' },
                { label: t('Detail.ChildDevice.index.5rcyczrklqw0'), value: 'online' },
            ],
        },
    },
    {
        title: t('Detail.ChildDevice.index.5rcyczrklu00'),
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('Detail.ChildDevice.index.5rcyczrklx00'),
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) return [];
    return [
        {
            key: 'view',
            text: t('Detail.ChildDevice.index.5rcyczrkm040'),
            tooltip: {
                title: t('Detail.ChildDevice.index.5rcyczrkm040'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                router.push('/iot/device/instance/detail/' + data.id);
            },
        },
        {
            key: 'action',
            text: t('Detail.ChildDevice.index.5rcyczrkm340'),
            tooltip: {
                title: t('Detail.ChildDevice.index.5rcyczrkm340'),
            },
            icon: 'DisconnectOutlined',
            popConfirm: {
                title: t('Detail.ChildDevice.index.5rcyczrkm5s0'),
                okText: t('Detail.ChildDevice.index.5rcyczrkma80'),
                cancelText: t('Detail.ChildDevice.index.5rcyczrkmdg0'),
                onConfirm: async () => {
                    const resp = await unbindDevice(
                        detail.value.id,
                        data.id,
                        {},
                    );
                    if (resp.status === 200) {
                        childDeviceRef.value?.reload();
                        onlyMessage(t('Detail.ChildDevice.index.5rcyczrkmg80'));
                    }
                },
            },
        },
        {
            key: 'update',
            text: t('Detail.ChildDevice.index.5rcyczrkmj40'),
            tooltip: {
                title: t('Detail.ChildDevice.index.5rcyczrkmj40'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                _current.value = data;
                childVisible.value = true;
            },
        },
    ];
};

const handleSearch = (e: any) => {
    params.value = e;
};

const onSelectChange = (keys: string[]) => {
    _selectedRowKeys.value = [...keys];
};

const cancelSelect = () => {
    _selectedRowKeys.value = [];
};

const handleUnBind = async () => {
    if (_selectedRowKeys.value.length) {
        const resp = await unbindBatchDevice(
            detail.value.id,
            _selectedRowKeys.value,
        );
        if (resp.status === 200) {
            onlyMessage(t('Detail.ChildDevice.index.5rcyczrkmg80'));
            cancelSelect();
            childDeviceRef.value?.reload();
        }
    } else {
        onlyMessage(t('Detail.ChildDevice.index.5rcyczrkmnk0'), 'warning');
    }
};

const closeBindDevice = (val: boolean) => {
    visible.value = false;
    if (val) {
        childDeviceRef.value?.reload();
    }
};

// const getChildren = async () => {
//   const { id} = instanceStore.detail
//   const data = await queryByParent(id)
//   if (data.success) {
//     parentIds.value.concat(data.result)
//   }
// }
const closeChildSave = () => {
    childVisible.value = false;
};
</script>

<style lang="less">
.device-child-device-search {
    padding: 0px;
}
</style>
