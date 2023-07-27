<template>
    <FullPage>
        <j-card>
            <TitleComponent :data="t('License.component.Card.5rgb42m24g80')"></TitleComponent>
            <div>
                <j-descriptions bordered :column="4">
                    <j-descriptions-item label="Host" :span="4">
                        {{ infoData?.host }}
                    </j-descriptions-item>
                    <template v-for="i in infoData?.modules" :key="i">
                        <j-descriptions-item label="IP" :span="2">
                            {{ i.ip }}
                        </j-descriptions-item>
                        <j-descriptions-item label="Mac" :span="2">
                            {{ i.mac }}</j-descriptions-item
                        >
                    </template>
                </j-descriptions>
            </div>
            <div style="display: flex; margin-top: 10px; align-items: center">
                <TitleComponent
                    data="License"
                    style="margin-top: 20px"
                ></TitleComponent>
                <slot></slot>
            </div>
            <j-textarea
                :placeholder="t('License.component.Card.5rgb42m25l00')"
                :rows="10"
                v-model:value="license"
            >
            </j-textarea>
            <PermissionButton
                type="primary"
                key="save"
                style="margin-top: 20px"
                @click="saveData"
                >{{t('License.component.Card.5rgb42m25ts0')}}</PermissionButton
            >
        </j-card>
    </FullPage>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  infoData: {
        type: Object,
        default: {},
    },
    licenseData: {
        type: String,
        default: '',
    },
});
let license = ref();

watch(
    () => props.licenseData,
    () => {
        license.value = props.licenseData;
    },
);
const emit = defineEmits(['saveData']);
const saveData = () => {
    emit('saveData', license.value);
};
</script>
<style lang="less" scoped>
</style>