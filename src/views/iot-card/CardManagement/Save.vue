<template>
    <j-modal
        :maskClosable="false"
        width="600px"
        :visible="true"
        :title="type === 'add' ? t('iot-card.CardManagement.Save.5rgbgvn6chw0') : t('iot-card.CardManagement.Save.5rgbgvn6ehg0')"
        :okText="t('iot-card.CardManagement.Save.5rgbgvn6ewk0')"
        :cancelText="t('iot-card.CardManagement.Save.5rgbgvn6f3w0')"
        @ok="handleOk"
        @cancel="handleCancel"
        :confirmLoading="btnLoading"
    >
        <div style="margin-top: 10px">
            <j-form
                :layout="'vertical'"
                ref="formRef"
                :rules="rules"
                :model="modelRef"
            >
                <j-form-item :label="t('iot-card.CardManagement.Save.5rgbgvn6fc40')" name="id">
                    <j-input
                        v-model:value="modelRef.id"
                        :placeholder="t('iot-card.CardManagement.Save.5rgbgvn6flo0')"
                        :disabled="type === 'edit'"
                    ></j-input>
                </j-form-item>
                <j-form-item name="iccId">
                    <template #label>
                        <span>
                            ICCID
                            <j-tooltip :title="t('iot-card.CardManagement.Save.ICTip')">
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </j-tooltip>
                        </span>
                    </template>
                    <j-input
                        v-model:value="modelRef.iccId"
                        :placeholder="t('iot-card.CardManagement.Save.5rgbgvn6g1s0')"
                        :disabled="type === 'edit'"
                    />
                </j-form-item>
                <j-form-item :label="t('iot-card.CardManagement.Save.5rgbgvn6g9o0')" name="operatorName">
                  <j-select
                    allowClear
                    showSearch
                    :filter-option="filterOption"
                    :disabled="type === 'edit'"
                    :options="OperatorList"
                    v-model:value="modelRef.operatorName"
                    :placeholder="t('iot-card.CardManagement.Save.5rgbgvn6gik0')"
                    @select='() => {
                      modelRef.platformConfigId = undefined
                    }'
                  >
                  </j-select>
                </j-form-item>
                <j-form-item :label="t('iot-card.CardManagement.Save.5rgbgvn6grg0')" name="platformConfigId">
                    <j-select
                        showSearch
                        :filter-option="filterOption"
                        :disabled="type === 'edit'"
                        allowClear
                        :options="platformConfigList"
                        v-model:value="modelRef.platformConfigId"
                        :placeholder="t('iot-card.CardManagement.Save.5rgbgvn6gz40')"
                    >
                </j-select>
                </j-form-item>


                <j-form-item :label="t('iot-card.CardManagement.Save.5rgbgvn6hg80')" name="cardType">
                    <j-select
                        allowClear
                        showSearch
                        :disabled="type === 'edit'"
                        :filter-option="filterOption"
                        :options="TypeList"
                        v-model:value="modelRef.cardType"
                        :placeholder="t('iot-card.CardManagement.Save.5rgbgvn6hn40')"
                    >
                    </j-select>
                </j-form-item>
                <j-form-item :label="t('iot-card.CardManagement.Save.5rgbgvn6hw80')" name="describe">
                    <j-textarea
                        v-model:value="modelRef.describe"
                        :placeholder="t('iot-card.CardManagement.Save.5rgbgvn6i400')"
                        showCount
                        :maxlength="200"
                    />
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import {
    queryPlatformNoPage,
    validateId,
    add,
    edit,
} from '@/api/iot-card/cardManagement';
import { onlyMessage } from '@/utils/comm';
import { OperatorList, TypeList } from '@/views/iot-card/data';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['change']);
const props = defineProps({
    type: {
        type: String,
    },
    data: {
        type: Object,
        default: undefined,
    },
});

const btnLoading = ref<boolean>(false);
const platformConfigCacheList = ref<Record<string, any>[]>([]);

const formRef = ref();

const modelRef = reactive({
    id: '',
    iccId: '',
    platformConfigId: undefined,
    operatorName: undefined,
    cardType: undefined,
    describe: '',
});

const isValidateId = async (id: string) => {
    const res: any = await validateId(id);
    if (res.status === 200) {
        if (res.result?.passed) {
            return '';
        } else {
            return res.result.reason;
        }
    } else {
        return t('iot-card.CardManagement.Save.5rgbgvn6idc0');
    }
};

const vailIccId = async (_: Record<string, any>, value: string) => {
    if (value) {
        const validateId =
            props.type === 'add' ? await isValidateId(value) : '';
        if (validateId === '') {
            return Promise.resolve();
        } else {
            return Promise.reject(new Error(`${validateId}`));
        }
        // } else {
        //     return Promise.reject(new Error('请输入卡号'));
    }
};

const rules = {
    id: [
        {
            required: true,
            message: t('iot-card.CardManagement.Save.5rgbgvn6flo0'),
        },
        {
            max: 64,
            message: t('iot-card.CardManagement.Save.5rgbgvn6ikw0'),
        },
        {
            validator: vailIccId,
            trigger: 'blur',
        },
    ],
    iccId: [
        {
            required: true,
            message: t('iot-card.CardManagement.Save.5rgbgvn6g1s0'),
        },
        {
            max: 64,
            message: t('iot-card.CardManagement.Save.5rgbgvn6ikw0'),
        },
    ],
    platformConfigId: [
        {
            required: true,
            message: t('iot-card.CardManagement.Save.5rgbgvn6gz40'),
        },
    ],
    operatorName: [
      {
        required: true,
        message: t('iot-card.CardManagement.Save.5rgbgvn6gik0'),
      },
    ],
    cardType: [
        {
            required: true,
            message: t('iot-card.CardManagement.Save.5rgbgvn6hn40'),
        },
    ],
};

const filterOption = (input: string, option: any) => {
    return (
        option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
    );
};

const platformConfigList = computed(() => {
  return platformConfigCacheList.value.filter(item => item.operatorName === modelRef.operatorName).map(item => ({ label: item.name, value: item.id }))
})

watch(
    () => props.data,
    (newValue) => {
        queryPlatformNoPage({
            paging: false,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [{ column: 'state', value: 'enabled' }],
        }).then((resp: any) => {
            if (resp.status === 200) {
              platformConfigCacheList.value = resp.result
            }
        });
        Object.assign(modelRef, newValue);
    },
    { immediate: true, deep: true },
);

const handleCancel = () => {
    emit('change', false);
    formRef.value.resetFields();
};

const handleOk = () => {
    formRef.value
        .validate()
        .then(async () => {
            btnLoading.value = true;
            const resp =
                props.type === 'add'
                    ? await add(toRaw(modelRef)).catch(err => err)
                    : await edit(toRaw(modelRef)).catch(err => err);
            btnLoading.value = false;
            if (resp.status === 200) {
                onlyMessage(t('iot-card.CardManagement.Save.5rgbgvn6irk0'))
                emit('change', true);
                formRef.value.resetFields();
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};
</script>
