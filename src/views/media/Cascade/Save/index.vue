<!-- 国标级联新增/编辑 -->
<template>
    <page-container>
        <j-card>
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form ref="formRef" layout="vertical" :model="formData">
                        <j-row :gutter="24">
                            <TitleComponent :data="t('Cascade.Save.index.5rg8oqlcefk0')" />
                            <j-col :span="12">
                                <j-form-item
                                    :label="t('Cascade.Save.index.5rg8oqlcfhs0')"
                                    name="cascadeName"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlcfng0'),
                                        },
                                        {
                                            max: 64,
                                            message: t('Cascade.Save.index.5rg8oqlcfsw0'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.cascadeName"
                                        :placeholder="t('Cascade.Save.index.5rg8oqlcfng0')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="t('Cascade.Save.index.5rg8oqlcfws0')"
                                    name="proxyStream"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlcg0o0'),
                                        },
                                    ]"
                                >
                                    <j-radio-group
                                        button-style="solid"
                                        v-model:value="formData.proxyStream"
                                    >
                                        <j-radio-button :value="true">
                                            {{t('Cascade.Save.index.5rg8oqlcg440')}}
                                        </j-radio-button>
                                        <j-radio-button :value="false">
                                            {{t('Cascade.Save.index.5rg8oqlcg9g0')}}
                                        </j-radio-button>
                                    </j-radio-group>
                                </j-form-item>
                            </j-col>

                            <TitleComponent :data="t('Cascade.Save.index.5rg8oqlcgd40')" />
                            <j-col :span="12">
                                <j-form-item
                                    name="clusterNodeId"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlcggk0'),
                                        },
                                    ]"
                                >
                                    <template #label>
                                        <span>
                                            {{t('Cascade.Save.index.5rg8oqlcgkg0')}}
                                            <j-tooltip
                                                :title="t('Cascade.Save.index.5rg8oqlcgpc0')"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </j-tooltip>
                                        </span>
                                    </template>
                                    <j-select
                                        v-model:value="formData.clusterNodeId"
                                        :placeholder="t('Cascade.Save.index.5rg8oqlcggk0')"
                                        :options="clustersList"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="t('Cascade.Save.index.5rg8oqlcgsg0')"
                                    name="name"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlcgx80'),
                                        },
                                        {
                                            max: 64,
                                            message: t('Cascade.Save.index.5rg8oqlcfsw0'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.name"
                                        :placeholder="t('Cascade.Save.index.5rg8oqlcgx80')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="24">
                                <j-form-item
                                    :label="t('Cascade.Save.index.ID')"
                                    name="sipId"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.IDTip'),
                                        },
                                        {
                                            max: 64,
                                            message: t('Cascade.Save.index.5rg8oqlcfsw0'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.sipId"
                                        :placeholder="t('Cascade.Save.index.IDTip')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="t('Cascade.Save.index.5rg8oqlch0w0')"
                                    name="domain"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlch400'),
                                        },
                                        {
                                            max: 64,
                                            message: t('Cascade.Save.index.5rg8oqlcfsw0'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.domain"
                                        :placeholder="t('Cascade.Save.index.5rg8oqlch400')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="t('Cascade.Save.index.5rg8oqlch7c0')"
                                    name="remoteAddress"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlchaw0')
                                        },
                                        {
                                            validator: checkSIP,
                                        },
                                    ]"
                                >
                                    <j-row :gutter="10">
                                        <j-col :span="14">
                                            <j-input
                                                v-model:value="
                                                    formData.remoteAddress
                                                "
                                                :placeholder="t('Cascade.Save.index.5rg8oqlche00')"
                                            />
                                        </j-col>
                                        <j-col :span="10">
                                            <j-input-number
                                                :min="1"
                                                :max="65535"
                                                v-model:value="
                                                    formData.remotePort
                                                "
                                                :placeholder="t('Cascade.Save.index.5rg8oqlchhk0')"
                                                style="width: 100%"
                                                :precision="0"
                                            />
                                        </j-col>
                                    </j-row>
                                </j-form-item>
                            </j-col>

                            <j-col :span="24">
                                <j-form-item
                                    :label="t('Cascade.Save.index.gatewayID')"
                                    name="localSipId"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.gatewayIDRules'),
                                        },
                                        {
                                            max: 64,
                                            message: t('Cascade.Save.index.5rg8oqlcfsw0'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.localSipId"
                                        :placeholder="t('Cascade.Save.index.gatewayIDTip')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    name="host"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlchmg0'),
                                        },
                                        {
                                            validator: checkLocalSIP,
                                        },
                                    ]"
                                >
                                    <template #label>
                                        <span>
                                            {{ t('Cascade.Save.index.SIPAddress') }}
                                            <j-tooltip
                                                :title="t('Cascade.Save.index.5rg8oqlchq00')"
                                            >
                                                <AIcon
                                                    type="QuestionCircleOutlined"
                                                    style="margin-left: 2px"
                                                />
                                            </j-tooltip>
                                        </span>
                                    </template>
                                    <j-row :gutter="10">
                                        <j-col :span="14">
                                            <j-select
                                                v-model:value="formData.host"
                                                :placeholder="t('Cascade.Save.index.5rg8oqlchuo0')"
                                                :options="allList"
                                                @change="setPorts"
                                                showSearch
                                            />
                                        </j-col>
                                        <j-col :span="10">
                                            <j-select
                                                v-model:value="formData.port"
                                                :placeholder="t('Cascade.Save.index.5rg8oqlchxc0')"
                                                :options="allListPorts"
                                            />
                                        </j-col>
                                    </j-row>
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="t('Cascade.Save.index.longRange')"
                                    name="publicHost"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlci000'),
                                        },
                                        {
                                            validator: checkPublicSIP,
                                        },
                                    ]"
                                >
                                    <j-row :gutter="10">
                                        <j-col :span="14">
                                            <j-input
                                                v-model:value="
                                                    formData.publicHost
                                                "
                                                :placeholder="t('Cascade.Save.index.5rg8oqlche00')"
                                            />
                                        </j-col>
                                        <j-col :span="10">
                                            <j-input-number
                                                :min="1"
                                                :max="65535"
                                                v-model:value="
                                                    formData.publicPort
                                                "
                                                :placeholder="t('Cascade.Save.index.5rg8oqlchhk0')"
                                                style="width: 100%"
                                                :precision="0"
                                            />
                                        </j-col>
                                    </j-row>
                                </j-form-item>
                            </j-col>
                            <j-col :span="24">
                                <j-form-item
                                    :label="t('Cascade.Save.index.5rg8oqlci2k0')"
                                    name="transport"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlci5c0'),
                                        },
                                    ]"
                                >
                                    <j-radio-group
                                        button-style="solid"
                                        v-model:value="formData.transport"
                                        @change="handleTransportChange"
                                    >
                                        <j-radio-button value="UDP">
                                            UDP
                                        </j-radio-button>
                                        <j-radio-button value="TCP">
                                            TCP
                                        </j-radio-button>
                                    </j-radio-group>
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="t('Cascade.Save.index.5rg8oqlci800')"
                                    name="user"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlciag0'),
                                        },
                                        {
                                            max: 64,
                                            message: t('Cascade.Save.index.5rg8oqlcfsw0'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.user"
                                        :placeholder="t('Cascade.Save.index.5rg8oqlciag0')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="t('Cascade.Save.index.5rg8oqlcidc0')"
                                    name="password"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlcig40'),
                                        },
                                        {
                                            max: 64,
                                            message: t('Cascade.Save.index.5rg8oqlcfsw0'),
                                        },
                                    ]"
                                >
                                    <j-input-password
                                        v-model:value="formData.password"
                                        :placeholder="t('Cascade.Save.index.5rg8oqlcig40')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="t('Cascade.Save.index.5rg8oqlciio0')"
                                    name="manufacturer"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlcil40'),
                                        },
                                        {
                                            max: 64,
                                            message: t('Cascade.Save.index.5rg8oqlcfsw0'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.manufacturer"
                                        :placeholder="t('Cascade.Save.index.5rg8oqlcil40')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="t('Cascade.Save.index.5rg8oqlcins0')"
                                    name="model"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlciqk0'),
                                        },
                                        {
                                            max: 64,
                                            message: t('Cascade.Save.index.5rg8oqlcfsw0'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.model"
                                        :placeholder="t('Cascade.Save.index.5rg8oqlciqk0')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="t('Cascade.Save.index.5rg8oqlciuk0')"
                                    name="firmware"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlcix40'),
                                        },
                                        {
                                            max: 64,
                                            message: t('Cascade.Save.index.5rg8oqlcfsw0'),
                                        },
                                    ]"
                                >
                                    <j-input
                                        v-model:value="formData.firmware"
                                        :placeholder="t('Cascade.Save.index.5rg8oqlcix40')"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="t('Cascade.Save.index.5rg8oqlcizg0')"
                                    name="keepaliveInterval"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlcj200'),
                                        },
                                        {
                                            pattern: /^[1-9]\d*$/,
                                            message: '请输入1~10000的整数',
                                        }
                                    ]"
                                >
                                    <j-input-number
                                        :min="1"
                                        :max="10000"
                                        v-model:value="
                                            formData.keepaliveInterval
                                        "
                                        :placeholder="t('Cascade.Save.index.5rg8oqlcj200')"
                                        style="width: 100%"
                                    />
                                </j-form-item>
                            </j-col>
                            <j-col :span="12">
                                <j-form-item
                                    :label="t('Cascade.Save.index.5rg8oqlcj4o0')"
                                    name="registerInterval"
                                    :rules="[
                                        {
                                            required: true,
                                            message: t('Cascade.Save.index.5rg8oqlcj7c0'),
                                        },
                                        {
                                            pattern: /^[1-9]\d*$/,
                                            message: '请输入1~10000的整数',
                                        }
                                    ]"
                                >
                                    <j-input-number
                                        :min="1"
                                        :max="10000"
                                        v-model:value="
                                            formData.registerInterval
                                        "
                                        :placeholder="t('Cascade.Save.index.5rg8oqlcj7c0')"
                                        style="width: 100%"
                                    />
                                </j-form-item>
                            </j-col>
                        </j-row>

                        <j-form-item>
                            <j-button
                                type="primary"
                                @click="handleSubmit"
                                :loading="btnLoading"
                            >
                                {{t('Cascade.Save.index.5rg8oqlcjak0')}}
                            </j-button>
                        </j-form-item>
                    </j-form>
                </j-col>
                <j-col :span="12">
                    <div class="doc">
                        <h1>1.{{t('Cascade.Save.index.summarize')}}</h1>
                        <div>
                            {{t('Cascade.Save.index.5rg8oqlcjd80')}}
                        </div>
                        <div>
                            <j-alert
                                :message="t('Cascade.Save.index.5rg8oqlcjfo0')"
                                type="info"
                                show-icon
                            />
                        </div>
                        <h1>2.{{t('Cascade.Save.index.explain')}}</h1>
                        <div>
                            {{t('Cascade.Save.index.5rg8oqlcjkc0')}}
                        </div>
                        <h2>1、{{t('Cascade.Save.index.ID')}}</h2>
                        <div>{{t('Cascade.Save.index.5rg8oqlcjnc0')}}<b>SIP ID</b>。</div>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/northbound/doc2.png')"
                            />
                        </div>
                        <h2>2、{{t('Cascade.Save.index.SIP') + t('Cascade.Save.index.5rg8oqlcjpw0')}}</h2>
                        <div>{{t('Cascade.Save.index.5rg8oqlcjnc0')}}<b>{{ t('Cascade.Save.index.domain') }}</b>。</div>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/northbound/doc1.png')"
                            />
                        </div>
                        <h2>3、{{t('Cascade.Save.index.SIP') + t('Cascade.Save.index.5rg8oqlcjso0')}}</h2>
                        <div>{{t('Cascade.Save.index.5rg8oqlcjnc0')}}<b>{{t('Cascade.Save.index.IDAddress')}}</b>。</div>
                        <div class="image">
                            <j-image
                                width="100%"
                                :src="getImage('/northbound/doc3.png')"
                            />
                        </div>
                        <h2>4、{{t('Cascade.Save.index.gatewayID')}}</h2>
                        <div>
                            {{t('Cascade.Save.index.5rg8oqlcjvo0')}}<b>{{t('Cascade.Save.index.IDAddress')}}</b>。
                            {{t('Cascade.Save.index.5rg8oqlcjy40')}}
                            {{t('Cascade.Save.index.5rg8oqlck0o0')}}
                        </div>
                        <h2>5、{{t('Cascade.Save.index.localAddress')}}</h2>
                        <div>
                            {{t('Cascade.Save.index.5rg8oqlck3c0')}}<b>{{t('Cascade.Save.index.5rg8oqlck7c0')}}</b>，{{t('Cascade.Save.index.connection')}}
                        </div>
                        <h2>6、{{t('Cascade.Save.index.user')}}</h2>
                        <div>
                            {{t('Cascade.Save.index.5rg8oqlck9s0')}}<b
                                >{{t('Cascade.Save.index.5rg8oqlckck0')}} ID</b
                            >{{t('Cascade.Save.index.5rg8oqlckck0')}}。
                        </div>
                        <h2>7、{{t('Cascade.Save.index.5rg8oqlcidc0')}}</h2>
                        <div>
                            {{t('Cascade.Save.index.5rg8oqlckfg0')}}
                        </div>
                        <h2>8、 {{t('Cascade.Save.index.versions')}}</h2>
                        <div>
                            {{t('Cascade.Save.index.5rg8oqlckhw0')}}
                        </div>
                        <h2>9、 {{t('Cascade.Save.index.heartbeat')}}</h2>
                        <div>
                            {{t('Cascade.Save.index.5rg8oqlckls0')}}
                        </div>
                        <h2>10、 {{t('Cascade.Save.index.interval')}}</h2>
                        <div>
                            {{t('Cascade.Save.index.5rg8oqlckoc0') + t('Cascade.Save.index.intervalContent') + t('Cascade.Save.index.5rg8oqlckqw0')}}
                        </div>
                    </div>
                </j-col>
            </j-row>
        </j-card>
    </page-container>
</template>

<script setup lang="ts">
import { getImage, onlyMessage } from '@/utils/comm';
import CascadeApi from '@/api/media/cascade';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter();
const route = useRoute();

// 表单数据
const formData = ref({
    id: route.query.id || undefined,
    // name: undefined,
    cascadeName: undefined,
    proxyStream: false,
    // 以下字段, 提交时需提取到sipConfigs[{}]字段当中
    clusterNodeId: undefined,
    name: undefined,
    sipId: undefined,
    domain: undefined,
    remoteAddress: undefined,
    remotePort: undefined,
    localSipId: undefined,
    host: undefined,
    port: undefined,
    // remotePublic: {
    //     host: undefined,
    //     port: undefined,
    // },
    publicHost: undefined,
    publicPort: undefined,
    transport: 'UDP',
    user: undefined,
    password: undefined,
    manufacturer: undefined,
    model: undefined,
    firmware: undefined,
    keepaliveInterval: '60',
    registerInterval: '3600',
});

/**
 * 获取集群节点
 */
const clustersList = ref([]);
const getClustersList = async () => {
    const { result } = await CascadeApi.clusters();
    clustersList.value = result.map((m: any) => ({
        label: m.name,
        value: m.id,
    }));
};
getClustersList();
/**
 * SIP本地地址
 */
const allList = ref<any[]>([]);
const getAllList = async () => {
    const { result } = await CascadeApi.all();
    allList.value = result.map((m: any) => ({
        label: m.host,
        value: m.host,
        ...m,
    }));
    setPorts();
};
getAllList();

const handleTransportChange = () => {
    formData.value.host = undefined;
    formData.value.port = undefined;
    setPorts();
};
/**
 * 获取端口
 */
const allListPorts = ref([]);
const setPorts = () => {
    if (!formData.value.host) return;
    allListPorts.value = allList.value
        .find((f: any) => f.host === formData.value.host)
        ?.ports[formData.value.transport || '']?.map((m: string) => ({
            label: m,
            value: m,
        }));
};

/**
 * 获取详情
 */
const getDetail = async () => {
    if (!route.query.id) return;
    const res = await CascadeApi.detail(route.query.id as string);
    const { id, name, proxyStream, sipConfigs, ...others } = res.result;
    Object.keys(formData.value).forEach((key: string) => {
        if (key === 'id') formData.value[key] = id;
        else if (key === 'cascadeName') formData.value[key] = name;
        else if (key === 'proxyStream') formData.value[key] = proxyStream;
        else formData.value[key] = sipConfigs[0][key];
    });
    // console.log('formData.value: ', formData.value);
};

onMounted(() => {
    getDetail();
});

const regDomain = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.|$)){4}$/
    // /[j-zA-Z0-9][-j-zA-Z0-9]{0,62}(\.[j-zA-Z0-9][-j-zA-Z0-9]{0,62})+\.?/;
/**
 * 上级SIP地址 字段验证
 * @param _
 * @param value 此处绑定的是 remoteAddress
 */
const checkSIP = (_: any, value: string) => {
    return checkHost(value, formData.value.remotePort);
};
/**
 * SIP远程地址 字段验证
 * @param _
 * @param value 此处绑定的是 publicHost
 */
const checkPublicSIP = (_: any, value: string) => {
    return checkHost(value, formData.value.publicPort);
};

/**
 * 字段验证
 * @param host ip
 * @param port 端口
 */
const checkHost = (host: string, port: string | number | undefined) => {
    if (!host) {
        return Promise.resolve();
    } else if (!host) {
        return Promise.reject(new Error(t('Cascade.Save.index.IPAddress')));
    } else if (host && !regDomain.test(host)) {
        return Promise.reject(new Error('请输入0.0.0.0~255.255.255.255的IP地址'));
    } else if (!port) {
        return Promise.reject(new Error(t('Cascade.Save.index.5rg8oqlchhk0')));
    } else if ((port && Number(port) < 1) || Number(port) > 65535) {
        return Promise.reject(new Error(t('Cascade.Save.index.5rg8oqlckw00')));
    }
    return Promise.resolve();
};

/**
 * SIP本地地址 字段验证
 * @param _
 * @param value
 */
const checkLocalSIP = (_: any, value: string) => {
    if (!value) {
        return Promise.resolve();
    } else if (!value) {
        return Promise.reject(new Error(t('Cascade.Save.index.5rg8oqlchuo0')));
    } else if (!formData.value.port) {
        return Promise.reject(new Error(t('Cascade.Save.index.5rg8oqlchxc0')));
    }
    return Promise.resolve();
};

/**
 * 表单提交
 */
const formRef = ref();
const btnLoading = ref<boolean>(false);
const handleSubmit = () => {
    // console.log('formData.value: ', formData.value);
    formRef.value
        .validate()
        .then(() => {
            const {
                id,
                cascadeName,
                proxyStream,
                // publicHost,
                // publicPort,
                ...extraFormData
            } = formData.value;
            const params = {
                id,
                name: cascadeName,
                proxyStream,
                sipConfigs: [
                    {
                        ...extraFormData,
                        // remotePublic: {
                        //     host: publicHost,
                        //     port: publicPort,
                        // },
                    },
                ],
            };
            btnLoading.value = true;
            CascadeApi[id ? 'update' : 'save'](params)
                .then(() => {
                    onlyMessage(t('Cascade.Save.index.5rg8oqlckyk0'));
                    router.back();
                })
                .finally(() => {
                    btnLoading.value = false;
                });
        })
        .catch((err: any) => {
            console.log('err: ', err);
        });
};
</script>

<style lang="less" scoped>
// @import './index.less';
</style>
