// import './index.less';
import { Image } from 'jetlinks-ui-components';
import { getImage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const AliyunVoice = () => {
    const { t } = useI18n()
    const accessKey = getImage(
        '/notice/doc/config/aliyun-sms-voice/AccesskeyIDSecret.jpg',
    );

    return (
        <div class={'doc'}>
            <div class={'url'}>
                {t('pages.iot.notice.config.aliControls')}
                <a
                    href="https://home.console.aliyun.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    https://home.console.aliyun.com
                </a>
            </div>
            <h1>1. {t('common.summarize')}</h1>
            <div>
                {t('common.summarizeContent')}
            </div>
            <h1>2.{t('common.noticonfigdes')}</h1>
            <div>
                <h2>1、RegionID</h2>
                <div>
                    {t('pages.iot.notice.config.regionID')}
                </div>
            </div>
            <h2>2、AccesskeyID/Secret</h2>
            <div>
                <div>
                 {t('pages.iot.notice.config.AccesskeyID')}
                </div>
            </div>
            <div class={'image'}>
                <Image width="100%" src={accessKey} />
            </div>
        </div>
    );
};
export default AliyunVoice;
