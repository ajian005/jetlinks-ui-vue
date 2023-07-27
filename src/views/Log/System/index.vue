<template>
    <div>
        <pro-search :columns="columns" target="search-system" @search="handleSearch" />
        <j-pro-table
            ref="tableRef"
            model="TABLE"
            :columns="columns"
            :request="querySystem"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
            }"
            :params="params"
        >
            <template #level="slotProps">
                <j-tag
                    :color="
                        slotProps.level === 'WARN'
                            ? 'orange'
                            : slotProps.level === 'ERROR'
                            ? 'red'
                            : slotProps.level === 'DEBUG'
                            ? 'blue'
                            : 'green'
                    "
                >
                    {{ slotProps.level }}
                </j-tag>
            </template>
            <template #createTime="slotProps">
                {{ moment(slotProps.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #server="slotProps">
                {{ slotProps.context.server }}
            </template>

            <template #action="slotProps">
                <j-space :size="16">
                    <j-tooltip
                        v-for="i in getActions(slotProps)"
                        :key="i.key"
                        v-bind="i.tooltip"
                    >
                        <j-popconfirm v-if="i.popConfirm" v-bind="i.popConfirm">
                            <j-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></j-button>
                        </j-popconfirm>
                        <j-button
                            style="padding: 0"
                            type="link"
                            v-else
                            @click="i.onClick && i.onClick(slotProps)"
                        >
                            <j-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></j-button>
                        </j-button>
                    </j-tooltip>
                </j-space>
            </template>
        </j-pro-table>
    </div>
    <j-modal :width="1100" v-model:visible="visible" :title="t('Log.System.index.5rg3dimnkg00')">
        <div>
            <span class="mr-10">[{{ descriptionsData?.threadName }}]</span>
            <span class="mr-10">{{
                moment(descriptionsData?.createTime).format(
                    'YYYY-MM-DD HH:mm:ss',
                )
            }}</span>
            <span>{{ descriptionsData?.className }}</span>
        </div>
        <div class="mb-10">
            <j-tag
                :color="
                    descriptionsData?.level === 'WARN'
                        ? 'orange'
                        : descriptionsData?.level === 'ERROR'
                        ? 'red'
                        : descriptionsData?.level === 'DEBUG'
                        ? 'blue'
                        : 'green'
                "
            >
                {{ descriptionsData?.level }}
            </j-tag>
            <span>{{ descriptionsData?.message }}</span>
        </div>
        <j-textarea
            v-model:value="descriptionsData.exceptionStack"
            :placeholder="t('Log.System.index.5rg3dimnlr00')"
            :auto-size="{ minRows: 24, maxRows: 28 }"
        />
        <template #footer>
            <j-button type="primary" @click="handleOk">{{t('Log.System.index.5rg3dimnlzg0')}}</j-button>
        </template>
    </j-modal>
</template>
<script lang="ts" setup name="SystemLog">
import type { ActionsType } from '@/components/Table/index';
import type { SystemLogItem } from '../typings';
import { querySystem } from '@/api/link/log';
import moment from 'moment';

import { modifySearchColumnValue } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: t('Log.System.index.5rg3dimnm5o0'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        scopedSlots: true,
        width: 400,
        fixed: 'left',
        ellipsis: true,
    },
    {
        title: t('Log.System.index.5rg3dimnme80'),
        dataIndex: 'level',
        key: 'level',
        search: {
            type: 'select',
            options: [
                {
                    label: 'ERROR',
                    value: 'ERROR',
                },
                {
                    label: 'INFO',
                    value: 'INFO',
                },
                {
                    label: 'DEBUG',
                    value: 'DEBUG',
                },
                {
                    label: 'WARN',
                    value: 'WARN',
                },
            ],
        },
        scopedSlots: true,
        width: 100,
    },
    {
        title: t('Log.System.index.5rg3dimnmkg0'),
        dataIndex: 'message',
        key: 'message',
        search: {
            type: 'string',
        },
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: t('Log.System.index.5rg3dimnmpg0'),
        dataIndex: 'server',
        key: 'server',
        scopedSlots: true,
        search: {
            type: 'string',
        },
        width: 200,
        ellipsis: true,
    },
    {
        title: t('Log.System.index.5rg3dimnmuk0'),
        dataIndex: 'createTime',
        key: 'createTime',
        search: {
            type: 'date',
        },
        scopedSlots: true,
        width: 200,
    },
    {
        title: t('Log.System.index.5rg3dimnn000'),
        key: 'action',
        fixed: 'right',
        width: 60,
        scopedSlots: true,
    },
];

const descriptionsData = ref<SystemLogItem>({
    id: '',
    threadName: '',
    createTime: 0,
    className: '',
    level: '',
    message: '',
    exceptionStack: '',
    context: '',
    lineNumber: 0,
    methodName: '',
    name: '',
    threadId: '',
});
const visible = ref<boolean>(false);

const handleOk = (e: MouseEvent) => {
    visible.value = false;
};

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) {
        return [];
    }
    return [
        {
            key: 'eye',
            text: t('Log.System.index.5rg3dimnn580'),
            tooltip: {
                title: t('Log.System.index.5rg3dimnn580'),
            },
            icon: 'EyeOutlined',
            onClick: (data: SystemLogItem) => {
                descriptionsData.value = data;
                visible.value = true;
            },
        },
    ];
};

const column = {
    server: 'context.server',
};

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = modifySearchColumnValue(e, column);
};
</script>

<style scoped lang="less">
.mr-10 {
    margin-right: 10px;
}
.mb-10 {
    margin-bottom: 10px;
}
</style>
