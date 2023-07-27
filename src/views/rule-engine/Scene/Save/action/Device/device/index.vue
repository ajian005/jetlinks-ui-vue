<template>
    <div>
        <j-form :layout="'vertical'" ref="formRef" :model="modelRef">
            <j-form-item
                name="selector"
                :label="t('Device.device.index.5rg4p6h78aw0')"
                v-show="!(list.length === 1)"
                :rules="[{ required: true, message: t('Device.device.index.5rg4p6h7b200') }]"
            >
                <TopCard
                    :typeList="list"
                    v-model:value="modelRef.selector"
                    @change="onSelectorChange"
                />
            </j-form-item>
            <Device
                v-if="modelRef.selector === 'fixed'"
                :productId="productDetail.id"
                v-model:value="modelRef.selectorValues"
                @change="onDeviceChange"
            />
            <j-form-item
                v-else-if="modelRef.selector === 'relation'"
                :label="t('Device.device.index.5rg4p6h7bko0')"
                name="selectorValues"
                :rules="[{ required: true, message: t('Device.device.index.5rg4p6h7buc0') }]"
            >
                <RelationSelect
                    @change="onRelationChange"
                    v-model:value="modelRef.selectorValues"
                />
            </j-form-item>
            <j-form-item
                v-else-if="modelRef.selector === 'tag' && isTags"
                name="selectorValues"
                :rules="[{ required: true, message: t('Device.device.index.5rg4p6h7c440') }]"
            >
                <Tag
                    v-model:value="modelRef.selectorValues"
                    :tagData="tagList"
                    @change="onTagChange"
                />
            </j-form-item>
            <j-form-item
                v-else
                name="upperKey"
                :label="t('Device.device.index.5rg4p6h7cjk0')"
                :rules="[{ required: true, message: t('Device.device.index.5rg4p6h7cqc0') }]"
            >
                <j-tree-select
                    style="width: 100%; height: 100%"
                    :tree-data="builtInList"
                    v-model:value="modelRef.upperKey"
                    :placeholder="t('Device.device.index.5rg4p6h7cyk0')"
                    @select="onVariableChange"
                    :fieldNames="{ label: 'name', value: 'id' }"
                >
                    <template #title="{ name, description }">
                        <j-space>
                            {{ name }}
                            <span style="color: grey; margin-left: 5px">{{
                                description
                            }}</span>
                        </j-space>
                    </template>
                </j-tree-select>
            </j-form-item>
        </j-form>
    </div>
</template>

<script setup lang='ts' name="Device">
import { useSceneStore } from '@/store/scene';
import TopCard from './TopCard.vue';
import { storeToRefs } from 'pinia';
import { getImage, onlyMessage } from '@/utils/comm';
import NoticeApi from '@/api/notice/config';
import Device from './Device.vue';
import Tag from './Tag.vue';
import RelationSelect from './RelationSelect.vue';
import { getParams } from '../../../util';
import { handleParamsData } from '../../../components/Terms/util';
import _ from 'lodash';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
    values: {
        type: Object,
        default: () => {},
    },
    name: {
        type: Number,
        default: 0,
    },
    thenName: {
        type: Number,
        default: 0,
    },
    branchesName: {
        type: Number,
        default: 0,
    },
    parallel: {
        type: Boolean,
    },
    productDetail: {
        type: Object,
        default: () => {},
    },
});

// 首次操作标签数据option回显问题
const isTags = computed(() => {
    return _.map(list.value, 'value').includes('tag');
});

// save保存deviceDetail
const emits = defineEmits(['save', 'cancel']);

const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);

const formRef = ref();

const modelRef = reactive({
    selector: 'fixed',
    selectorValues: undefined,
    deviceId: '',
    source: '',
    upperKey: '',
});

const list = ref<any[]>([]);
const builtInList = ref<any[]>([]);
const tagList = ref<any[]>([]);

const TypeList = [
    {
        label: t('Device.device.index.5rg4p6h7d640'),
        value: 'fixed',
        image: getImage('/scene/device-custom.png'),
        tip: t('Device.device.index.5rg4p6h7dds0'),
    },
    {
        label: t('Device.device.index.5rg4p6h7f5c0'),
        value: 'relation',
        image: getImage('/scene/device-relation.png'),
        tip: t('Device.device.index.5rg4p6h7iqg0'),
    },
    {
        label: t('Device.device.index.5rg4p6h7j8w0'),
        value: 'tag',
        image: getImage('/scene/device-tag.png'),
        tip: t('Device.device.index.5rg4p6h7jiw0'),
    },
    {
        label: t('Device.device.index.5rg4p6h7jv40'),
        value: 'context',
        image: getImage('/scene/device-variable.png'),
        tip: t('Device.device.index.5rg4p6h7k3w0'),
    },
];

const filterTree = (nodes: any[]) => {
    if (!nodes?.length) {
        return nodes;
    }
    const arr = nodes.filter((it) => {
        if (
            it.children.find(
                (item: any) =>
                    item?.id?.indexOf(
                        'deviceId' || 'device_id' || 'device_Id',
                    ) > -1,
            ) &&
            !it.children.find((item: any) => item?.id.indexOf('boolean') > -1)
        ) {
            return true;
        }
        return false;
    });
    return arr.map((item) => {
        if (item.children) {
        }
        return {
            ...item,
            title: item.name,
            value: item.id,
            disabled: !!item.children,
        };
    });
};

const sourceChangeEvent = async () => {
    const _params = {
        branch: props.thenName,
        branchGroup: props.branchesName,
        action: props.name - 1,
    };
    //判断相同产品才有按变量
    const productId =
        data.value?.branches?.[props.branchesName].then?.[props.thenName]
            ?.actions?.[props.name > 0 ? props.name - 1 : 0]?.device?.productId;
    if (productId === props?.productDetail?.id) {
        const _data = await getParams(_params, unref(data));
        builtInList.value = handleParamsData(filterTree(_data), 'id');
    } else {
        builtInList.value = [];
    }
};

const filterType = async (newVal: any) => {
    const _list = TypeList.filter((item) => item.value === 'fixed');
    if (unref(data)?.trigger?.type === 'device') {
        //关系
        const res = await NoticeApi.getRelationUsers({
            paging: false,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                { termType: 'eq', column: 'objectTypeName', value: t('Device.device.index.5rg4p6h7kb00') },
            ],
        });
        if (res.status === 200 && res.result.length !== 0) {
            const array = TypeList.filter((item) => item.value === 'relation');
            _list.push(...array);
        }
        //标签
        const tag = JSON.parse(newVal?.metadata || '{}')?.tags;
        if (tag && tag.length !== 0) {
            tagList.value = tag || [];
            const array = TypeList.filter((item) => item.value === 'tag');
            _list.push(...array);
        }
        //变量
        if (
            builtInList.value.length !== 0 &&
            !props.parallel &&
            props.name !== 0
        ) {
            const array = TypeList.filter((item) => item.value === 'context');
            _list.push(...array);
        }
        list.value = _list;
    } else {
        if (
            builtInList.value.length !== 0 &&
            !props.parallel &&
            props.name !== 0
        ) {
            const array = TypeList.filter((item) => item.value === 'context');
            _list.push(...array);
        }
        list.value = _list;
    }
};

const onSelectorChange = (val: string) => {
    modelRef.selectorValues = undefined;
    modelRef.selector = val;
};

/**
 * 切换设备
 * @param _detail
 */
const onDeviceChange = (_detail: any) => {
    if (_detail) {
        if (_detail.id) {
            modelRef.deviceId = _detail?.id;
            modelRef.selectorValues = [
                { value: _detail.id, name: _detail.name },
            ] as any;
        } else {
            modelRef.deviceId = '';
            modelRef.selectorValues = [] as any;
        }
        modelRef.upperKey = ''
        emits('save', unref(modelRef), { name: _detail.name });
    }
};

/**
 * 变量选择
 * @param val
 * @param options
 */
const onRelationChange = (val: any, options: any) => {
    modelRef.deviceId = 'deviceId';
    modelRef.source = 'upper';
    modelRef.selectorValues = val;
    modelRef.upperKey = 'scene.deviceId';
    emits('save', unref(modelRef), { relationName: options.label });
};

/**
 *
 * @param val
 * @param arr
 */
const onTagChange = (val: any[], arr: any[]) => {
    if (val) {
        modelRef.deviceId = 'deviceId';
        modelRef.source = 'fixed';
    }
    const tagName = arr.map((i, _index) => {
        const _type =
            _index !== 0 && _index !== (arr || []).length && i.type
                ? i.type === 'and'
                    ? t('Device.device.index.5rg4p6h7ki00')
                    : t('Device.device.index.5rg4p6h7koc0')
                : '';
        return `${_type}${i.name}为${i.value}`;
    });
    emits('save', unref(modelRef), { tagName: tagName.join('') });
};

const onVariableChange = (val: any, node: any) => {
    modelRef.deviceId = val;
    modelRef.source = 'upper';
    modelRef.upperKey = val;
    modelRef.selectorValues = undefined // [{ value: val, name: node.description }] as any;
    emits('save', unref(modelRef), { name: node.description });
};

watch(
    () => props.values,
    (newVal) => {
        Object.assign(modelRef, newVal);
    },
    {
        immediate: true,
        deep: true,
    },
);

watch(
    () => props.productDetail,
    async (newVal) => {
        await sourceChangeEvent();
        if (newVal?.id) {
            filterType(newVal);
        }
    },
    {
        immediate: true,
        deep: true,
    },
);

watch(
    () => [props.values, builtInList.value],
    ([newVal1, newVal2]) => {
        if (newVal2 && newVal2.length) {
            const param = newVal1?.selectorValues?.[0]?.value;
            const isVariable = (newVal2 || [])?.find((item: any) => {
                return item.children.find((i: any) => i.id === param);
            });
            if (isVariable) {
                modelRef.selector = 'context';
            }
        }
    },
    {
        immediate: true,
        deep: true,
    },
);

const onFormSave = () => {
    return new Promise((resolve, reject) => {
        formRef.value
            .validate()
            .then(async (_data: any) => {
                if (modelRef.selector === 'fixed') {
                    if (!modelRef?.selectorValues?.[0]?.value) {
                        onlyMessage(t('Device.device.index.5rg4p6h7kvc0'), 'error');
                        reject(false);
                    } else {
                        resolve({
                            ..._data,
                            selectorValues: modelRef.selectorValues,
                        });
                    }
                } else {
                    resolve({..._data});
                }
            })
            .catch((err: any) => {
                reject(err);
            });
    });
};

defineExpose({ onFormSave });
</script>

<style scoped lang='less'>
</style>