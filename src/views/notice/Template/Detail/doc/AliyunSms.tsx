// import './index.less';
import { useI18n } from 'vue-i18n'

const AliyunSms = () => {
    const { t } = useI18n()
    return (
        <div class="doc">
            <div class="url">
                {t('pages.iot.notice.template.aliMes')}
                <a
                    href="https://dysms.console.aliyun.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://dysms.console.aliyun.com
                </a>
            </div>
            <h1>1. {t('common.summarize')}</h1>
            <div>
                {t('pages.iot.notice.template.summarize') + t('pages.iot.notice.template.aliSmsSumm')}
            </div>
            <h1>2.{t('pages.iot.notice.template.temDisDes')}</h1>

            <div>
                <h2> 1、{t('pages.iot.notice.template.bindConfig')}</h2>
                <div> {t('pages.iot.notice.template.configTip')}</div>
                <h2> 2、{t('pages.iot.notice.template.template')}</h2>
                <div> {t('pages.iot.notice.template.templateTip')}</div>
                <h2> 3、{t('pages.iot.notice.template.receive')}</h2>
                <div>
                    {t('pages.iot.notice.template.aliReceiveTip')}
                </div>
                <h2> 4、{t('pages.iot.notice.template.signature')}</h2>
                <div> {t('pages.iot.notice.template.aliSignture')}</div>
                <h2> 5、{t('pages.iot.notice.template.variableAttri')}</h2>
                <div>
                    {t('pages.iot.notice.template.variableAttri')}
                </div>
            </div>
        </div>
    );
};
export default AliyunSms;
