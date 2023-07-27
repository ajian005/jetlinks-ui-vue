<template>
    <div>
        <j-steps class="steps-steps" :current="stepCurrent">
            <j-step disabled v-for="item in steps" :key="item" :title="item" />
        </j-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    {{ t('components.Cloud.OneNet.5rg35msxx1s0') }}
                </div>
                <div style="margin-top: 42px">
                    <j-row :gutter="[24, 24]">
                        <j-col :span="16">
                            <j-form :model="formState" ref="formRef1" name="basic" autocomplete="off" layout="vertical">
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="24">
                                        <j-form-item name="apiAddress" :rules="[
                                            {
                                                required: true,
                                            },
                                        ]">
                                            <template #label>
                                                {{ t('components.Cloud.OneNet.5rg35msxxys0') }}
                                                <j-tooltip :title="t('components.Cloud.OneNet.5rg35msxy540')">
                                                    <AIcon type="QuestionCircleOutlined" style="margin-left: 2px" />
                                                </j-tooltip>
                                            </template>
                                            <j-input disabled v-model:value="formState.apiAddress
                                                " />
                                        </j-form-item>
                                    </j-col>
                                </j-row>
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="24">
                                        <j-form-item label="apiKey" name="apiKey" :rules="[
                                            {
                                                required: true,
                                                message: t('components.Cloud.OneNet.5rg35msxy9w0'),
                                            },
                                            {
                                                max: 64,
                                                message:
                                                    t('components.Cloud.OneNet.5rg35msxygg0'),
                                                trigger: 'blur',
                                            },
                                        ]">
                                            <j-input v-model:value="formState.apiKey"
                                                :placeholder="t('components.Cloud.OneNet.5rg35msxy9w0')" />
                                        </j-form-item>
                                    </j-col>
                                </j-row>
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="12">
                                        <j-form-item name="validateToken" :rules="[
                                            {
                                                required: true,
                                                message: t('components.Cloud.OneNet.5rg35msxylg0'),
                                            },
                                            {
                                                max: 64,
                                                message:
                                                    t('components.Cloud.OneNet.5rg35msxygg0'),
                                                trigger: 'blur',
                                            },
                                        ]">
                                            <template #label>
                                                {{t('components.Cloud.OneNet.5rg35msxypo0')}}
                                                <j-tooltip
                                                    title="OneNet端HTTP推送配置中设置的Token"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </j-tooltip>
                                            </template>
                                            <j-input v-model:value="formState.validateToken
                                                " :placeholder="t('components.Cloud.OneNet.5rg35msxylg0')" />
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="12">
                                        <j-form-item name="aesKey" :rules="[
                                            {
                                                max: 64,
                                                message:
                                                    t('components.Cloud.OneNet.5rg35msxygg0'),
                                                trigger: 'blur',
                                            },
                                        ]">
                                            <template #label>
                                                aesKey
                                                <j-tooltip :title="t('components.Cloud.OneNet.encipher')">
                                                    <AIcon type="QuestionCircleOutlined" style="margin-left: 2px" />
                                                </j-tooltip>
                                            </template>
                                            <j-input v-model:value="formState.aesKey"
                                                :placeholder="t('components.Cloud.OneNet.5rg35msxyyg0')" />
                                        </j-form-item></j-col>
                                </j-row>
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="24">
                                        <j-form-item :label="t('components.Cloud.OneNet.5rg35msxz300')" name="description">
                                            <j-textarea :placeholder="t('components.Cloud.OneNet.5rg35msxz780')" :rows="4"
                                                v-model:value="formState.description
                                                    " show-count :maxlength="200" />
                                        </j-form-item>
                                    </j-col>
                                </j-row> </j-form></j-col>
                        <j-col :span="8">
                            <j-scrollbar height="500">
                                <div class="doc">
                                    <h1>{{ t('components.Cloud.OneNet.5rg35msxzbo0') }}</h1>
                                    <div>
                                        1、{{ t('components.Cloud.OneNet.step1') }}
                                    </div>
                                    <div>
                                        2、{{ t('components.Cloud.OneNet.step2') }}
                                    </div>
                                    <div>
                                        3、{{ t('components.Cloud.OneNet.step3') }}
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img5" />
                                    </div>
                                    <div>
                                        4、{{ t('components.Cloud.OneNet.step4') }}
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img6" />
                                    </div>
                                    <h1>{{ t('components.Cloud.OneNet.HTTP') }}</h1>
                                    <div class="image">
                                        <j-image width="100%" :src="img" />
                                    </div>
                                    <div>
                                        {{ t('components.Cloud.OneNet.HTTPDisposition') }}
                                    </div>
                                    <j-descriptions bordered size="small" :column="1" :labelStyle="{ width: '100px' }">
                                        <j-descriptions-item
                                            :label="t('components.Cloud.OneNet.5rg35msxzfs0')">{{ t('components.Cloud.OneNet.5rg35msxz300') }}</j-descriptions-item>
                                        <j-descriptions-item
                                            :label="t('components.Cloud.OneNet.5rg35msxzjw0')">{{ t('components.Cloud.OneNet.5rg35msxzpo0') }}</j-descriptions-item>
                                        <j-descriptions-item :label="t('components.Cloud.OneNet.5rg35msxzts0')">
                                            {{ t('components.Cloud.OneNet.oneNet') }}
                                            <div style="word-wrap: break-word">
                                                {{
                                                    `${origin}/api/one-net/${randomString()}/notify`
                                                }}
                                            </div>
                                        </j-descriptions-item>
                                        <j-descriptions-item label="Token">
                                            {{ t('components.Cloud.OneNet.5rg35msxyu40') }}
                                        </j-descriptions-item>
                                        <j-descriptions-item :label="t('components.Cloud.OneNet.5rg35msxzy80')">
                                            {{ t('components.Cloud.OneNet.5rg35msy02g0') }}
                                        </j-descriptions-item>
                                    </j-descriptions>

                                    <h1>{{ t('components.Cloud.OneNet.5rg35msy0700') }}</h1>
                                    <j-descriptions bordered size="small" :column="1" :labelStyle="{ width: '100px' }">
                                        <j-descriptions-item
                                            :label="t('components.Cloud.OneNet.5rg35msxzfs0')">{{ t('components.Cloud.OneNet.5rg35msxz300') }}</j-descriptions-item>
                                        <j-descriptions-item
                                            label="apiKey">{{ t('components.Cloud.OneNet.oneNetKey') }}</j-descriptions-item>
                                        <j-descriptions-item :label="t('components.Cloud.OneNet.5rg35msxypo0')">
                                            {{ t('components.Cloud.OneNet.5rg35msy0bg0') }}
                                        </j-descriptions-item>
                                        <j-descriptions-item label="aesKey">
                                            {{ t('components.Cloud.OneNet.5rg35msy0i40') }}
                                        </j-descriptions-item>
                                    </j-descriptions>
                                    <h1>{{ t('components.Cloud.OneNet.5rg35msy0ls0') }}</h1>
                                    <div>
                                        1.{{ t('components.Cloud.OneNet.instructions') }}
                                    </div>
                                </div>
                            </j-scrollbar>
                        </j-col>
                    </j-row>
                </div>
            </div>
        </div>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 1">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    {{ t('components.Cloud.OneNet.5rg35msy0rc0') }}
                </div>
                <div class="search">
                    <j-input-search allowClear :placeholder="t('components.Cloud.OneNet.5rg35msy0v40')" style="width: 300px"
                        @search="procotolSearch" />
                    <PermissionButton v-if='showAddBtn' type="primary" @click="addProcotol"
                        hasPermission="link/Protocol:add">
                        <template #icon>
                            <AIcon type="PlusOutlined" />
                        </template>
                        {{ t('components.Cloud.OneNet.5rg35msy0yw0') }}
                    </PermissionButton>
                </div>
                <j-scrollbar height="480">
                    <j-row :gutter="[24, 24]" style="width: 100%" v-if="procotolList.length > 0">
                        <j-col :span="8" v-for="item in procotolList" :key="item.id">
                            <AccessCard @checkedChange="procotolChange" :checked="procotolCurrent" :disabled='!showAddBtn'
                                :data="{ ...item, type: 'protocol' }">
                            </AccessCard>
                        </j-col>
                    </j-row>
                    <j-empty style="margin-top: 10%" v-else :description="t('components.Cloud.OneNet.5rg35msy12c0')" />
                </j-scrollbar>
            </div>
        </div>
        <div v-if="current === 2" class="card-last">
            <j-row :gutter="[24, 24]">
                <j-col :span="12">
                    <title-component :data="t('components.Cloud.OneNet.5rg35msy16w0')" />
                    <div>
                        <j-form :model="formData" name="basic" autocomplete="off" layout="vertical" ref="formRef2">
                            <j-form-item :label="t('components.Cloud.OneNet.5rg35msy1bc0')" name="name" :rules="[
                                {
                                    required: true,
                                    message: t('components.Cloud.OneNet.5rg35msy1f00'),
                                    trigger: 'blur',
                                },
                                {
                                    max: 64,
                                    message: t('components.Cloud.OneNet.5rg35msxygg0'),
                                    trigger: 'blur',
                                },
                            ]">
                                <j-input :placeholder="t('components.Cloud.OneNet.5rg35msy1f00')"
                                    v-model:value="formData.name" />
                            </j-form-item>
                            <j-form-item :label="t('components.Cloud.OneNet.5rg35msxz300')" name="description">
                                <j-textarea :placeholder="t('components.Cloud.OneNet.5rg35msxz780')" :rows="4"
                                    v-model:value="formData.description" show-count :maxlength="200" />
                            </j-form-item>
                        </j-form>
                    </div>
                </j-col>
                <j-col :span="12">
                    <div class="doc" style="height: 606px">
                        <TitleComponent :data="t('components.Cloud.OneNet.5rg35msy1is0')" />
                        <p>{{ t('components.Cloud.OneNet.accessMode') + provider.name }}</p>
                        <p>
                            {{ provider.description }}
                        </p>
                        <p>{{ t('components.Cloud.OneNet.agreement') + procotolCurrent }}</p>
                        <TitleComponent :data="t('components.Cloud.OneNet.5rg35msy1mc0')" />
                        <p>
                            1、{{ t('components.Cloud.OneNet.accessStep1',{type:  props?.provider?.id === 'OneNet'
                                ? 'OneNet'
                                : 'CTWing'})
                            }}
                        </p>
                        <p>
                            2、
                            {{ t('components.Cloud.OneNet.accessStep2') +
                                (props?.provider?.id === 'OneNet'
                                ? 'OneNet'
                                : t('components.Cloud.OneNet.CTWing'))
                            }}
                        </p>
                        <p>
                            3、{{ t('components.Cloud.OneNet.accessStep3') }}
                        </p>
                    </div>
                </j-col>
            </j-row>
        </div>
        <div :class="current !== 2 ? 'steps-action' : 'steps-action-save'">
            <j-button v-if="current > 0" @click="prev" style="margin-right: 8px">
                {{ t('components.Cloud.OneNet.5rg35msy1pw0') }} </j-button>
            <PermissionButton style="margin-right: 8px" v-if="current === 2 && view === 'false'" type="primary"
                @click="saveData" :hasPermission="`link/AccessConfig:${id === ':id' ? 'add' : 'update'
                    }`">
                {{ t('components.Cloud.OneNet.5rg35msy1t40') }}
            </PermissionButton>
            <j-button v-if="[0, 1].includes(current)" type="primary" @click="next">
                {{ t('components.Cloud.OneNet.5rg35msy1ww0') }}
            </j-button>

        </div>
    </div>
</template>

<script lang="ts" setup name="AccessCloudOneNet">
import { onlyMessage } from '@/utils/comm';
import type { FormInstance } from 'ant-design-vue';
import { update, save, getProtocolList } from '@/api/link/accessConfig';
import AccessCard from '../AccessCard/index.vue';
import { randomString } from '@/utils/utils';
import { getImage } from '@/utils/comm';
import { ProtocolMapping } from '../../data';
import { useMenuStore } from 'store/menu';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const menuStory = useMenuStore();
const origin = window.location.origin;
const img5 = getImage('/network/05.jpg');
const img6 = getImage('/network/06.jpg');
const img = getImage('/network/OneNet.jpg');

interface FormState {
    apiAddress: string;
    apiKey: string;
    validateToken: string;
    aesKey: string;
    description: string;
}
interface Form {
    name: string;
    description: string;
}

const props = defineProps({
    provider: {
        type: Object,
        default: () => { },
    },
    data: {
        type: Object,
        default: () => { },
    },
    bindProduct: {
        type: Boolean,
        default: false
    }
});

const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const formRef1 = ref<FormInstance>();
const formRef2 = ref<FormInstance>();

const formState = ref<FormState>({
    apiAddress: 'https://api.heclouds.com/',
    apiKey: '',
    validateToken: '',
    aesKey: '',
    description: '',
});
const formData = ref<Form>({
    name: '',
    description: '',
});

const current = ref(0);
const stepCurrent = ref(0);
const steps = ref([t('components.Cloud.OneNet.5rg35msy20c0'), t('components.Cloud.OneNet.5rg35msy23o0'), t('components.Cloud.OneNet.5rg35msy29c0')]);
const procotolList: any = ref([]);
const allProcotolList = ref([]);
const procotolCurrent: any = ref('');

const showAddBtn = computed(() => {
    return route.query.view === 'false' && !props.bindProduct
})

const procotolChange = (id: string) => {
    procotolCurrent.value = id;
};

const procotolSearch = (value: string) => {
    procotolList.value = value
        ? allProcotolList.value.filter(
            (i: any) =>
                i.name &&
                i.name
                    .toLocaleLowerCase()
                    .includes(value.toLocaleLowerCase()),
        )
        : allProcotolList.value;
};

const saveData = async () => {
    const data: any = await formRef2.value?.validate();
    const params = {
        ...data,
        configuration: {
            ...formState.value,
            protocol: procotolCurrent.value,
        },
        protocol: procotolCurrent.value,
        provider: props.provider.id,
        transport: 'HTTP_SERVER',
    };
    const resp =
        id === ':id'
            ? await save(params)
            : await update({
                ...props.data,
                ...params,
                id,
            });

    if (resp.status === 200) {
        onlyMessage(t('components.Cloud.OneNet.5rg35msy2cw0'), 'success');
        history.back();
        if ((window as any).onTabSaveSuccess) {
            (window as any).onTabSaveSuccess(resp);
            setTimeout(() => window.close(), 300);
        }
    }
};

const queryProcotolList = async (id: string, params = {}) => {
    const resp: any = await getProtocolList(ProtocolMapping.get(id), {
        ...params,
        'sorts[0].name': 'createTime',
        'sorts[0].order': 'desc',
    });
    if (resp.status === 200) {
        procotolList.value = resp.result;
        allProcotolList.value = resp.result;
    }
};

const addProcotol = () => {
    const url = menuStory.menus['link/Protocol']?.path;
    const tab: any = window.open(
        `${window.location.origin + window.location.pathname}#${url}?save=true`,
    );
    tab.onTabSaveSuccess = (value: any) => {
        if (value.success) {
            procotolCurrent.value = value.result?.id;
            queryProcotolList(props.provider?.id);
        }
    };
};

const next = async () => {
    if (current.value === 0) {
        let data1: any = await formRef1.value?.validate();
        queryProcotolList(props.provider.id);
        current.value = current.value + 1;
    } else if (current.value === 1) {
        if (!procotolCurrent.value) {
            onlyMessage(t('components.Cloud.OneNet.5rg35msy2hc0'), 'error');
        } else {
            current.value = current.value + 1;
        }
    }
};
const prev = () => {
    current.value = current.value - 1;
};

onMounted(() => {
    if (id !== ':id') {
        formState.value = props.data.configuration;
        procotolCurrent.value = props.data.protocol;
        formData.value = {
            name: props.data.name,
            description: props.data.description,
        };
    }
});

watch(
    current,
    (v) => {
        stepCurrent.value = v;
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>

<style lang="less" scoped>
.steps-content {
    margin-top: 20px;
}

.steps-box {
    min-height: 400px;

    .card-last {
        padding-right: 5px;
        overflow-y: auto;
        overflow-x: hidden;
    }
}

.steps-action {
    width: 100%;
    margin-top: 24px;
}

.steps-action-save {
    margin-left: 0;
}

.alert {
    height: 40px;
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}

.search {
    display: flex;
    margin: 15px 0;
    justify-content: space-between;
}

.card-last {
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
}

.form-label {
    height: 30px;
    padding-bottom: 8px;
}
</style>
