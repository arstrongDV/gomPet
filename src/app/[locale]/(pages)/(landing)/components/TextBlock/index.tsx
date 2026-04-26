import { useTranslations } from 'next-intl';
import style from './TextBlock.module.scss'

const TextBlock = () => {
    const t = useTranslations('pages.landing.textBlock');
    return(
        <div className={style.textBlock}>
        <h2><span className={style.greenText}>{t('titleHighlight')}</span> {t('titleRest')}</h2>
        <p>{t('description')}</p>
      </div>
    )
}
export default TextBlock;