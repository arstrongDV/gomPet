'use client'

import { Card, Divider } from "src/components"
import Image from "next/image"
import { Routes } from "src/constants/routes"
import Logo from 'assets/images/logo.png';
import { Link } from 'src/navigation';

import style from './Footer.module.scss'

const Footer = () => {
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
                <h3>O platformie</h3>
                <h4>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus viverra nisl ut accumsan tristique.
                </h4>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus viverra nisl ut accumsan tristique. 
                    Integer hendrerit id sem sit amet rutrum. Ut vitae nibh mi. Etiam pellentesque arcu sed justo commodo, 
                    ac dignissim ante aliquam. Duis suscipit a urna ut euismod. Morbi tempor mi lobortis 
                    orci condimentum vulputate sit amet vitae magna.
                </p>
            </div>


            <Divider className={style.divider} />


            <div className={style.privicyBlock}>
                <div className={style.politic}>
                    <Link className={style.link} href="/">Regulamin</Link>
                    <Link className={style.link} href="/">Polityka prywatności</Link>
                </div>
                <Link href="/" className={style.footerGreenLink}>Wszelkie prawa zastrzeżone</Link>
            </div>
        </Card>
    )
}
export default Footer;