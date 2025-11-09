'use client'

import { Button, Card } from "src/components";
import style from './Banner.module.scss';
import image from '../../../../../../assets/banner.png';
import { useRouter } from "next/navigation";
import { Routes } from "src/constants/routes";

const Banner = () => {
const { push } = useRouter()
  const cardStyles = {
    backgroundImage: `
      linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.0) 10%,
        rgba(0, 0, 0, 0.5) 35%,
        rgba(0, 0, 0, 0.7) 50%,
        rgba(0, 0, 0, 0.5) 65%,
        rgba(0, 0, 0, 0.0) 90%
      ),
      url(${image.src})
    `
  };

  return (
    <Card className={style.baner} style={cardStyles}>
        <div className={style.container}>
            <h1>Znajdź swojego nowego <span className={style.greenText}>przyjaciela</span></h1>
            <p>
                Poznaj wyjątkowe zwierzęta do adopcji z lokalnych schronisk, hodowli i fundacji. 
                Odkryj historię, temperament i cechy swojego przyszłego towarzysza, aby znaleźć idealne 
                dopasowanie dla Twojej rodziny.
            </p>
            <Button className={style.buttonCard} icon="paw" label="Znajdź kompana" onClick={() => push(Routes.ANIMALS)} />
        </div>
    </Card>
  );
};

export default Banner;
