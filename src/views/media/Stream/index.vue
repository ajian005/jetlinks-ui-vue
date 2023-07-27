<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search-stream"
                @search="handleSearch"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    model="CARD"
                    :columns="columns"
                    :gridColumn="2"
                    :gridColumns="[1, 2]"
                    :request="query"
                    :defaultParams="{
                        sorts: [{ name: 'id', order: 'desc' }],
                    }"
                    :params="params"
                >
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            @click="handlAdd"
                            hasPermission="media/Stream:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            {{t('media.Stream.index.5rg3jccphhs0')}}
                        </PermissionButton>
                    </template>
                    <template #card="slotProps">
                        <CardBox
                            :showStatus="true"
                            :value="slotProps"
                            :actions="getActions(slotProps)"
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
                                    <img :src="getImage('/stream.png')" />
                                </slot>
                            </template>
                            <template #content>
                                <div class="card-item-content">
                                    <Ellipsis
                                        style="
                                            width: calc(100% - 100px);
                                            margin-bottom: 10px;
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
                                        <j-col
                                            :span="8"
                                            class="card-item-content-text"
                                        >
                                            <div class="card-item-content-text">
                                                {{t('media.Stream.index.5rg3jccpizw0')}}
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        slotProps.provider
                                                    }}</template>
                                                    {{ slotProps.provider }}
                                                </j-tooltip>
                                            </div>
                                        </j-col>
                                        <j-col :span="8">
                                            <div class="card-item-content-text">
                                                RTP IP
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        slotProps.configuration
                                                            ?.rtpIp
                                                    }}</template>
                                                    {{
                                                        slotProps.configuration
                                                            ?.rtpIp
                                                    }}
                                                </j-tooltip>
                                            </div>
                                        </j-col>
                                        <j-col :span="8">
                                            <div class="card-item-content-text">
                                                API HOST
                                            </div>
                                            <div class="card-item-content-text">
                                                <j-tooltip>
                                                    <template #title>{{
                                                        slotProps.configuration
                                                            ?.apiHost
                                                    }}</template>
                                                    {{
                                                        slotProps.configuration
                                                            ?.apiHost
                                                    }}
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
                                    :hasPermission="'media/Stream:' + item.key"
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
                </j-pro-table>
            </FullPage>
        </div>
    </page-container>
</template>
<script lang="ts" setup name="StreamPage">
import type { ActionsType } from '@/components/Table/index';
import { getImage } from '@/utils/comm';
import { query, remove, disable, enalbe } from '@/api/media/stream';
import { onlyMessage } from '@/utils/comm';
import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();
const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: t('media.Stream.index.5rg3jccpjcw0'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        scopedSlots: true,
    },
    {
        title: t('media.Stream.index.5rg3jccpjl00'),
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {
                    label: t('media.Stream.index.5rg3jccpjw80'),
                    value: 'disabled',
                },
                {
                    label: t('media.Stream.index.5rg3jccpk440'),
                    value: 'enabled',
                },
            ],
        },
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) return [];
    const state = data.state.value;
    const stateText = state === 'enabled' ? t('media.Stream.index.5rg3jccpjw80') : t('media.Stream.index.5rg3jccpkag0');
    const actions = [
        {
            key: 'update',
            text: t('media.Stream.index.5rg3jccpkh40'),
            tooltip: {
                title: t('media.Stream.index.5rg3jccpkh40'),
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
                title: `${t('media.Stream.index.verify') + stateText}?`,
                onConfirm: async () => {
                    let res =
                        state === 'enabled'
                            ? await disable(data.id)
                            : await enalbe(data.id);
                    if (res.success) {
                        onlyMessage(t('media.Stream.index.5rg3jccpkok0'), 'success');
                        tableRef.value?.reload();
                    }
                },
            },
        },
        {
            key: 'delete',
            text: t('media.Stream.index.5rg3jccpkxs0'),
            disabled: state === 'enabled',
            tooltip: {
                title: state === 'enabled' ? t('media.Stream.index.5rg3jccpl3w0') : t('media.Stream.index.5rg3jccpkxs0'),
            },
            popConfirm: {
                title: t('media.Stream.index.5rg3jccpl9w0'),
                onConfirm: async () => {
                    const res = await remove(data.id);
                    if (res.success) {
                        onlyMessage(t('media.Stream.index.5rg3jccpkok0'), 'success');
                        tableRef.value.reload();
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};

const handlAdd = () => {
    menuStory.jumpPage(`media/Stream/Detail`, { id: ':id' }, { view: false });
};
const handlEdit = (id: string) => {
    menuStory.jumpPage(`media/Stream/Detail`, { id }, { view: false });
};
const handlEye = (id: string) => {
    menuStory.jumpPage(`media/Stream/Detail`, { id }, { view: true });
};

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
        color: rgba(0, 0, 0, 0.75);
        font-size: 12px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
    }
}
</style>
