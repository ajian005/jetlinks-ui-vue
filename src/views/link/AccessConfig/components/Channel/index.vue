<template>
    <div v-if="type === 'channel'" class="card-last">
        <j-row :gutter="[24, 24]">
            <j-col :span="12">
                <title-component :data="t('components.Channel.index.5rg34u5fd1w0')" />
                <div>
                    <j-form :model="formState" name="basic" autocomplete="off" layout="vertical" @finish="onFinish">
                        <j-form-item :label="t('components.Channel.index.5rg34u5fgx40')" name="name" :rules="[
                            {
                                required: true,
                                message: t('components.Channel.index.5rg34u5fhc80'),
                                trigger: 'blur',
                            },
                            {
                                max: 64,
                                message: t('components.Channel.index.5rg34u5fhjg0'),
                                trigger: 'blur',
                            },
                        ]">
                            <j-input :placeholder="t('components.Channel.index.5rg34u5fhc80')"
                                v-model:value="formState.name" />
                        </j-form-item>
                        <j-form-item :label="t('components.Channel.index.5rg34u5fi700')" name="description">
                            <j-textarea :placeholder="t('components.Channel.index.5rg34u5firs0')" :rows="4"
                                v-model:value="formState.description" show-count :maxlength="200" />
                        </j-form-item>
                        <j-form-item>
                            <PermissionButton v-if="view === 'false'" type="primary" html-type="submit" :hasPermission="`link/AccessConfig:${id === ':id' ? 'add' : 'update'
                                }`">
                                {{ t('components.Channel.index.5rg34u5fj6c0') }}
                            </PermissionButton>
                        </j-form-item>
                    </j-form>
                </div>
            </j-col>
            <j-col :span="12">
                <div class="doc" style="height: 600px">
                    <TitleComponent :data="t('components.Channel.index.5rg34u5fjqg0')" />
                    <p>{{ t('components.Channel.index.accessMode') + provider.name }}</p>
                    <p>
                        {{ provider.description }}
                    </p>
                    <p>{{ t('components.Channel.index.agreement') + provider.id }}</p>
                    <TitleComponent :data="t('components.Channel.index.5rg34u5fk540')" />
                    <p>1、{{ t('components.Channel.index.channel', { name: provider.name }) }}</p>
                    <p>2、{{ t('components.Channel.index.accessGateway', { name: provider.name }) }}</p>
                    <p>3、{{ t('components.Channel.index.productTip') + provider.name }}</p>
                    <p>4、{{ t('components.Channel.index.bind') }}</p>
                </div>
            </j-col>
        </j-row>
    </div>
</template>

<script lang="ts" setup name="AccessChannel">
import { onlyMessage } from '@/utils/comm';
import { update, save } from '@/api/link/accessConfig';
import { ProtocolMapping } from '../../data';
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
        default: () => { },
    },
    data: {
        type: Object,
        default: () => { },
    },
});

const type = ref(props.provider.type || props.data.type);

const formState = ref<FormState>({
    name: '',
    description: '',
});
const onFinish = async (values: any) => {
    const providerId = props.provider.id;
    const params = {
        ...values,
        provider: providerId,
        protocol: providerId,
        transport: ProtocolMapping.get(providerId),
        channel: providerId === 'modbus-tcp' ? 'modbus' : 'opc-ua',
    };
    const resp =
        id === ':id' ? await save(params) : await update({ ...params, id });
    if (resp.status === 200) {
        onlyMessage(t('components.Channel.index.5rg34u5fkfw0'), 'success');
        history.back();
        if ((window as any).onTabSaveSuccess) {
            (window as any).onTabSaveSuccess(resp);
            setTimeout(() => window.close(), 300);
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
.card-last {
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
