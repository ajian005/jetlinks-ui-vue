<!-- 充值管理 -->
<template>
    <page-container>
        <pro-search :columns="columns" target="recharge-search" @search="handleSearch" />
        <FullPage>
        <j-pro-table
          ref="rechargeRef"
          :columns="columns"
          :request="queryRechargeList"
          model="TABLE"
          :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
          :params="params"
        >
            <template #headerTitle>
                <j-space>
                    <PermissionButton @click="visible = true" :hasPermission="'iot-card/Recharge:pay'" type="primary">
                        {{t('iot-card.Recharge.index.5rgbjc3ydao0')}}
                    </PermissionButton>
                    <div class="tips-text">
                        <span style="margin-right: 8px; font-size: 16px">
                            <AIcon type="ExclamationCircleOutlined"></AIcon>
                        </span>
                        {{t('iot-card.Recharge.index.5rgbjc3yehs0')}}
                    </div>
                </j-space>
            </template>
            <template #createTime="slotProps">
                {{
                    slotProps.createTime
                    ? moment(slotProps.createTime).format(
                        'YYYY-MM-DD HH:mm:ss',
                    )
                    : ''
                }}
            </template>
            <template #action="slotProps">
                <j-space :size="16">
                    <template
                        v-for="i in getActions(slotProps)"
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
                            :hasPermission="'iot-card/Recharge:' + i.key"
                        >
                            <template #icon><AIcon :type="i.icon" /></template>
                        </PermissionButton>
                    </template>
                </j-space>
            </template>
        </j-pro-table>
        </FullPage>
        <!-- 充值 -->
        <Save v-if="visible" @change="saveChange" />
        <Detail v-if="detailVisible" :data="current" @close="close" />
    </page-container>
</template>

<script setup lang="ts">
import moment from 'moment';
import type { ActionsType } from '@/components/Table';
import { queryRechargeList } from '@/api/iot-card/cardManagement';
import Save from './Save.vue';
import Detail from './Detail.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const rechargeRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const visible = ref<boolean>(false);
const detailVisible = ref<boolean>(false);
const current = ref<Record<string, any>>({});

const columns = [
    {
        title: t('iot-card.Recharge.index.5rgbjc3yeq80'),
        dataIndex: 'chargeMoney',
        key: 'chargeMoney',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('iot-card.Recharge.index.5rgbjc3yeww0'),
        dataIndex: 'paymentType',
        key: 'paymentType',
        search: {
            type: 'string',
        },
    },
    {
        title: t('iot-card.Recharge.index.5rgbjc3yf200'),
        dataIndex: 'orderNumber',
        key: 'orderNumber',
        ellipsis: true,
    },
    {
        title: t('iot-card.Recharge.index.5rgbjc3yf5s0'),
        dataIndex: 'url',
        key: 'url',
        ellipsis: true,
    },
    {
        title: t('iot-card.Recharge.index.5rgbjc3yf9o0'),
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        width: 200,
        search: {
            type: 'date',
        },
    },
    {
        title: t('iot-card.Recharge.index.5rgbjc3yfd40'),
        key: 'action',
        fixed: 'right',
        width: 60,
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) return [];
    return [
        {
            key: 'view',
            text: t('iot-card.Recharge.index.5rgbjc3yfgo0'),
            tooltip: {
                title: t('iot-card.Recharge.index.5rgbjc3yfgo0'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                detailVisible.value = true;
                current.value = data;
            },
        },
    ];
};

const handleSearch = (e: any) => {
    params.value = e;
};

/**
 * 充值关闭弹窗
 * @param val 加载表格
 */
const saveChange = (val: any) => {
    visible.value = false;
    if (val) {
      setTimeout(() => {
        rechargeRef.value?.reload();
      }, 700)
    }
};

/**
 * 查看详情弹窗关闭
 */
const close = () => {
    detailVisible.value = false;
};
</script>

<style scoped lang="less">
.tips-text {
    padding-left: 24px;
    background: #fff;
    font-size: 14px;
}
</style>
