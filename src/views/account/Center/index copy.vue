<template>
    <page-container>
        <div class="center-container">
            <div class="card">
                <div class="content" style="margin-top: 0">
                    <div
                        class="content-item flex-item"
                        style="width: 350px; justify-content: center"
                    >
                        <img
                            v-if="userInfo.avatar"
                            :src="userInfo.avatar"
                            style="width: 140px; border-radius: 70px"
                            alt=""
                        />
                        <div class="default-avatar" v-else>
                            <AIcon type="UserOutlined" />
                        </div>

                        <div
                            style="
                                width: 100%;
                                text-align: center;
                                margin-top: 20px;
                            "
                        >
                            <j-upload
                                v-model:file-list="upload.fileList"
                                accept=".jpg,.png,.jfif,.pjp,.pjpeg,.jpeg"
                                :maxCount="1"
                                :show-upload-list="false"
                                :headers="{
                                    [TOKEN_KEY]: LocalStore.get(TOKEN_KEY),
                                }"
                                :action="`${BASE_API_PATH}/file/static`"
                                @change="upload.changeBackUpload"
                                :beforeUpload="upload.beforeUpload"
                            >
                                <j-button>
                                    <AIcon type="UploadOutlined" />
                                    {{t('account.Center.index copy.5rmxwbksi1g0')}}
                                </j-button>
                            </j-upload>
                        </div>
                    </div>
                    <div
                        class="content-item flex-item"
                        style="flex: 1; padding: 15px 0"
                    >
                        <div class="info-card">
                            <p>{{t('account.Center.index copy.5rmxwbksjbs0')}}</p>
                            <p>{{ userInfo.username }}</p>
                        </div>
                        <div class="info-card">
                            <p>{{t('account.Center.index copy.5rmxwbksjl40')}}</p>
                            <p>{{ userInfo.id }}</p>
                        </div>
                        <div class="info-card">
                            <p>{{t('account.Center.index copy.5rmxwbksjqg0')}}</p>
                            <p>
                                {{
                                userInfo.createTime ? moment(userInfo.createTime).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    ) : '-'
                                }}
                            </p>
                        </div>
                        <div class="info-card">
                            <p>{{t('account.Center.index copy.5rmxwbksjvg0')}}</p>
                            <p>{{ userInfo.telephone || '-' }}</p>
                        </div>
                        <div class="info-card">
                            <p>{{t('account.Center.index copy.5rmxwbksk100')}}</p>
                            <p>{{ userInfo.name }}</p>
                        </div>
                        <div class="info-card">
                            <p>{{t('account.Center.index copy.5rmxwbksk640')}}</p>
                            <p>
                                {{
                                    (userInfo.roleList &&
                                        userInfo.roleList
                                            .map((item) => item.name)
                                            .join(',')) ||
                                    '-'
                                }}
                            </p>
                        </div>
                        <div class="info-card">
                            <p>{{t('account.Center.index copy.5rmxwbkskaw0')}}</p>
                            <p>
                                {{
                                    (userInfo.orgList &&
                                        userInfo.orgList
                                            .map((item) => item.name)
                                            .join(',')) ||
                                    '-'
                                }}
                            </p>
                        </div>
                        <div class="info-card">
                            <p>{{t('account.Center.index copy.5rmxwbkskg00')}}</p>
                            <p>{{ userInfo.email || '-' }}</p>
                        </div>
                    </div>
                    <AIcon
                        type="EditOutlined"
                        class="edit"
                        style="right: 40px"
                        @click="editInfoVisible = true"
                    />
                </div>
            </div>
            <div class="card" v-if='updatePassword'>
                <h3>{{t('account.Center.index copy.5rmxwbkskko0')}}</h3>
                <div class="content">
                    <div class="content" style="align-items: flex-end">
                        <AIcon
                            type="LockOutlined"
                            style="color: #1d39c4; font-size: 70px"
                        />
                        <span
                            style="margin-left: 5px; color: rgba(0, 0, 0, 0.55)"
                            >{{t('account.Center.index copy.5rmxwbkskow0')}}</span
                        >
                    </div>
                    <span class="edit">
                        <PermissionButton
                            :uhasPermission="`${permission}:update`"
                            type="link"
                            @click="editPasswordVisible = true"
                        >
                            <AIcon type="EditOutlined" style="color: #1d39c4" />
                        </PermissionButton>
                    </span>
                </div>
            </div>
            <!-- 社区版不显示 -->
            <div class="card" v-if="isNoCommunity">
                <h3>{{t('account.Center.index copy.5rmxwbkskts0')}}</h3>
                <div class="content">
                    <div class="account-card" v-for="item in bindList">
                        <img
                            :src="item.logoUrl || getImage(bindIcon[item.provider])"
                            style="height: 50px;width: 50px"
                            width='50px'
                            height='50px'
                            alt=""
                        />
                        <Ellipsis style="width: 150px; font-size: 22px">
                            <div v-if="item.bound">
                                <div>{{ t('account.Center.index copy.bindName') + item.others.name }}</div>
                                <div>
                                    {{ t('account.Center.index copy.bindTime') +
                                        moment(item.bindTime).format(
                                            'YYYY-MM-DD HH:mm:ss',
                                        )
                                    }}
                                </div>
                            </div>
                            <div v-else>{{ item.name +  t('account.Center.index copy.unbind')}}</div>
                        </Ellipsis>
                        <j-popconfirm
                            v-if="item.bound"
                            :title="t('account.Center.index copy.5rmxwbkskyw0')"
                            @confirm="() => unBind(item.id)"
                        >
                            <j-button>{{t('account.Center.index copy.5rmxwbksl3g0')}}</j-button>
                        </j-popconfirm>
                        <j-button
                            v-else
                            type="primary"
                            @click="clickBind(item.id)"
                            >{{t('account.Center.index copy.5rmxwbkslag0')}}</j-button
                        >
                    </div>
                </div>
            </div>
            <!-- 第三方用户不显示 -->
            <div class="card" v-if="!isApiUser">
                <h3>{{t('account.Center.index copy.5rmxwbksles0')}}</h3>
                <div class="choose-view">
                    <j-row class="view-content" :gutter="24">
                        <j-col
                            :span="6"
                            class="select-item"
                            :class="{ selected: currentView === 'device' }"
                            @click="currentView = 'device'"
                        >
                            <img :src="getImage('/home/device.png')" alt="" />
                        </j-col>
                        <j-col
                            :span="6"
                            class="select-item"
                            :class="{ selected: currentView === 'ops' }"
                            @click="currentView = 'ops'"
                        >
                            <img :src="getImage('/home/ops.png')" alt="" />
                        </j-col>
                        <j-col
                            :span="6"
                            class="select-item"
                            :class="{
                                selected: currentView === 'comprehensive',
                            }"
                            @click="currentView = 'comprehensive'"
                        >
                            <img
                                :src="getImage('/home/comprehensive.png')"
                                alt=""
                            />
                        </j-col>
                    </j-row>
                    <j-button type="primary" class="btn" @click="confirm"
                        >{{t('account.Center.index copy.5rmxwbksljw0')}}</j-button
                    >
                </div>
            </div>

            <EditInfoDialog
                v-if="editInfoVisible"
                v-model:visible="editInfoVisible"
                :data="{ ...userInfo }"
                @ok="getUserInfo"
            />
            <EditPasswordDialog
                v-if="editPasswordVisible"
                v-model:visible="editPasswordVisible"
            />
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Center">
import PermissionButton from '@/components/PermissionButton/index.vue';
import EditInfoDialog from './components/EditInfoDialog.vue';
import EditPasswordDialog from './components/EditPasswordDialog.vue';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { LocalStore, getImage, onlyMessage } from '@/utils/comm'
import { message, UploadChangeParam, UploadFile } from 'ant-design-vue';
import {
    getMeInfo_api,
    getSsoBinds_api,
    unBind_api,
    updateMeInfo_api
} from '@/api/account/center';
import moment from 'moment';
import { getMe_api, getView_api, setView_api } from '@/api/home';
import { isNoCommunity } from '@/utils/utils';
import { userInfoType } from './typing';
import { usePermissionStore } from 'store/permission'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const btnHasPermission = usePermissionStore().hasPermission;
const updatePassword = btnHasPermission('account-center:user-center-passwd-update')
const permission = 'system/User';
const userInfo = ref<userInfoType>({} as any);
// 第三方账号
const bindList = ref<any[]>([]);
const bindIcon = {
    'dingtalk-ent-app': '/notice/dingtalk.png',
    'wechat-webapp': '/notice/wechat.png',
    'internal-standalone': '/apply/provider1.png',
    'third-party': '/apply/provider5.png',
};
const unBind = (id: string) => {
    unBind_api(id).then((resp) => {
        if (resp.status === 200) {
            message.success(t('account.Center.index copy.5rmxwbksls00'));
            getSsoBinds();
        }
    });
};
const clickBind = (id: string) => {
    window.open(
        `${BASE_API_PATH}/application/sso/${id}/login?autoCreateUser=false`,
    );
    localStorage.setItem('onBind', 'false');
    localStorage.setItem('onLogin', 'yes');
    window.onstorage = (e) => {
        if (e.newValue) {
            getSsoBinds();
        }
    };
};
const upload = reactive({
    fileList: [] as any[],
    uploadLoading: false,
    changeBackUpload: (info: UploadChangeParam<UploadFile<any>>) => {
        if (info.file.status === 'uploading') {
            upload.uploadLoading = true;
        } else if (info.file.status === 'done') {
            info.file.url = info.file.response?.result;
            upload.uploadLoading = false;
            userInfo.value.avatar = info.file.response?.result;
            updateMeInfo_api(userInfo.value).then(res => {
              if(res.success) {
                onlyMessage(t('account.Center.index copy.5rmxwbkslw80'))
              }
            })
        } else if (info.file.status === 'error') {
            upload.uploadLoading = false;
          onlyMessage(t('account.Center.index copy.fail'), 'error');
        }
    },
    beforeUpload: ({ size, type }: File) => {
        const imageTypes = ['jpg', 'png', 'jfif', 'pjp', 'pjpeg', 'jpeg'];
        const typeBool =
            imageTypes.filter((typeStr) => type.includes(typeStr)).length > 0;
        const sizeBool = size < 4 * 1024 * 1024;

        (typeBool && sizeBool) || message.error(t('account.Center.index copy.5rmxwbksm0w0'));
        return typeBool && sizeBool;
    },
});
// 首页视图
const isApiUser = ref<boolean>();
const currentView = ref<string>('');
const confirm = () => {
    setView_api({
        name: 'view',
        content: currentView.value,
    }).then(() => message.success(t('account.Center.index copy.5rmxwbksm8o0')));
};

const editInfoVisible = ref<boolean>(false);
const editPasswordVisible = ref<boolean>(false);
init();

function init() {
    getUserInfo();
    isNoCommunity && getSsoBinds();
    getViews();
}

/**
 * 获取用户信息
 */
function getUserInfo() {
    getMeInfo_api().then((resp) => {
        userInfo.value = resp.result as userInfoType;
    });
}
/**
 * 获取绑定第三方账号
 */
function getSsoBinds() {
    getSsoBinds_api().then((resp: any) => {
        if (resp.status === 200) bindList.value = resp.result;
    });
}
/**
 * 获取首页视图
 */
function getViews() {
    // 判断是否是api用户 不是则获取选中的视图
    getMe_api()
        .then((resp: any) => {
            if (resp && resp.status === 200) {
                isApiUser.value = resp.result.dimensions.find(
                    (item: any) =>
                        item.type === 'api-client' ||
                        item.type.id === 'api-client',
                );
                if (!isApiUser.value) return getView_api();
            }
        })
        .then((resp: any) => {
            if (resp?.status === 200) {
                if (resp.result) currentView.value = resp.result?.content;
                else if (resp.result?.username === 'admin') {
                    currentView.value = 'comprehensive';
                } else currentView.value = 'init';
            }
        });
}
</script>

<style lang="less" scoped>
.center-container {
    background-color: #f0f2f5;
    min-height: 100vh;
    .card {
        margin: 16px 0;
        padding: 24px;
        background-color: #fff;
        position: relative;

        h3 {
            font-size: 22px;

            &::before {
                display: inline-block;
                width: 3px;
                height: 0.7em;
                content: '';
                background-color: #2f54eb;
                margin: 0 8px;
            }
        }

        .content {
            display: flex;
            margin-top: 24px;
            flex-wrap: wrap;
            gap: 24px;

            .content-item {
                margin-right: 24px;

                .default-avatar {
                    background-color: #ccc;
                    color: #fff;
                    border-radius: 50%;
                    font-size: 70px;
                    width: 140px;
                    height: 140px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .info-card {
                    width: 25%;

                    :first-child {
                        font-weight: bold;
                    }
                    :last-child {
                        color: #666363d9;
                    }
                }
                &.flex-item {
                    display: flex;
                    flex-wrap: wrap;
                }
            }

            .edit {
                position: absolute;
                cursor: pointer;
                top: 30px;
                right: 24px;
                color: #1d39c4;
            }

            .account-card {
                width: 415px;
                background-image: url(/images/notice/dingtalk-background.png);
                border-right: 1px solid #f0f0f0;
                border-bottom: 1px solid #f0f0f0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 24px;
            }
        }

        .choose-view {
            width: 100%;
            margin-top: 48px;
            .view-content {
                display: flex;
                flex-flow: row wrap;
                .select-item {
                    border: 2px solid transparent;
                    img {
                        width: 100%;
                    }

                    &.selected {
                        border-color: #10239e;
                    }
                }
            }

            .btn {
                display: block;
                margin: 48px auto;
                margin-bottom: 0;
            }
        }
    }
}
</style>
