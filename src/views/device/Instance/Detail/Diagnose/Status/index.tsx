import { Badge, Button, Popconfirm, Space } from "jetlinks-ui-components"
import TitleComponent from '@/components/TitleComponent/index.vue'
import styles from './index.module.less'
import type { ListProps } from './util'
import { getNetworkInitList, getChildInitList, getCloudInitList, getMediaInitList, TextColorMap, StatusMap, modifyArrayList, isExit, gatewayList, urlMap } from './util'
import { useInstanceStore } from "@/store/instance"
import { startNetwork, startGateway, getGatewayDetail, queryGatewayState, queryProtocolDetail, detail, queryProductState, queryProductConfig, queryDeviceConfig, _deploy } from '@/api/device/instance'
import { PropType, VNode } from "vue"
import { _deploy as _deployProduct } from "@/api/device/product"
import _ from "lodash"
import DiagnosticAdvice from './DiagnosticAdvice'
import ManualInspection from './ManualInspection'
import { deployDevice } from "@/api/initHome"
import PermissionButton from '@/components/PermissionButton/index.vue'
import { useMenuStore } from "@/store/menu"
import BindParentDevice from '../../components/BindParentDevice/index.vue'
import { onlyMessage } from "@/utils/comm"
import { useI18n } from 'vue-i18n'

type TypeProps = 'network' | 'child-device' | 'media' | 'cloud' | 'channel'

const Status = defineComponent({
    components: { TitleComponent },
    props: {
        providerType: {
            type: String as PropType<TypeProps>,
            default: undefined
        }
    },
    emits: ['percentChange', 'countChange', 'stateChange'],
    setup(props, { emit }) {
        const { t } = useI18n()
        const instanceStore = useInstanceStore()
        const time = 500;

        const status = ref<'loading' | 'finish'>('loading')

        const device = ref(instanceStore.current)
        const gateway = ref<Partial<Record<string, any>>>({}) // 网关信息
        const parent = ref<Partial<Record<string, any>>>({}) // 父设备
        const product = ref<Partial<Record<string, any>>>({}) // 产品

        const artificialVisible = ref<boolean>(false)
        const artificialData = ref<Partial<Record<string, any>>>()

        const diagnoseVisible = ref<boolean>(false)
        const diagnoseData = ref<Partial<Record<string, any>>>()

        const bindParentVisible = ref<boolean>(false)
        const menuStory = useMenuStore();

        const configuration = reactive<{
            product: Record<string, any>,
            device: Record<string, any>
        }>({
            product: {},
            device: []
        })

        const list = ref<ListProps[]>([])

        const manualInspection = (params: any) => {
            artificialVisible.value = true
            artificialData.value = params
        }

        const jumpAccessConfig = () => {
            menuStory.jumpPage('device/Product/Detail', { id: unref(device).productId, tab: 'access' });
        };

        const jumpDeviceConfig = () => {
            instanceStore.tabActiveKey = 'Info'
        }

        // 网络信息
        const diagnoseNetwork = () => new Promise(async (resolve) => {
            if (unref(device).state?.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(unref(list), {
                        key: 'network',
                        name: t('Instance.tsx.index.module'),
                        desc: t('Instance.tsx.index.moduleTip'),
                        status: 'success',
                        text: t('Instance.tsx.index.normal'),
                        info: null,
                    });
                    resolve({})
                }, time)
            } else {
                const _device = unref(device)
                if (_device.accessId) {
                    const response: Record<string, any> = await queryGatewayState(_device.accessId)
                    if (response.status === 200) {
                        gateway.value = response.request
                        const address = response.result?.channelInfo?.addresses || [];
                        const _label = address.some((i: any) => i.health === -1);
                        const __label = address.every((i: any) => i.health === 1);
                        const health = _label ? -1 : __label ? 1 : 0;
                        let _item: ListProps | undefined = undefined
                        if (health === 1) {
                            _item = {
                                key: 'network',
                                name: t('Instance.tsx.index.module'),
                                desc: t('Instance.tsx.index.moduleTip'),
                                status: 'success',
                                text: t('Instance.tsx.index.normal'),
                                info: null,
                            };
                        } else {
                            _item = {
                                key: 'network',
                                name: t('Instance.tsx.index.module'),
                                desc: t('Instance.tsx.index.moduleTip'),
                                status: 'error',
                                text: t('Instance.tsx.index.abnormal'),
                                info: health === -1 ? (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>{t('Instance.tsx.index.enableTip')}
                                                        <PermissionButton
                                                            type="link"
                                                            style="padding: 0"
                                                            hasPermission="link/Type:action"
                                                            popConfirm={{
                                                                title: t('Instance.tsx.index.confirmEnable'),
                                                                onConfirm: async () => {
                                                                    const res = await startNetwork(
                                                                        unref(gateway)?.channelId,
                                                                    );
                                                                    if (res.status === 200) {
                                                                        onlyMessage(t('Instance.tsx.index.suc'));
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: 'network',
                                                                                name: t('Instance.tsx.index.module'),
                                                                                desc: t('Instance.tsx.index.moduleTip'),
                                                                                status: 'success',
                                                                                text: t('Instance.tsx.index.normal'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            {t('Instance.tsx.index.enable')}
                                                        </PermissionButton>
                                                    </span>
                                                }
                                            />
                                        </div>
                                    </div >
                                ) : (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={t('Instance.tsx.index.portTip')}
                                            />
                                        </div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={t('Instance.tsx.index.firewallTip')}
                                            />
                                        </div>
                                    </div>
                                ),
                            };
                        }
                        setTimeout(() => {
                            if (_item) {
                                list.value = modifyArrayList(list.value, _item);
                            }
                            resolve({});
                        }, time);
                    } else {
                        onlyMessage(t('Instance.tsx.index.requestErr'), 'error')
                    }
                } else {
                    onlyMessage(t('Instance.tsx.index.noAccessId'), 'error')
                }
            }
        })

        // 设备接入网关
        const diagnoseGateway = () => new Promise(async (resolve) => {
            const desc = props.providerType && ['child-device', 'cloud'].includes(props.providerType)
                ? t('Instance.tsx.index.deviceAccessState1')
                : t('Instance.tsx.index.deviceAccessState2');
            if (unref(device).state.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(list.value, {
                        key: 'gateway',
                        name: t('Instance.tsx.index.gateway'),
                        desc: desc,
                        status: 'success',
                        text: t('Instance.tsx.index.normal'),
                        info: null,
                    });
                    resolve({});
                }, time);
            } else {
                let _item: ListProps | undefined = undefined
                if (!unref(gateway)?.id) {
                    const accessId = unref(device)?.accessId
                    if (accessId) {
                        const response: Record<string, any> = await queryGatewayState(accessId)
                        if (response.status === 200) {
                            gateway.value = response.result
                            if (response.result?.state?.value === 'enabled') {
                                if (props.providerType === 'cloud' || unref(device)?.accessProvider === 'gb28181-2016') {
                                    _item = {
                                        key: 'gateway',
                                        name: t('Instance.tsx.index.gateway'),
                                        desc: desc,
                                        status: 'warning',
                                        text: t('Instance.tsx.index.possibleAb'),
                                        info: (
                                            <div>
                                                <div class={styles.infoItem}>
                                                    <Badge
                                                        status="default"
                                                        text={
                                                            <span>
                                                                {t('Instance.tsx.index.please')}<Button type="link" style="padding: 0" onClick={async () => {
                                                                    const config: any = await getGatewayDetail(
                                                                        response.result?.id || '',
                                                                    );
                                                                    if (config.status === 200) {
                                                                        manualInspection({
                                                                            type: props.providerType,
                                                                            key: `gateway`,
                                                                            name: t('Instance.tsx.index.gateway'),
                                                                            desc: desc,
                                                                            data: { name: `${unref(device)?.accessProvider + t('Instance.tsx.index.disposition')}` },
                                                                            configuration: { ...config.result },
                                                                        });
                                                                    }
                                                                }}>{t('Instance.tsx.index.manualCheck')}</Button>{t('Instance.tsx.index.dispositionTip')}
                                                                <Popconfirm
                                                                    title={t('Instance.tsx.index.ignoreTip')}
                                                                    onConfirm={() => {
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: 'gateway',
                                                                                name: t('Instance.tsx.index.gateway'),
                                                                                desc: desc,
                                                                                status: 'success',
                                                                                text: t('Instance.tsx.index.normal'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }}
                                                                >
                                                                    <Button type="link" style="padding: 0">{t('Instance.tsx.index.disposition')}</Button>
                                                                </Popconfirm>
                                                            </span>
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ),
                                    };
                                } else {
                                    _item = {
                                        key: 'gateway',
                                        name: t('Instance.tsx.index.gateway'),
                                        desc: desc,
                                        status: 'success',
                                        text: t('Instance.tsx.index.normal'),
                                        info: null,
                                    };
                                }
                            } else {
                                _item = {
                                    key: 'gateway',
                                    name: t('Instance.tsx.index.gateway'),
                                    desc: desc,
                                    status: 'error',
                                    text: t('Instance.tsx.index.abnormal'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={<span>{t('Instance.tsx.index.gatewayDisableTip')}
                                                        <PermissionButton
                                                            hasPermission="link/Type:action"
                                                            type="link"
                                                            style="padding: 0"
                                                            popConfirm={{
                                                                title: t('Instance.tsx.index.confirmEnable'),
                                                                onConfirm: async () => {
                                                                    const resp = await startGateway(unref(device).accessId || '');
                                                                    if (resp.status === 200) {
                                                                        onlyMessage(t('Instance.tsx.index.suc'));
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: 'gateway',
                                                                                name: t('Instance.tsx.index.gateway'),
                                                                                desc: desc,
                                                                                status: 'success',
                                                                                text: t('Instance.tsx.index.normal'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            {t('Instance.tsx.index.enable')}
                                                        </PermissionButton>
                                                    </span>}
                                                />
                                            </div>
                                        </div>
                                    ),
                                };
                            }
                            setTimeout(() => {
                                if (_item) {
                                    list.value = modifyArrayList(list.value, _item);
                                }
                                resolve({});
                            }, time);
                        } else {
                            onlyMessage(t('Instance.tsx.index.requestErr'), 'error')
                        }
                    } else {
                        onlyMessage(t('Instance.tsx.index.noAccessId'), 'error')
                    }
                } else {
                    if (unref(gateway)?.state?.value === 'enabled') {
                        if (props.providerType === 'cloud' || unref(device)?.accessProvider === 'gb28181-2016') {
                            _item = {
                                key: 'gateway',
                                name: t('Instance.tsx.index.gateway'),
                                desc: desc,
                                status: 'warning',
                                text: t('Instance.tsx.index.possibleAb'),
                                info: (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>
                                                        {t('Instance.tsx.index.please')}<Button type="link" style="padding: 0"
                                                            onClick={async () => {
                                                                const config: any = await getGatewayDetail(
                                                                    unref(gateway)?.id || '',
                                                                );
                                                                if (config.status === 200) {
                                                                    manualInspection({
                                                                        type: props.providerType,
                                                                        key: `gateway`,
                                                                        name: t('Instance.tsx.index.gateway'),
                                                                        desc: desc,
                                                                        data: { name: `${unref(device)?.accessProvider}${t('Instance.tsx.index.disposition')}` },
                                                                        configuration: { ...config.result },
                                                                    });
                                                                }
                                                            }}
                                                        >{t('Instance.tsx.index.manualCheck')}</Button>
                                                        {t('Instance.tsx.index.dispositionTip')}
                                                        <Popconfirm
                                                            title={t('Instance.tsx.index.ignoreTip')}
                                                            onConfirm={() => {
                                                                list.value = modifyArrayList(
                                                                    list.value,
                                                                    {
                                                                        key: 'gateway',
                                                                        name: t('Instance.tsx.index.gateway'),
                                                                        desc: desc,
                                                                        status: 'success',
                                                                        text: t('Instance.tsx.index.normal'),
                                                                        info: null,
                                                                    },
                                                                );
                                                            }}
                                                        >
                                                            <Button type="link" style="padding: 0">{t('Instance.tsx.index.disposition')}</Button>
                                                        </Popconfirm>
                                                    </span>
                                                }
                                            />
                                        </div>
                                    </div>
                                ),
                            };
                        } else {
                            _item = {
                                key: 'gateway',
                                name: t('Instance.tsx.index.gateway'),
                                desc: desc,
                                status: 'success',
                                text: t('Instance.tsx.index.normal'),
                                info: null,
                            };
                        }
                    } else {
                        _item = {
                            key: 'gateway',
                            name: t('Instance.tsx.index.gateway'),
                            desc: desc,
                            status: 'error',
                            text: t('Instance.tsx.index.abnormal'),
                            info: (
                                <div>
                                    <div class={styles.infoItem}>
                                        <Badge
                                            status="default"
                                            text={
                                                <span>
                                                    {t('Instance.tsx.index.gatewayDisableTip')}
                                                    <PermissionButton
                                                        hasPermission="link/AccessConfig:action"
                                                        type="link"
                                                        style="padding: 0"
                                                        popConfirm={{
                                                            title: t('Instance.tsx.index.confirmEnable'),
                                                            onConfirm: async () => {
                                                                const resp = await startGateway(unref(device).accessId || '');
                                                                if (resp.status === 200) {
                                                                    onlyMessage(t('Instance.tsx.index.suc'));
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: 'gateway',
                                                                            name: t('Instance.tsx.index.gateway'),
                                                                            desc: desc,
                                                                            status: 'success',
                                                                            text: t('Instance.tsx.index.normal'),
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        {t('Instance.tsx.index.enable')}
                                                    </PermissionButton>
                                                </span>
                                            }
                                        />
                                    </div>
                                </div>
                            ),
                        };
                    }
                    setTimeout(() => {
                        if (_item) {
                            list.value = modifyArrayList(list.value, _item);
                        }
                        resolve({});
                    }, time);
                }
            }
        })

        // 网关父设备
        const diagnoseParentDevice = () => new Promise(async (resolve) => {
            if (unref(device).state.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(unref(list), {
                        key: 'parent-device',
                        name: t('Instance.tsx.index.gatewayParent'),
                        desc: t('Instance.tsx.index.gatewayParentTip'),
                        status: 'success',
                        text: t('Instance.tsx.index.normal'),
                        info: null,
                    });
                    resolve({});
                }, time);
            } else {
                const _device = unref(device)
                if (!_device?.parentId) {
                    setTimeout(() => {
                        list.value = modifyArrayList(unref(list), {
                            key: 'parent-device',
                            name: t('Instance.tsx.index.gatewayParent'),
                            desc: t('Instance.tsx.index.gatewayParentTip'),
                            status: 'error',
                            text: t('Instance.tsx.index.abnormal'),
                            info: (
                                <div>
                                    <div class={styles.infoItem}>
                                        <Badge
                                            status="default"
                                            text={
                                                <span>
                                                    {t('Instance.tsx.index.parentUnbind')}
                                                    <Button type="link" style="padding: 0"
                                                        onClick={() => {
                                                            bindParentVisible.value = true
                                                        }}
                                                    >
                                                        {t('Instance.tsx.index.bind')}
                                                    </Button>
                                                    {t('Instance.tsx.index.parentRetry')}
                                                </span>
                                            }
                                        />
                                    </div>
                                </div>
                            ),
                        });
                        resolve({});
                    }, time);
                } else {
                    let _item: ListProps | undefined = undefined;
                    const response = await detail(_device?.parentId);
                    parent.value = response.result
                    if (response.status === 200) {
                        if (response?.result?.state?.value === 'notActive') {
                            _item = {
                                key: 'parent-device',
                                name: t('Instance.tsx.index.gatewayParent'),
                                desc: t('Instance.tsx.index.gatewayParentTip'),
                                status: 'error',
                                text: t('Instance.tsx.index.abnormal'),
                                info: (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>
                                                        {t('Instance.tsx.index.parentDisable')}
                                                        <PermissionButton
                                                            hasPermission="device/Product:action"
                                                            type="link"
                                                            style="padding: 0"
                                                            popConfirm={{
                                                                title: t('Instance.tsx.index.confirmEnable'),
                                                                onConfirm: async () => {
                                                                    const resp = await _deploy(response?.result?.id || '');
                                                                    if (resp.status === 200) {
                                                                        onlyMessage(t('Instance.tsx.index.suc'));
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: 'parent-device',
                                                                                name: t('Instance.tsx.index.gatewayParent'),
                                                                                desc: t('Instance.tsx.index.gatewayParentTip'),
                                                                                status: 'success',
                                                                                text: t('Instance.tsx.index.normal'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            {t('Instance.tsx.index.enable')}
                                                        </PermissionButton>
                                                    </span>
                                                }
                                            />
                                        </div>
                                    </div>
                                ),
                            };
                        } else if (response?.result?.state?.value === 'online') {
                            _item = {
                                key: 'parent-device',
                                name: t('Instance.tsx.index.gatewayParent'),
                                desc: t('Instance.tsx.index.gatewayParentTip'),
                                status: 'success',
                                text: t('Instance.tsx.index.normal'),
                                info: null,
                            };
                        } else {
                            _item = {
                                key: 'parent-device',
                                name: t('Instance.tsx.index.gatewayParent'),
                                desc: t('Instance.tsx.index.gatewayParentTip'),
                                status: 'error',
                                text: t('Instance.tsx.index.abnormal'),
                                info: (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={<span>{t('Instance.tsx.index.parentOffline')}</span>}
                                            />
                                        </div>
                                    </div>
                                ),
                            };
                        }
                        setTimeout(() => {
                            if (_item) {
                                list.value = modifyArrayList(unref(list), _item);
                            }
                            resolve({});
                        }, time);
                    }
                }
            }
        })

        // 产品状态
        const diagnoseProduct = () => new Promise(async (resolve) => {
            if (unref(device).state?.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(unref(list), {
                        key: 'product',
                        name: t('Instance.tsx.index.productState'),
                        desc: t('Instance.tsx.index.productTip'),
                        status: 'success',
                        text: t('Instance.tsx.index.normal'),
                        info: null,
                    });
                    resolve({});
                }, time);
            } else {
                const _device = unref(device)
                if (_device.productId) {
                    const response: Record<string, any> = await queryProductState(_device.productId)
                    if (response.status === 200) {
                        product.value = response.result
                        let _item: ListProps | undefined = undefined
                        const state = response.result?.state
                        _item = {
                            key: 'product',
                            name: t('Instance.tsx.index.productState'),
                            desc: t('Instance.tsx.index.productTip'),
                            status: state === 1 ? 'success' : 'error',
                            text: state === 1 ? t('Instance.tsx.index.normal') : t('Instance.tsx.index.abnormal'),
                            info:
                                state === 1 ? null : (
                                    <div>
                                        <div class={styles.infoItem}>
                                            <Badge
                                                status="default"
                                                text={
                                                    <span>
                                                        {t('Instance.tsx.index.productDisable')}
                                                        <PermissionButton
                                                            hasPermission="device/Product:action"
                                                            type="link"
                                                            style="padding: 0"
                                                            popConfirm={{
                                                                title: t('Instance.tsx.index.confirmEnable'),
                                                                onConfirm: async () => {
                                                                    const resp = await _deployProduct(unref(device).productId || '');
                                                                    if (resp.status === 200) {
                                                                        onlyMessage(t('Instance.tsx.index.suc'));
                                                                        list.value = modifyArrayList(
                                                                            list.value,
                                                                            {
                                                                                key: 'product',
                                                                                name: t('Instance.tsx.index.productState'),
                                                                                desc: t('Instance.tsx.index.productTip'),
                                                                                status: 'success',
                                                                                text: t('Instance.tsx.index.normal'),
                                                                                info: null,
                                                                            },
                                                                        );
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            {t('Instance.tsx.index.enable')}
                                                        </PermissionButton>
                                                        {t('Instance.tsx.index.product')}
                                                    </span>
                                                }
                                            />
                                        </div>
                                    </div>
                                ),
                        };
                        setTimeout(() => {
                            if (_item) {
                                list.value = modifyArrayList(unref(list), _item);
                            }
                            resolve({});
                        }, time);
                    }
                }
            }
        })

        // 设备状态
        const diagnoseDevice = () => new Promise(resolve => {
            const _device = unref(device)
            if (_device.state?.value === 'online') {
                setTimeout(() => {
                    list.value = modifyArrayList(unref(list), {
                        key: 'device',
                        name: t('Instance.tsx.index.deviceState'),
                        desc: t('Instance.tsx.index.deviceTip'),
                        status: 'success',
                        text: t('Instance.tsx.index.normal'),
                        info: null,
                    });
                    resolve({});
                }, time);
            } else {
                let item: ListProps | undefined = undefined;
                if (_device.state?.value === 'notActive') {
                    item = {
                        key: 'device',
                        name: t('Instance.tsx.index.deviceState'),
                        desc: t('Instance.tsx.index.deviceTip'),
                        status: 'error',
                        text: t('Instance.tsx.index.abnormal'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    <Badge
                                        status="default"
                                        text={
                                            <span>
                                                {t('Instance.tsx.index.deviceDisable')}
                                                <PermissionButton
                                                    hasPermission="device/Instance:action"
                                                    type="link"
                                                    style="padding: 0"
                                                    popConfirm={{
                                                        title: t('Instance.tsx.index.confirmEnable'),
                                                        onConfirm: async () => {
                                                            const resp = await _deploy(unref(device)?.id || '');
                                                            if (resp.status === 200) {
                                                                instanceStore.current.state = { value: 'offline', text: t('Instance.tsx.index.offline') }
                                                                onlyMessage(t('Instance.tsx.index.suc'));
                                                                list.value = modifyArrayList(
                                                                    list.value,
                                                                    {
                                                                        key: 'device',
                                                                        name: t('Instance.tsx.index.deviceState'),
                                                                        desc: t('Instance.tsx.index.deviceTip'),
                                                                        status: 'success',
                                                                        text: t('Instance.tsx.index.normal'),
                                                                        info: null,
                                                                    },
                                                                );
                                                            }
                                                        }
                                                    }}
                                                >
                                                    {t('Instance.tsx.index.enable')}
                                                </PermissionButton>
                                                {t('Instance.tsx.index.device')}
                                            </span>
                                        }
                                    />
                                </div>
                            </div>
                        ),
                    };
                } else {
                    item = {
                        key: 'device',
                        name: t('Instance.tsx.index.deviceState'),
                        desc: t('Instance.tsx.index.deviceTip'),
                        status: 'success',
                        text: t('Instance.tsx.index.normal'),
                        info: null,
                    };
                }
                setTimeout(() => {
                    if (item) {
                        list.value = modifyArrayList(unref(list), item);
                    }
                    resolve({});
                }, time);
            }
        })

        // 产品认证配置
        const diagnoseProductAuthConfig = () => new Promise(async (resolve) => {
            const _device = unref(device)
            if (_device.productId) {
                const response: Record<string, any> = await queryProductConfig(_device.productId)
                if (response.status === 200 && response.result.length > 0) {
                    configuration.product = response.result;
                    const _configuration = unref(product)?.configuration || {};
                    response.result.map((item: any, i: number) => {
                        const _list = [...list.value];
                        if (!_.map(_list, 'key').includes(`product-auth${i}`)) {
                            list.value = modifyArrayList(
                                list.value,
                                {
                                    key: `product-auth${i}`,
                                    name: `${t('Instance.tsx.index.product') + '-' + item?.name}`,
                                    desc: t('Instance.tsx.index.MQTTTip') ,
                                    status: 'loading',
                                    text: t('Instance.tsx.index.diagnosing') ,
                                    info: null,
                                },
                                list.value.length,
                            );
                        }
                        const properties = _.map(item?.properties, 'property');
                        if (unref(device).state?.value === 'online') {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `product-auth${i}`,
                                    name: `${t('Instance.tsx.index.product') + '-' + item?.name}`,
                                    desc: t('Instance.tsx.index.MQTTTip') ,
                                    status: 'success',
                                    text: t('Instance.tsx.index.normal'),
                                    info: null,
                                });
                                resolve({});
                            }, time);
                        } else if (
                            !isExit(
                                properties,
                                Object.keys(_configuration).filter((k: string) => !!_configuration[k]),
                            )
                        ) {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `product-auth${i}`,
                                    name: `${t('Instance.tsx.index.product') + '-' + item?.name}`,
                                    desc: t('Instance.tsx.index.MQTTTip') ,
                                    status: 'error',
                                    text: t('Instance.tsx.index.abnormal'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            {t('Instance.tsx.index.approveTip')}
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    jumpAccessConfig();
                                                                }}
                                                            >
                                                                {t('Instance.tsx.index.fillOut')}
                                                            </Button>
                                                            {t('Instance.tsx.index.approveNoNeed')}
                                                            <Popconfirm
                                                                title={t('Instance.tsx.index.ignoreTip')}
                                                                onConfirm={() => {
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: `product-auth${i}`,
                                                                            name: `${t('Instance.tsx.index.product') + '-' + item?.name}`,
                                                                            desc: t('Instance.tsx.index.MQTTTip') ,
                                                                            status: 'success',
                                                                            text: t('Instance.tsx.index.normal'),
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                <Button type="link" style="padding: 0">{t('Instance.tsx.index.disposition')}</Button>
                                                            </Popconfirm>
                                                        </span>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ),
                                });
                                resolve({});
                            }, time);
                        } else {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `product-auth${i}`,
                                    name: `${t('Instance.tsx.index.product') + '-' + item?.name}`,
                                    desc: t('Instance.tsx.index.MQTTTip') ,
                                    status: 'warning',
                                    text: t('Instance.tsx.index.possibleAb'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            {t('Instance.tsx.index.please')}
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    manualInspection({
                                                                        type: 'product',
                                                                        key: `product-auth${i}`,
                                                                        name: `${t('Instance.tsx.index.product') + '-' + item?.name}`,
                                                                        desc: t('Instance.tsx.index.MQTTTip') ,
                                                                        data: { ...item },
                                                                        configuration: _configuration,
                                                                        productId: unref(device).productId,
                                                                    });
                                                                }}
                                                            >
                                                                {t('Instance.tsx.index.manualCheck')}
                                                            </Button>
                                                            {t('Instance.tsx.index.product') + item.name + t('Instance.tsx.index.NoNeedTip')}
                                                            <Popconfirm
                                                                title={t('Instance.tsx.index.ignoreTip')}
                                                                onConfirm={() => {
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: `product-auth${i}`,
                                                                            name: `${t('Instance.tsx.index.product') + '-' + item?.name}`,
                                                                            desc: t('Instance.tsx.index.MQTTTip') ,
                                                                            status: 'success',
                                                                            text: t('Instance.tsx.index.normal'),
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                <Button type="link" style="padding: 0">{t('Instance.tsx.index.disposition')}</Button>
                                                            </Popconfirm>
                                                        </span>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ),
                                });
                                resolve({});
                            }, time);
                        }
                    });
                } else {
                    resolve({});
                }
            }
        })

        // 设备认证配置
        const diagnoseDeviceAuthConfig = () => new Promise(async (resolve) => {
            const _device = unref(device)
            if (_device.id) {
                const response: Record<string, any> = await queryDeviceConfig(_device.id)
                if (response.status === 200 && response.result.length > 0) {
                    configuration.device = response.result;
                    const _configuration = _device?.configuration || {};
                    response.result.map((item: any, i: number) => {
                        const _list = [...list.value];
                        if (!_.map(_list, 'key').includes(`device-auth${i}`)) {
                            list.value = modifyArrayList(
                                list.value,
                                {
                                    key: `device-auth${i}`,
                                    name: `${t('Instance.tsx.index.device') + '-' + item?.name}`,
                                    desc: t('Instance.tsx.index.deviceMQTT'),
                                    status: 'loading',
                                    text: t('Instance.tsx.index.diagnosing') ,
                                    info: null,
                                },
                                list.value.length,
                            );
                        }
                        const properties = _.map(item?.properties, 'property');
                        if (_device.state?.value === 'online') {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `device-auth${i}`,
                                    name: `${t('Instance.tsx.index.device') + '-' + item?.name}`,
                                    desc: t('Instance.tsx.index.deviceMQTT'),
                                    status: 'success',
                                    text: t('Instance.tsx.index.normal'),
                                    info: null,
                                });
                                resolve({});
                            }, time);
                        } else if (
                            !isExit(
                                properties,
                                Object.keys(_configuration).filter((k: string) => !!_configuration[k]),
                            )
                        ) {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `device-auth${i}`,
                                    name: `${t('Instance.tsx.index.device') + '-' + item?.name}`,
                                    desc: t('Instance.tsx.index.deviceMQTT'),
                                    status: 'error',
                                    text: t('Instance.tsx.index.abnormal'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            {t('Instance.tsx.index.approveTip')}
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    jumpDeviceConfig();
                                                                }}
                                                            >
                                                                {t('Instance.tsx.index.fillOut')}
                                                            </Button>
                                                            {t('Instance.tsx.index.approveNoNeed')}
                                                            <Popconfirm
                                                                title={t('Instance.tsx.index.ignoreTip')}
                                                                onConfirm={() => {
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: `device-auth${i}`,
                                                                            name: `${t('Instance.tsx.index.device') + '-' + item?.name}`,
                                                                            desc: t('Instance.tsx.index.deviceMQTT'),
                                                                            status: 'success',
                                                                            text: t('Instance.tsx.index.normal'),
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                <Button type="link" style="padding: 0">{t('Instance.tsx.index.disposition')}</Button>
                                                            </Popconfirm>
                                                        </span>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ),
                                });
                                resolve({});
                            }, time);
                        } else {
                            setTimeout(() => {
                                list.value = modifyArrayList(list.value, {
                                    key: `device-auth${i}`,
                                    name: `${t('Instance.tsx.index.device') + '-' + item?.name}`,
                                    desc: t('Instance.tsx.index.deviceMQTT'),
                                    status: 'warning',
                                    text: t('Instance.tsx.index.possibleAb'),
                                    info: (
                                        <div>
                                            <div class={styles.infoItem}>
                                                <Badge
                                                    status="default"
                                                    text={
                                                        <span>
                                                            {t('Instance.tsx.index.please')}
                                                            <Button type="link" style="padding: 0"
                                                                onClick={() => {
                                                                    manualInspection({
                                                                        type: 'device',
                                                                        key: `device-auth${i}`,
                                                                        name: `${t('Instance.tsx.index.device') + '-' + item?.name}`,
                                                                        desc: t('Instance.tsx.index.deviceMQTT'),
                                                                        data: { ...item },
                                                                        configuration: _configuration,
                                                                        productId: unref(device).productId,
                                                                    });
                                                                }}
                                                            >
                                                                {t('Instance.tsx.index.manualCheck')}
                                                            </Button>
                                                            {t('Instance.tsx.index.device') + item.name + t('Instance.tsx.index.NoNeedTip')}
                                                            <Popconfirm
                                                                title={t('Instance.tsx.index.ignoreTip')}
                                                                onConfirm={() => {
                                                                    list.value = modifyArrayList(
                                                                        list.value,
                                                                        {
                                                                            key: `device-auth${i}`,
                                                                            name: `${t('Instance.tsx.index.device') + '-' + item?.name}`,
                                                                            desc: t('Instance.tsx.index.deviceMQTT'),
                                                                            status: 'success',
                                                                            text: t('Instance.tsx.index.normal'),
                                                                            info: null,
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                <Button type="link" style="padding: 0">{t('Instance.tsx.index.disposition')}</Button>
                                                            </Popconfirm>
                                                        </span>
                                                    }
                                                />
                                            </div>
                                        </div>
                                    ),
                                });
                                resolve({});
                            }, time);
                        }
                    });
                } else {
                    resolve({});
                }
            }
        })

        // onenet
        const diagnoseOnenet = () => new Promise(async (resolve) => {
            const _device = unref(device)
            if (_device?.accessProvider === 'OneNet') {
                const response: any = await queryDeviceConfig(_device?.id || '');
                configuration.device = response.result;
                const _configuration = _device?.configuration || {};
                let item: ListProps | undefined = undefined;
                if (
                    _device.configuration?.onenet_imei ||
                    _device.configuration?.onenet_imsi ||
                    (unref(product)?.configuration &&
                        unref(product)?.configuration['api-key'])
                ) {
                    item = {
                        key: `onenet`,
                        name: t('Instance.tsx.index.deviceOneNet'),
                        desc: t('Instance.tsx.index.deviceOneNetTip'),
                        status: 'warning',
                        text: t('Instance.tsx.index.possibleAb'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    {t('Instance.tsx.index.please')}
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            manualInspection({
                                                type: 'device',
                                                key: `onenet`,
                                                name: t('Instance.tsx.index.deviceOneNet'),
                                                desc: t('Instance.tsx.index.deviceOneNetTip'),
                                                data: { ...response.result[0] },
                                                configuration: _configuration,
                                            });
                                        }}
                                    >
                                        {t('Instance.tsx.index.manualCheck')}
                                    </Button>
                                    {t('Instance.tsx.index.deviceoneNetNo')}
                                    <Popconfirm
                                        title={t('Instance.tsx.index.ignoreTip')}
                                        onConfirm={() => {
                                            list.value = modifyArrayList(list.value, {
                                                key: `onenet`,
                                                name: t('Instance.tsx.index.deviceOneNet'),
                                                desc: t('Instance.tsx.index.deviceOneNetTip'),
                                                status: 'success',
                                                text: t('Instance.tsx.index.normal'),
                                                info: null,
                                            });
                                        }}
                                    >
                                        <Button type="link" style="padding: 0">{t('Instance.tsx.index.disposition')}</Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        ),
                    };
                } else {
                    item = {
                        key: `onenet`,
                        name: t('Instance.tsx.index.deviceOneNet'),
                        desc: t('Instance.tsx.index.deviceOneNetTip'),
                        status: 'error',
                        text: t('Instance.tsx.index.abnormal'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    {t('Instance.tsx.index.approveTip')}
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            jumpDeviceConfig();
                                        }}
                                    >
                                        {t('Instance.tsx.index.fillOut')}
                                    </Button>
                                    {t('Instance.tsx.index.approveNoNeed')}
                                    <Popconfirm
                                        title={t('Instance.tsx.index.ignoreTip')}
                                        onConfirm={() => {
                                            list.value = modifyArrayList(list.value, {
                                                key: `onenet`,
                                                name: t('Instance.tsx.index.deviceOneNet'),
                                                desc: t('Instance.tsx.index.deviceOneNetTip'),
                                                status: 'success',
                                                text: t('Instance.tsx.index.normal'),
                                                info: null,
                                            });
                                        }}
                                    >
                                        <Button type="link" style="padding: 0">{t('Instance.tsx.index.disposition')}</Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        ),
                    };
                }
                setTimeout(() => {
                    if (item) {
                        list.value = modifyArrayList(
                            list.value,
                            item,
                            list.value.length,
                        );
                    }
                    resolve({});
                }, time);
            } else {
                resolve({});
            }
        })

        // ctwing
        const diagnoseCTWing = () => new Promise(async (resolve) => {
            const _device = unref(device)
            if (_device?.accessProvider === 'Ctwing') {
                const response: any = await queryDeviceConfig(_device?.id || '');
                configuration.device = response.result;
                const _configuration = _device?.configuration || {};
                let item: ListProps | undefined = undefined;
                const config = unref(product)?.configuration;
                if (
                    _device.configuration?.ctwing_imei ||
                    _device.configuration?.ctwing_imsi ||
                    (config && (config.ctwing_product_id || config.master_key))
                ) {
                    item = {
                        key: `ctwing`,
                        name: t('Instance.tsx.index.ctwing'),
                        desc: t('Instance.tsx.index.ctwingTip'),
                        status: 'warning',
                        text: t('Instance.tsx.index.possibleAb'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    {t('Instance.tsx.index.please')}
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            manualInspection({
                                                type: 'device',
                                                key: `ctwing`,
                                                name: t('Instance.tsx.index.ctwing'),
                                                desc: t('Instance.tsx.index.ctwingTip'),
                                                data: { ...response.result[0] },
                                                configuration: _configuration,
                                            });
                                        }}
                                    >
                                        {t('Instance.tsx.index.manualCheck')}
                                    </Button>
                                    {t('Instance.tsx.index.ctwingNo')}
                                    <Popconfirm
                                        title={t('Instance.tsx.index.ignoreTip')}
                                        onConfirm={() => {
                                            list.value = modifyArrayList(list.value, {
                                                key: `ctwing`,
                                                name: t('Instance.tsx.index.ctwing'),
                                                desc: t('Instance.tsx.index.ctwingTip'),
                                                status: 'success',
                                                text: t('Instance.tsx.index.normal'),
                                                info: null,
                                            });
                                        }}
                                    >
                                        <Button type="link" style="padding: 0">{t('Instance.tsx.index.disposition')}</Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        ),
                    };
                } else {
                    item = {
                        key: `ctwing`,
                        name: t('Instance.tsx.index.ctwing'),
                        desc: t('Instance.tsx.index.ctwingTip'),
                        status: 'error',
                        text: t('Instance.tsx.index.abnormal'),
                        info: (
                            <div>
                                <div class={styles.infoItem}>
                                    {t('Instance.tsx.index.approveTip')}
                                    <Button type="link" style="padding: 0"
                                        onClick={() => {
                                            jumpDeviceConfig();
                                        }}
                                    >
                                        {t('Instance.tsx.index.fillOut')}
                                    </Button>
                                    {t('Instance.tsx.index.approveNoNeed')}
                                    <Popconfirm
                                        title={t('Instance.tsx.index.ignoreTip')}
                                        onConfirm={() => {
                                            list.value = modifyArrayList(list.value, {
                                                key: `ctwing`,
                                                name: t('Instance.tsx.index.ctwing'),
                                                desc: t('Instance.tsx.index.ctwingTip'),
                                                status: 'success',
                                                text: t('Instance.tsx.index.normal'),
                                                info: null,
                                            });
                                        }}
                                    >
                                        <Button type="link" style="padding: 0">{t('Instance.tsx.index.disposition')}</Button>
                                    </Popconfirm>
                                </div>
                            </div>
                        ),
                    };
                }
                setTimeout(() => {
                    if (item) {
                        list.value = modifyArrayList(
                            list.value,
                            item,
                            list.value.length,
                        );
                    }
                    resolve({});
                }, time);
            } else {
                resolve({});
            }
        })

        const diagnoseNetworkOtherConfig = async () => {
            if (unref(device).state?.value != 'online') {
                const item: VNode[] = [];
                let info: any = {
                    id: unref(device).id,
                };
                item.push(<Badge status="default" text={t('Instance.tsx.index.inspectState')} />);
                if (props.providerType === 'network') {
                    item.push(
                        <Badge
                            status="default"
                            text={
                                (unref(gateway)?.channelInfo?.addresses || []).length > 1 ? (
                                    <>
                                        {t('Instance.tsx.index.inspectNetwork1')}
                                        <div class="serverItem">
                                            {(unref(gateway)?.channelInfo?.addresses || []).map((i: any) => (
                                                <span style={{ marginLeft: 15 }} key={i.address}>
                                                    <Badge color={i.health === -1 ? 'red' : 'green'} />
                                                    {i.address}
                                                </span>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {t('Instance.tsx.index.inspectNetwork2')}
                                        {(unref(gateway)?.channelInfo?.addresses || []).map((i: any) => (
                                            <span style={{ marginLeft: 15 }} key={i.address}>
                                                <Badge color={i.health === -1 ? 'red' : 'green'} />
                                                {i.address}
                                            </span>
                                        ))}
                                    </>
                                )
                            }
                        />,
                    );
                    if (
                        unref(device)?.protocol &&
                        unref(device)?.accessProvider &&
                        gatewayList.includes(unref(device).accessProvider as string)
                    ) {
                        const response: any = await queryProtocolDetail(unref(device).protocol, 'MQTT');
                        if (response.status === 200) {
                            if ((response.result?.routes || []).length > 0) {
                                item.push(
                                    <Badge
                                        status="default"
                                        text={
                                            <span>
                                                {t('Instance.tsx.index.reason')}
                                                <Button type="link" style="padding: 0"
                                                    onClick={() => {
                                                        jumpAccessConfig();
                                                    }}
                                                >
                                                    {t('Instance.tsx.index.joinDisposition')}
                                                </Button>
                                                {t('Instance.tsx.index.in')}${urlMap.get(unref(device)?.accessProvider) || ''}{t('Instance.tsx.index.message')}
                                            </span>
                                        }
                                    />,
                                );
                            } else {
                                item.push(
                                    <Badge
                                        status="default"
                                        text={
                                            <span>
                                                {t('Instance.tsx.index.tip',{accessProvider: urlMap.get(unref(device)?.accessProvider) || ''})}
                                            </span>
                                        }
                                    />,
                                );
                            }
                        }
                    }
                    info = {
                        ...info,
                        address: unref(gateway)?.channelInfo?.addresses || [],
                        config: configuration.device || [],
                    };
                } else if (props.providerType === 'child-device') {
                    if (unref(device)?.accessProvider === 'gb28181-2016') {
                        const address = unref(gateway)?.channelInfo?.addresses[0];
                        if (address) {
                            item.push(
                                <Badge
                                    status="default"
                                    text={
                                        <span>
                                            {t('Instance.tsx.index.inspect')}
                                            <span style={{ marginLeft: 15 }}>
                                                <Badge color={address.health === -1 ? 'red' : 'green'} />
                                                {address.address}
                                            </span>
                                        </span>
                                    }
                                />,
                            );
                            info = {
                                ...info,
                                address: [address] || [],
                            };
                        }
                    }
                } else if (props.providerType === 'media') {
                    if (unref(device)?.accessProvider === 'gb28181-2016') {
                        const address = unref(gateway)?.channelInfo?.addresses[0];
                        if (address) {
                            item.push(
                                <Badge
                                    status="default"
                                    text={
                                        <span>
                                            {t('Instance.tsx.index.inspect')}
                                            <span style={{ marginLeft: 15 }}>
                                                <Badge color={address.health === -1 ? 'red' : 'green'} />
                                                {address.address}
                                            </span>
                                        </span>
                                    }
                                />,
                            );
                            info = {
                                ...info,
                                address: [address] || [],
                            };
                        }
                    }
                } else if (props.providerType === 'cloud') {
                    item.push(
                        <Badge
                            status="default"
                            text={t('Instance.tsx.index.platform')}
                        />,
                    );
                    item.push(<Badge status="default" text={t('Instance.tsx.index.platform')} />);
                } else if (props.providerType === 'channel') {
                }
                info = {
                    ...info,
                    configValue: unref(device)?.configuration || {},
                };
                diagnoseData.value = {
                    list: [...item],
                    info,
                }
                diagnoseVisible.value = true
            } else {
                emit('stateChange', 'success')
            }
        };

        const handleSearch = async () => {
            emit('percentChange', 0)
            emit('countChange', 0)
            emit('stateChange', 'loading')
            status.value = 'loading'
            const { providerType } = props
            let arr: any[] = [];
            if (providerType === 'network') {
                list.value = [...(getNetworkInitList(t))];
                arr = [
                    diagnoseNetwork,
                    diagnoseGateway,
                    diagnoseProduct,
                    diagnoseDevice,
                    diagnoseProductAuthConfig,
                    diagnoseDeviceAuthConfig,
                ];
            } else if (providerType === 'child-device') {
                list.value = [...(getChildInitList(t))];
                arr = [
                    diagnoseGateway,
                    diagnoseParentDevice,
                    diagnoseProduct,
                    diagnoseDevice,
                    diagnoseProductAuthConfig,
                    diagnoseDeviceAuthConfig,
                ];
            } else if (providerType === 'media') {
                list.value = [...(getMediaInitList(t))];
                arr = [diagnoseGateway, diagnoseProduct, diagnoseDevice];
            } else if (providerType === 'cloud') {
                list.value = [...(getCloudInitList(t))];
                arr = [diagnoseGateway, diagnoseProduct, diagnoseDevice, diagnoseCTWing, diagnoseOnenet];
            } else if (providerType === 'channel') {
                onlyMessage(t('Instance.tsx.index.underdevelopment'), 'error');
                return;
            }
            if (arr.length > 0) {
                for (let i = 0; i < arr.length; i++) {
                    await arr[i]();
                    emit('percentChange')
                }
                emit('percentChange', 100)
                status.value = 'finish'
            }
        }

        watch(() => props.providerType, (newVal) => {
            if (newVal) {
                device.value = instanceStore.current
                handleSearch()
            }
        }, { deep: true, immediate: true })

        watch(() => [list, status], () => {
            if (status.value === 'finish') {
                const _list = _.uniq(_.map(unref(list), 'status'));
                if (unref(device).state?.value !== 'online') {
                    emit('stateChange', 'error')
                    if (_list[0] === 'success' && _list.length === 1) {
                        diagnoseNetworkOtherConfig();
                    }
                } else {
                    emit('stateChange', 'success')
                }
            } else if (status.value === 'loading') {
                const arr = _.map(unref(list), 'status').filter((i) => i !== 'loading');
                emit('countChange', arr.length)
            }
        }, { deep: true, immediate: true })

        return () => <div class={styles['statusBox']}>
            <div class={styles["statusHeader"]}>
                <TitleComponent data={t('Instance.tsx.index.connection')} />
                <Space>
                    {
                        status.value === 'finish' && unref(device).state?.value !== 'online' && <Button type="primary" onClick={async () => {
                            let flag: boolean = true;
                            if (
                                Object.keys(unref(gateway)).length > 0 &&
                                unref(gateway)?.state?.value !== 'enabled'
                            ) {
                                const resp = await startGateway(unref(device).accessId || '');
                                if (resp.status === 200) {
                                    list.value = modifyArrayList(list.value, {
                                        key: 'gateway',
                                        name: t('Instance.tsx.index.gateway'),
                                        desc: t('Instance.tsx.index.gatewayTip'),
                                        status: 'success',
                                        text: t('Instance.tsx.index.normal'),
                                        info: null,
                                    });
                                } else {
                                    flag = false;
                                }
                            }
                            if (unref(product)?.state !== 1) {
                                const resp = await _deployProduct(unref(device).productId || '');
                                if (resp.status === 200) {
                                    list.value = modifyArrayList(list.value, {
                                        key: 'product',
                                        name: t('Instance.tsx.index.productState'),
                                        desc: t('Instance.tsx.index.productTip'),
                                        status: 'success',
                                        text: t('Instance.tsx.index.normal'),
                                        info: null,
                                    });
                                } else {
                                    flag = false;
                                }
                            }
                            if (unref(device)?.state?.value === 'notActive') {
                                const resp = await deployDevice(unref(device)?.id || '');
                                if (resp.status === 200) {
                                    unref(device).state = { value: 'offline', text: t('Instance.tsx.index.offline') };
                                    list.value = modifyArrayList(list.value, {
                                        key: 'device',
                                        name: t('Instance.tsx.index.deviceState'),
                                        desc: t('Instance.tsx.index.deviceTip'),
                                        status: 'success',
                                        text: t('Instance.tsx.index.normal'),
                                        info: null,
                                    });
                                } else {
                                    flag = false;
                                }
                            }
                            if (props.providerType === 'network' || props.providerType === 'child-device') {
                                const address = unref(gateway)?.channelInfo?.addresses || [];
                                const _label = address.some((i: any) => i.health === -1);
                                const __label = address.every((i: any) => i.health === 1);
                                const health = _label ? -1 : __label ? 1 : 0;
                                if (health === -1 && unref(gateway)?.channelId) {
                                    const res = await startNetwork(unref(gateway)?.channelId);
                                    if (res.status === 200) {
                                        list.value = modifyArrayList(list.value, {
                                            key: 'network',
                                            name: t('Instance.tsx.index.module'),
                                            desc: t('Instance.tsx.index.moduleTip'),
                                            status: 'success',
                                            text: t('Instance.tsx.index.normal'),
                                            info: null,
                                        });
                                    } else {
                                        flag = false;
                                    }
                                }
                            }
                            if (props.providerType === 'child-device' && unref(device)?.parentId) {
                                if (unref(parent)?.state?.value === 'notActive') {
                                    const resp = await deployDevice(unref(device)?.parentId || '');
                                    if (resp.status === 200) {
                                        list.value = modifyArrayList(list.value, {
                                            key: 'parent-device',
                                            name: t('Instance.tsx.index.gatewayParent'),
                                            desc: t('Instance.tsx.index.gatewayParentTip'),
                                            status: 'success',
                                            text: t('Instance.tsx.index.normal'),
                                            info: null,
                                        });
                                    } else {
                                        flag = false;
                                    }
                                }
                            }
                            if (flag) {
                                onlyMessage(t('Instance.tsx.index.suc'));
                            }
                        }}>{t('Instance.tsx.index.repair')}</Button>
                    }
                    <Button onClick={() => {
                        handleSearch()
                    }}>{t('Instance.tsx.index.rediagnosis')}</Button>
                </Space>
            </div>
            <div class={styles["statusContent"]}>
                {
                    list.value.map(item => (
                        <div key={item.key} class={styles["statusItem"]}>
                            <div class={styles["statusLeft"]}>
                                <div class={styles["statusImg"]}>
                                    <img
                                        style={{ height: 32 }}
                                        class={item.status === 'loading' ? styles.loading : {}}
                                        src={StatusMap.get(item.status)}
                                    />
                                </div>
                                <div class={styles["statusContext"]}>
                                    <div class={styles.statusTitle}>{item?.name}</div>
                                    <div class={styles.statusDesc}>{item.desc}</div>
                                    <div class={styles.info}>{item?.info}</div>
                                </div>
                            </div>
                            <div class={styles["statusRight"]} style={{ color: TextColorMap.get(item.status) }}>
                                {item?.text}
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                diagnoseVisible.value && <DiagnosticAdvice
                    data={diagnoseData.value}
                    onClose={() => {
                        diagnoseVisible.value = false
                    }}
                />
            }
            {artificialVisible.value && (
                <ManualInspection
                    data={artificialData.value}
                    onClose={() => {
                        artificialVisible.value = false
                    }}
                    onSave={(params: any) => {
                        list.value = modifyArrayList(list.value, {
                            key: params.key,
                            name: params.name,
                            desc: params.desc,
                            status: 'success',
                            text: t('Instance.tsx.index.normal'),
                            info: null,
                        });
                        artificialVisible.value = false
                    }}
                />
            )}
            {
                bindParentVisible.value && (
                    <BindParentDevice
                        data={device.value}
                        onCancel={() => {
                            bindParentVisible.value = false
                        }}
                        onOk={async (parentId: string) => {
                            let item: ListProps | undefined = undefined;
                            const response = await detail(parentId);
                            if (response.status === 200) {
                                if (response?.result?.state?.value === 'notActive') {
                                    item = {
                                        key: 'parent-device',
                                        name: t('Instance.tsx.index.gatewayParent'),
                                        desc: t('Instance.tsx.index.gatewayParentTip'),
                                        status: 'error',
                                        text: t('Instance.tsx.index.abnormal'),
                                        info: (
                                            <div>
                                                <div class={styles.infoItem}>
                                                    <Badge
                                                        status="default"
                                                        text={
                                                            <span>
                                                                {t('Instance.tsx.index.parentDisable')}
                                                                <PermissionButton
                                                                    hasPermission="device/Product:action"
                                                                    type="link"
                                                                    style="padding: 0"
                                                                    popConfirm={{
                                                                        title: t('Instance.tsx.index.confirmEnable'),
                                                                        onConfirm: async () => {
                                                                            const resp = await _deploy(response?.result?.id || '');
                                                                            if (resp.status === 200) {
                                                                                onlyMessage(t('Instance.tsx.index.suc'));
                                                                                list.value = modifyArrayList(
                                                                                    list.value,
                                                                                    {
                                                                                        key: 'parent-device',
                                                                                        name: t('Instance.tsx.index.gatewayParent'),
                                                                                        desc: t('Instance.tsx.index.gatewayParentTip'),
                                                                                        status: 'success',
                                                                                        text: t('Instance.tsx.index.normal'),
                                                                                        info: null,
                                                                                    },
                                                                                );
                                                                            }
                                                                        }
                                                                    }}
                                                                >
                                                                    {t('Instance.tsx.index.enable')}
                                                                </PermissionButton>
                                                            </span>
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ),
                                    };
                                } else if (response?.state?.value === 'online') {
                                    item = {
                                        key: 'parent-device',
                                        name: t('Instance.tsx.index.gatewayParent'),
                                        desc: t('Instance.tsx.index.gatewayParentTip'),
                                        status: 'success',
                                        text: t('Instance.tsx.index.normal'),
                                        info: null,
                                    };
                                } else {
                                    item = {
                                        key: 'parent-device',
                                        name: t('Instance.tsx.index.gatewayParent'),
                                        desc: t('Instance.tsx.index.gatewayParentTip'),
                                        status: 'error',
                                        text: t('Instance.tsx.index.abnormal'),
                                        info: (
                                            <div>
                                                <div class={styles.infoItem}>
                                                    <Badge
                                                        status="default"
                                                        text={<span>{t('Instance.tsx.index.parentOffline')}</span>}
                                                    />
                                                </div>
                                            </div>
                                        ),
                                    };
                                }
                                if (item) {
                                    list.value = modifyArrayList(unref(list), item);
                                }
                                instanceStore.current.parentId = parentId;
                                bindParentVisible.value = false
                            }
                        }}
                    />
                )
            }
        </div>
    },
})

export default Status