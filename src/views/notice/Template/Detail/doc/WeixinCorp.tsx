// import './index.less';
import { Image } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'


const WeixinCorp = () => {
  const { t } = useI18n()
  const agentId = getImage('/notice/doc/template/weixin-corp/01-Agentid.jpg');
  const userId = getImage('/notice/doc/template/weixin-corp/02-userID.jpg');
  const toDept = getImage('/notice/doc/template/weixin-corp/03-toDept.jpg');
  const toTags = getImage('/notice/doc/template/weixin-corp/04-toTags.jpg');

  return (
    <div class="doc">
      <div class="url">
        {t('pages.iot.notice.template.weixinPlatform')}
        <a href="https://work.weixin.qq.com" target="_blank" rel="noopener noreferrer">
          https://work.weixin.qq.com
        </a>
      </div>
      <h1>1. {t('common.summarize')}</h1>
      <div>
        {t('pages.iot.notice.template.summarize')}
      </div>
      <h1>2.{t('pages.iot.notice.template.temDisDes')}</h1>
      <div>
        <h2> 1、{t('pages.iot.notice.template.bindConfig')}</h2>
        <div> {t('pages.iot.notice.template.configTip')}</div>
        <h2> 2、Agentid</h2>
        <div> {t('pages.iot.notice.template.AgentIdTip')}</div>
        <div> {t('pages.iot.notice.template.getWXAgentId')}”</div>
        <div class="image">
          <Image width="100%" src={agentId} />
        </div>
        <h2> 3、{t('pages.iot.notice.template.WXReceiving')}</h2>
        <div>
        {t('pages.iot.notice.template.WXReceiveTip')}
        </div>
        <div> {t('pages.iot.notice.template.getWXReceiveId')}</div>
        <div> {t('pages.iot.notice.template.getWXReDept')}</div>
        <div class="image">
          <Image width="100%" src={userId} />
          <Image width="100%" src={toDept} />
          <Image width="100%" src={toTags} />
        </div>
      </div>
    </div>
  );
};
export default WeixinCorp;
