'use client'

import { Card, Divider, LabelLink } from "src/components"
import Image from "next/image"
import { Routes } from "src/constants/routes"
import Logo from 'assets/images/logo.png';
import { Link } from 'src/navigation';

import style from './Footer.module.scss'
import { useTranslations } from "next-intl";

const Footer = () => {
    const t = useTranslations('pages.landing');

    return(
        <Card className={style.card}>
            <Link href={Routes.LANDING}>
                <Image
                    className={style.logo}
                    src={Logo}
                    alt='Logo'
                    height={70}
                    priority
                />
            </Link>
            <div className={style.textContent}>
                <h3>{t('footer.aboutThePlatformTitle')}</h3>
                <h4>{t('footer.tagline')}</h4>
                <p>{t('footer.description')}</p>
            </div>


            <Divider className={style.divider} />


            <div className={style.privicyBlock}>
                <div className={style.politic}>
                    <LabelLink
                        className={style.link}
                        href={Routes.DOC_STATUTE}
                        label={t('footer.rules')}
                    />
                    <LabelLink
                        className={style.link}
                        href={Routes.DOC_PRIVACY}
                        label={t('footer.privatePolitic')}
                    />
                </div>
                <LabelLink
                    className={style.footerGreenLink}
                    href={Routes.DOC_COPYRIGHT}
                    label={t('footer.toCnange')}
                />
            </div>
        </Card>
    )
}
export default Footer;