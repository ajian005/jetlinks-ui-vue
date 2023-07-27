import { getImage } from '@/utils/comm';
import createI18n from '@/locales/index';
const { t }  = createI18n.global
const ProtocolMapping = new Map();
ProtocolMapping.set('websocket-server', 'WebSocket');
ProtocolMapping.set('http-server-gateway', 'HTTP');
ProtocolMapping.set('udp-device-gateway', 'UDP');
ProtocolMapping.set('coap-server-gateway', 'CoAP');
ProtocolMapping.set('mqtt-client-gateway', 'MQTT');
ProtocolMapping.set('mqtt-server-gateway', 'MQTT');
ProtocolMapping.set('tcp-server-gateway', 'TCP');
ProtocolMapping.set('child-device', '');
ProtocolMapping.set('OneNet', 'HTTP');
ProtocolMapping.set('Ctwing', 'HTTP');
ProtocolMapping.set('modbus-tcp', 'MODBUS_TCP');
ProtocolMapping.set('opc-ua', 'OPC_UA');
ProtocolMapping.set('edge-child-device', 'EdgeGateway');
ProtocolMapping.set('official-edge-gateway', 'MQTT');

const NetworkTypeMapping = new Map();
NetworkTypeMapping.set('websocket-server', 'WEB_SOCKET_SERVER');
NetworkTypeMapping.set('http-server-gateway', 'HTTP_SERVER');
NetworkTypeMapping.set('udp-device-gateway', 'UDP');
NetworkTypeMapping.set('coap-server-gateway', 'COAP_SERVER');
NetworkTypeMapping.set('mqtt-client-gateway', 'MQTT_CLIENT');
NetworkTypeMapping.set('mqtt-server-gateway', 'MQTT_SERVER');
NetworkTypeMapping.set('tcp-server-gateway', 'TCP_SERVER');
NetworkTypeMapping.set('official-edge-gateway', 'MQTT_SERVER');

const BackMap = new Map();
BackMap.set('mqtt-server-gateway', getImage('/access/mqtt.png'));
BackMap.set('websocket-server', getImage('/access/websocket.png'));
BackMap.set('modbus-tcp', getImage('/access/modbus.png'));
BackMap.set('coap-server-gateway', getImage('/access/coap.png'));
BackMap.set('tcp-server-gateway', getImage('/access/tcp.png'));
BackMap.set('Ctwing', getImage('/access/ctwing.png'));
BackMap.set('plugin_gateway', getImage('/access/plugin.png'));
BackMap.set('child-device', getImage('/access/child-device.png'));
BackMap.set('opc-ua', getImage('/access/opc-ua.png'));
BackMap.set('http-server-gateway', getImage('/access/http.png'));
BackMap.set('fixed-media', getImage('/access/video-device.png'));
BackMap.set('udp-device-gateway', getImage('/access/udp.png'));
BackMap.set('OneNet', getImage('/access/onenet.png'));
BackMap.set('gb28181-2016', getImage('/access/gb28181.png'));
BackMap.set('mqtt-client-gateway', getImage('/access/mqtt-broke.png'));
BackMap.set('edge-child-device', getImage('/access/child-device.png'));
BackMap.set('official-edge-gateway', getImage('/access/edge.png'));

const descriptionList = {
    'udp-device-gateway':t('link.AccessConfig.data.UDP'),
    'tcp-server-gateway':
    t('link.AccessConfig.data.TCP'),
    'websocket-server':
    t('link.AccessConfig.data.webSocket'),
    'mqtt-client-gateway':
    t('link.AccessConfig.data.mqttClient'),
    'http-server-gateway':
    t('link.AccessConfig.data.http'),
    'mqtt-server-gateway':
    t('link.AccessConfig.data.mqttServer'),
    'coap-server-gateway':
    t('link.AccessConfig.data.coap'),
};

const ColumnsMQTT = [
    // {
    //     title: '分组',
    //     dataIndex: 'group',
    //     key: 'group',
    //     ellipsis: true,
    //     align: 'center',
    //     width: 100,
    //     scopedSlots: { customRender: 'group' },
    // },
    {
        title: 'topic',
        dataIndex: 'topic',
        key: 'topic',
        ellipsis: true,
    },
    {
        title: t('link.AccessConfig.data.stream'),
        dataIndex: 'stream',
        key: 'stream',
        ellipsis: true,
        align: 'center',
        width: 100,
        scopedSlots: { customRender: 'stream' },
    },
    {
        title: t('link.AccessConfig.data.description'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
];

const ColumnsHTTP = [
    {
        title: t('link.AccessConfig.data.address'),
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
    },
    {
        title: t('link.AccessConfig.data.example'),
        dataIndex: 'example',
        key: 'example',
        ellipsis: true,
    },
    {
        title: t('link.AccessConfig.data.description'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
];

export {
    NetworkTypeMapping,
    ProtocolMapping,
    BackMap,
    descriptionList,
    ColumnsMQTT,
    ColumnsHTTP,
};
