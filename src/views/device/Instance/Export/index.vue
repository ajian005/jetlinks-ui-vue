<template>
    <j-modal
        :maskClosable="false"
        width="800px"
        :visible="true"
        :title="t('Instance.Export.index.5rcyax8aor40')"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <div style="background-color: rgb(236, 237, 238)">
            <p style="padding: 10px">
                <AIcon type="ExclamationCircleOutlined" />
                {{t('Instance.Export.index.5rcyax8aqdk0')}}
            </p>
        </div>
        <div style="margin-top: 20px">
            <j-form :layout="'vertical'">
                <j-form-item :label="t('Instance.Export.index.5rcyax8aqo80')">
                    <j-select
                        show-search
                        :filter-option="filterOption"
                        v-model:value="modelRef.product"
                        :placeholder="t('Instance.Export.index.5rcyax8aqxw0')"
                        allowClear
                    >
                        <j-select-option
                            :value="item.id"
                            v-for="item in productList"
                            :key="item.id"
                            :label="item.name"
                            >{{ item.name }}</j-select-option
                        >
                    </j-select>
                </j-form-item>
                <j-form-item :label="t('Instance.Export.index.5rcyax8ar780')">
                    <j-radio-group
                        button-style="solid"
                        v-model:value="modelRef.fileType"
                        :placeholder="t('Instance.Export.index.5rcyax8argw0')"
                    >
                        <j-radio-button value="xlsx">xlsx</j-radio-button>
                        <j-radio-button value="csv">csv</j-radio-button>
                    </j-radio-group>
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '@/api/device/product';
import { downloadFileByUrl } from '@/utils/utils';
import encodeQuery from '@/utils/encodeQuery';
import { deviceExport } from '@/api/device/instance';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const emit = defineEmits(['close']);
const props = defineProps({
    data: {
        type: Object,
        default: undefined,
    },
});
const modelRef = reactive({
    product: undefined,
    fileType: 'xlsx',
});

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const productList = ref<Record<string, any>[]>([]);

watch(
    () => props.data,
    () => {
        queryNoPagingPost({ paging: false }).then((resp) => {
            if (resp.status === 200) {
                productList.value = resp.result as Record<string, any>[];
            }
        });
    },
    { immediate: true, deep: true },
);

const productName = computed(() => {
    return productList.value.find(item => item.id === modelRef.product)?.name || ''
})

const handleOk = async () => {
    const params = encodeQuery(props.data);
    // downloadFile(
    //     deviceExport(modelRef.product || '', modelRef.fileType),
    //     params,
    // );
    const res: any = await deviceExport(
        modelRef.product || '',
        modelRef.fileType,
        params
    );
    if (res) {
        const blob = new Blob([res], { type: modelRef.fileType });
        const url = URL.createObjectURL(blob);
        downloadFileByUrl(url, `${productName.value ? (productName.value  + '下设备') : '设备实例'}`, modelRef.fileType);
        emit('close');
    }
};

const handleCancel = () => {
    emit('close');
};
</script>