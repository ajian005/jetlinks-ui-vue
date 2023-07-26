// import './index.less';
import { Image } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const DingTalkRebot = () => {
    const groupSetting = getImage(
        '/notice/doc/config/dingTalk-rebot/01-group-setting.jpg',
    );
    const rebot = getImage('/notice/doc/config/dingTalk-rebot/02-rebot.jpg');
    const webhook = getImage(
        '/notice/doc/config/dingTalk-rebot/03-Webhook.jpg',
    );

    return (
        <div class={'doc'}>
            <h1>1. {t('common.summarize')}</h1>
            <div>
                {t('common.summarizeContent')}
            </div>
            <h1>2.{t('common.noticonfigdes')}</h1>
            <div>
                <h2> 1、WebHook</h2>
                <div>
                    {t('pages.iot.notice.config.WebHook')}
                </div>
                <div>
                    {t('pages.iot.notice.config.getWebHook')}
                </div>
                <div class={'image'}>
                    <Image width="100%" src={rebot} />
                </div>
                <h2>1、{t('pages.iot.notice.config.getWHStep1')}</h2>
                <div class={'image'}>
                    <Image width="100%" src={groupSetting} />
                </div>
                <h2>2、{t('pages.iot.notice.config.getWHStep2')}</h2>
                <div class={'image'}>
                    <Image width="100%" src={webhook} />
                </div>
            </div>
        </div>
    );
};
export default DingTalkRebot;
