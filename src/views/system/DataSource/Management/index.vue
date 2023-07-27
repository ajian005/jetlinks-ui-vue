<template>
    <page-container>
        <div class="manager-container">
            <div class="left">
                <j-input-search v-model:value="leftData.searchValue" :placeholder="t('DataSource.Management.index.5rg9zlwj22k0')" style="margin-bottom: 24px" />
                <!-- 使用v-if用于解决异步加载数据后不展开的问题 -->
                <j-tree v-if="leftData.treeData.length > 0" showLine defaultExpandAll :tree-data="leftData.treeData"
                    v-model:selectedKeys="leftData.selectedKeys" @select="onSelect">
                    <template #title="{ dataRef }">
                        <div v-if="dataRef.root" style="
                                justify-content: space-between;
                                display: flex;
                                align-items: center;
                                width: 200px;
                            ">
                            <span>
                                {{ dataRef.title }}
                            </span>
                            <AIcon type="PlusOutlined" style="color: #1d39c4" @click="addTable" />
                        </div>
                        <span v-else>
                            {{ dataRef.title }}
                        </span>
                    </template>
                </j-tree>
            </div>
            <div class="right">
                <div class="btns">
                    <j-button type="primary" @click="clickSave">{{t('DataSource.Management.index.5rg9zlwj3gg0')}}</j-button>
                </div>
                <j-form ref="formRef" :model="table">
                    <j-table :columns="columns" :dataSource="table.data" :pagination="false" :scroll="{ y: 500 }">
                        <template #bodyCell="{ column, record, index }">
                            <template v-if="column.key === 'name'">
                                <j-form-item :name="['data', index, 'name']" :rules="[
                                    {
                                        max: 64,
                                        message: t('DataSource.Management.index.5rg9zlwj3mc0'),
                                    },
                                    {
                                        required: true,
                                        message: t('DataSource.Management.index.5rg9zlwj3rw0'),
                                    },
                                ]">
                                    <j-input :disabled="record.old_id" v-model:value="record.name" :placeholder="t('DataSource.Management.index.5rg9zlwj3rw0')" />
                                </j-form-item>
                            </template>
                            <template v-else-if="column.key === 'type'">
                                <j-form-item :name="['data', index, 'type']" :rules="[
                                    {
                                        max: 64,
                                        message: t('DataSource.Management.index.5rg9zlwj3mc0'),
                                    },
                                    {
                                        required: true,
                                        message: t('DataSource.Management.index.5rg9zlwj3vw0'),
                                    },
                                ]">
                                    <j-input v-model:value="record.type" :placeholder="t('DataSource.Management.index.5rg9zlwj3vw0')" />
                                </j-form-item>
                            </template>
                            <template v-else-if="column.key === 'length'">
                                <j-form-item :name="['data', index, 'length']">
                                    <j-input-number v-model:value="record.length" :min="0" :max="99999"
                                        style="width: 100%" />
                                </j-form-item>
                            </template>
                            <template v-else-if="column.key === 'scale'">
                                <j-form-item :name="['data', index, 'scale']">
                                    <j-input-number v-model:value="record.scale" :min="0" :max="99999"
                                        style="width: 100%" />
                                </j-form-item>
                            </template>
                            <template v-else-if="column.key === 'notnull'">
                                <j-form-item :name="['data', index, 'notnull']" :rules="[
                                    {
                                        required: true,
                                        message: t('DataSource.Management.index.5rg9zlwj4080'),
                                    },
                                ]">
                                    <j-radio-group v-model:value="record.notnull" button-style="solid">
                                        <j-radio-button :value="true">{{t('DataSource.Management.index.5rg9zlwj4440')}}</j-radio-button>
                                        <j-radio-button :value="false">{{t('DataSource.Management.index.5rg9zlwj47c0')}}</j-radio-button>
                                    </j-radio-group>
                                </j-form-item>
                            </template>
                            <template v-else-if="column.key === 'comment'">
                                <j-form-item :name="['data', index, 'comment']">
                                    <j-input v-model:value="record.comment" :placeholder="t('DataSource.Management.index.5rg9zlwj4aw0')" />
                                </j-form-item>
                            </template>
                            <template v-else-if="column.key === 'action'">
                                <PermissionButton hasPermission="system/DataSource:delete" type="link"
                                    :tooltip="{ title: t('DataSource.Management.index.5rg9zlwj4ek0') }" :danger="true" :popConfirm="{
                                        title: t('DataSource.Management.index.deleteTip'),
                                        onConfirm: () =>
                                            clickDel(record, index),
                                    }" :disabled="record.status">
                                    <AIcon type="DeleteOutlined" />
                                </PermissionButton>
                            </template>
                        </template>
                    </j-table>
                </j-form>

                <j-button class="add-row" @click="addRow">
                    <AIcon type="PlusOutlined" /> {{t('DataSource.Management.index.5rg9zlwj4i00')}}
                </j-button>
            </div>
        </div>
        <j-modal :visible="true" v-if="dialog.visible" :title="t('DataSource.Management.index.5rg9zlwj4nk0')" @ok="handleOk" @cancel="handleCancel">
            <j-form :model="dialog.form" ref="addFormRef" :layout="'vertical'">
                <j-form-item
                    :label="t('DataSource.Management.index.5rg9zlwj4qo0')"
                    name="name"
                    :required="true"
                    :rules="[
                        {
                            required: true,
                            message: t('DataSource.Management.index.5rg9zlwj3rw0'),
                        },
                        {
                            max: 64,
                            message: t('DataSource.Management.index.5rg9zlwj3mc0'),
                            trigger: 'change',
                        },
                        {
                            // pattern: /^[0-9].*$/,
                            // message: '不能以数字开头',
                            trigger: 'change',
                            validator: checkName,
                        },
                        {
                            pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/,
                            message: '名称只能由英文、汉字、下划线、数字组成',
                            trigger: 'change',
                        },
                    ]"
                >
                    <j-input
                        v-model:value="dialog.form.name"
                        :placeholder="t('DataSource.Management.index.5rg9zlwj3rw0')"
                    />
                </j-form-item>
            </j-form>
        </j-modal>
    </page-container>
</template>

<script setup lang="ts" name="Management">
import {
    getDataSourceInfo_api,
    rdbTree_api,
    rdbTables_api,
    saveTable_api,
    delSaveRow_api,
} from '@/api/system/dataSource';
import { onlyMessage } from '@/utils/comm';
import { randomString } from '@/utils/utils';
import { FormInstance } from 'ant-design-vue';
import { DataNode } from 'ant-design-vue/lib/tree';
import _ from 'lodash';
import { cloneDeep } from 'lodash';
import type { dbColumnType, dictItemType, sourceItemType } from '../typing';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const id = useRoute().query.id as string;

const columns = [
    {
        title: t('DataSource.Management.index.5rg9zlwj4xk0'),
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: t('DataSource.Management.index.5rg9zlwj5200'),
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: t('DataSource.Management.index.5rg9zlwj55k0'),
        dataIndex: 'length',
        key: 'length',
    },
    {
        title: t('DataSource.Management.index.5rg9zlwj58s0'),
        dataIndex: 'scale',
        key: 'scale',
    },
    {
        title: t('DataSource.Management.index.5rg9zlwj5fg0'),
        dataIndex: 'notnull',
        key: 'notnull',
        width: 130
    },
    {
        title: t('DataSource.Management.index.5rg9zlwj5j80'),
        dataIndex: 'comment',
        key: 'comment',
    },
    {
        title: t('DataSource.Management.index.5rg9zlwj5o80'),
        dataIndex: 'action',
        key: 'action',
    },
];
const formRef = ref();

const getInfo = (_id: string) => {
    getDataSourceInfo_api(_id).then((resp: any) => {
        info.data = resp.result;
    });
};

const info = reactive({
    data: {} as sourceItemType,
});

const leftData = reactive({
    searchValue: '',
    sourceTree: [] as dictItemType[],
    treeData: [] as any[],
    selectedKeys: [] as string[],
    oldKey: '',
});

const queryTables = (key: string) => {
    if (key) {
        rdbTables_api(id, key).then((resp: any) => {
            table.data = resp.result.columns.map(
                (item: object, index: number) => ({
                    old_id: randomString(),
                    ...item,
                    index,
                }),
            );
        });
    }
};

const handleSearch = (refresh?: boolean) => {
    rdbTree_api(id)
        .then((resp: any) => {
            if (resp.status === 200) {
                leftData.sourceTree = resp.result;
                if (refresh) {
                    leftData.selectedKeys = [resp.result[0]?.name];
                    queryTables(resp.result[0]?.name);
                } else {
                    queryTables(leftData.selectedKeys[0]);
                }
            }
        })
        .catch(() => { });
};

const onSelect = (selectedKeys: string[], e?: any) => {
    if (e?.node?.root) {
        leftData.selectedKeys = [leftData.oldKey];
        return;
    }
    if (!selectedKeys[0]) {
        return;
    }
    leftData.oldKey = selectedKeys[0];
    const key = selectedKeys[0];
    queryTables(key);
};

const addTable = (e: Event) => {
    e?.stopPropagation();
    dialog.visible = true;
};

watch(
    () => id,
    (newId) => {
        if (newId) {
            getInfo(newId);
            handleSearch(true);
        }
    },
    {
        immediate: true,
    },
);

const table = reactive({
    data: [] as dbColumnType[],
});

const addRow = () => {
    const initData: dbColumnType = {
        scale: 0,
        length: 0,
        notnull: false,
        type: '',
        comment: '',
        name: '',
    };
    table.data.push(initData);
};

const clickDel = (row: any, index: number) => {
    if (row.scale !== undefined) {
        delSaveRow_api(id, leftData.selectedKeys[0], [row.name]).then(
            (resp: any) => {
                if (resp.status === 200) {
                    table.data.splice(index, 1);
                }
            },
        );
    } else {
        table.data.splice(index, 1);
    }
};

const clickSave = () => {
    formRef.value.validate().then((_data: any) => {
        const columns = cloneDeep(table.data);
        columns.forEach((item: any) => {
            delete item?.old_id
            delete item?.index
        });
        if (!columns.length) {
            onlyMessage(t('DataSource.Management.index.5rg9zlwj5r80'), 'error');
            return;
        }
        const params = {
            name: leftData.selectedKeys[0],
            columns,
        };
        saveTable_api(id, params).then((resp) => {
            if (resp.status === 200) {
                onlyMessage(t('DataSource.Management.index.5rg9zlwj5ug0'));
                queryTables(params.name);
            }
        });
    });
};

const addFormRef = ref<FormInstance>();
const dialog = reactive({
    visible: false,
    form: {
        name: '',
    },
});

const handleOk = () => {
    addFormRef.value &&
        addFormRef.value.validate().then(() => {
            const name = dialog.form.name;
            leftData.sourceTree.unshift({
                id: name,
                name,
            });
            leftData.oldKey = name;
            leftData.selectedKeys = [name];
            table.data = [];
            dialog.visible = false;
            addFormRef.value?.resetFields();
        });
};

const handleCancel = () => {
    dialog.visible = false;
    addFormRef.value?.resetFields();
};

watch(
    [() => leftData.searchValue, () => leftData.sourceTree],
    ([m, n]) => {
        if (!!m) {
            const list = n.filter((item) => {
                return item.name.includes(m);
            });
            leftData.treeData = [
                {
                    title: info.data.shareConfig?.schema,
                    key: info.data.shareConfig?.schema,
                    root: true,
                    children: list.map((item) => ({
                        title: item.name,
                        key: item.name,
                    })),
                },
            ];
            if (!_.map(list, 'name').includes(leftData.selectedKeys[0])) {
                leftData.selectedKeys = [list[0]?.name];
                queryTables(list[0]?.name);
            }
        } else {
            leftData.treeData = [
                {
                    title: info.data.shareConfig?.schema,
                    key: info.data.shareConfig?.schema,
                    root: true,
                    children: leftData.sourceTree.map((item) => ({
                        title: item.name,
                        key: item.name,
                    })),
                },
            ];
        }
    },
    { deep: true },
);

const checkName = (_: any, value: any) =>
    new Promise((resolve, reject) => {
        if (value) {
            const first = value.slice(0, 1);
            if (typeof Number(first) === 'number' && !isNaN(Number(first))) {
                reject(t('DataSource.Management.index.5rg9zlwj5x00'));
            } else {
                resolve('');
            }
        } else {
            resolve('');
        }
    });
</script>

<style lang="less" scoped>
.manager-container {
    padding: 24px;
    background-color: #fff;
    display: flex;
    min-height: 500px;

    .left {
        flex-basis: 280px;
        padding: 0 24px;
        box-sizing: border-box;
    }

    .right {
        width: calc(100% - 280px);
        box-sizing: border-box;
        border-left: 1px solid #f0f0f0;
        padding-left: 24px;

        .btns {
            display: flex;
            justify-content: right;
        }

        .add-row {
            display: block;
            text-align: center;
            width: 100%;
            margin: 24px 0;
            cursor: pointer;
        }

        .ant-form-item {
            margin-bottom: 0;
        }
    }
}
</style>
