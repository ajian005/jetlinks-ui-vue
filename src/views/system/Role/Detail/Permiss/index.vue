<template>
    <div class="role-permiss-container">
        <section class="card">
            <h5>{{t('Detail.Permiss.index.5rkjrj4xs2s0')}}</h5>
            <j-form
                ref="formRef"
                class="basic-form"
                :model="form.data"
                layout="vertical"
            >
                <j-form-item
                    name="name"
                    :label="t('Detail.Permiss.index.5rkjrj4xtio0')"
                    :rules="[
                        { required: true, message: t('Detail.Permiss.index.5rkjrj4xtpw0') },
                        { max: 64, message: t('Detail.Permiss.index.5rkjrj4xtv40') },
                    ]"
                >
                    <j-input
                        v-model:value="form.data.name"
                        :placeholder="t('Detail.Permiss.index.5rkjrj4xu080')"
                    />
                </j-form-item>
                <j-form-item :label="t('Detail.Permiss.index.5rkjrj4xu5k0')">
                    <j-textarea
                        v-model:value="form.data.description"
                        :placeholder="t('Detail.Permiss.index.5rkjrj4xuac0')"
                        :maxlength="200"
                        show-count
                    />
                </j-form-item>
            </j-form>
        </section>

        <section class="card">
            <h5>{{t('Detail.Permiss.index.5rkjrj4xufc0')}}</h5>
            <PermissTree v-model:select-items="form.menus" />

            <j-button
                type="primary"
                :disabled="form.loading"
                @click="form.clickSave"
                style="margin-top: 24px"
                >{{t('Detail.Permiss.index.5rkjrj4xukc0')}}</j-button
            >
        </section>
    </div>
</template>

<script setup lang="ts" name="RolePermiss">
import { FormInstance } from 'ant-design-vue';
import PermissTree from '../components/PermissTree.vue';
import { useMenuStore } from '@/store/menu';
// import { USER_CENTER_MENU_DATA } from '@/views/init-home/data/baseMenu'

import {
    getRoleDetails_api,
    updateRole_api,
    editRole_api,
    updatePrimissTree_api,
} from '@/api/system/role';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n() 
const { jumpPage } = useMenuStore();
const route = useRoute();
const router = useRouter();
const roleId = route.params.id as string;

// 表单相关
const formRef = ref<FormInstance>();
const form = reactive({
    loading: false,
    data: {
        name: '',
        description: '',
    },
    menus: [], // USER_CENTER_MENU_DATA
    getForm: () => {
        getRoleDetails_api(roleId).then((resp) => {
            if (resp.status) {
                form.data = resp.result;
            }
        });
    },
    clickSave: () => {
        formRef.value?.validate().then(() => {
            const updateRole = editRole_api(roleId, form.data);
            const updateTree = updatePrimissTree_api(roleId, {
                menus: form.menus,
            });
            Promise.all([updateRole, updateTree]).then((resp) => {
                onlyMessage(t('Detail.Permiss.index.5rkjrj4xuro0'));
                // jumpPage(`system/Role`);
            });
        });
    },
});

form.getForm();
</script>

<style lang="less" scoped>
.role-permiss-container {
    .card {
        margin-bottom: 24px;
        background-color: #fff;
        padding: 24px;

        h5 {
            position: relative;
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding: 4px 0 4px 12px;
            font-weight: bold;
            font-size: 16px;

            &::before {
                position: absolute;
                top: 5px px;
                left: 0;
                width: 4px;
                height: calc(100% - 10px);
                background-color: #1d39c4;
                border-radius: 2px;
                content: ' ';
            }
        }

        .basic-form {
            :deep(.ant-form-item-required) {
                padding-right: 12px;

                &::before {
                    right: 0;
                }
            }
            .ant-form-item {
                display: block;
                width: 60%;
            }
        }
    }
}
</style>
