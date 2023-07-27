<!-- 国标级联-推送 -->
<template>
    <j-modal
        v-model:visible="_vis"
        :title="t('Cascade.Publish.index.5rg8ogcinoc0')"
        :cancelText="t('Cascade.Publish.index.5rg8ogcitds0')"
        :okText="t('Cascade.Publish.index.5rg8ogcitwc0')"
        width="900px"
        @ok="_vis = false"
        @cancel="_vis = false"
    >
        <j-row :gutter="20">
            <j-col :span="8">
                <p>{{t('Cascade.Publish.index.suc') + successCount }}</p>
                <j-space>
                    <p>{{t('Cascade.Publish.index.lose') + failCount }}</p>
                    <a
                        v-if="errMessage.length"
                        @click="
                            downloadObject(
                                errMessage || '',
                                data.name + '-推送失败',
                            )
                        "
                        >{{t('Cascade.Publish.index.5rg8ogciu4g0')}}</a
                    >
                </j-space>
            </j-col>
            <j-col :span="8">
                <p>{{t('Cascade.Publish.index.push') + data.count }}</p>
            </j-col>
            <j-col :span="8">
                <p>{{t('Cascade.Publish.index.pushed') + successCount + failCount }}</p>
            </j-col>
        </j-row>
        <div v-if="flag">
            <j-textarea :rows="10" v-model:value="errStr" />
        </div>
    </j-modal>
</template>

<script setup lang="ts">
import { LocalStore } from '@/utils/comm';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { PropType } from 'vue';
import { downloadObject } from '@/utils/utils';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
    (val: boolean) => {
        if (val) publish();
    },
);

/**
 * {{t('Cascade.Publish.index.5rg8ogcinoc0')}}
 */
const successCount = ref<number>(0);
const failCount = ref<number>(0);
const flag = ref<boolean>(false);
const errMessage = ref<any[]>([]);
const errStr = computed(() => JSON.stringify(errMessage.value));
const publish = () => {
    successCount.value = 0;
    const activeAPI = `${BASE_API_PATH}/media/gb28181-cascade/${
        props.data.id
    }/bindings/publish?:X_Access_Token=${LocalStore.get(TOKEN_KEY)}`;
    const source = new EventSourcePolyfill(activeAPI);
    source.onmessage = (e: any) => {
        const res = JSON.parse(e.data);
        if (res.successful) {
            successCount.value += 1;
        } else {
            failCount.value += 1;
            if (errMessage.value.length <= 5) {
                errMessage.value.push({ ...res });
            }
        }
    };
    source.onerror = () => {
        source.close();
    };
    source.onopen = () => {};
};
</script>
