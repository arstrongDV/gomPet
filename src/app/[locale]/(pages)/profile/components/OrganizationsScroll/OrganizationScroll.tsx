import { HorizontalScroll, LabelLink, Loader } from "src/components";
import { Routes } from "src/constants/routes";
import { IAnimal, IOrganization } from "src/constants/types";
import AnimalCard from "../../../animals/components/AnimalCard";
import style from './OrganizationScroll.module.scss'
import { useTranslations } from "next-intl";
import OrganizationCard from "../../../(organizations)/components/OrganizationCard";

type AnimalScrollProps = {
    organizations: any;
    isLoading: boolean | undefined;
}

const OrganizationsScroll = ({organizations, isLoading}: AnimalScrollProps) => {
    const t = useTranslations('pages.landing');
    console.log(organizations);

    return(
        <div className={style.container}>
            <header className={style.header}>
                <h3 className={style.title}>
                    {t.rich('organizationsScroll.myOrganizations', {
                        highlight: (chunks) => <span className={style.highlight}>{chunks}</span>
                    })}
                </h3>
                <LabelLink
                    href={Routes.SHELTERS}
                    label={t('organizationsScroll.seeAll')}
                    color='dimmed'
                />
            </header>

            <HorizontalScroll className={style.list}>
                {isLoading && <Loader />}
                {organizations.map((org: any) => (
                <OrganizationCard
                    key={org.organization.id}
                    className={style.item}
                    organization={org.organization}
                />
                ))}
            </HorizontalScroll>
        </div>
    )
}

export default OrganizationsScroll;