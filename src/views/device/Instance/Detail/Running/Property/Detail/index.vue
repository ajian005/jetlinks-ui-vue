<template>
    <j-modal :title="t('Property.Detail.index.5rcymvg63l00')" visible width="50vw" @ok="onCancel" @cancel="onCancel">
        <div style="margin-bottom: 10px"><TimeComponent v-model="dateValue" /></div>
        <div>
            <j-tabs :destroyInactiveTabPane="true" v-model:activeKey="activeKey" style="max-height: 600px; overflow-y: auto">
                <j-tab-pane key="table" :tab="t('Property.Detail.index.5rcymvg65ow0')">
                    <Table :data="props.data" :time="_getTimes" />
                </j-tab-pane>
                <j-tab-pane key="charts" :tab="t('Property.Detail.index.5rcymvg66080')">
                    <Charts :data="props.data" :time="_getTimes" />
                </j-tab-pane>
                <j-tab-pane key="geo" :tab="t('Property.Detail.index.5rcymvg669k0')" v-if="data?.valueType?.type === 'geoPoint'">
                    <PropertyAMap :data="props.data" :time="_getTimes" />
                </j-tab-pane>
            </j-tabs>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import type { Dayjs } from 'dayjs';
import TimeComponent from './TimeComponent.vue'
import Charts from './Charts.vue'
import PropertyAMap from './PropertyAMap.vue'
import Table from './Table.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
})

const _emits = defineEmits(['close'])

const activeKey = ref<'table' | 'charts' | 'geo'>('table')

const dateValue = ref<[Dayjs, Dayjs]>();

const _getTimes = computed(() => {
    if(dateValue.value){
        return [dateValue.value[0].valueOf(), dateValue.value[1].valueOf()]
    }
    return []
})

const onCancel = () => {
    _emits('close')
}
</script>

<style lang="less" scoped>

</style>

