import { HorizontalScroll, LabelLink, Loader } from "src/components";
import { Routes } from "src/constants/routes";
import { IAnimal } from "src/constants/types";
import AnimalCard from "../../../animals/components/AnimalCard";
import style from './AnimalScroll.module.scss'
import { useTranslations } from "next-intl";

type AnimalScrollProps = {
    animals: IAnimal[];
    isLoading: boolean | undefined;
}

const AnimalScroll = ({animals, isLoading}: AnimalScrollProps) => {
    const t = useTranslations('pages.landing');

    return(
        <div className={style.container}>
            <header className={style.header}>
                <h3 className={style.title}>
                    {t.rich('animalsScroll.myAnimals', {
                        highlight: (chunks) => <span className={style.highlight}>{chunks}</span>
                    })}
                </h3>
                <LabelLink
                    href={Routes.MY_ANIMALS}
                    label={t('animalsScroll.seeAll')}
                    color='dimmed'
                />
            </header>

            <HorizontalScroll className={style.list}>
                {isLoading && <Loader />}
                {animals.map((animal) => (
                <AnimalCard
                    className={style.animal}
                    key={animal.id}
                    animal={animal}
                />
                ))}
            </HorizontalScroll>
        </div>
    )
}

export default AnimalScroll;