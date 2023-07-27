<template>
    <j-modal
        :maskClosable="false"
        width="600px"
        :visible="true"
        :title="t('iot-card.Recharge.Save.5rgbjmnhygo0')"
        :okText="t('iot-card.Recharge.Save.5rgbjmni02k0')"
        :cancelText="t('iot-card.Recharge.Save.5rgbjmni0aw0')"
        @ok="handleOk"
        @cancel="handleCancel"
        :confirmLoading="btnLoading"
    >
        <div>
            <div class="modal-info">
                <AIcon
                    type="ExclamationCircleOutlined"
                    style="margin-right: 6px"
                />
                {{t('iot-card.Recharge.Save.5rgbjmni0lo0')}}
            </div>
            <j-form
                layout="vertical"
                ref="formRef"
                :rules="rules"
                :model="modelRef"
            >
                <j-form-item :label="t('iot-card.Recharge.Save.5rgbjmni0s00')" name="configId">
                    <j-select
                        v-model:value="modelRef.configId"
                        :options="configList"
                        allowClear
                        show-search
                        style="width: 100%"
                        :placeholder="t('iot-card.Recharge.Save.5rgbjmni0z40')"
                    >
                    </j-select>
                </j-form-item>
                <j-form-item :label="t('iot-card.Recharge.Save.5rgbjmni1540')" name="rechargeId">
                    <j-input
                        v-model:value="modelRef.rechargeId"
                        :placeholder="t('iot-card.Recharge.Save.5rgbjmni1aw0')"
                    />
                </j-form-item>
                <j-form-item :label="t('iot-card.Recharge.Save.5rgbjmni1g40')" name="chargeMoney">
                    <j-input-number
                        allowClear
                        :precision="2"
                        style="width: 100%"
                        v-model:value="modelRef.chargeMoney"
                        :min="1"
                        :max="500"
                        :placeholder="t('iot-card.Recharge.Save.5rgbjmni1mk0')"
                    />
                </j-form-item>

                <j-form-item :label="t('iot-card.Recharge.Save.5rgbjmni1s80')" name="paymentType">
                    <j-select
                        allowClear
                        :options="PaymentMethod"
                        v-model:value="modelRef.paymentType"
                        :placeholder="t('iot-card.Recharge.Save.5rgbjmni1z00')"
                    >
                    </j-select>
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { queryPlatformNoPage, recharge } from '@/api/iot-card/cardManagement';
import { PaymentMethod } from '@/views/iot-card/data';
import { onlyMessage } from '@/utils/comm'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['change', 'save']);

const btnLoading = ref<boolean>(false);
const configList = ref<Record<string, any>[]>([]);

const formRef = ref();

const modelRef = reactive({
    configId: undefined,
    rechargeId: '',
    chargeMoney: undefined,
    paymentType: undefined,
});

const rules = {
    configId: [
        {
            required: true,
            message: t('iot-card.Recharge.Save.5rgbjmni0z40'),
        },
        {
            max: 64,
            message: t('iot-card.Recharge.Save.5rgbjmni24c0'),
        },
    ],
    rechargeId: [
        {
            required: true,
            message: t('iot-card.Recharge.Save.5rgbjmni1aw0'),
        },
        {
            max: 64,
            message: t('iot-card.Recharge.Save.5rgbjmni24c0'),
        },
    ],
    chargeMoney: [
        {
            required: true,
            message: t('iot-card.Recharge.Save.5rgbjmni2a80'),
        },
        // {
        //     min: 1,
        //     max: 500,
        //     message: '请输入1~500之间的数字',
        // },
    ],
    paymentType: [
        {
            required: true,
            message: t('iot-card.Recharge.Save.5rgbjmni1z00'),
        },
    ],
};

const queryProvidersList = () => {
    queryPlatformNoPage({
        paging: false,
        terms: [
            {
                terms: [
                    {
                        column: 'operatorName',
                        termType: 'eq',
                        value: 'onelink',
                    },
                    {
                        column: 'state',
                        termType: 'eq',
                        value: 'enabled',
                        type: 'and',
                    },
                ],
            },
        ],
    }).then((res: any) => {
        configList.value = res.result.map((item: any) => ({
            label: item.name,
            value: item.id,
        }));
    });
};

const handleCancel = () => {
    emit('change');
    formRef.value.resetFields();
};

const handleOk = () => {
    formRef.value
        .validate()
        .then(async () => {
            btnLoading.value = true;
            const resp: any = await recharge(toRaw(modelRef));
            btnLoading.value = false;
            if (resp.status === 200) {
                if (resp.result === '失败') {
                    onlyMessage(t('iot-card.Recharge.Save.5rgbjmni2lw0'), 'error')
                } else if(!resp.result) {
                  onlyMessage(t('iot-card.Recharge.Save.5rgbjmni2ro0'), 'warning')
                } else {
                    window.open(resp.result);
                }
                emit('change', true);
                formRef.value.resetFields();
            }
        })
        .catch((err: any) => {
            btnLoading.value=false
            console.log('error', err);
        });
};

queryProvidersList();
</script>

<style scoped lang="less">
.modal-info {
    color: rgba(0, 0, 0, 0.55);
    background-color: #f6f6f6;
    padding: 6px 12px;
    margin-bottom: 12px;
}
</style>
