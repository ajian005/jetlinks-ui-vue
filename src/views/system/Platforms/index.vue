<template>
    <page-container>
        <Api mode="api">
            <template #top>
                <p>
                    <AIcon
                        type="ExclamationCircleOutlined"
                        style="margin-right: 12px; font-size: 14px"
                    />
                    {{t('system.Platforms.index.5rga5ah5jgo0')}}
                </p>
            </template>
        </Api>
    </page-container>
</template>

<script setup lang="ts" name="Platforms">
import Api from './Api/index.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
