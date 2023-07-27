import { getImage } from '@/utils/comm';
import { VNode } from 'vue';
import { useI18n } from 'vue-i18n'

export type ListProps = {
    key: string;
    name: string;
    desc?: string;
    status: 'loading' | 'error' | 'success' | 'warning';
    text?: string;
    info?: VNode | null;
};

export const TextColorMap = new Map();
TextColorMap.set('loading', 'black');
TextColorMap.set('error', 'red');
TextColorMap.set('success', 'green');
TextColorMap.set('warning', '#FAB247');

export const StatusMap = new Map();
StatusMap.set('error', getImage('/diagnose/status/error.png'));
StatusMap.set('success', getImage('/diagnose/status/success.png'));
StatusMap.set('warning', getImage('/diagnose/status/warning.png'));
StatusMap.set('loading', getImage('/diagnose/status/loading.png'));

export const  getNetworkInitList = (t:any) =>{
     
     const networkInitList: ListProps[] = [
        // {
        //   key: 'access',
        //   name: '设备接入配置',
        //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
        //   status: 'loading',
        //   text: t('Instance.tsx.util.diagnosing'),
        //   info: null,
        // },
        {
            key: 'network',
            name: t('Instance.tsx.util.network'),
            desc: t('Instance.tsx.util.networkDesc'),
            status: 'loading',
            text:  t('Instance.tsx.util.diagnosing'),
            info: null,
        },
        {
            key: 'gateway',
            name: t('Instance.tsx.util.gateway'),
            desc: t('Instance.tsx.util.gatewayDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
        {
            key: 'product',
            name: t('Instance.tsx.util.product'),
            desc: t('Instance.tsx.util.productDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
        {
            key: 'device',
            name: t('Instance.tsx.util.device'),
            desc: t('Instance.tsx.util.deviceDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
    ];
    return networkInitList
}

export const getChildInitList = (t:any) =>{
   
    const childInitList: ListProps[] = [
        // {
        //   key: 'access',
        //   name: '设备接入配置',
        //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
        //   status: 'loading',
        //   text: t('Instance.tsx.util.diagnosing'),
        //   info: null,
        // },
        // {
        //   key: 'network',
        //   name: '网络组件',
        //   desc: '诊断网络组件配置是否正确，配置错误将导致设备连接失败',
        //   status: 'loading',
        //   text: t('Instance.tsx.util.diagnosing'),
        //   info: null,
        // },
        {
            key: 'gateway',
            name: t('Instance.tsx.util.gateway'),
            desc: t('Instance.tsx.util.gatewayDesc2'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
        {
            key: 'parent-device',
            name: t('Instance.tsx.util.parentDevice'),
            desc: t('Instance.tsx.util.parentDeviceDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
        {
            key: 'product',
            name: t('Instance.tsx.util.product'),
            desc: t('Instance.tsx.util.productDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
        {
            key: 'device',
            name: t('Instance.tsx.util.device'),
            desc: t('Instance.tsx.util.deviceDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
    ];
    return childInitList
}

export const getCloudInitList = (t:any) =>{
    
    const cloudInitList: ListProps[] = [
        // {
        //   key: 'access',
        //   name: '设备接入配置',
        //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
        //   status: 'loading',
        //   text: t('Instance.tsx.util.diagnosing'),
        //   info: null,
        // },
        {
            key: 'gateway',
            name: t('Instance.tsx.util.gateway'),
            desc: t('Instance.tsx.util.gatewayDesc2'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
        {
            key: 'product',
            name:  t('Instance.tsx.util.product'),
            desc:  t('Instance.tsx.util.productDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
        {
            key: 'device',
            name: t('Instance.tsx.util.device'),
            desc: t('Instance.tsx.util.deviceDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
    ];
    return cloudInitList
}

export const getChannelInitList = (t:any) =>{
   
    const channelInitList: ListProps[] = [
        // {
        //   key: 'access',
        //   name: '设备接入配置',
        //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
        //   status: 'loading',
        //   text: t('Instance.tsx.util.diagnosing'),
        //   info: null,
        // },
        {
            key: 'gateway',
            name: t('Instance.tsx.util.gateway'),
            desc: t('Instance.tsx.util.gatewayDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
        {
            key: 'product',
            name: t('Instance.tsx.util.product'),
            desc:  t('Instance.tsx.util.productDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
        {
            key: 'device',
            name: t('Instance.tsx.util.device'),
            desc: t('Instance.tsx.util.deviceDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
    ];
    return channelInitList
}

export const getMediaInitList = (t:any) =>{
    
    const mediaInitList: ListProps[] = [
        // {
        //   key: 'access',
        //   name: '设备接入配置',
        //   desc: '诊断该设备所属产品是否已配置“设备接入”方式，未配置将导致设备连接失败。',
        //   status: 'loading',
        //   text: t('Instance.tsx.util.diagnosing'),
        //   info: null,
        // },
        {
            key: 'gateway',
            name: t('Instance.tsx.util.gateway'),
            desc: t('Instance.tsx.util.gatewayDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
        {
            key: 'product',
            name: t('Instance.tsx.util.product'),
            desc:  t('Instance.tsx.util.productDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
        {
            key: 'device',
            name: t('Instance.tsx.util.device'),
            desc: t('Instance.tsx.util.deviceDesc'),
            status: 'loading',
            text: t('Instance.tsx.util.diagnosing'),
            info: null,
        },
    ];
    return mediaInitList
}

export const modifyArrayList = (oldList: ListProps[], item: ListProps, index?: number) => {
    let newList: ListProps[] = [];
    if (index !== 0 && !index) {
        // 添加
        for (let i = 0; i < oldList.length; i++) {
            const dt = oldList[i];
            if (item.key === dt.key) {
                newList.push(item);
            } else {
                newList.push(dt);
            }
        }
    } else {
        // 修改
        oldList.splice(index, 0, item);
        newList = [...oldList];
    }
    return newList;
};

export const isExit = (arr1: any[], arr2: any[]) => {
    return arr1.find((item) => arr2.includes(item));
};

export const gatewayList = [
    'websocket-server',
    'http-server-gateway',
    'udp-device-gateway',
    'coap-server-gateway',
    'mqtt-client-gateway',
    'tcp-server-gateway',
];

export const urlMap = new Map();
urlMap.set('mqtt-client-gateway', 'topic');
urlMap.set('http-server-gateway', 'url');
urlMap.set('websocket-server', 'url');
urlMap.set('coap-server-gateway', 'url');

