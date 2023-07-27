// import './index.less';
import { Image } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'
const WeixinApp = () => {
  const appId = getImage('/notice/doc/template/weixin-official/02-mini-Program-Appid.png');
  const { t } = useI18n()
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
        <h2>1、{t('pages.iot.notice.template.bindConfig')}</h2>
        <div>{t('pages.iot.notice.template.configTip')}</div>
      </div>
      <div>
        <h2>2、{t('pages.iot.notice.template.AppUser')}</h2>
        <div>{t('pages.iot.notice.template.AppUserTip')}</div>
      </div>
      <div>
        <h2>3、{t('pages.iot.notice.template.AppMesTemp')}</h2>
        <div>{t('pages.iot.notice.template.AppMesTempTip')}</div>
      </div>
      <div>
        <h2>4、{t('pages.iot.notice.template.AppTempSkip')}</h2>
        <div>{t('pages.iot.notice.template.tempSkipTip')}</div>
      </div>
      <div>
        <h2>5、{t('pages.iot.notice.template.skipApp')}</h2>
        <div>{t('pages.iot.notice.template.skipAppTip')}</div>
      </div>
      <div>
        <h2>6、{t('pages.iot.notice.template.skipWay')}</h2>
        <div>{t('pages.iot.notice.template.skipWayTip')}</div>
        <div class="image">
          <Image width="100%" src={appId} />
        </div>
      </div>
      <div>
        <h2>7、{t('pages.iot.notice.template.temContent')}</h2>
        <div>
          {t('pages.iot.notice.template.appTemplateContent')}
        </div>
      </div>
    </div>
  );
};
export default WeixinApp;
