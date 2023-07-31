<template>
    <div class="file">
        <j-form layout="vertical">
            <j-form-item>
                <template #label>
                    <div>
                        {{t('Instance.Import.file.5rcy9hmpxjo0')}}
                        <div class="alert"><AIcon style="margin-right: 5px;" type="InfoCircleOutlined" />{{t('Instance.Import.file.5seygezqqe80')}}</div>
                    </div>
                </template>
                
                <a-upload-dragger
                    v-model:fileList="modelRef.upload"
                    name="file"
                    :action="FILE_UPLOAD"
                    :headers="{
                        'X-Access-Token': LocalStore.get(TOKEN_KEY),
                    }"
                    :maxCount="1"
                    :showUploadList="false"
                    @change="uploadChange"
                    :accept="'.xlsx,.csv'"
                    :before-upload="beforeUpload"
                    :disabled="disabled"
                    @drop="handleDrop"
                >
                    <div class="dragger-box">
                        <AIcon class="icon" type="PlusCircleFilled" />
                        <span style="margin: 16px 0 8px 0">{{t('Instance.Import.file.5seygezqr2s0')}}</span>
                        <span>{{t('Instance.Import.file.5seygezqr8g0')}} .csv</span>
                    </div>
                </a-upload-dragger>
            </j-form-item>
            <div style="margin-bottom: 16px">
                <j-checkbox v-model:checked="modelRef.file.autoDeploy"
                    >{{t('Instance.Import.file.5seygezqrc80')}}</j-checkbox
                >
            </div>
            <div v-if="importLoading" class="result">
                <div v-if="flag">
                    <j-spin size="small" style="margin-right: 10px" />{{t('Instance.Import.file.5seyh9eo8i80')}}
                </div>
                <div v-else>
                    <AIcon
                        style="
                            color: #08e21e;
                            margin-right: 10px;
                            font-size: 16px;
                        "
                        type="CheckCircleOutlined"
                    />{{t('Instance.Import.file.5seyhfnl90k0')}}
                </div>
                <div>{{t('Instance.Import.file.5seygezqrg40',{count:count})}}</div>
                <div>
                    {{t('Instance.Import.file.5seygezqrkk0')}}<span style="color: #ff595e">{{ errCount }}</span>
                    {{t('Instance.Import.file.5seygezqrg40')}}<a
                        v-if="errMessage && !flag && errCount > 0"
                        style="margin-left: 20px"
                        @click="downError"
                        >{{t('Instance.Import.file.5seygezqro00')}}</a
                    >
                </div>
            </div>
            <j-form-item :label="t('Instance.Import.file.5rcy9hmpy480')">
                <div class="file-download">
                    <j-button class="btn" @click="downFile('xlsx')">{{t('Instance.Import.file.5seygezqrrk0')}}</j-button>
                    <j-button class="btn" @click="downFile('csv')">{{t('Instance.Import.file.5seygezqrvg0')}}</j-button>
                </div>
            </j-form-item>
        </j-form>
    </div>
</template>

<script setup lang='ts' name='DeviceImportFile'>
import { FILE_UPLOAD } from '@/api/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { LocalStore, onlyMessage } from '@/utils/comm';
import { downloadFileByUrl } from '@/utils/utils';
import { deviceImport, templateDownload } from '@/api/device/instance';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    product: {
        type: String,
        default: undefined,
    },
});

const modelRef = reactive({
    product: props.product,
    upload: [],
    file: {
        fileType: 'xlsx',
        autoDeploy: false,
    },
});

const importLoading = ref<boolean>(false);
const flag = ref<boolean>(false);
const count = ref<number>(0);
const errCount = ref<number>(0);

const errMessage = ref<string>('');
const disabled = ref(false);

const downFile = async (type: string) => {
    const res: any = await templateDownload(props.product!, type);
    if (res) {
        const blob = new Blob([res], { type: type });
        const url = URL.createObjectURL(blob);
        downloadFileByUrl(url, `设备导入模板`, type);
    }
};

const beforeUpload = (_file: any) => {
    // const fileType = modelRef.file?.fileType === 'csv' ? 'csv' : 'xlsx';
    const isCsv = _file.type === 'text/csv';
    const isXlsx =
        _file.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    if (!isCsv && !isXlsx) {
        onlyMessage(t('Instance.Import.file.5seygezqryo0'), 'warning');
    }
    // if (!isXlsx) {
    //     onlyMessage('请上传.xlsx格式文件', 'warning');
    // }
    // return  (isCsv && fileType !== 'xlsx') || (isXlsx && fileType !== 'csv');
    return  isCsv || isXlsx;
};

const handleDrop = () => {};

const downError = () => {
    window.open(errMessage.value);
};

const submitData = async (fileUrl: string) => {
    if (!!fileUrl) {
        count.value = 0;
        errCount.value = 0;
        const autoDeploy = !!modelRef?.file?.autoDeploy || false;
        importLoading.value = true;
        let dt = 0;
        let et = 0;
        const source = new EventSourcePolyfill(
            deviceImport(props.product!, fileUrl, autoDeploy),
        );
        source.onmessage = (e: any) => {
            const res = JSON.parse(e.data);
            if (res.success) {
                const temp = res.result.total;
                dt += temp;
                count.value = dt;
            } else {
                if (res.detailFile) {
                    errMessage.value = res.detailFile;
                } else {
                    et += 1;
                    errCount.value = et;
                }
            }
            disabled.value = false;
        };
        source.onerror = (e: { status: number }) => {
            if (e.status === 403) errMessage.value = t('Instance.Import.file.5rcy9hmpzsg0');
            flag.value = false;
            disabled.value = false;
            source.close();
        };
        source.onopen = () => {};
    } else {
        onlyMessage(t('Instance.Import.file.5rcy9hmq07s0'), 'error');
    }
};

const uploadChange = async (info: Record<string, any>) => {
    disabled.value = true;
    if (info.file.status === 'done') {
        const resp: any = info.file.response || { result: '' };
        await submitData(resp?.result || '');
    }else{
        disabled.value = false;
    }
};
</script>

<style scoped lang='less'>
.file {
    .file-type-label {
        display: flex;
        gap: 16px;
        align-items: center;

        .file-type-radio {
            display: flex;
            flex-grow: 1;

            :deep(.ant-radio-button-wrapper) {
                width: 50%;
            }
        }
    }

    .file-download {
        display: flex;
        gap: 16px;
        .btn {
            border: none;
            background-color: #ECECF0;
            width: 152px;
            color: #666666;
        }
    }

    .dragger-box {
        margin: 46px 0;
        display: flex;
        flex-direction: column;
        color: #666666;

        .icon {
            font-size: 30px; 
            color: @primary-color;
        }
    }

    .result {
        div {
            margin: 5px 0;
            color: #605e5c;
        }
    }

    .alert {
        height: 40px;
        width: 100%;
        padding: 0 20px 0 10px;
        color: rgba(0, 0, 0, 0.55);
        line-height: 40px;
        background-color: #f6f6f6;
    }

    :deep(.ant-form-item) {
        .ant-upload.ant-upload-drag {
            background: #F8F9FC;
            border: 1px dashed rgba(212, 219, 243, 0.7);
        }
    }
}
</style>