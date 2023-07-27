<template>
    <j-modal
        :width="1000"
        @cancel="emit('close')"
        @ok="emit('close')"
        visible
        :title="t('action.TriggerAlarm.index.5rg4wkndh9o0')"
    >
        <div style="margin-bottom: 24px">{{ t('action.TriggerAlarm.index.relevance') + count }}</div>
        <JProTable
            :columns="columns"
            :request="queryAlarmList"
            model="TABLE"
            :bodyStyle="{ padding: 0 }"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms: [
                    {
                        terms: [
                            {
                                column: 'id',
                                value: id,
                                termType: 'rule-bind-alarm',
                            },
                        ],
                    },
                ],
            }"
        >
            <template #level="slotProps">
                {{ levelList.find(i => slotProps.level === i.level)?.title || '' }}
            </template>
            <template #targetType="slotProps">
                {{ map[slotProps.targetType] }}
            </template>
            <template #state="slotProps">
                <j-badge
                    :text="slotProps.state?.text"
                    :status="
                        slotProps.state?.value === 'disabled'
                            ? 'error'
                            : 'success'
                    "
                />
            </template>
        </JProTable>
    </j-modal>
</template>

<script setup lang="ts">
import { queryAlarmList } from '@/api/rule-engine/scene';
import {
    getAlarmLevel,
    getAlarmConfigCount,
} from '@/api/rule-engine/dashboard';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    id: {
        type: String,
        default: '',
    },
});
const emit = defineEmits(['close']);

const count = ref<number>(0);
const levelList = ref<any[]>([]);

const map = {
    product: t('action.TriggerAlarm.index.5rg4wkndi8g0'),
    device: t('action.TriggerAlarm.index.5rg4wkndifs0'),
    org: t('action.TriggerAlarm.index.5rg4wkndikg0'),
    other: t('action.TriggerAlarm.index.5rg4wkndiqg0'),
};

const columns = [
    {
        dataIndex: 'name',
        fixed: 'left',
        ellipsis: true,
        title: t('action.TriggerAlarm.index.5rg4wkndivc0'),
    },
    {
        dataIndex: 'targetType',
        title: t('action.TriggerAlarm.index.5rg4wkndiz40'),
        scopedSlots: true,
    },
    {
        dataIndex: 'level',
        title: t('action.TriggerAlarm.index.5rg4wkndj300'),
        scopedSlots: true,
    },
    {
        dataIndex: 'state',
        title: t('action.TriggerAlarm.index.5rg4wkndj740'),
        scopedSlots: true,
    },
    {
        dataIndex: 'description',
        title: t('action.TriggerAlarm.index.5rg4wkndjh40'),
        ellipsis: true,
    },
];
watch(
    () => props.id,
    (newId) => {
        if (newId) {
            getAlarmConfigCount({
                terms: [
                    {
                        column: 'id$rule-bind-alarm',
                        value: newId,
                    },
                ],
            }).then((resp) => {
                if (resp.status === 200) {
                    count.value = (resp.result || 0) as number;
                }
            });
        }
    },
    { immediate: true },
);

onMounted(() => {
    getAlarmLevel().then((resp) => {
        if (resp.status === 200) {
            levelList.value = resp.result?.levels || []
        }
    });
});
</script>