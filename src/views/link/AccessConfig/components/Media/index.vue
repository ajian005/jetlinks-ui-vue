<template>
    <div class="container">
        <div v-if="channel === 'fixed-media'" class="card-last">
            <j-row :gutter="[24, 24]">
                <j-col :span="12">
                    <title-component :data="t('components.Media.index.5rg37iwxsow0')" />
                    <div>
                        <j-form
                            :model="formState"
                            name="basic"
                            autocomplete="off"
                            layout="vertical"
                            @finish="onFinish"
                        >
                            <j-form-item
                                :label="t('components.Media.index.5rg37iwxu080')"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: t('components.Media.index.5rg37iwxu8k0'),
                                        trigger: 'blur',
                                    },
                                    {
                                        max: 64,
                                        message: t('components.Media.index.5rg37iwxuf40'),
                                        trigger: 'blur',
                                    },
                                ]"
                            >
                                <j-input
                                    :placeholder="t('components.Media.index.5rg37iwxu8k0')"
                                    v-model:value="formState.name"
                                />
                            </j-form-item>
                            <j-form-item :label="t('components.Media.index.5rg37iwxul00')" name="description">
                                <j-textarea
                                    :placeholder="t('components.Media.index.5rg37iwxurg0')"
                                    :rows="4"
                                    v-model:value="formState.description"
                                    show-count
                                    :maxlength="200"
                                />
                            </j-form-item>
                            <j-form-item>
                                <PermissionButton
                                    v-if="view === 'false'"
                                    type="primary"
                                    html-type="submit"
                                    :hasPermission="`link/AccessConfig:${
                                        id === ':id' ? 'add' : 'update'
                                    }`"
                                >
                                    {{t('components.Media.index.5rg37iwxuzg0')}}
                                </PermissionButton>
                            </j-form-item>
                        </j-form>
                    </div>
                </j-col>
                <j-col :span="12">
                    <div class="doc">
                        <h1>{{t('components.Media.index.5rg37iwxv500')}}</h1>
                        <p>
                            {{ provider.name }}
                        </p>
                        <p>
                            {{ provider.description }}
                        </p>
                        <h1>{{t('components.Media.index.5rg37iwxvao0')}}</h1>
                        <p>
                            {{ provider.id === 'fixed-media' ? 'URL' : 'SIP' }}
                        </p>
                    </div>
                </j-col>
            </j-row>
        </div>
        <div v-else-if="channel === 'gb28181'">
            <GB28181 :provider="props.provider" :data="props.data"></GB28181>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessMedia">
import { onlyMessage } from '@/utils/comm';
import GB28181 from './GB28181.vue';
import { update, save } from '@/api/link/accessConfig';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
interface FormState {
    name: string;
    description: string;
}
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const props = defineProps({
    provider: {
        type: Object,
        default: () => {},
    },
    data: {
        type: Object,
        default: () => {},
    },
});

const channel = ref(props.provider.channel);

const formState = ref<FormState>({
    name: '',
    description: '',
});
const onFinish = async (values: any) => {
    const params = {
        ...values,
        provider: 'fixed-media',
        transport: 'URL',
        channel: 'fixed-media',
    };
    const resp =
        id === ':id' ? await save(params) : await update({ ...params, id });
    if (resp.status === 200) {
        onlyMessage(t('components.Media.index.5rg37iwxvfw0'), 'success');

        if (route.query.save) {
            // @ts-ignore
            window?.onTabSaveSuccess(resp.result);
            setTimeout(() => window.close(), 300);
        } else {
            history.back();
        }
    }
};

onMounted(() => {
    if (id !== ':id') {
        formState.value = {
            name: props.data.name,
            description: props.data?.description || '',
        };
    }
});
</script>

<style lang="less" scoped>
.container {
    margin: 20px;
}

.card-last {
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
