<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search-type"
                @search="handleSearch"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :gridColumn="3"
                    :request="query"
                    :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                    :params="params"
                >
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            @click="handlAdd"
                            hasPermission="link/Type:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{t('link.Type.index.5rg3f4lisdw0')}}
                        </PermissionButton>
                    </template>
                    <template #card="slotProps">
                        <CardBox
                            :showStatus="true"
                            :value="slotProps"
                            :actions="getActions(slotProps, 'card')"
                            v-bind="slotProps"
                            :status="slotProps.state.value"
                            :statusText="slotProps.state.text"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
                            @click="handlEye(slotProps.id)"
                        >
                            <template #img>
                                <slot name="img">
                                    <img :src="getImage('/network.png')" />
                                </slot>
                            </template>
                            <template #content>
                                <div class="card-item-content">
                                    <Ellipsis
                                        style="
                                            width: calc(100% - 100px);
                                            margin-bottom: 20px;
                                        "
                                    >
                                        <span
                                            style="
                                                font-size: 18px;
                                                font-weight: 800;
                                                line-height: 22px;
                                            "
                                        >
                                            {{ slotProps.name }}
                                        </span>
                                    </Ellipsis>
                                    <j-row class="card-item-content-box">
                                        <j-col :span="8">
                                            <div
                                                class="card-item-content-text-title"
                                            >
                                                {{t('link.Type.index.5rg3f4litms0')}}
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        slotProps.type
                                                    }}</template>
                                                    {{ slotProps.type }}
                                                </j-tooltip>
                                            </div>
                                        </j-col>

                                        <j-col :span="16">
                                            <div
                                                class="card-item-content-text-title"
                                            >
                                                {{t('link.Type.index.5rg3f4litsw0')}}
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        getDetails(slotProps)
                                                    }}</template>
                                                    {{ getDetails(slotProps) }}
                                                </j-tooltip>
                                            </div>
                                        </j-col>
                                    </j-row>
                                </div>
                            </template>
                            <template #actions="item">
                                <PermissionButton
                                    :disabled="item.disabled"
                                    :popConfirm="item.popConfirm"
                                    :tooltip="{
                                        ...item.tooltip,
                                    }"
                                    @click="item.onClick"
                                    :hasPermission="'link/Type:' + item.key"
                                >
                                    <AIcon
                                        type="DeleteOutlined"
                                        v-if="item.key === 'delete'"
                                    />
                                    <template v-else>
                                        <AIcon :type="item.icon" />
                                        <span>{{ item?.text }}</span>
                                    </template>
                                </PermissionButton>
                            </template>
                        </CardBox>
                    </template>
                    <template #action="slotProps">
                        <j-space>
                            <template
                                v-for="i in getActions(slotProps, 'table')"
                                :key="i.key"
                            >
                                <PermissionButton
                                    :disabled="i.disabled"
                                    :popConfirm="i.popConfirm"
                                    :tooltip="{
                                        ...i.tooltip,
                                    }"
                                    style="padding: 0px"
                                    @click="i.onClick"
                                    type="link"
                                    :danger="i.key === 'delete'"
                                    :hasPermission="'link/Type:' + i.key"
                                >
                                    <template #icon
                                        ><AIcon :type="i.icon"
                                    /></template>
                                </PermissionButton>
                            </template>
                        </j-space>
                    </template>
                    <template #state="slotProps">
                        <BadgeStatus
                            :text="slotProps.state.text"
                            :status="slotProps.state.value"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
                        ></BadgeStatus>
                    </template>
                    <template #shareCluster="slotProps">
                        {{
                            slotProps.shareCluster === true
                                ? t('link.Type.index.5rg3f4litxs0')
                                : t('link.Type.index.5rg3f4liu240')
                        }}
                    </template>
                    <template #type="slotProps">
                        {{ slotProps.typeObject.name }}
                    </template>
                    <template #details="slotProps">
                        {{ getDetails(slotProps) }}
                    </template>
                </j-pro-table>
            </FullPage>
        </div>
    </page-container>
</template>
<script lang="ts" setup name="TypePage">
import type { ActionsType } from '@/components/Table/index';
import { getImage } from '@/utils/comm';
import { supports, query, remove, start, shutdown } from '@/api/link/type';
import { onlyMessage } from '@/utils/comm';
import { useMenuStore } from 'store/menu';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();
const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const options = ref([]);

const columns = [
    {
        title: t('link.Type.index.5rg3f4liu6o0'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        width: 250,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: t('link.Type.index.5rg3f4litms0'),
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
        width: 150,
        search: {
            type: 'select',
            options: options,
        },
        scopedSlots: true,
    },
    {
        title: t('link.Type.index.5rg3f4liuag0'),
        dataIndex: 'shareCluster',
        key: 'shareCluster',
        width: 120,
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: t('link.Type.index.5rg3f4litxs0'), value: 'true' },
                { label: t('link.Type.index.5rg3f4liu240'), value: 'false' },
            ],
        },
    },
    {
        title: t('link.Type.index.5rg3f4litsw0'),
        dataIndex: 'details',
        key: 'details',
        ellipsis: true,
        scopedSlots: true,
    },
    {
        title: t('link.Type.index.5rg3f4liue40'),
        dataIndex: 'state',
        key: 'state',
        width: 100,
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: t('link.Type.index.5rg3f4liuhw0'), value: 'enabled' },
                { label: t('link.Type.index.5rg3f4liupk0'), value: 'disabled' },
            ],
        },
    },
    {
        title: t('link.Type.index.5rg3f4liut40'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: t('link.Type.index.5rg3f4liuwo0'),
        key: 'action',
        fixed: 'right',
        width: 120,
        scopedSlots: true,
    },
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const state = data.state.value;
    const stateText = state === 'enabled' ? t('link.Type.index.5rg3f4liupk0') : t('link.Type.index.5rg3f4liv040');
    const actions = [
        {
            key: 'view',
            text: t('link.Type.index.5rg3f4liv3w0'),
            tooltip: {
                title: t('link.Type.index.5rg3f4liv3w0'),
            },
            icon: 'EyeOutlined',
            onClick: async () => {
                handlEye(data.id);
            },
        },
        {
            key: 'update',
            text: t('link.Type.index.5rg3f4liv7g0'),
            tooltip: {
                title: t('link.Type.index.5rg3f4liv7g0'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                handlEdit(data.id);
            },
        },
        {
            key: 'action',
            text: stateText,
            tooltip: {
                title: stateText,
            },
            icon: state === 'enabled' ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: t('link.Type.index.verify',{stateText:stateText}),
                onConfirm: async () => {
                    let res =
                        state === 'enabled'
                            ? await shutdown(data.id)
                            : await start(data.id);
                    if (res.success) {
                        onlyMessage(t('link.Type.index.5rg3f4livb00'), 'success');
                        tableRef.value?.reload();
                    }
                },
            },
        },
        {
            key: 'delete',
            text: t('link.Type.index.5rg3f4livhs0'),
            disabled: state === 'enabled',
            tooltip: {
                title:
                    state === 'enabled' ? t('link.Type.index.5rg3f4livlo0') : t('link.Type.index.5rg3f4livhs0'),
            },
            popConfirm: {
                title: t('link.Type.index.5rg3f4livp00'),
                onConfirm: async () => {
                    const res: any = await remove(data.id);
                    if (res.status === 200) {
                        onlyMessage(t('link.Type.index.5rg3f4livb00'), 'success');
                        tableRef.value.reload();
                    } else {
                        onlyMessage(res?.message, 'error');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return type === 'table'
        ? actions
        : actions.filter((item) => item.key !== 'view');
};

const handlAdd = () => {
    menuStory.jumpPage(`link/Type/Detail`, { id: ':id' }, { view: false });
};

const handlEye = (id: string) => {
    menuStory.jumpPage(`link/Type/Detail`, { id }, { view: true });
};

const handlEdit = (id: string) => {
    menuStory.jumpPage(`link/Type/Detail`, { id }, { view: false });
};

const getDetails = (slotProps: Partial<Record<string, any>>) => {
    const { typeObject, shareCluster, configuration, cluster } = slotProps;
    const headers =
        typeObject.name.replace(/[^j-zA-Z]/g, '').toLowerCase() + '://';
    const content = !!shareCluster
        ? (configuration.publicHost || configuration.remoteHost) +
          ':' +
          (configuration.publicPort || configuration.remotePort)
        : (cluster[0].configuration.publicHost ||
              cluster[0].configuration.remoteHost) +
          ':' +
          (cluster[0].configuration.publicPort ||
              cluster[0].configuration.remotePort);
    let head = '远程:';
    if (!!shareCluster) {
        !!configuration.publicHost && (head = '公网:');
    } else {
        !!cluster[0].configuration.publicHos && (head = '公网:');
    }
    if( !shareCluster  && cluster.length > 1){
        const contentItem2 = (cluster[0].configuration.publicHost ||
              cluster[0].configuration.remoteHost) +
          ':' +
          (cluster[0].configuration.publicPort ||
              cluster[0].configuration.remotePort)
        let headItme2 ='远程'
         !!cluster[0].configuration.publicHos && (headItme2 = '公网:');
         if(cluster.length > 2){
            return head + headers + content + " "  + headItme2 + headers + contentItem2 + '。。。'
         } 
         return  head + headers + content + " "  + headItme2 + headers + contentItem2 
    }
    return head + headers + content;
};



const getSupports = async () => {
    const res: any = await supports();
    options.value = res.result.map((item: any) => ({
        value: item.id,
        label: item.name,
    }));
};
getSupports();

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>
<style lang="less" scoped>
.card-item-content {
    min-height: 100px;
    .card-item-content-box {
        min-height: 50px;
    }
    .card-item-content-text {
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 170%;
        color: rgba(0, 0, 0, 0.85);
        opacity: 0.75;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
    }
    .card-item-content-text-title {
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 170%;
        color: rgba(0, 0, 0, 0.75);
        opacity: 0.75;
    }
}
</style>
