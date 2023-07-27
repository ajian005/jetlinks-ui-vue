<template>
    <j-modal class="edit-dialog-container" width="1050px" visible :title="dialogTitle" :confirmLoading="loading"
        @ok="confirm" @cancel="emits('cancel')">
        <j-form ref="formRef" :model="form.data" layout="vertical">
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form-item name="name" :label="t('DataSource.components.EditDialog.5rg9yza8ygg0')" :rules="[
                        { required: true, message: t('DataSource.components.EditDialog.5rg9yza8zw00') },
                        { max: 64, message: t('DataSource.components.EditDialog.5rg9yza90800') },
                    ]">
                        <j-input v-model:value="form.data.name" :placeholder="t('DataSource.components.EditDialog.5rg9yza8zw00')" />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item name="typeId" :label="t('DataSource.components.EditDialog.5rg9yza90fk0')" :rules="[{ required: true, message: t('DataSource.components.EditDialog.5rg9yza90mo0') }]">
                        <j-select v-model:value="form.data.typeId" :options="form.typeOptions" :placeholder="t('DataSource.components.EditDialog.5rg9yza90mo0')"
                            :disabled="!!form.data.id" />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="form.data.typeId === 'rdb'">
                <j-col :span="24">
                    <j-form-item :name="['shareConfig', 'url']" label="URL" :rules="[
                        {
                            required: true,
                            message: t('DataSource.components.EditDialog.5rg9yza90u00'),
                            trigger: 'change',
                        },
                        { validator: checkUrl, trigger: 'blur' },
                    ]">
                        <j-input v-model:value="form.data.shareConfig.url"
                            :placeholder="t('DataSource.components.EditDialog.joinAddress')" />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="form.data.typeId === 'rabbitmq'">
                <j-col :span="24">
                    <j-form-item :name="['shareConfig', 'adminUrl']" :label="t('DataSource.components.EditDialog.5rg9yza90zg0')" :rules="[
                        { required: true, message: t('DataSource.components.EditDialog.5rg9yza915k0') },
                        { validator: validateAdminUrl },
                    ]">
                        <j-input v-model:value="form.data.shareConfig.adminUrl"
                            :placeholder="t('DataSource.components.EditDialog.manageAddress')" />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="form.data.typeId === 'rabbitmq'">
                <j-col :span="24">
                    <j-form-item :name="['shareConfig', 'addresses']" :label="t('DataSource.components.EditDialog.5rg9yza91bw0')" :rules="[
                        { required: true, message: t('DataSource.components.EditDialog.5rg9yza91ho0') },
                        { validator: validateAddress },
                    ]">
                        <j-input v-model:value="form.data.shareConfig.addresses" :placeholder="t('DataSource.components.EditDialog.linkAddress')" />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-show="form.data.typeId">
                <j-col :span="12">
                    <j-form-item :name="['shareConfig', 'username']" :label="t('DataSource.components.EditDialog.5rg9yza91ms0')" :rules="[
                        { required: true, message: t('DataSource.components.EditDialog.5rg9yza91vo0') },
                        {
                            max: 64,
                            message: t('DataSource.components.EditDialog.5rg9yza90800'),
                        },
                    ]">
                        <j-input v-model:value="form.data.shareConfig.username" :placeholder="t('DataSource.components.EditDialog.5rg9yza91vo0')" />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item :name="['shareConfig', 'password']" :label="t('DataSource.components.EditDialog.5rg9yza921c0')" :rules="[
                        { required: true, message: t('DataSource.components.EditDialog.5rg9yza926w0') },
                        {
                            max: 64,
                            message: t('DataSource.components.EditDialog.5rg9yza90800'),
                        },
                    ]">
                        <j-input-password v-model:value="form.data.shareConfig.password" :placeholder="t('DataSource.components.EditDialog.5rg9yza926w0')" />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="form.data.typeId === 'rabbitmq'">
                <j-col :span="24">
                    <j-form-item :name="['shareConfig', 'virtualHost']" :label="t('DataSource.components.EditDialog.5rg9yza92c40')" :rules="[
                        { required: true, message: t('DataSource.components.EditDialog.5rg9yza92hg0') },
                        {
                            max: 64,
                            message: t('DataSource.components.EditDialog.5rg9yza90800'),
                        },
                    ]">
                        <j-input v-model:value="form.data.shareConfig.virtualHost" :placeholder="t('DataSource.components.EditDialog.5rg9yza92hg0')" />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24" v-if="form.data.typeId === 'rdb'">
                <j-col :span="24">
                    <j-form-item :name="['shareConfig', 'schema']" label="schema" :rules="[
                        { required: true, message: t('DataSource.components.EditDialog.5rg9yza92n40') },
                        {
                            max: 64,
                            message: t('DataSource.components.EditDialog.5rg9yza90800'),
                        },
                    ]">
                        <j-input v-model:value="form.data.shareConfig.schema" :placeholder="t('DataSource.components.EditDialog.5rg9yza92n40')" />
                    </j-form-item>
                </j-col>
            </j-row>
            <j-row :gutter="24">
                <j-col :span="24">
                    <j-form-item name="description" :label="t('DataSource.components.EditDialog.5rg9yza92tc0')">
                        <j-textarea v-model:value="form.data.description" :placeholder="t('DataSource.components.EditDialog.5rg9yza92z00')" :rows="3" showCount
                            :maxlength="200" />
                    </j-form-item>
                </j-col>
            </j-row>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import {
    getDataTypeDict_api,
    saveDataSource_api,
} from '@/api/system/dataSource';
import { FormInstance } from 'ant-design-vue';
import { Rule } from 'ant-design-vue/lib/form';
import type { dictItemType, optionItemType, sourceItemType } from '../typing';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emits = defineEmits(['confirm', 'cancel']);
const props = defineProps<{
    data: sourceItemType;
}>();
// 弹窗相关
const dialogTitle = computed(() =>
    props.data.id ? t('DataSource.components.EditDialog.5rg9yza93500') : t('DataSource.components.EditDialog.5rg9yza93ds0'),
);
const loading = ref(false);

const checkUrl = (_rule: Rule, value: string): Promise<any> => {
    if (!value) return Promise.resolve();
    const arr = value.split(':');
    if (arr?.[0] === 'jdbc' || arr?.[0] === 'r2dbc') {
        return Promise.resolve();
    } else {
        return Promise.reject(t('DataSource.components.EditDialog.5rg9yza93l80'));
    }
};

/**
 * 管理地址校验
 */
const validateAdminUrl = (_rule: Rule, value: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!value) {
            resolve('');
        } else {
            const arr = value.split('://');
            if (arr[0] === 'http' || arr[0] === 'https') {
                resolve('');
            } else {
                reject(t('DataSource.components.EditDialog.5rg9yza93rw0'));
            }
        }
    });
};
/**
 * 链接地址校验
 * @param _rule
 * @param value
 */
const validateAddress = (_rule: Rule, value: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (!value) {
            resolve('');
        } else {
            const reg =
                /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
            if (reg.test(value)) {
                resolve('');
            } else {
                reject(t('DataSource.components.EditDialog.5rg9yza93wk0'));
            }
        }
    });
};

const getTypeOption = () => {
    getDataTypeDict_api().then((resp: any) => {
        const result = resp.result as dictItemType[];
        const options:any = []
         result.forEach((item) => {
            if(item.name !== 'redis'){
                options.push({
                label: item.name,
                value: item.id,
                })
            }
        });
        form.typeOptions =  options
    });
};

const formRef = ref<FormInstance>();
const form = reactive({
    data: {
        ...props.data,
    } as sourceItemType,
    typeOptions: [] as optionItemType[],
});

watch(
    () => props.data,
    (newValue) => {
        form.data = { ...newValue, shareConfig: { ...newValue?.shareConfig } };
    },
    {
        immediate: true,
        deep: true,
    },
);

onMounted(() => {
    getTypeOption();
});

const confirm = () => {
    loading.value = true;
    formRef.value
        ?.validate()
        .then(async (_data: any) => {
            const resp = await saveDataSource_api({ ...props.data, ..._data });
            if (resp.status === 200) {
                onlyMessage(t('DataSource.components.EditDialog.5rg9yza941g0'));
                emits('confirm');
                formRef.value?.resetFields();
            }
        })
        .finally(() => {
            loading.value = false;
        });
};
</script>
