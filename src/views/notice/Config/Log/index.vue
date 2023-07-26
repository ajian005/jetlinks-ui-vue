<!-- 通知记录 -->
<template>
    <j-modal v-model:visible="_vis" :title="t('Config.Log.index.5saxdc8c4vk0')" :footer="null" width="70%">
        <pro-search type="simple" :columns="columns" @search="handleSearch" />

        <JProTable
            ref="logRef"
            model="table"
            :columns="columns"
            :request="(e:any) => configApi.getHistory(e, data.id)"
            :defaultParams="{
                pageSize: 5,
                sorts: [{ name: 'notifyTime', order: 'desc' }],
                terms: [{ column: 'notifyType$IN', value: data.type }],
            }"
            :params="params"
            :pagination="{
                pageSizeOptions: ['5', '10', '20', '50', '100'],
            }"
        >
            <template #notifyTime="slotProps">
                {{ moment(slotProps.notifyTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #state="slotProps">
                <j-space>
                    <j-badge
                        :status="slotProps.state.value"
                        :text="slotProps.state.text"
                    ></j-badge>
                    <AIcon
                        v-if="slotProps.state.value === 'error'"
                        type="ExclamationCircleOutlined"
                        style="color: #1d39c4; cursor: pointer"
                        @click="handleError(slotProps.errorStack)"
                    />
                </j-space>
            </template>
            <template #action="slotProps">
                <AIcon
                    type="ExclamationCircleOutlined"
                    :class="Object.keys(slotProps.context).length == 0 ? 'disableIcon' : 'Icon'"
                    @click="handleDetail(slotProps)"
                />
            </template>
        </JProTable>
    </j-modal>
</template>

<script setup lang="ts">
import configApi from '@/api/notice/config';
import { PropType } from 'vue';
import moment from 'moment';
import { Modal } from 'ant-design-vue';
import Record from '../../Template/Log/components/Record.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
type Emits = {
    (e: 'update:visible', data: boolean): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

watch(
    () => _vis.value,
    (val) => {
        if (val) handleSearch({ terms: [] });
    },
);

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        search: {
            type: 'string',
        },
    },
    {
        title: t('Config.Log.index.5saxdc8c5x40'),
        dataIndex: 'notifyTime',
        key: 'notifyTime',
        scopedSlots: true,
        search: {
            type: 'date',
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: t('Config.Log.index.5saxdc8c6280'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: t('Config.Log.index.5saxdc8c66o0'), value: 'success' },
                { label: t('Config.Log.index.5saxdc8c6ac0'), value: 'error' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: t('Config.Log.index.5saxdc8c6i80'),
        key: 'action',
        scopedSlots: true,
    },
];

const params = ref<Record<string, any>>({});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

/**
 * 查看错误信息
 */
const handleError = (e: any) => {
    Modal.info({
        title: t('Config.Log.index.5saxdc8c6r40'),
        content: h(
            'p',
            {
                style: {
                    maxHeight: '300px',
                    overflowY: 'auto',
                },
            },
            JSON.stringify(e),
        ),
    });
};
/**
 * 查看详情
 */
const handleDetail = (data: any) => {
    if(Object.keys(data.context).length == 0){
        Modal.info({
        title: t('Config.Log.index.5saxdc8c6us0'),
        content: h(
            "p",
            {
               
                style: {
                    maxHeight: '300px',
                    overflowY: 'auto',
                },
            },
            t('Config.Log.index.5saxdc8c6yw0')
        ),
    });
    }else{
        Modal.info({
        title: t('Config.Log.index.5saxdc8c6us0'),
        content: h(
            Record,
            {
                data:data,
                style: {
                    maxHeight: '300px',
                    overflowY: 'auto',
                },
            },
        ),
    });
    }  
};
</script>
<style lang="less" scoped>
.disableIcon{
    color:darkgrey ;
    cursor:pointer;
}
.Icon{
    color:#1d39c4;
    cursor:pointer;
}
</style>
