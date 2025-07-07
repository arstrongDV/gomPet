'use client';

import React from 'react'
import Image from 'next/image';
import { IAnimal } from 'src/constants/types';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';

import style from './AnimalProfile.module.scss';

import { FamilyTreeWrapper } from './components/FamilyTree/FamilyTreeWrapper';
import { Button, Icon, OrganizationTypeName, StarRating } from 'src/components';
import RelatedAnimals from './components/RelatedAnimals';
import AnimalPhotos from './components/AnimalPhotos';
import Comments from './components/Comments';
import AnimalDescription from './components/AnimalDescription';
import { useRouter } from 'next/navigation';

type AnimalProfileProps = {
    animal: IAnimal & {
      characteristicBoard: { title: string; bool: boolean }[];
    }
}

const AnimalInformation = ({ animal }: AnimalProfileProps) => {

    const t = useTranslations('pages.animals');
    const router = useRouter();
    const formatDate = (dateString: string) => {
        return dayjs(dateString).format('DD.MM.YYYY, godz. HH:mm');
      };

  return (
    <div className={style.mainBlock}>
        <div className={style.infoWrapper}>
            <AnimalPhotos animal={animal} />
            <div className={style.infoContainer}>
                <div className={style.blocksContainer}>
                    <div className={style.aboutAnimalBlock}>
                        <p>Imię: <span style={{color: '#000'}}>{animal.name}</span></p>
                        <p>Miasto: <span style={{color: '#000'}}>{animal.owner.address.city}</span></p>
                        <p>Gatunek: <span style={{color: '#000'}}>{animal.species}</span></p>
                        <p>Pleć: <span style={{color: '#000'}}>{animal.gender}</span></p>
                        <p>Wiek: <span style={{color: '#000'}}>{animal.age}</span></p>
                        <p>Wielkość: <span style={{color: '#000'}}>{animal.size}</span></p>
                        <p>Status: <span style={{color: '#000'}}>{animal.status}</span></p>
                        <p>Rasa: <span style={{color: '#000'}}>{animal.breed}</span></p>
                        <p>Dodany dnia: <span style={{color: '#000'}}>{formatDate(`${animal.created_at}`)}</span></p>
                    </div>
                    <div className={style.contactsBlock}>
                        <div className={style.mainInfo}>
                            <div className={style.logoFundation}>
                            <OrganizationTypeName type={animal.owner.type} />
                            </div>
                            <div className={style.logoHelp}>
                                <Image src={animal.owner.image} alt='animals-help-image' width={90} height={40} />
                            </div>
                            <p>Ratujemy zwierzaki</p>
                        </div>
                        <div className={style.contactInfo}>
                            <div className={style.boneCount}>
                                <StarRating
                                    rating={4}
                                    readonly
                                />
                            </div>
                        <div className={style.location}>
                            <Icon name={"mapPin"} /> <p style={{color: '#000'}}>{animal.owner.address.city}</p>
                        </div>
                        <p><span style={{color: '#798177'}}>Cena:</span> {animal.price} zł</p>
                        {/* <a href='tel:+48213713370' className={style.phoneNumButton}> */}
                            {/* <button> */}
                                    {/* <Image src={PHONE_IMAGE} alt='phone-image' width={18} /> 
                                    <p className={style.call}>Zadzwoń i zapytaj</p> */}
                            {/* </button> */}
                        {/* </a> */}
                    
                        <Button
                            className={style.phoneNumButton}
                            icon='phone'
                            label={'Zadzwoń i zapytaj'}
                            hrefOutside='tel:+48213713370'
                            empty={true}
                        />

                        </div>
                    </div>
                    <div className={style.characteristicsBlock}>
                        {animal.characteristicBoard.map(c => (
                        <div className={style.AnimalCharacter} key={c.title}>
                            <div className={style.caracteristicImage}>
                                {c.bool ? <Icon name={"pawFilled"} /> : <></>}
                            </div> 
                            <p className={style.caracteristicTitle}>{c.title}</p>
                        </div>
                        ))}
                    </div>
                    <div className={style.mapBlock}>
                        <iframe
                            src={animal.location}
                            width="600"
                            height="450"
                            className={style.mapBlock}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy='no-referrer-when-downgrade'
                            >
                        </iframe>
                    </div>

                </div>
                <div className={style.infoTextBlock}>
                    {/* <p>
                        Lobo to około 2-3 letni samiec w typie amstaffa, który był towarzyszem Flory oraz ojcem ich potomstwa. 
                        Lobo to około 2-3 letni samiec w typie amstaffa który był towarzyszem Flory oraz ojcem ich potomstwa. Jego stan jest nieco lepszy niż suczki, ale tylko nie wiele.
                    </p>
                    <p>
                    Podobnie jak Flora będzie wymagał sporo zaangażowania od nowego opiekuna włożonego w naukę życia obok człowieka. Lobo to pies z bardzo fajnym charakterem, widać że brakowało mu człowieka i że bardzo chce nadrobić te straty. Nie ma najmniejszego problemu w poznawaniu nowych ludzi, jest łasy na uwagę i pieszczoty. Czasami w emocjach zdaży mu się podgryzać lub łapać zębami za smycz, ale skorygowany szybko odpuszcza i potrafi ostudzić emocje. Ma duży potencjał szkoleniowy i nie mniejszy sportowy. Polecamy Lobo dla osób aktywnych, nastawionych na prace z psem.
                    </p>
                    <p>
                    Jeżeli uważasz że Lobo to psiak na którego właśnie czekałeś, koniecznie wypełnij ankietę adopcyjną na stronie https://amstaffyniczyje.pl
                    </p>
                    <p>
                    W przypadku dodatkowych pytań zapraszamy również do kontaktu telefonicznego po 
                    godzinie 16(uszanuj to pracujemy zawodowo) AGA 503305077 lub ADAM 661 037 223Lobo to około 2-3 
                    letni samiec w typie amstaffa który był towarzyszem Flory oraz ojcem ich potomstwa. Jego stan jest '
                    nieco lepszy niż suczki, ale tylko nie wiele. Podobnie jak Flora będzie wymagał sporo zaangażowania 
                    od nowego opiekuna włożonego w naukę życia obok człowieka. Lobo to pies z bardzo fajnym charakterem, 
                    widać że brakowało mu człowieka i że bardzo chce nadrobić te straty. Nie ma najmniejszego problemu w 
                    poznawaniu nowych ludzi, jest łasy na uwagę i pieszczoty. Czasami w emocjach zdaży mu się podgryzać 
                    lub łapać zębami za smycz, ale skorygowany szybko odpuszcza i potrafi ostudzić emocje. Ma duży potencjał 
                    szkoleniowy i nie mniejszy sportowy. Polecamy Lobo dla osób aktywnych, nastawionych na prace z psem. 
                    Jeżeli uważasz że Lobo to psiak na którego właśnie czekałeś, koniecznie wypełnij ankietę adopcyjną na 
                    stronie https://amstaffyniczyje.pl W przypadku dodatkowych pytań zapraszamy również do kontaktu telefonicznego 
                    po godzinie 16(uszanuj to pracujemy zawodowo) AGA 503305077 lub ADAM 661 037 223
                    </p> */}
                    <AnimalDescription text="W przypadku dodatkowych pytań zapraszamy również do kontaktu telefonicznego po 
                    godzinie 16(uszanuj to pracujemy zawodowo) AGA 503305077 lub ADAM 661 037 223Lobo to około 2-3 
                    letni samiec w typie amstaffa który był towarzyszem Flory oraz ojcem ich potomstwa. Jego stan jest '
                    nieco lepszy niż suczki, ale tylko nie wiele. Podobnie jak Flora będzie wymagał sporo zaangażowania 
                    od nowego opiekuna włożonego w naukę życia obok człowieka. Lobo to pies z bardzo fajnym charakterem, 
                    widać że brakowało mu człowieka i że bardzo chce nadrobić te straty. Nie ma najmniejszego problemu w 
                    poznawaniu nowych ludzi, jest łasy na uwagę i pieszczoty. Czasami w emocjach zdaży mu się podgryzać 
                    lub łapać zębami za smycz, ale skorygowany szybko odpuszcza i potrafi ostudzić emocje. Ma duży potencjał 
                    szkoleniowy i nie mniejszy sportowy. Polecamy Lobo dla osób aktywnych, nastawionych na prace z psem. 
                    Jeżeli uważasz że Lobo to psiak na którego właśnie czekałeś, koniecznie wypełnij ankietę adopcyjną na 
                    stronie https://amstaffyniczyje.pl W przypadku dodatkowych pytań zapraszamy również do kontaktu telefonicznego 
                    po godzinie 16(uszanuj to pracujemy zawodowo) AGA 503305077 lub ADAM 661 037 223" maxLines={5} />
                </div>
                <div className={style.myFamilly}>
                    <FamilyTreeWrapper animal={animal} />
                </div>
            </div>
        </div>
        <div className={style.bottomContainer}>
            <Comments animal={animal}/>
            <div className={style.related}>
                <div className={style.title}>
                    <h4>Inni <span style={{color: '#277D23'}}>podopieczni</span> fundacji</h4>
                    <p onClick={() => router.push(`/organizations/${animal.owner.id}`)}>Zobacz stronę fundacji</p>
                </div>
                <div className={style.relatedAnimals}>
                    <RelatedAnimals animal={animal} />
                    <RelatedAnimals animal={animal} />
                    <RelatedAnimals animal={animal} />
                    <RelatedAnimals animal={animal} />
                    <RelatedAnimals animal={animal} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default AnimalInformation
