<template>
    <page-container>
        <pro-search :columns="columns" target="search-firmware-task" @search="handleSearch" />
        <j-pro-table
            ref="tableRef"
            model="TABLE"
            :columns="columns"
            :request="task"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
            }"
            :params="params"
        >
            <template #headerTitle>
                <PermissionButton
                    type="primary"
                    @click="handlAdd"
                    hasPermission="device/Firmware:add"
                >
                    <template #icon><AIcon type="PlusOutlined" /></template>
                    {{t('Firmware.Task.index.5rg3no6rw940')}}
                </PermissionButton>
            </template>
            <template #mode="slotProps">
                <span>{{ slotProps.mode.text }}</span>
            </template>
            <template #progress="slotProps">
                <span>{{ slotProps.progress }}%</span>
            </template>
            <template #action="slotProps">
                <j-space>
                    <template v-for="i in getActions(slotProps)" :key="i.key">
                        <PermissionButton
                            :disabled="i.disabled"
                            :popConfirm="i.popConfirm"
                            :tooltip="{
                                ...i.tooltip,
                            }"
                            style="padding: 0px"
                            @click="i.onClick"
                            type="link"
                            :hasPermission="'device/Firmware:' + i.key"
                        >
                            <template #icon><AIcon :type="i.icon" /></template>
                        </PermissionButton>
                    </template>
                </j-space>
            </template>
        </j-pro-table>
        <Save v-if="visible" :data="current" @change="saveChange" />
    </page-container>
</template>
<script lang="ts" setup name="TaskPage">
import type { ActionsType } from '@/components/Table/index';
import { task, startTask, stopTask } from '@/api/device/firmware';
import { onlyMessage } from '@/utils/comm';
import Save from './Save/index.vue';
import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();
const tableRef = ref<Record<string, any>>({});
const route = useRoute();
const params = ref<Record<string, any>>({});

const visible = ref(false);
const current = ref({});

const columns = [
    {
        title: t('Firmware.Task.index.5rg3no6rxnc0'),
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 200,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('Firmware.Task.index.5rg3no6rxww0'),
        dataIndex: 'mode',
        key: 'mode',
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                {
                    label: t('Firmware.Task.index.5rg3no6ry500'),
                    value: 'pull',
                },
                {
                    label: t('Firmware.Task.index.5rg3no6ry940'),
                    value: 'push',
                },
            ],
        },
        scopedSlots: true,
        width: 200,
    },

    {
        title: t('Firmware.Task.index.5rg3no6rydc0'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('Firmware.Task.index.5rg3no6rygs0'),
        dataIndex: 'progress',
        key: 'progress',
        ellipsis: true,
        scopedSlots: true,
    },
    {
        title: t('Firmware.Task.index.5rg3no6rynw0'),
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

const defaultParams =
    {
        terms: [
            {
                column: 'firmwareId',
                value: route.query.id,
            },
        ],
}


const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) {
        return [];
    }

    const stop = data.waiting > 0 && data?.state?.value === 'processing';
    const pause = data?.state?.value === 'canceled';

    const Actions = [
        {
            key: 'view',
            text: t('Firmware.Task.index.5rg3no6ryrs0'),
            tooltip: {
                title: t('Firmware.Task.index.5rg3no6ryrs0'),
            },
            icon: 'icon-details',
            onClick: async () => {
                handlDetails(data.id);
            },
        },
        {
            key: 'view',
            text: t('Firmware.Task.index.5rg3no6rywg0'),
            tooltip: {
                title: t('Firmware.Task.index.5rg3no6rywg0'),
            },
            icon: 'EyeOutlined',
            onClick: async () => {
                handlEye(data);
            },
        },
    ];

    if (stop) {
        Actions.push({
            key: 'update',
            text: t('Firmware.Task.index.5rg3no6rz000'),
            tooltip: {
                title: t('Firmware.Task.index.5rg3no6rz000'),
            },
            onClick: async () => {
                const res = await stopTask(data.id);
                if (res.success) {
                    onlyMessage(t('Firmware.Task.index.5rg3no6rz3o0'), 'success');
                    tableRef.value.reload();
                }
            },
            icon: 'StopOutlined',
        });
    } else if (pause) {
        Actions.push({
            key: 'update',
            text: t('Firmware.Task.index.5rg3no6rz740'),
            tooltip: {
                title: t('Firmware.Task.index.5rg3no6rz740'),
            },
            onClick: async () => {
                const res = await startTask(data.id, ['canceled']);
                if (res.success) {
                    onlyMessage(t('Firmware.Task.index.5rg3no6rz3o0'), 'success');
                    tableRef.value.reload();
                }
            },
            icon: 'ControlOutlined',
        });
    }

    return Actions;
};

const handlAdd = () => {
    current.value = {};
    visible.value = true;
};

const handlEye = (data: object) => {
    current.value = toRaw({ ...data, view: true });
    visible.value = true;
};

const handlDetails = (id: string) => {
    menuStory.jumpPage('device/Firmware/Task/Detail', { id });
};
const saveChange = (value: boolean) => {
    visible.value = false;
    current.value = {};
    if (value) {
        onlyMessage(t('Firmware.Task.index.5rg3no6rz3o0'), 'success');
        tableRef.value.reload();
    }
};

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
      const query = {"terms":[
        e,defaultParams
      ]}
      params.value = query
};
</script>

<style lang="less" scoped></style>
