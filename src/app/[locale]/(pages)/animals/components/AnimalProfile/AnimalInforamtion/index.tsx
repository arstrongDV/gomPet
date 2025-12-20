'use client';

import React, { useRef } from 'react'
import Image from 'next/image';
import { IAnimal, IComment } from 'src/constants/types';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';

import style from './AnimalProfile.module.scss';

import { FamilyTreeWrapper } from './components/FamilyTree/FamilyTreeWrapper';
import { Button, Icon, List, Comment, OrganizationTypeName, StarRating } from 'src/components';
import RelatedAnimals from './components/RelatedAnimals';
import AnimalPhotos from './components/AnimalPhotos';
import Comments from './components/Comments';
import DescriptionTranslate from './components/AnimalDescription';
import { useRouter } from 'next/navigation';
import CharacteristicsBlock from './components/AnimalCharacteristics';

type AnimalProfileProps = {
    animal: IAnimal;
    comments: IComment[];
    familyTree: any;
}

const AnimalInformation = ({ animal, comments }: AnimalProfileProps) => {

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
                    <div className={style.aboutAnimalBlock}>
                        <p>Imię: <span style={{color: '#000'}}>{animal?.name ?? "Brak danych"}</span></p>
                        <p>Miasto: <span style={{color: '#000'}}>{animal?.city ?? "Brak danych"}</span></p>
                        <p>Gatunek: <span style={{color: '#000'}}>{animal?.species ?? "Brak danych"}</span></p>
                        <p>Płeć: <span style={{color: '#000'}}>{animal?.gender ?? "Brak danych"}</span></p>
                        <p>Wiek: <span style={{color: '#000'}}>{animal?.age ?? "Brak danych"}</span></p>
                        <p>Wielkość: <span style={{color: '#000'}}>{animal?.size ?? "Brak danych"}</span></p>
                        <p>Status: <span style={{color: '#000'}}>{animal?.status ?? "Brak danych"}</span></p>
                        <p>Rasa: <span style={{color: '#000'}}>{animal?.breed ?? "Nieznana"}</span></p>
                        <p>Dodany dnia: <span style={{color: '#000'}}>
                            {animal?.created_at ? formatDate(`${animal.created_at}`) : "Brak danych"}
                        </span></p>
                        </div>
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
                            <Icon name={"mapPin"} /> <p style={{color: '#000'}}>{animal.city}</p>
                        </div>
                        {String(animal.price) !== '0.00' ? (
                            <p><span style={{color: '#798177'}}>Cena:</span> {animal.price} zł</p>
                        ) : (
                            <p style={{color: '#798177'}}>Oddam w dobre rece!</p>
                        )}
                    
                        <Button
                            className={style.phoneNumButton}
                            icon='phone'
                            label={'Zadzwoń i zapytaj'}
                            hrefOutside='tel:+48213713370'
                            empty={true}
                        />

                        </div>
                    </div>
                        <CharacteristicsBlock animal={animal} />
                    {animal.location?.coordinates ? (
                        <iframe
                            width="600"
                            height="450"
                            className={style.mapBlock}
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen={false}
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${animal.location.coordinates[1]},${animal.location.coordinates[0]}&output=embed`}
                        />
                        ) : (
                        <div>Map location not available</div>
                        )}

                </div>
                <div className={style.infoTextBlock}>
                    <DescriptionTranslate text={animal.descriptions} maxLines={5} />
                </div>
                <div className={style.myFamilly}>
                <FamilyTreeWrapper 
                    familyTree={animal.parents} 
                    rootName={animal.name} 
                    rootImages={animal.image} 
                />
                </div>
            </div>
        </div>
        <div className={style.bottomContainer}>
            <List
                className={style.comments}
                // isLoading={isLoading}
                emptyText="Brak komentarzy"
            >
                {animal.comments.map((comment: any) => (
                    <Comment key={comment.id} comment={comment} /> 
                ))}
            </List>
            {/* <Comments comment={comment}/> */}
            <div className={style.related}>
                <div className={style.title}>
                    <h4>Inni <span style={{color: '#277D23'}}>podopieczni</span> fundacji</h4>
                    <p onClick={() => router.push(`/organizations/${animal.owner.id}`)}>Zobacz stronę fundacji</p>
                </div>
                <div className={style.relatedAnimals}>
                    <RelatedAnimals />
                </div>
            </div>
        </div>
    </div>
  )
}

export default AnimalInformation
