
// import './index.less';
import { Image } from 'jetlinks-ui-components';
import { getImage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const DingTalk = () => {
  const { t } = useI18n()
  const agentId = getImage('/notice/doc/template/dingTalk-message/01-Agentid.jpg');
  // const userId = getImage('/notice/doc/template/dingTalk-message/02-user-id.jpg');
  // const dept = getImage('/notice/doc/template/dingTalk-message/03-dept.jpg');
  const a = '{name}';
  return (
    <div class="doc">
      <div class="url">
        {t('pages.iot.notice.template.dingdingOpnen')}
        <a href="https://open-dev.dingtalk.com" target="_blank" rel="noopener noreferrer">
          https://open-dev.dingtalk.com
        </a>
        <br />
        {t('pages.iot.notice.template.dingdingControl')}
        <a href="https://www.dingtalk.com" target="_blank" rel="noopener noreferrer">
          https://www.dingtalk.com
        </a>
      </div>
      <h1>1. {t('common.summarize')}</h1>
      <div>
        {t('pages.iot.notice.template.summarize')}
        <div>{t('pages.iot.notice.template.dingdingSumm')}</div>
      </div>
      <h1> 2.{t('pages.iot.notice.template.temDisDes')}</h1>
      <h2> 1、{t('pages.iot.notice.template.bindConfig')}</h2>
      <div> {t('pages.iot.notice.template.configTip')}</div>
      <h2> 2、Agentid</h2>
      <div> {t('pages.iot.notice.template.AgentIdTip')}</div>
      <div> {t('pages.iot.notice.template.getDdAgentid')}</div>
      <div class="image">
        <Image width="100%" src={agentId} />
      </div>
      <h2> 3、{t('pages.iot.notice.template.receiving')}</h2>
      <div>{t('pages.iot.notice.template.receivingTip')}</div>
      {/*<div> 收信人ID获取路径：“钉钉管理后台”--“通讯录”--“查看用户”</div>*/}
      {/*<div> 收信部门ID获取路径：“钉钉管理后台”--“通讯录”--“编辑部门”</div>*/}
      {/*<div class="image">*/}
      {/*  <Image width="100%" src={userId} />*/}
      {/*  <Image width="100%" src={dept} />*/}
      {/*</div>*/}
      <h2> 4、{t('pages.iot.notice.template.temContent')}</h2>
      <div>
        {t('pages.iot.notice.template.ddTemplateContent')}
      </div>
    </div>
  );
};
export default DingTalk;
