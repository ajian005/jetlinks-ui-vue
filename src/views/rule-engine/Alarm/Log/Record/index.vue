<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="bind-channel"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                model="TABLE"
                :columns="columns"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                    terms,
                }"
                :request="queryHandleHistory"
                :params="params"
            >
                <template #headerTitle>
                    <h3>{{t('Log.Record.index.5rg453slguw0')}}</h3>
                </template>
                <template #handleTime="slotsProps">
                    <span>
                        {{
                            dayjs(slotsProps.handleTime).format(
                                'YYYY-MM-DD HH:mm:ss',
                            )
                        }}
                    </span>
                </template>
                <template #handleType="slotProps">
                    <span>{{ slotProps.handleType.text }}</span>
                </template>
                <template #alarmTime="slotProps">
                    <span>
                        {{
                            dayjs(slotProps.alarmTime).format(
                                'YYYY-MM-DD HH:mm:ss',
                            )
                        }}
                    </span>
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup>
import { queryHandleHistory } from '@/api/rule-engine/log';
import dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute();
const id = route.query?.id;
const terms = [
    {
        column: 'alarmRecordId',
        termType: 'eq',
        value: id,
        type: 'and',
    },
];
const columns = [
    {
        title: t('Log.Record.index.5rg453slje00'),
        dataIndex: 'handleTime',
        key: 'handleTime',
        scopedSlots: true,
        width: 180,
        search: {
            type: 'date',
        },
    },
    {
        dataIndex: 'handleType',
        title: t('Log.Record.index.5rg453sljow0'),
        key: 'handleType',
        scopedSlots: true,
        width: 120,
        search: {
            type: 'select',
            options: [
                {
                    label: t('Log.Record.index.5rg453sljt00'),
                    value: 'system',
                },
                {
                    label: t('Log.Record.index.5rg453sljy00'),
                    value: 'user',
                },
            ],
        },
    },
    {
        title: t('Log.Record.index.5rg453slk4w0'),
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
        width:180,
    },
    {
        title: t('Log.Record.index.5rg453slk8o0'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
];
const params = ref();
const emit = defineEmits(['closeLog']);
/**
 * 关闭弹窗
 */

const handleSearch = (e: any) => {
    params.value = e;
};
</script>
<style lang="less" scoped>
</style>