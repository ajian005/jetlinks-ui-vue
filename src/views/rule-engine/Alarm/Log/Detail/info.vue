<template>
    <j-modal
        visible
        :title="t('Log.Detail.info.5rg44l76xs40')"
        :okText="t('Log.Detail.info.5rg44l76zlc0')"
        :cancelText="t('Log.Detail.info.5rg44l76zv40')"
        :width="1000"
        @ok="closeModal"
        @cancel="closeModal"
    >
        <j-descriptions bordered :column="2">
            <j-descriptions-item
                v-if="props.data.targetType === 'device'"
                :label="t('Log.Detail.info.5rg44l7702o0')"
                :span="1"
                >{{ props.data?.targetName || '' }}</j-descriptions-item
            >
            <j-descriptions-item
                v-if="props.data.targetType === 'device'"
                :label="t('Log.Detail.info.5rg44l7709c0')"
                :span="1"
                >{{ props.data?.targetId || '' }}</j-descriptions-item
            >
            <j-descriptions-item :label="t('Log.Detail.info.5rg44l770gg0')" :span="1">{{
                props.data?.alarmConfigName
            }}</j-descriptions-item>
            <j-descriptions-item :label="t('Log.Detail.info.5rg44l770mo0')" :span="1">{{
                dayjs(data?.alarmTime).format('YYYY-MM-DD HH:mm:ss')
            }}</j-descriptions-item>
            <j-descriptions-item :label="t('Log.Detail.info.5rg44l770wg0')" :span="1">
                <j-tooltip
                    placement="topLeft"
                    :title="_level"
                >
                    <Ellipsis>
                        <span>
                            {{_level}}
                        </span>
                    </Ellipsis>
                </j-tooltip>
            </j-descriptions-item>
            <j-descriptions-item :label="t('Log.Detail.info.5rg44l771480')" :span="1">
                <Ellipsis style="width: calc(100% - 20px)">
                    <span>
                        {{ description || '' }}
                    </span>
                </Ellipsis>
            </j-descriptions-item>
            <j-descriptions-item :label="t('Log.Detail.info.5rg44l771b40')" :span="2"
                ><div style="max-height: 500px; overflow-y: auto">
                    <JsonViewer
                        :value="data"
                        :expanded="true" :expandDepth="4" 
                    ></JsonViewer></div
            ></j-descriptions-item>
        </j-descriptions>
    </j-modal>
</template>

<script lang="ts" setup>
import { queryLevel } from '@/api/rule-engine/config';
import dayjs from 'dayjs';
import JsonViewer from 'vue-json-viewer';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    data: Object,
    description: String,
});
const data = computed(()=>{
    return JSON.parse(props.data?.alarmInfo);
})
const defaultLevel = ref<any[]>([])

const emit = defineEmits(['close']);
const closeModal = () => {
    emit('close');
};

const _level = computed(() => {
    return (defaultLevel.value || []).find((item: any) => item?.level === props.data?.level)?.title || props.data?.level
})

onMounted(() => {
    queryLevel().then((res)=>{
        if(res.status === 200 ){
            defaultLevel.value = res.result?.levels || [];
        }
    })
})
</script>
<style lang="less" scoped>
</style>