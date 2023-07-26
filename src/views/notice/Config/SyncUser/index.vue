<!-- 同步用户 -->
<template>
    <div>
        <j-modal
            v-model:visible="_vis"
            :title="t('Config.SyncUser.index.5saxe2ntxc40')"
            :footer="null"
            @cancel="_vis = false"
            width="80%"
        >
            <j-row :gutter="10" class="model-body">
                <j-col :span="4">
                    <j-input
                        v-model:value="deptName"
                        @keyup.enter="getDepartment"
                        allowClear
                        :placeholder="t('Config.SyncUser.index.5saxe2ntyb80')"
                        style="margin-bottom: 8px"
                    >
                        <template #addonAfter>
                            <AIcon
                                type="SearchOutlined"
                                style="cursor: pointer"
                                @click="getDepartment"
                            />
                        </template>
                    </j-input>
                    <j-tree
                        :tree-data="deptTreeData"
                        :fieldNames="{ title: 'name', key: 'id' }"
                        :selectedKeys="[deptId]"
                        @select="onTreeSelect"
                    >
                    </j-tree>
                    <j-empty v-if="!deptTreeData.length" />
                </j-col>
                <j-col :span="20">
                    <j-button type="primary" @click="handleAutoBind">
                        {{t('Config.SyncUser.index.5saxe2ntygg0')}}
                    </j-button>
                    <JTable
                        ref="tableRef"
                        :columns="columns"
                        :dataSource="dataSource"
                        :loading="tableLoading"
                        :pagination="{
                            total: dataSource.length,
                            current: current,
                            pageSize: pageSize,
                            pageSizeOptions: ['12', '24', '48', '96'],
                            showSizeChanger: true,
                            hideOnSinglePage: false,
                            showTotal: (total: number, range: number) => `${t('pages.iot.notice.config.paging',{num:range[0]-range[1],total:total})}`,
                        }"
                        @change="handleTableChange"
                    >
                        <template #bodyCell="{ column, record, index }">
                            <template v-if="column.dataIndex === 'status'">
                                <j-space>
                                    <j-badge
                                        :status="record.status.value"
                                        :text="record.status.text"
                                    ></j-badge>
                                </j-space>
                            </template>
                            <template v-if="column.dataIndex === 'action'">
                                <j-space :size="16">
                                    <j-tooltip
                                        v-for="i in getActions(record, 'table')"
                                        :key="i.key"
                                        v-bind="i.tooltip"
                                    >
                                        <j-popconfirm
                                            v-if="i.popConfirm"
                                            v-bind="i.popConfirm"
                                            :disabled="i.disabled"
                                        >
                                            <j-button
                                                :disabled="i.disabled"
                                                style="padding: 0"
                                                type="link"
                                                ><AIcon :type="i.icon"
                                            /></j-button>
                                        </j-popconfirm>
                                        <j-button
                                            style="padding: 0"
                                            type="link"
                                            v-else
                                            @click="
                                                i.onClick && i.onClick(record)
                                            "
                                        >
                                            <j-button
                                                :disabled="i.disabled"
                                                style="padding: 0"
                                                type="link"
                                                ><AIcon :type="i.icon"
                                            /></j-button>
                                        </j-button>
                                    </j-tooltip>
                                </j-space>
                            </template>
                        </template>
                    </JTable>
                </j-col>
            </j-row>
        </j-modal>

        <!-- 绑定用户 -->
        <j-modal
            v-model:visible="bindVis"
            :title="t('Config.SyncUser.index.5saxe2ntysk0')"
            :maskClosable="false"
            :confirm-loading="confirmLoading"
            @cancel="handleCancel"
            @ok="handleBindSubmit"
        >
            <j-form layout="vertical">
                <j-form-item :label="t('Config.SyncUser.index.5saxe2ntyw40')" v-bind="validateInfos.userId">
                    <j-select
                        v-model:value="formData.userId"
                        :options="allUserList"
                        allowClear
                        show-search
                        option-filter-prop="children"
                        :filter-option="filterOption"
                        :placeholder="t('Config.SyncUser.index.5saxe2ntyzo0')"
                    />
                </j-form-item>
            </j-form>
        </j-modal>
    </div>
</template>

<script setup lang="ts" name="SyncUser">
import configApi from '@/api/notice/config';
import { PropType } from 'vue';
import type { ActionsType } from '@/views/device/Instance/typings';
import { Form } from 'ant-design-vue';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const useForm = Form.useForm;

type Emits = {
    (e: 'update:visible', data: boolean): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

watch(
    () => _vis.value,
    (val) => {
        if (val) {
            getDepartment();
        } else {
            dataSource.value = [];
        }
    },
);

// 左侧部门
const deptTreeData = ref([]);
const deptName = ref('');
const deptId = ref('');

/**
 * 获取部门
 */
const getDepartment = async () => {
    let res = null;
    if (props.data.type === 'dingTalk') {
        res = await configApi.dingTalkDept(props.data.id);
    } else if (props.data.type === 'weixin') {
        res = await configApi.weChatDept(props.data.id);
    }
    let _result = res?.result;
    if (deptName.value) {
        _result = res?.result?.filter(
            (f: any) => f.name.indexOf(deptName.value) > -1,
        );
    }

    deptTreeData.value = _result;
    deptId.value = _result[0]?.id;
};

watch(
    () => deptName.value,
    (val: any) => {
        if (!val) getDepartment();
    },
);

/**
 * 部门点击
 */
const onTreeSelect = (keys: any) => {
  if (keys.length) {
    deptId.value = keys[0];
    pageSize.value = 12;
    current.value = 1;
  }
};

// 右侧表格

const columns = [
    {
        title: t('Config.SyncUser.index.5saxe2ntz3c0'),
        dataIndex: 'thirdPartyUserName',
        key: 'thirdPartyUserName',
    },
    {
        title: t('Config.SyncUser.index.5saxe2ntyw40'),
        dataIndex: 'userName',
        key: 'userName',
        scopedSlots: true,
    },
    {
        title: t('Config.SyncUser.index.5saxe2ntz740'),
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
    },
    {
        title: t('Config.SyncUser.index.5saxe2ntzak0'),
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
    },
];
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'bind',
            text: t('Config.SyncUser.index.5saxe2ntzhg0'),
            tooltip: {
                title: t('Config.SyncUser.index.5saxe2ntzhg0'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                handleBind(data);
            },
        },
        {
            key: 'unbind',
            text: t('Config.SyncUser.index.5saxe2ntzl00'),
            icon: 'DisconnectOutlined',
            popConfirm: {
                title: t('Config.SyncUser.index.5saxe2ntzoo0'),
                onConfirm: async () => {
                    configApi
                        .unBindUser({ bindingId: data.bindId }, data.bindId)
                        .then(() => {
                            onlyMessage(t('Config.SyncUser.index.5saxe2ntzsg0'));
                            getTableData();
                        });
                },
            },
        },
    ];
    if (data.status.value === 'success') return actions;
    return actions.filter((i: ActionsType) => i.key !== 'unbind');
};

/**
 * {{t('Config.SyncUser.index.5saxe2ntygg0')}}
 */
const handleAutoBind = async () => {
    await getTableData([
        {
            column: `id$user-third$${props.data.type}_${props.data.provider}$not`,
        },
    ]);
    const params = dataSource.value
        .filter((f: any) => f.userId && f.status.value === 'error')
        .map((m: any) => ({
            userId: m.userId,
            providerName: m.thirdPartyUserName,
            thirdPartyUserId: m.thirdPartyUserId,
        }));

    if (props.data.type === 'dingTalk') {
        configApi.dingTalkBindUser(params, props.data.id).then(() => {
            onlyMessage(t('Config.SyncUser.index.5saxe2ntzsg0'));
            getTableData();
        });
    } else if (props.data.type === 'weixin') {
        configApi.weChatBindUser(params, props.data.id).then(() => {
            onlyMessage(t('Config.SyncUser.index.5saxe2ntzsg0'));
            getTableData();
        });
    }
};

/**
 * 获取钉钉/微信部门用户
 */
const getDeptUsers = async () => {
    let res = null;
    if (props.data.type === 'dingTalk') {
        res = await configApi.getDingTalkUsers(props.data.id, deptId.value);
    } else if (props.data.type === 'weixin') {
        res = await configApi.getWeChatUsers(props.data.id, deptId.value);
    }
    return res?.result;
};
/**
 * 获取已经绑定的用户
 */
const getBindUsers = async () => {
    let res = null;
    if (props.data.type === 'dingTalk') {
        res = await configApi.getDingTalkBindUsers(props.data.id);
    } else if (props.data.type === 'weixin') {
        res = await configApi.getWeChatBindUsers(props.data.id);
    }
    return res?.result;
};
/**
 * 获取所有用户未绑定的用户
 */
const allUserList = ref([]);
const getAllUsers = async (terms?: any) => {
    const params = {
        paging: false,
        terms,
    };
    const { result } = await configApi.getPlatformUsers(params);
    allUserList.value = result.map((m: any) => ({
        label: m.name,
        value: m.id,
        ...m,
    }));
    return result;
};

/**
 * 处理列表数据
 */
const dataSource = ref<any>([]);
const tableLoading = ref(false);
const getTableData = (terms?: any) => {
    tableLoading.value = true;
    Promise.all<any>([getDeptUsers(), getBindUsers(), getAllUsers(terms)])
        .then((res) => {
            dataSource.value = [];
            const [deptUsers, bindUsers, unBindUsers] = res;
            (deptUsers || []).forEach((deptUser: any) => {
                // 未绑定的用户
                let unBindUser = unBindUsers.find(
                    (f: any) => f.name === deptUser?.name,
                );
                // 绑定的用户
                const bindUser = bindUsers.find(
                    (f: any) => f.thirdPartyUserId === deptUser.id,
                );
                if (bindUser) {
                    unBindUser = unBindUsers.find(
                        (f: any) => f.id === bindUser.userId,
                    );
                }
                dataSource.value.push({
                    thirdPartyUserId: deptUser.id,
                    thirdPartyUserName: deptUser.name,
                    bindId: bindUser?.id,
                    userId: unBindUser?.id,
                    userName: unBindUser
                        ? `${unBindUser.name}(${unBindUser.username})`
                        : bindUser?.providerName,
                    status: {
                        text: bindUser?.providerName ? t('Config.SyncUser.index.5saxe2ntzvw0') : t('Config.SyncUser.index.5saxe2ntzzk0'),
                        value: bindUser?.providerName ? 'success' : 'error',
                    },
                });
            });
            // console.log('dataSource.value: ', dataSource.value);
        })
        .finally(() => {
            tableLoading.value = false;
        });
};

/**
 * 前端分页
 */
const current = ref(1);
const pageSize = ref(12);
const handleTableChange = (pagination: any) => {
    current.value = pagination.current;
    pageSize.value = pagination.pageSize;
};

watch(
    () => deptId.value,
    () => {
        getTableData();
    },
    { immediate: true },
);

/**
 * {{t('Config.SyncUser.index.5saxe2ntysk0')}}
 */
const bindVis = ref(false);
const confirmLoading = ref(false);
const formData = ref({
    userId: '',
    thirdPartyUserId: '',
    thirdPartyUserName: '',
    bindId: '',
});
const formRules = ref({
    userId: [{ required: true, message: t('Config.SyncUser.index.5saxe2ntyzo0'), trigger: 'change' }],
});

const { resetFields, validate, validateInfos, clearValidate } = useForm(
    formData.value,
    formRules.value,
);

const handleBind = (row: any) => {
    bindVis.value = true;
    // formData.value = row;
    Object.assign(formData.value, row);
    getAllUsers([
        {
            column: `id$user-third$${props.data.type}_${props.data.provider}$not`,
        },
    ]);
};

/**
 * 绑定用户, 用户下拉筛选
 */
const filterOption = (input: string, option: any) => {
    return (
        option.componentOptions.children[0].text
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
    );
};

/**
 * 绑定提交
 */
const handleBindSubmit = () => {
    validate().then(async () => {
        const params = {
            providerName: formData.value.thirdPartyUserName,
            thirdPartyUserId: formData.value.thirdPartyUserId,
            userId: formData.value.userId,
            id: formData.value.bindId,
        };
        confirmLoading.value = true;
        if (props.data.type === 'dingTalk') {
            configApi
                .dingTalkBindUser([params], props.data.id)
                .then(() => {
                    onlyMessage(t('Config.SyncUser.index.5saxe2ntzsg0'));
                    bindVis.value = false;
                    getTableData();
                })
                .finally(() => {
                    confirmLoading.value = false;
                });
        } else if (props.data.type === 'weixin') {
            configApi
                .weChatBindUser([params], props.data.id)
                .then(() => {
                    onlyMessage(t('Config.SyncUser.index.5saxe2ntzsg0'));
                    bindVis.value = false;
                    getTableData();
                })
                .finally(() => {
                    confirmLoading.value = false;
                });
        }
    });
};
const handleCancel = () => {
    bindVis.value = false;
    resetFields();
};
</script>

<style lang="less" scoped>
.model-body {
    height: 600px;
    overflow-y: auto;
    &:deep(.ant-pagination-item) {
        display: none;
    }
}
</style>
