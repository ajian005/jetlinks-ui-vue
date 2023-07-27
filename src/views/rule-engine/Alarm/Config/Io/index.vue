<template>
    <div>
        <j-row :gutter="24">
            <j-col :span="14">
                <div class="alarmFlow-left">
                    <j-card :head-style="{ borderBottom: 'none', height: '30px' }" :bordered="false">
                        <template #title>
                            <div class="alarmTitle">
                                <span>{{ t('Config.Io.index.5rg40ihzqpo0') }}</span>
                                <j-tooltip :title="t('Config.Io.index.5rg40ihzs5w0')">
                                    <AIcon type="QuestionCircleOutlined" style="
                                            margin-left: 6px;
                                            line-height: 35px;
                                        " />
                                </j-tooltip>

                                <PermissionButton type="link" @click="showOutput" hasPermission="device/Instance:update">
                                    <template #icon>
                                        <AIcon type="EditOutlined" />
                                    </template>
                                </PermissionButton>
                            </div>
                        </template>
                        <j-descriptions bordered :labelStyle="{ width: 112 + 'px' }"
                            :contentStyle="{ minWidth: 100 + 'px' }" :column="2">
                            <j-descriptions-item :label="t('Config.Io.index.kafka')"
                                :content-style="{ minWidth: '200px' }"><j-badge :status="output?.running ? 'success' : 'error'
                                    " :text="output?.data?.config?.config?.address ||
        ''
        "></j-badge></j-descriptions-item>
                            <j-descriptions-item label="topic">{{
                                output?.data?.config?.config?.topic || ''
                            }}</j-descriptions-item>
                            <j-descriptions-item :label="t('Config.Io.index.5rg40ihzsbw0')" :span="2"><j-badge :status="output?.data?.state?.value === 'enabled'
                                    ? 'success'
                                    : 'error'
                                " :text="output?.data?.state?.text || ''"></j-badge></j-descriptions-item>
                        </j-descriptions>
                    </j-card>
                    <j-card :head-style="{ borderBottom: 'none', height: '30px' }" :bordered="false">
                        <template #title>
                            <div class="alarmTitle">
                                <span>{{ t('Config.Io.index.5rg40ihzsg40') }}</span>
                                <j-tooltip :title="t('Config.Io.index.5rg40ihzsk00')">
                                    <AIcon type="QuestionCircleOutlined" style="
                                            margin-left: 6px;
                                            line-height: 35px;
                                        " />
                                </j-tooltip>
                                <PermissionButton type="link" @click="showInput" hasPermission="device/Instance:update">
                                    <template #icon>
                                        <AIcon type="EditOutlined" />
                                    </template>
                                </PermissionButton>
                            </div>
                        </template>
                        <j-descriptions bordered :labelStyle="{ width: 112 + 'px' }"
                            :contentStyle="{ minWidth: 150 + 'px' }" :column="2">
                            <j-descriptions-item :label="t('Config.Io.index.kafka')"><j-badge :status="input?.running ? 'success' : 'error'
                                " :text="input?.data?.config?.config?.address ||
        ''
        "></j-badge></j-descriptions-item>
                            <j-descriptions-item label="topic">{{
                                input?.data?.config?.config?.topic || ''
                            }}</j-descriptions-item>
                            <j-descriptions-item :label="t('Config.Io.index.5rg40ihzsbw0')" :span="2"><j-badge :status="input?.data?.state?.value === 'enabled'
                                    ? 'success'
                                    : 'error'
                                " :text="input?.data?.state?.text || ''"></j-badge></j-descriptions-item>
                        </j-descriptions>
                    </j-card>
                </div>
            </j-col>
            <j-col :span="10">
                <div class="alarmFlow-right">
                    <div class="doc">
                        <h1>{{ t('Config.Io.index.5rg40ihzsr40') }}</h1>
                        <div class="image">
                            <j-image width="100%" :src="getImage('/alarm/io.png')"></j-image>
                        </div>
                        <h1>{{ t('Config.Io.index.5rg40ihzt0w0') }}</h1>
                        <div>
                            {{ t('Config.Io.index.explain1') }}
                        </div>
                        <h2>{{ t('Config.Io.index.5rg40ihzt500') }}</h2>
                        <div>
                            <j-table :dataSource="outputData" :pagination="false" :columns="outputColumns"></j-table>
                        </div>
                        <h2>{{ t('Config.Io.index.5rg40ihzt8w0') }}</h2>
                        <div v-html="markdownOutputText" class="code"></div>
                        <div>
                            {{ t('Config.Io.index.explain2') }}
                        </div>
                        <h2>{{ t('Config.Io.index.5rg40ihztcg0') }}</h2>
                        <div>
                            <j-table :dataSource="subData" :pagination="false" :columns="subColumns"></j-table>
                        </div>
                        <h2>{{ t('Config.Io.index.5rg40ihzt8w0') }}</h2>
                        <div class="code" v-html="markdownSubText"></div>
                    </div>
                </div>
            </j-col>
        </j-row>
        <InputSave :data="input" v-if="inputVisible" @closeModel="closeInput" @saveSuc="saveInput" />
        <OutputSave :data="output" v-if="outputVisible" @closeModel="closeOutput" @saveSuc="saveOutput" />
    </div>
</template>

<script lang="ts" setup>
import InputSave from './Save/input.vue';
import OutputSave from './Save/output.vue';
import { getDataExchange } from '@/api/rule-engine/config';
import { getImage } from '@/utils/comm';
import { marked } from 'marked';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
let input = ref<any>();
let output = ref<any>();
const outputData = [
    {
        key: 'alarmConfigName',
        name: t('Config.Io.index.5rg40ihztgg0'),
        type: 'string',
        desc: t('Config.Io.index.5rg40ihztk00'),
        example: t('Config.Io.index.5rg40ihztng0'),
    },
    {
        key: 'alarmConfigId',
        name: t('Config.Io.index.5rg40ihztr00'),
        type: 'string',
        desc: t('Config.Io.index.5rg40ihztv40'),
        example: '1605111722418597888',
    },
    {
        key: 'Id',
        name: t('Config.Io.index.5rg40ihztys0'),
        type: 'string',
        desc: t('Config.Io.index.5rg40ihzu5s0'),
        example: '1515992841393119232',
    },
    {
        key: 'alarmRecordId',
        name: t('Config.Io.index.5rg40ihzu9k0'),
        type: 'string',
        desc: t('Config.Io.index.5rg40ihzud40'),
        example: 'ba33a59ca5ebe3dccfcd75fd0575be4e',
    },
    {
        key: 'targetType',
        name: t('Config.Io.index.5rg40ihzugs0'),
        type: 'string',
        desc: t('Config.Io.index.5rg40ihzuo00'),
        example: t('Config.Io.index.5rg40ihzur00'),
    },
    {
        key: 'targetId',
        name: t('Config.Io.index.5rg40ihzuv40'),
        type: 'string',
        desc: t('Config.Io.index.5rg40ihzuy40'),
        example: '1583300346713661440',
    },
    {
        key: 'targetName',
        name: t('Config.Io.index.5rg40ihzv1c0'),
        type: 'string',
        desc: t('Config.Io.index.5rg40ihzv4c0'),
        example: t('Config.Io.index.5rg40ihzv7g0'),
    },
    {
        key: 'alarmTime',
        name: t('Config.Io.index.5rg40ihzvao0'),
        type: 'long',
        desc: t('Config.Io.index.5rg40ihzvf00'),
        example: '1651233650840',
    },
    {
        key: 'sourceType',
        name: t('Config.Io.index.5rg40ihzvig0'),
        type: 'string',
        desc: t('Config.Io.index.5rg40ihzvlc0'),
        example: 'device',
    },
    {
        key: 'sourceId',
        name: t('Config.Io.index.5rg40ihzvo40'),
        type: 'string',
        desc: t('Config.Io.index.5rg40ihzvr00'),
        example: '1605138218826821632',
    },
    {
        key: 'sourceName',
        name: t('Config.Io.index.5rg40ihzx800'),
        type: 'string',
        desc: t('Config.Io.index.5rg40ihzxj40'),
        example: t('Config.Io.index.deviceName'),
    },
    {
        key: 'level',
        name: t('Config.Io.index.5rg40ihzxrk0'),
        type: 'int',
        desc: t('Config.Io.index.5rg40ihzxvw0'),
        example: 1,
    },
    {
        key: 'description',
        name: t('Config.Io.index.5rg40ihzxzk0'),
        type: 'string',
        desc: t('Config.Io.index.5rg40ihzynk0'),
        example:  t('Config.Io.index.rule'),
    },
];
const subData = [
    {
        key: 'alarmRecordId',
        name: t('Config.Io.index.5rg40ihzu9k0'),
        type: 'string',
        require: t('Config.Io.index.5rg40ihzz880'),
        desc: t('Config.Io.index.5rg40ihzud40'),
        example: 'ba33a59ca5ebe3dccfcd75fd0575be4e',
    },
    {
        key: 'alarmConfigId',
        name: t('Config.Io.index.5rg40ihztr00'),
        type: 'string',
        require: t('Config.Io.index.5rg40ihzz880'),
        desc: t('Config.Io.index.5rg40ihztv40'),
        example: '1605111722418597888',
    },
    {
        key: 'alarmTime',
        name: t('Config.Io.index.5rg40ihzvao0'),
        type: 'long',
        require: t('Config.Io.index.5rg40ihzz880'),
        desc: t('Config.Io.index.5rg40ihzvf00'),
        example: '1651233650840',
    },
    {
        key: 'handleTime',
        name: t('Config.Io.index.5rg40ihzzdk0'),
        type: 'long',
        require: t('Config.Io.index.5rg40ihzz880'),
        desc: t('Config.Io.index.5rg40ihzzhg0'),
        example: '1651233650840',
    },
    {
        key: 'describe',
        name: t('Config.Io.index.5rg40ihzzmk0'),
        type: 'string',
        require: t('Config.Io.index.5rg40ihzz880'),
        desc: t('Config.Io.index.5rg40ihzzq80'),
        example: t('Config.Io.index.5rg40ihzzv00'),
    },
    {
        key: 'type',
        name: t('Config.Io.index.5rg40ihzzyo0'),
        type: 'enum',
        require: t('Config.Io.index.5rg40ihzz880'),
        desc: t('Config.Io.index.5rg40ii00400'),
        example: 'user',
    },
    {
        key: 'state',
        name: t('Config.Io.index.5rg40ii00c00'),
        type: 'enum',
        require: t('Config.Io.index.5rg40ihzz880'),
        desc: 'warning、normal',
        example: 'normal',
    },
];
const outputColumns = [
    {
        title: t('Config.Io.index.5rg40ii00g80'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
    {
        title: t('Config.Io.index.5rg40ii00k40'),
        dataIndex: 'key',
        key: 'key',
        ellipsis: true,
    },
    {
        title: t('Config.Io.index.5rg40ii00oc0'),
        dataIndex: 'type',
        key: 'type',
        ellipsis: true,
    },
    {
        title: t('Config.Io.index.5rg40ii00sw0'),
        dataIndex: 'desc',
        key: 'desc',
        width: 100,
        ellipsis: true,
    },
    {
        title: t('Config.Io.index.5rg40ii00wk0'),
        dataIndex: 'example',
        key: 'example',
        width: 100,
        ellipsis: true,
    },
];
const subColumns = [...outputColumns];
subColumns.splice(3, 0, {
    title: t('Config.Io.index.5rg40ii012g0'),
    dataIndex: 'require',
    key: 'require',
    ellipsis: true,
});
const subText = `
  ~~~json
  {
    "alarmRecordId": "ba33a59ca5ebe3dccfcd75fd0575be4e",
    "alarmConfigId": "1605111722418597888",
    "alarmTime": "1651233650840",
    "handleTime": "1651233650841",
    "describe": "已联系第三方人员进行告警处理，现告警已恢复",
    "type": "user",
    "state": "normal"
  }
  ~~~
  `;
const outputText = `
  ~~~json
  {
    "alarmConfigId": "1605111722418597888",
    "id": "1515992841393119232",
    "alarmConfigId": "1586989804257853441",
    "alarmConfigName": "烟感告警",
    "alarmRecordId": "ba33a59ca5ebe3dccfcd75fd0575be4e",
    "level": "3",
    "description": "设备温度过高",
    "alarmTime": "1667202964007",
    "sourceType": "device",
    "sourceId": "1605138218826821632",
    "sourceName": "1楼烟感S01",
    "targetType": "device",
    "targetName": "温度探测设备",
    "targetId": "1583300346713661440"
  }
  ~~~
  `;
const render = new marked.Renderer();
const markdownSubText = shallowRef(marked(subText));
const markdownOutputText = shallowRef(marked(outputText));
let inputVisible = ref(false);
let outputVisible = ref(false);
marked.setOptions({
    renderer: render,
    gfm: true,
    pedantic: false,
});
const handleOutputSearch = () => {
    getDataExchange('producer').then((res) => {
        if (res.status === 200) {
            output.value = res.result;
        }
    });
};
const handleInputSearch = () => {
    getDataExchange('consume').then((res) => {
        if (res.status === 200) {
            input.value = res.result;
        }
    });
};
handleInputSearch();
handleOutputSearch();
const showInput = () => {
    inputVisible.value = true;
};
const closeInput = () => {
    inputVisible.value = false;
};
const saveInput = () => {
    inputVisible.value = false;
    handleInputSearch();
};
const showOutput = () => {
    outputVisible.value = true;
};
const closeOutput = () => {
    outputVisible.value = false;
};
const saveOutput = () => {
    outputVisible.value = false;
    handleOutputSearch();
};
</script>
<style lang="less" scoped>
.alarmTitle {
    display: flex;
    position: relative;
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.8);
    font-weight: 600;
    line-height: 1;
    margin-bottom: 16px;
    line-height: 30px;
}

.alarmTitle::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: #1d39c4;
    border-radius: 0 3px 3px 0;
    content: ' ';
}

.alarmFlow-left,
.alarmFlow-right {
    height: 780px;
    background-color: white;
}

.alarmFlow-right {
    margin-left: 20px;
    padding-bottom: 24px;
}

.doc {
    height: 100%;
    padding: 24px;
    overflow-y: auto;
    color: rgba(#000, 0.8);
    font-size: 14px;
    background-color: #fff;

    .url {
        padding: 8px 16px;
        color: #2f54eb;
        background-color: rgba(#a7bdf7, 0.2);
    }

    h1 {
        margin: 16px 0;
        color: rgba(#000, 0.85);
        font-weight: bold;
        font-size: 14px;

        &:first-child {
            margin-top: 0;
        }
    }

    h2 {
        margin: 6px 10px;
        color: rgba(0, 0, 0, 0.8);
        font-weight: 400;
        font-size: 14px;
    }

    .image {
        margin: 16px 0;
    }

    .code {
        padding: 16px;
        background-color: #fafafa;
    }
}
</style>