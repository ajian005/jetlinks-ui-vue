import { useInstanceStore } from "@/store/instance";
import { useMenuStore } from "@/store/menu";
import { AIcon, Button, Modal, Descriptions, DescriptionsItem, Space } from "jetlinks-ui-components"
import styles from './index.module.less'
import { useI18n } from 'vue-i18n'


const ManualInspection = defineComponent({
    props: {
        data: {
            type: Object,
            default: () => { }
        }
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
        const { t } = useI18n()
        const { data } = props

        const instanceStore = useInstanceStore();

        const menuStory = useMenuStore();

        const dataRender = () => {
            if (data.type === 'device' || data.type === 'product') {
                return (
                    <>
                        <div style={{ flex: 1 }}>
                            <div class={styles.alert}>
                                <span style={{ marginRight: '10px' }}><AIcon type="InfoCircleOutlined" /></span>
                                {t('Instance.tsx.ManualInspection.inspectTip')}
                                <Button type="link" style="padding: 0"
                                    onClick={() => {
                                        emit('save', data)
                                    }}
                                >
                                    {t('Instance.tsx.ManualInspection.ignore')}
                                </Button>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <Descriptions title={data?.data?.name} layout="vertical" bordered>
                                    {(data?.data?.properties || []).map((item: any) => (
                                        <DescriptionsItem
                                            key={item.property}
                                            label={`${item.name}${item?.description ? `(${item.description})` : ''}`}
                                        >
                                            {data?.configuration[item.property] || ''}
                                        </DescriptionsItem>
                                    ))}
                                </Descriptions>
                            </div>
                        </div>
                        {data?.data?.description ? (
                            <div
                                style={{ width: '50%', border: '1px solid #f0f0f0', padding: '10px', borderLeft: 'none' }}
                            >
                                <h4>{t('Instance.tsx.ManualInspection.explain')}</h4>
                                <p>{data?.data?.description}</p>
                            </div>
                        ) : (
                            ''
                        )}
                    </>
                );
            } else if (data.type === 'cloud') {
                return (
                    <>
                        <div style={{ flex: 1 }}>
                            <div class={styles.alert}>
                                <span style={{ marginRight: '10px' }}><AIcon type="InfoCircleOutlined" /></span>
                                {t('Instance.tsx.ManualInspection.inspectTip')}
                                <Button type="link" style="padding: 0"
                                    onClick={() => {
                                        emit('save', data)
                                    }}
                                >
                                     {t('Instance.tsx.ManualInspection.ignore')}
                                </Button>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <Descriptions title={data?.data?.name} layout="vertical" bordered>
                                    {data.configuration?.provider === 'OneNet' ? (
                                        <>
                                            <DescriptionsItem label={t('Instance.tsx.ManualInspection.address')}>
                                                {data?.configuration?.configuration?.apiAddress || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'apiKey'}>
                                                {data?.configuration?.configuration?.apiKey || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={t('Instance.tsx.ManualInspection.informTokne')}>
                                                {data?.configuration?.configuration?.validateToken || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'aesKey'}>
                                                {data?.configuration?.configuration?.aesKey || ''}
                                            </DescriptionsItem>
                                        </>
                                    ) : (
                                        <>
                                            <DescriptionsItem label={t('Instance.tsx.ManualInspection.address')}>
                                                {data?.configuration?.configuration?.apiAddress || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'appKey'}>
                                                {data?.configuration?.configuration?.appKey || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'appSecret'}>
                                                {data?.configuration?.configuration?.appSecret || ''}
                                            </DescriptionsItem>
                                        </>
                                    )}
                                </Descriptions>
                            </div>
                        </div>
                        {data?.configuration?.configuration?.description ? (
                            <div
                                style={{ width: '50%', border: '1px solid #f0f0f0', padding: '10px', borderLeft: 'none' }}
                            >
                                <h4>{t('Instance.tsx.ManualInspection.explain')}</h4>
                                <p>{data?.configuration?.configuration?.description}</p>
                            </div>
                        ) : (
                            ''
                        )}
                    </>
                );
            } else if (data.type === 'media') {
                return (
                    <>
                        <div style={{ flex: 1 }}>
                            <div class={styles.alert}>
                                <span style={{ marginRight: '10px' }}><AIcon type="InfoCircleOutlined" /></span>
                                {t('Instance.tsx.ManualInspection.inspectTip')}
                                <Button type="link" style="padding: 0"
                                    onClick={() => {
                                        emit('save', data)
                                    }}
                                >
                                    {t('Instance.tsx.ManualInspection.ignore')}
                                </Button>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                                <Descriptions title={data?.data?.name} layout="vertical" bordered>
                                    {data?.configuration?.configuration?.shareCluster ? (
                                        <>
                                            <DescriptionsItem label={t('Instance.tsx.ManualInspection.domain')}>
                                                {data?.configuration?.configuration?.domain || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'SIP ID'}>
                                                {data?.configuration?.configuration?.sipId || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={t('Instance.tsx.ManualInspection.cluster')}>
                                                {data?.configuration?.configuration?.shareCluster ? t('Instance.tsx.ManualInspection.share') : t('Instance.tsx.ManualInspection.independent')}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={t('Instance.tsx.ManualInspection.SIPAddress')}>
                                                {`${data?.configuration?.configuration?.hostPort?.host}:${data?.configuration?.configuration?.hostPort?.port}`}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={ t('Instance.tsx.ManualInspection.Host')}>
                                                {`${data?.configuration?.configuration?.hostPort?.publicHost}:${data?.configuration?.configuration?.hostPort?.publicPort}`}
                                            </DescriptionsItem>
                                        </>
                                    ) : (
                                        <>
                                            <DescriptionsItem label={t('Instance.tsx.ManualInspection.domain')}>
                                                {data?.configuration?.configuration?.domain || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={'SIP ID'}>
                                                {data?.configuration?.configuration?.sipId || ''}
                                            </DescriptionsItem>
                                            <DescriptionsItem label={t('Instance.tsx.ManualInspection.cluster')}>
                                                {data?.configuration?.configuration?.shareCluster ? t('Instance.tsx.ManualInspection.share') : t('Instance.tsx.ManualInspection.independent')}
                                            </DescriptionsItem>
                                            {data?.configuration?.configuration?.cluster.map((i: any, it: number) => (
                                                <div key={it}>
                                                    <div>{t('Instance.tsx.ManualInspection.node') + (it + 1)}</div>
                                                    <DescriptionsItem label={t('Instance.tsx.ManualInspection.nodeName')}>
                                                        {i?.clusterNodeId || ''}
                                                    </DescriptionsItem>
                                                    <DescriptionsItem label={t('Instance.tsx.ManualInspection.SIPAddress')}>
                                                        {`${i.host}:${i?.port}`}
                                                    </DescriptionsItem>
                                                    <DescriptionsItem label={t('Instance.tsx.ManualInspection.Host')}>
                                                        {`${i?.publicHost}:${i?.publicPort}`}
                                                    </DescriptionsItem>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </Descriptions>
                            </div>
                        </div>
                        {data?.configuration?.description ? (
                            <div
                                style={{ width: '50%', border: '1px solid #f0f0f0', padding: '10px', borderLeft: 'none' }}
                            >
                                <h4>{t('Instance.tsx.ManualInspection.explain')}</h4>
                                <p>{data?.configuration?.description}</p>
                            </div>
                        ) : (
                            ''
                        )}
                    </>
                );
            } else {
                return null;
            }
        };

        return () => <Modal
            title={t('Instance.tsx.ManualInspection.labour')}
            visible
            width={1000}
            onOk={() => {
                emit('save', data)
            }}
            onCancel={() => {
                emit('close')
            }}
            v-slots={{
                footer: <Space>
                    <Button onClick={() => {
                        if (data.type === 'device') {
                            instanceStore.tabActiveKey = 'Info'
                        } else if (data.type === 'product') {
                            menuStory.jumpPage('device/Product/Detail', { id: data.productId, tab: 'Device' });
                        } else {
                            menuStory.jumpPage('link/AccessConfig/Detail', { id: data.configuration?.id });
                        }
                    }}>{t('Instance.tsx.ManualInspection.edit')}</Button>
                    <Button onClick={() => {
                        emit('save', data)
                    }}>{t('Instance.tsx.ManualInspection.confirm')}</Button>
                </Space>
            }}
        >
            <div style={{ display: 'flex' }}>{dataRender()}</div>
        </Modal>
    }
})

export default ManualInspection