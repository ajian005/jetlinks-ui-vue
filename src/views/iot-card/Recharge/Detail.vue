<template>
    <j-modal
        :maskClosable="false"
        width="1000px"
        :visible="true"
        :title="t('iot-card.Recharge.Detail.5rgbj155z4c0')"
        :okText="t('iot-card.Recharge.Detail.5rgbj15628g0')"
        :cancelText="t('iot-card.Recharge.Detail.5rgbj1562kk0')"
        @ok="handleCancel"
        @cancel="handleCancel"
    >
        <div style="margin-top: 10px">
            <j-descriptions
                :column="2"
                bordered
                :contentStyle="{ minWidth: '300px' }"
                :labelStyle="{ minWidth: '120px' }"
            >
                <j-descriptions-item :label="t('iot-card.Recharge.Detail.5rgbj1562vs0')">{{
                    data.chargeMoney
                }}</j-descriptions-item>
                <j-descriptions-item :label="t('iot-card.Recharge.Detail.5rgbj1563400')">{{
                    data?.rechargeId
                }}</j-descriptions-item>
                <j-descriptions-item :label="t('iot-card.Recharge.Detail.5rgbj1563do0')">{{
                    data.configName
                }}</j-descriptions-item>
                <j-descriptions-item :label="t('iot-card.Recharge.Detail.5rgbj1563lg0')">{{
                    data.orderNumber
                }}</j-descriptions-item>
                <j-descriptions-item :label="t('iot-card.Recharge.Detail.5rgbj1563u80')">{{
                    data.paymentType
                }}</j-descriptions-item>
                <j-descriptions-item :label="t('iot-card.Recharge.Detail.5rgbj15643g0')">
                    <div style="height: 100px; overflow: auto">
                        {{ data.url ? data.url : '' }}
                    </div>
                </j-descriptions-item>
                <j-descriptions-item :label="t('iot-card.Recharge.Detail.5rgbj1564ak0')">{{
                    data.createTime
                        ? moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')
                        : '-'
                }}</j-descriptions-item>
            </j-descriptions>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import moment from 'moment';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['close']);

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const handleCancel = () => {
    emit('close');
};
</script>
