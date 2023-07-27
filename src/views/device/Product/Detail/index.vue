<template>
    <page-container
        :tabList="list"
        :tabActiveKey="productStore.tabActiveKey"
        @tabChange="onTabChange"
        showBack="true"
    >
        <template #title>
            <div>
                <div style="display: flex; align-items: center">
                    <a-tooltip>
                        <template #title>{{
                            productStore.current.name
                        }}</template>
                        <div class="productDetailHead">
                            {{ productStore.current.name }}
                        </div>
                    </a-tooltip>
                    <div style="margin: -5px 0 0 20px">
                        <j-popconfirm
                            :title="t('Product.Detail.index.5rcy2a8o53o0')"
                            @confirm="handleUndeploy"
                            v-if="productStore.current.state === 1"
                            :okText="t('Product.Detail.index.5rcy2a8o6o40')"
                            :cancelText="t('Product.Detail.index.5rcy2a8o70k0')"
                        >
                            <j-switch
                                :checked="productStore.current.state === 1"
                                :checked-children="t('Product.Detail.index.5rcy2a8o79w0')"
                                :un-checked-children="t('Product.Detail.index.5rcy2a8o7i80')"
                            />
                        </j-popconfirm>
                        <j-popconfirm
                            :title="t('Product.Detail.index.5rcy2a8o87k0')"
                            @confirm="handleDeploy"
                            v-if="productStore.current.state === 0"
                            :okText="t('Product.Detail.index.5rcy2a8o6o40')"
                            :cancelText="t('Product.Detail.index.5rcy2a8o70k0')"
                        >
                            <j-switch
                                :unCheckedValue="
                                    productStore.current.state === 0
                                "
                                :checked-children="t('Product.Detail.index.5rcy2a8o79w0')"
                                :un-checked-children="t('Product.Detail.index.5rcy2a8o7i80')"
                            />
                        </j-popconfirm>
                    </div>
                </div>
            </div>
        </template>
        <template #content>
            <div style="padding-top: 10px">
                <j-descriptions size="small" :column="4">
                    <j-descriptions-item
                        :label="t('Product.Detail.index.5rcy2a8o8gk0')"
                        :labelStyle="{
                            fontSize: '14px',
                            opacity: 0.55,
                        }"
                        :contentStyle="{
                            fontSize: '14px',
                            color: '#092EE7',
                            cursor: 'pointer',
                        }"
                        ><span @click="jumpDevice">{{
                            productStore.current?.count
                                ? productStore.current?.count
                                : 0
                        }}</span></j-descriptions-item
                    >
                </j-descriptions>
            </div>
        </template>
        <template #extra>
            <PermissionButton
                type="primary"
                :popConfirm="{
                    title:t('Product.Detail.index.tip'),
                    placement: 'bottomRight',
                    onConfirm: handleDeploy,
                }"
                :disabled="productStore.current?.state === 0"
                :tooltip="
                    productStore.current?.state === 0
                        ? { title: t('Product.Detail.index.5rcy2a8o8os0') }
                        : undefined
                "
                hasPermission="device/Product:update"
                >{{t('Product.Detail.index.5rcy2a8o8xc0')}}</PermissionButton
            >
        </template>
        <FullPage>
            <div style="height: 100%; padding: 24px;">
                <component
                    :is="tabs[productStore.tabActiveKey]"
                    :class="
                        productStore.tabActiveKey === 'Metadata'
                            ? 'metedata'
                            : ''
                    "
                    v-bind="{ type: 'product' }"
                />
            </div>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup>
import { useProductStore } from '@/store/product';
import Info from './BasicInfo/indev.vue';
import Device from './DeviceAccess/index.vue';
import Metadata from '../../../device/components/Metadata/index.vue';
import DataAnalysis from './DataAnalysis/index.vue';
import MetadataMap from './MetadataMap'
// import Metadata from '../../../components/Metadata/index.vue';
import {
    _deploy,
    _undeploy,
    getDeviceNumber,
    getProtocolDetail,
} from '@/api/device/product';
import { getImage, handleParamsToString, onlyMessage } from '@/utils/comm';
import { useMenuStore } from '@/store/menu';
import { useRouterParams } from '@/utils/hooks/useParams';
import {EventEmitter} from "@/utils/utils";
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();
const route = useRoute();
const checked = ref<boolean>(true);
const productStore = useProductStore();
const routerParams = useRouterParams();
const searchParams = ref({
    terms1: [
        {
            column: 'productId',
            termType: 'eq',
            value: productStore.current?.id,
        },
    ],
    terms2: undefined,
    type: 'and',
});

const list = ref([
    {
        key: 'Info',
        tab: t('Product.Detail.index.5rcy2a8o95c0'),
    },
    {
        key: 'Metadata',
        tab: t('Product.Detail.index.5rcy2a8o9cs0'),
        class: 'objectModel',
    },
    {
        key: 'Device',
        tab: t('Product.Detail.index.5rcy2a8o9lw0'),
    },
]);

const tabs = {
    Info,
    Metadata,
    Device,
    DataAnalysis,
    MetadataMap
};

watch(
    () => route.params.id,
    (newId) => {
        if (newId) {
            productStore.reSet();
            productStore.tabActiveKey = 'Info';
            productStore.refresh(newId as string);
        }
    },
    { immediate: true, deep: true },
);
watch(
    () => productStore.current,
    () => {
        getProtocol();
    },
);
const onBack = () => {
    history.back();
};

const onTabChange = (e: string) => {
  if (productStore.tabActiveKey === 'Metadata') {
    EventEmitter.emit('MetadataTabs', () => {
      productStore.tabActiveKey = e;
    })
  } else {
    productStore.tabActiveKey = e;
  }
};

/**
 * 启用产品
 */
const handleDeploy = async () => {
    if (productStore.current.id) {
        const resp = await _deploy(productStore.current.id);
        if (resp.status === 200) {
            onlyMessage(t('Product.Detail.index.5rcy2a8o9t00'));
            productStore.refresh(productStore.current.id);
        }
    }
};

/**
 * 禁用产品
 */
const handleUndeploy = async () => {
    if (productStore.current.id) {
        const resp = await _undeploy(productStore.current.id);
        if (resp.status === 200) {
            onlyMessage(t('Product.Detail.index.5rcy2a8o9t00'));
            productStore.refresh(productStore.current.id);
        }
    }
};

/**
 * 查询设备数量
 */
// const getNunmber = async () => {
// const params = new URLSearchParams();
// params.append('q', JSON.stringify(searchParams.value));
// params.append('target', 'device-instance');
// console.log(params, ' params');
// const res = await getDeviceNumber(
//     encodeQuery({ terms: { productId: params?.id } }),
// );
// };
// getNunmber();

/**
 * 是否显示数据解析模块
 */
const getProtocol = async () => {
    if (productStore.current?.messageProtocol) {
        const res: any = await getProtocolDetail(
            productStore.current?.messageProtocol,
        );
        if (res.status === 200) {
            const paring = res.result?.transports[0]?.features?.find(
                (item: any) => item.id === 'transparentCodec',
            );
            if (paring) {
                list.value = [
                    {
                        key: 'Info',
                        tab: t('Product.Detail.index.5rcy2a8o95c0'),
                    },
                    {
                        key: 'Metadata',
                        tab: t('Product.Detail.index.5rcy2a8o9cs0'),
                        class: 'objectModel',
                    },
                    {
                        key: 'Device',
                        tab: t('Product.Detail.index.5rcy2a8o9lw0'),
                    },
                    {
                        key: 'DataAnalysis',
                        tab: t('Product.Detail.index.5rcy2a8oa1c0'),
                    },
                ];
            } else {
                list.value = [
                    {
                        key: 'Info',
                        tab: t('Product.Detail.index.5rcy2a8o95c0'),
                    },
                    {
                        key: 'Metadata',
                        tab: t('Product.Detail.index.5rcy2a8o9cs0'),
                        class: 'objectModel',
                    },
                    {
                        key: 'Device',
                        tab: t('Product.Detail.index.5rcy2a8o9lw0'),
                    },
                ];
            }
        }
        if (productStore.current?.accessProvider === 'plugin_gateway') {
          list.value.push({ key: 'MetadataMap', tab: t('Product.Detail.index.5rcy2a8oa9k0')})
        }
    }
};
/**
 * 详情页跳转到设备页
 */
const jumpDevice = () => {
    // console.log(productStore.current?.id);
    const searchParams = {
        column: 'productName',
        termType: 'eq',
        value: productStore.current?.id,
    };
    menuStory.jumpPage(
        'device/Instance',
        {},
        {
            target: 'device-instance',
            q: handleParamsToString([searchParams]),
        },
    );
};
onMounted(() => {
    if (routerParams.params?.value.tab) {
        productStore.tabActiveKey = routerParams.params?.value.tab;
    }
});
</script>
<style scoped lang="less">
.ant-switch-loading,
.ant-switch-disabled {
    cursor: not-allowed;
}
.productDetailHead {
    max-width: 300px;
    overflow: hidden;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
