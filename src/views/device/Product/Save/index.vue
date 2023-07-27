<!-- 新增、编辑产品 -->
<template>
    <j-modal
        :title="props.title"
        :maskClosable="false"
        destroy-on-close
        v-model:visible="visible"
        @ok="submitData"
        @cancel="close"
        :okText="t('Product.Save.index.5rcy1r9vifk0')"
        :cancelText="t('Product.Save.index.5rcy1r9vjqc0')"
        width="650px"
        :confirmLoading="loading"
    >
        <div style="margin-top: 10px">
            <j-form
                layout="vertical"
                :model="form"
                :rules="rules"
                ref="formRef"
            >
                <j-row type="flex">
                    <j-col flex="180px">
                        <j-form-item name="photoUrl">
                            <j-pro-upload
                                v-model="form.photoUrl"
                                :accept="
                                    imageTypes && imageTypes.length
                                        ? imageTypes.toString()
                                        : ''
                                "
                            />
                        </j-form-item>
                    </j-col>
                    <j-col flex="auto">
                        <j-form-item name="id">
                            <template #label>
                                <span>ID</span>
                                <j-tooltip
                                    :title="t('Product.Save.index.5rcy1r9vk3o0')"
                                >
                                    <AIcon
                                        type="QuestionCircleOutlined"
                                        style="margin-left: 2px"
                                    />
                                </j-tooltip>
                            </template>
                            <j-input
                                v-model:value="form.id"
                                :placeholder="t('Product.Save.index.5rcy1r9vkdg0')"
                                :disabled="idDisabled"
                            />
                        </j-form-item>
                        <j-form-item :label="t('Product.Save.index.5rcy1r9vkpc0')" name="name">
                            <j-input
                                v-model:value="form.name"
                                :placeholder="t('Product.Save.index.5rcy1r9vl4o0')"
                            />
                        </j-form-item>
                    </j-col>
                </j-row>
                <j-form-item :label="t('Product.Save.index.5rcy1r9vldk0')" name="classifiedId">
                    <j-tree-select
                        showSearch
                        v-model:value="form.classifiedId"
                        :placeholder="t('Product.Save.index.5rcy1r9vlmg0')"
                        :tree-data="treeList"
                        @change="valueChange"
                        allow-clear
                        :fieldNames="{
                            label: 'name',
                            value: 'id',
                            children: 'children',
                        }"
                        :filterTreeNode="
                            (v, option) => filterSelectNode(v, option, 'name')
                        "
                    >
                        <template> </template>
                    </j-tree-select>
                </j-form-item>
                <j-form-item :label="t('Product.Save.index.5rcy1r9vlw40')" name="deviceType">
                    <j-card-select
                        :value="form.deviceType"
                        :options="deviceList"
                        @change="changeDeviceType"
                        :disabled="productStore.detail?.accessId ? true : false"
                    >
                        <template #title="item">
                            <span>{{ item.title }}</span>
                            <a-tooltip :title="item.option.tooltip"
                                ><AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </a-tooltip>
                        </template>
                    </j-card-select>
                </j-form-item>
                <j-form-item :label="t('Product.Save.index.5rcy1r9vm5g0')" name="description">
                    <j-textarea
                        :maxlength="200"
                        showCount
                        :auto-size="{ minRows: 4, maxRows: 5 }"
                        v-model:value="form.describe"
                        :placeholder="t('Product.Save.index.5rcy1r9vme80')"
                    />
                </j-form-item>
            </j-form>
        </div>
    </j-modal>
    <DialogTips ref="dialogRef" />
</template>

<script lang="ts" setup>
import { category } from '@/api/device/product';
import { Form } from 'jetlinks-ui-components';
import { getImage } from '@/utils/comm.ts';
import DialogTips from '../DialogTips/index.vue';
import { useProductStore } from '@/store/product';
import { filterSelectNode, onlyMessage } from '@/utils/comm';
import { isInput } from '@/utils/regular';
import type { Rule } from 'ant-design-vue/es/form';
import { queryProductId, addProduct, editProduct } from '@/api/device/product';
import encodeQuery from '@/utils/encodeQuery';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const productStore = useProductStore();
const emit = defineEmits(['success']);

const props = defineProps({
    title: {
        type: String,
        defult: '',
    },
    isAdd: {
        type: Number,
        default: 0,
    },
});
const loading = ref<boolean>(false);
const dialogRef = ref();
const treeList = ref<Record<string, any>[]>([]);
const visible = ref<boolean>(false);
const formRef = ref();
const idDisabled = ref<boolean>(false);
const useForm = Form.useForm;
const photoValue = ref('/images/device-product.png');
const imageTypes = reactive([
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/jfif',
    'image/pjp',
    'image/pjpeg',
]);
const deviceList = ref([
    {
        label: t('Product.Save.index.5rcy1r9vmng0'),
        value: 'device',
        iconUrl: getImage('/device-type-1.png'),
        tooltip: t('Product.Save.index.5rcy1r9vmvw0'),
    },
    {
        label: t('Product.Save.index.5rcy1r9vn5c0'),
        value: 'childrenDevice',
        iconUrl: getImage('/device-type-2.png'),
        tooltip: t('Product.Save.index.5rcy1r9vnj80'),
    },
    {
        label: t('Product.Save.index.5rcy1r9vnro0'),
        value: 'gateway',
        iconUrl: getImage('/device/device-type-3.png'),
        tooltip: t('Product.Save.index.5rcy1r9vo0o0'),
    },
]);

const form = reactive({
    id: undefined,
    name: '',
    classifiedId: undefined,
    classifiedName: '',
    deviceType: '',
    describe: undefined,
    photoUrl: getImage('/device/instance/device-card.png'),
});
/**
 * 校验id
 */
const validateInput = async (_rule: Rule, value: string) => {
    if (value) {
        console.log(value.split('').length);
        if (!isInput(value)) {
            return Promise.reject(t('Product.Save.index.5rcy1r9vo9s0'));
        } else {
            if (props.isAdd === 1) {
                const res = await queryProductId(value);
                if (res.status === 200 && res.result) {
                    return Promise.reject(t('Product.Save.index.IDRepeat'));
                } else {
                    return Promise.resolve();
                }
            }
        }
    } else {
        return Promise.resolve();
    }
};
/**
 * 校验是否选择设备类型
 */
const validateDeviceType = async (_rule: Rule, value: string) => {
    if (!value) {
        return Promise.reject(t('Product.Save.index.5rcy1r9voig0'));
    } else {
        return Promise.resolve();
    }
};
const rules = reactive({
    id: [
        { validator: validateInput, trigger: 'blur' },
        { max: 64, message: t('Product.Save.index.5rcy1r9vosc0'), trigger: 'change' },
    ],
    name: [
        { required: true, message: t('Product.Save.index.5rcy1r9vl4o0'), trigger: 'blur' },
        { max: 64, message: t('Product.Save.index.5rcy1r9vosc0'), trigger: 'change' },
    ],
    deviceType: [
        {
            required: true,
            validator: validateDeviceType,
            trigger: 'blur',
        },
    ],
    description: [
        { max: 200, message: t('Product.Save.index.5rcy1r9vp3s0'), trigger: 'blur' },
    ],
});

const valueChange = (value: string, label: string) => {
    form.classifiedName = label[0];
};
/**
 * 查询产品分类
 */
const queryProductTree = async () => {
    category(encodeQuery({ sorts: { sortIndex: 'asc' } })).then((resp) => {
        if (resp.status === 200) {
            treeList.value = resp.result;
            treeList.value = dealProductTree(treeList.value);
        }
    });
};
/**
 * 处理产品分类key
 */
const dealProductTree = (arr: any) => {
    return arr.map((element: any) => {
        element.key = element.id;
        if (element.children) {
            element.children = dealProductTree(element.children);
        }
        return element;
    });
};
/**
 * 显示弹窗
 */
const show = (data: any) => {
    if (props.isAdd === 2) {
        productStore.refresh(data.id);
        form.name = data.name;
        form.classifiedId = data.classifiedId;
        form.classifiedName = data.classifiedName;
        form.photoUrl = data.photoUrl || photoValue.value;
        form.deviceType = data.deviceType.value;
        form.describe = data.describe;
        form.id = data.id;
        idDisabled.value = true;
    } else if (props.isAdd === 1) {
        productStore.reSet();
        form.name = '';
        form.classifiedId = undefined;
        form.classifiedName = '';
        form.photoUrl = getImage('/device/instance/device-card.png');
        form.deviceType = '';
        form.describe = undefined;
        form.id = undefined;
        idDisabled.value = false;
    }
    visible.value = true;
};

/**
 * 关闭弹窗
 */
const close = () => {
    visible.value = false;
};
const { resetFields, validate, validateInfos, clearValidate } = useForm(
    form,
    rules,
);
/**
 * 提交表单数据
 */
const submitData = () => {
    formRef.value
        .validate()
        .then(async () => {
            // 新增
          loading.value = true
            if (props.isAdd === 1) {
                if (form.id === '') {
                    form.id = undefined;
                }
                const res = await addProduct(form);
                loading.value = false
                if (res.status === 200) {
                    onlyMessage(t('Product.Save.index.5rcy1r9vpb40'));
                    visible.value = false;
                    emit('success');
                    dialogRef.value.show(res.result.id);
                } else {
                    onlyMessage(t('Product.Save.index.5rcy1r9vpnc0'), 'error');
                }
            } else if (props.isAdd === 2) {
                // 编辑
                form.classifiedId
                    ? form.classifiedId
                    : (form.classifiedId = ''); // 产品分类不选传空字符串
                form.classifiedName
                    ? form.classifiedName
                    : (form.classifiedName = '');
                const res = await editProduct(form).finally(() => {
                  loading.value = false
                });
                if (res.status === 200) {
                    onlyMessage(t('Product.Save.index.5rcy1r9vpb40'));
                    emit('success');
                    visible.value = false;
                } else {
                    onlyMessage(t('Product.Save.index.5rcy1r9vpnc0'), 'error');
                }
            }
        })
        .catch((err: any) => {});
};
/**
 * 初始化
 */
queryProductTree();

const changeDeviceType = (value: Array<string>) => {
    form.deviceType = value[0];
};
defineExpose({
    show: show,
});
</script>
<style scoped lang="less">
.card-style {
    position: relative;
    top: 19px;
}
.upload-image-warp-logo {
    display: flex;
    justify-content: flex-start;
    .upload-image-border-logo {
        position: relative;
        overflow: hidden;
        border: 1px dashed #d9d9d9;
        transition: all 0.3s;
        width: 160px;
        height: 150px;
        &:hover {
            border: 1px dashed #1890ff;
            display: flex;
        }
        .upload-image-content-logo {
            align-items: center;
            justify-content: center;
            position: relative;
            display: flex;
            flex-direction: column;
            width: 160px;
            height: 150px;
            padding: 8px;
            background-color: rgba(0, 0, 0, 0.06);
            cursor: pointer;
            .loading-logo {
                position: absolute;
                top: 50%;
            }
            .loading-icon {
                position: absolute;
            }
            .upload-image {
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                background-position: 50%;
                background-size: cover;
            }
            .upload-image-icon {
                width: 100%;
                height: 100%;
                background-repeat: no-repeat;
                background-position: 50%;
                background-size: inherit;
            }
            .upload-image-mask {
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 0;
                left: 0;
                display: none;
                width: 100%;
                height: 100%;
                color: #fff;
                font-size: 16px;
                background-color: rgba(0, 0, 0, 0.35);
            }
            &:hover .upload-image-mask {
                display: flex;
            }
        }
    }
}
.button-style {
    background-color: #fff;
    height: 66px;
    overflow: hidden;
    .card-content {
        width: 100%;
        .img-style {
            position: relative;
            top: 16px;
        }
        .checked-icon {
            position: absolute;
            right: -22px;
            bottom: -22px;
            z-index: 2;

            width: 44px;
            height: 44px;
            color: #fff;
            background-color: @primary-color-active;
            transform: rotate(-45deg);

            > div {
                position: relative;
                height: 100%;
                transform: rotate(45deg);

                > span {
                    position: absolute;
                    top: 6px;
                    left: 6px;
                    font-size: 12px;
                }
            }
        }
        &.checked {
            position: relative;
            color: @primary-color-active;
            border-color: @primary-color-active;

            > .checked-icon {
                display: block;
            }
        }
    }
}
</style>
