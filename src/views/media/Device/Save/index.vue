<!-- 视频设备新增/编辑 -->
<template>
    <page-container>
        <j-card>
            <j-row :gutter="24">
                <j-col :span="12">
                    <j-form ref="formRef" :model="formData" layout="vertical">
                        <j-form-item :label="t('Device.Save.index.5rg8ellkn4g0')" name="channel" :rules="{
                            required: true,
                            message: t('Device.Save.index.5rg8ellkocc0'),
                        }">
                            <RadioCard layout="horizontal" :options="PROVIDER_OPTIONS" :checkStyle="true"
                                :disabled="!!route.query.id" v-model="formData.channel" @change="handleChannelChange" />
                        </j-form-item>
                        <j-row :gutter="24">
                            <j-col :span="8">
                                <JProUpload v-model:modelValue="formData.photoUrl" />
                            </j-col>
                            <j-col :span="16">
                                <j-form-item label="ID" name="id" :rules="[
                                    {
                                        required:
                                            formData.channel ===
                                            'gb28181-2016',
                                        message: t('Device.Save.index.5rg8ellkoio0'),
                                    },
                                    {
                                        max: 64,
                                        message: t('Device.Save.index.5rg8ellkonk0'),
                                    },
                                    {
                                        pattern: /^[a-zA-Z0-9_\-]+$/,
                                        message:
                                            t('Device.Save.index.5rg8ellkorw0'),
                                    },
                                ]">
                                    <j-input v-model:value="formData.id" :placeholder="t('Device.Save.index.5rg8ellkoio0')"
                                        :disabled="!!route.query.id" />
                                </j-form-item>
                                <j-form-item :label="t('Device.Save.index.5rg8ellkoz40')" name="name" :rules="[
                                    {
                                        required: true,
                                        message: t('Device.Save.index.5rg8ellkp3o0'),
                                    },
                                    {
                                        max: 64,
                                        message: t('Device.Save.index.5rg8ellkp7s0'),
                                    },
                                ]">
                                    <j-input v-model:value="formData.name"
                                        :placeholder="t('Device.Save.index.5rg8ellkp3o0')" />
                                </j-form-item>
                            </j-col>
                        </j-row>
                        <j-form-item :label="t('Device.Save.index.5rke0desopk0')" name="productId" :rules="{
                            required: true,
                            message: t('Device.Save.index.5rg8ellkpgo0'),
                        }">
                            <j-row :gutter="[0, 10]">
                                <j-col :span="!!route.query.id ? 24 : 22">
                                    <j-select v-model:value="formData.productId"
                                        :placeholder="t('Device.Save.index.5rg8ellkpgo0')" :disabled="!!route.query.id"
                                        showSearch @change="handleProductChange">
                                        <j-select-option v-for="(item, index) in productList" :key="index" :value="item.id"
                                            :label="item.name">
                                            {{ item.name }}
                                        </j-select-option>
                                    </j-select>
                                </j-col>
                                <j-col :span="2" v-if="!route.query.id">
                                    <PermissionButton type="link" @click="saveProductVis = true"
                                        hasPermission="device/Product:add">
                                        <AIcon type="PlusOutlined" />
                                    </PermissionButton>
                                </j-col>
                            </j-row>
                        </j-form-item>
                        <j-form-item :label="t('Device.Save.index.5rg8ellkpkg0')" :name="['others', 'access_pwd']" :rules="[
                            {
                                required: true,
                                message: t('Device.Save.index.5rg8ellkpos0'),
                            },
                            {
                                max: 64,
                                message: t('Device.Save.index.5rg8ellkp7s0'),
                            },
                        ]" v-if="formData.channel === 'gb28181-2016'">
                            <j-input-password v-model:value="formData.others.access_pwd"
                                :placeholder="t('Device.Save.index.5rg8ellkpos0')" />
                        </j-form-item>
                        <template v-if="!!route.query.id">
                            <j-form-item :label="t('Device.Save.index.5rg8ellkpsk0')" name="streamMode" :rules="{
                                required: true,
                                message: t('Device.Save.index.5rg8ellkpws0'),
                            }">
                                <j-radio-group button-style="solid" v-model:value="formData.streamMode">
                                    <j-radio-button value="UDP">
                                        UDP
                                    </j-radio-button>
                                    <j-radio-button value="TCP_PASSIVE">
                                        {{ t('Device.Save.index.TCP') }}
                                    </j-radio-button>
                                </j-radio-group>
                            </j-form-item>
                            <j-form-item :label="t('Device.Save.index.5rg8ellkq180')"  
                                name="manufacturer"
                                :rules="[{ max: 64, message: '最多可输入64位字符', trigger: 'change' }]">
                                <j-input
                                    v-model:value="formData.manufacturer"
                                    :placeholder="t('Device.Save.index.5rg8ellkq500')"
                                   
                                />
                            </j-form-item>
                            <j-form-item :label="t('Device.Save.index.5rg8ellkqco0')" 
                                name="model"
                                :rules="[{ max: 64, message: '最多可输入64位字符', trigger: 'change' }]">
                                <j-input
                                    v-model:value="formData.model"
                                    :placeholder="t('Device.Save.index.5rg8ellkqgw0')"
                                />
                            </j-form-item>
                            <j-form-item :label="t('Device.Save.index.5rg8ellkql00')"
                                name="firmware"
                                :rules="[{ max: 64, message: '最多可输入64位字符', trigger: 'change' }]">
                                <j-input
                                    v-model:value="formData.firmware"
                                    :placeholder="t('Device.Save.index.5rg8ellkqp80')"
                                />
                            </j-form-item>
                        </template>

                        <j-form-item :label="t('Device.Save.index.5rg8ellkqv80')">
                            <j-textarea v-model:value="formData.description" show-count :maxlength="200" :rows="5"
                                :placeholder="t('Device.Save.index.5rg8ellkqyg0')" />
                        </j-form-item>
                        <j-form-item>
                            <j-button type="primary" @click="handleSubmit" :loading="btnLoading">
                                {{ t('Device.Save.index.5rg8ellkr2g0') }}
                            </j-button>
                        </j-form-item>
                    </j-form>
                </j-col>
                <j-col :span="12">
                    <div v-if="1" class="doc" style="height: 800">
                        <h1>1.{{ t('Device.Save.index.summarize') }}</h1>
                        <div>
                            {{ t('Device.Save.index.5rg8ellkr5s0') }}
                        </div>
                        <h1>2.{{ t('Device.Save.index.explain') }}</h1>
                        <h1>{{ t('Device.Save.index.5rg8ellkrc00') }}</h1>
                        <h2>1、ID</h2>
                        <div>{{ t('Device.Save.index.5rg8ellkrfc0') }}</div>
                        <h2>2、{{ t('Device.Save.index.product') }}</h2>
                        <div>
                            {{ t('Device.Save.index.5rg8ellkrig0') }}
                        </div>
                        <h2>3、{{ t('Device.Save.index.accessPwd') }}</h2>
                        <div>
                            {{ t('Device.Save.index.5rg8ellkrms0') }}
                        </div>
                        <h1>{{ t('Device.Save.index.5rg8ellkrpw0') }}</h1>
                        <div>
                            {{ t('Device.Save.index.5rg8ellkrts0') }}
                        </div>
                        <div class="image">
                            <j-image width="100%" :src="getImage('/media/doc1.png')" />
                        </div>
                        <h2>1、{{ t('Device.Save.index.SIPID') }}</h2>
                        <div>
                            {{ t('Device.Save.index.SIPIDContent') }}
                        </div>
                        <div class="image">
                            <j-image width="100%" :src="getImage('/media/doc2.png')" />
                        </div>
                        <h2>2、{{ t('Device.Save.index.SIPPort') }}</h2>
                        <div>
                            {{ t('Device.Save.index.SIPPortContent') }}
                        </div>
                        <div class="image">
                            <j-image width="100%" :src="getImage('/media/doc3.png')" />
                        </div>
                        <h2>3、{{t('Device.Save.index.equipmentNum')}}</h2>
                        <div>
                            {{ t('Device.Save.index.5rg8ellkrxs0') }}
                        </div>
                        <h2>4、{{t('Device.Save.index.pwd')}}</h2>
                        <div>
                            {{ t('Device.Save.index.5rg8ellks0w0') }}
                        </div>
                        <div class="image">
                            <j-image width="100%" :src="getImage('/media/doc4.png')" />
                        </div>
                        <h2>5、{{t('Device.Save.index.other')}}</h2>
                        <div>{{ t('Device.Save.index.5rg8ellks4c0') }}</div>
                    </div>

                    <div v-else class="doc" style="height: 600">
                        <h1>1.{{ t('Device.Save.index.summarize') }}</h1>
                        <div>
                            {{ t('Device.Save.index.5rg8ellks7k0') }}
                        </div>
                        <div>1、{{ t('Device.Save.index.addDevice') }}</div>
                        <div>2、{{ t('Device.Save.index.addChannel') }}</div>
                        <div>
                            {{ t('Device.Save.index.5rg8ellksb00') }}
                        </div>
                        <h1>2.{{ t('Device.Save.index.explain') }}</h1>
                        <h2>1、ID</h2>
                        <div>
                            {{ t('Device.Save.index.5rg8ellkseg0') }}
                        </div>
                        <h2>2、{{ t('Device.Save.index.product') }}</h2>
                        <div>
                            {{ t('Device.Save.index.5rg8ellkshs0') }}
                        </div>
                    </div>
                </j-col>
            </j-row>
        </j-card>

        <SaveProduct
            v-model:visible="saveProductVis"
            v-model:productId="formData.productId"
            v-model:password="formData.others.access_pwd"
            :channel="formData.channel"
            @close="getProductList"
        />
    </page-container>
</template>

<script setup lang="ts">
import { getImage, onlyMessage } from '@/utils/comm';
import DeviceApi from '@/api/media/device';
import { PROVIDER_OPTIONS } from '@/views/media/Device/const';
import type { ProductType } from '@/views/media/Device/typings';
import SaveProduct from './SaveProduct.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter();
const route = useRoute();

// 表单数据
const formData = ref({
    id: '',
    name: '',
    channel: 'gb28181-2016',
    photoUrl: getImage('/device-media.png'),
    productId: undefined,
    description: '',
    others: {
        access_pwd: '',
    },
    // 编辑字段
    streamMode: 'UDP',
    manufacturer: '',
    model: '',
    firmware: '',
});

const handleChannelChange = () => {
    formData.value.productId = undefined;
    getProductList();
};

/**
 * 获取所属产品
 */
const productList = ref<ProductType[]>([]);
const getProductList = async () => {
    const params = {
        paging: false,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [
            { column: 'accessProvider', value: formData.value.channel },
            { column: 'state', value: 1 },
        ],
    };
    const { result } = await DeviceApi.queryProductList(params);
    productList.value = result;
};
getProductList();

const handleProductChange = () => {
    formData.value.others.access_pwd =
        productList.value.find((f: any) => f.id === formData.value.productId)
            ?.configuration.access_pwd || '';
};

/**
 * 新增产品
 */
const saveProductVis = ref(false);

/**
 * 获取详情
 */
const getDetail = async () => {
    if (!route.query.id) return;
    const res = await DeviceApi.detail(route.query.id as string);
    Object.assign(formData.value, res.result);
    formData.value.channel = res.result.provider;
};

onMounted(() => {
    getDetail();
});

/**
 * 表单提交
 */
const btnLoading = ref<boolean>(false);
const formRef = ref();
const handleSubmit = () => {
    const {
        others,
        id,
        streamMode,
        manufacturer,
        model,
        firmware,
        ...extraParams
    } = formData.value;
    let params: any;
    if (formData.value.channel === 'fixed-media') {
        // 固定地址
        params = !id
            ? extraParams
            : { id, streamMode, manufacturer, model, firmware, ...extraParams };
    } else {
        // 国标
        const getParmas = () =>{
                if(others?.stream_mode){
                    others.stream_mode = streamMode
                }
                return{
                  others,
                  id,
                  streamMode,
                  manufacturer,
                  model,
                  firmware,
                  ...extraParams,
              };
            }
        params = !id
            ? { others, id, ...extraParams }
            : getParmas()
    }

    formRef.value
        ?.validate()
        .then(async () => {
            btnLoading.value = true;
            const res = !route.query.id
                ? await DeviceApi.save(params)
                : await DeviceApi.update(params);
            if (res?.success) {
                onlyMessage(t('Device.Save.index.5rg8ellkskw0'));
                history.back();
            }
        })
        .catch((err: any) => {
            console.log('err: ', err);
        })
        .finally(() => {
            btnLoading.value = false;
        });
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
