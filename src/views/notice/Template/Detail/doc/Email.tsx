// import './index.less';
import { useI18n } from 'vue-i18n'

const Email = () => {
  const a = '{标题}';
  const b = '{name}';
  const { t } = useI18n()
  return (
    <div class="doc">
      <h1>1. {t('common.summarize')}</h1>
      <div>
        {t('pages.iot.notice.template.summarize') + t('pages.iot.notice.template.emailSumm')}
      </div>
      <h1>2.{t('pages.iot.notice.template.temDisDes')}</h1>
      <div>
        {/* <h2> 1、服务器地址</h2>
        <div>服务器地址支持自定义输入</div> */}
        <h2> 1、 {t('pages.iot.notice.template.title')}</h2>
        <div>{t('pages.iot.notice.template.emailTitle')}</div>
        <h2> 2、{t('pages.iot.notice.template.addressee')}</h2>
        <div> {t('pages.iot.notice.template.emailAddressee')}</div>
        <h2> 3、{t('pages.iot.notice.template.temContent')}</h2>
        <div>
          {t('pages.iot.notice.template.ddTemplateContent')}
        </div>
      </div>
    </div>
  );
};
export default Email;
