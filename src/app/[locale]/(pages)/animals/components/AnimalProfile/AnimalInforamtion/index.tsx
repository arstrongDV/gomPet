'use client';

import React, { useState } from 'react'
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { Avatar, Button, Card,Comment, Icon, List, OrganizationTypeName, StarRating } from 'src/components';
import RichTextViewer from 'src/components/layout/Forms/RichTextViewer';
import FollowingButton from 'src/components/layout/PostCard/components/FollowingButton';
import { Routes } from 'src/constants/routes';
import { IAnimal, IComment } from 'src/constants/types';

import CharacteristicsBlock from './components/AnimalCharacteristics';
import AnimalPhotos from './components/AnimalPhotos';
import { FamilyTreeWrapper } from './components/FamilyTree/FamilyTreeWrapper';
import RelatedAnimals from './components/RelatedAnimals';

import style from './AnimalProfile.module.scss';

dayjs.extend(utc);

type AnimalProfileProps = {
    animal: IAnimal;
    comments: IComment[];
    familyTree: any;
    followers: number;
}

const AnimalInformation = ({ animal, followers, comments }: AnimalProfileProps) => {

    const t = useTranslations('pages.animals');
    const router = useRouter();
    const session = useSession();
    const myId = Number(session.data?.user.id);
    const [followedAuthors, setFollowedAuthors] =
    useState<Record<number, number>>({});

    console.log("followers: ", followers);

    console.log("animalanimalanimal:: ", animal);

    const formatDate = (dateString: string) => {
        return dayjs.utc(dateString).format('DD.MM.YYYY, godz. HH:mm');
      };

  return (
    <div className={style.mainBlock}>
        <div className={style.infoWrapper}>
            <AnimalPhotos animal={animal} />
            <div className={style.infoContainer}>
                <div className={style.blocksContainer}>
                    <div className={style.aboutAnimalBlock}>
                        <ul>
                            <li>Imię: <span style={{color: '#000'}}>{animal?.name ?? "Brak danych"}</span></li>
                            <li>Miasto: <span style={{color: '#000'}}>{animal?.city ?? "Brak danych"}</span></li>
                            <li>Gatunek: <span style={{color: '#000'}}>{(animal?.species as any)?.label ?? animal?.species ?? "Brak danych"}</span></li>
                            <li>Płeć: <span style={{color: '#000'}}>{animal?.gender ?? "Brak danych"}</span></li>
                            <li>Wiek: <span style={{color: '#000'}}>{animal?.age ?? "Brak danych"}</span></li>
                            <li>Wielkość: <span style={{color: '#000'}}>{animal?.size ?? "Brak danych"}</span></li>
                            <li>Status: <span style={{color: '#000'}}>{animal?.status ?? "Brak danych"}</span></li>
                            <li>Rasa: <span style={{color: '#000'}}>{(animal?.breed as any)?.label ?? animal?.breed ?? "Nieznana"}</span></li>
                            <li>Dodany dnia: <span style={{color: '#000'}}>
                                {animal?.created_at ? formatDate(`${animal.created_at}`) : "Brak danych"}
                            </span></li>
                        </ul>
                    </div>
                    <div className={style.contactsBlock}>
                        {animal.organization ? (
                            <>
                                <div className={style.mainInfo}>
                                    <div className={style.logoFundation}>
                                        <OrganizationTypeName type={animal.organization.type} />
                                    </div>

                                    <div className={style.ownerLogo} onClick={() => {
                                        router.push(Routes.ORGANIZATION_PROFILE(animal.organization.id))
                                    }}>
                                        {animal.organization.image && (
                                            <img
                                                src={animal.organization.image}
                                                alt={animal.organization.name}
                                                className={style.organizationLogo}
                                            />
                                        )}
                                    </div>

                                    <p>{animal.organization.name}</p>
                                </div>

                                <div className={style.contactInfo}>

                                    {animal.organization && (
                                        <div className={style.boneCount}>
                                            <StarRating
                                                rating={animal.organization.rating}
                                                readonly
                                            />
                                        </div>
                                    )}

                                    <div className={style.location}>
                                        <Icon name={"mapPin"} /> <p style={{color: '#000'}}>{animal.city}</p>
                                    </div>

                                    {String(animal.price) !== '0.00' ? (
                                        <p><span style={{color: '#798177'}}>Cena:</span> {animal.price} zł</p>
                                    ) : (
                                        <p style={{color: '#798177'}}>Oddam w dobre ręce!</p>
                                    )}

                                    <div className={style.subscribtion}>
                                        <span>{followers ?? 0} <Icon name='people' /></span>
                                        {myId !== animal.organization.user && (
                                            <FollowingButton 
                                                target_type="animals.animal" 
                                                fullWidth 
                                                authorId={animal.id} 
                                                followedAuthors={followedAuthors}
                                                setFollowedAuthors={setFollowedAuthors}
                                            />
                                        )}
                                    </div>

                                    {animal?.organization?.phone ? (
                                        <Button
                                            className={style.phoneNumButton}
                                            icon='phone'
                                            label={'Zadzwoń i zapytaj'}
                                            hrefOutside={`tel:${animal?.organization?.phone}`}
                                            empty={true}
                                        />
                                    ) : (
                                        <Button
                                            className={style.phoneNumButton}
                                            icon='mail'
                                            label={'Napisz do nas'}
                                            hrefOutside={`mailto:${animal?.organization?.email}`}
                                            empty={true}
                                        />
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={style.mainInfo}>
                                    <div className={style.logoFundation}>
                                        <Avatar  
                                            className={style.avatarImage}
                                            profile={animal.owner_info}
                                            src={animal.owner_info ? (animal.owner_info.image ?? undefined) : undefined} 
                                        />
                                    </div>

                                    <p>{animal.owner_info && animal.owner_info.full_name}</p>
                                </div>

                                <div className={style.contactInfo}>
                                    <div className={style.location}>
                                        <Icon name={"mapPin"} /> <p style={{color: '#000'}}>{animal.city}</p>
                                    </div>

                                    {String(animal.price) !== '0.00' ? (
                                        <p><span style={{color: '#798177'}}>Cena:</span> {animal.price} zł</p>
                                    ) : (
                                        <p style={{color: '#798177'}}>Oddam w dobre ręce!</p>
                                    )}

                                    <div className={style.subscribtion}>
                                        <span>{followers ?? 0} <Icon name='people' /></span>
                                        {myId !== animal?.owner_info?.id && (
                                            <FollowingButton 
                                                target_type="animals.animal" 
                                                fullWidth 
                                                authorId={animal.id} 
                                                followedAuthors={followedAuthors}
                                                setFollowedAuthors={setFollowedAuthors}
                                            />
                                        )}
                                    </div>

                                    {animal?.owner_info?.phone && (
                                        <Button
                                            className={style.phoneNumButton}
                                            icon='phone'
                                            label={'Zadzwoń i zapytaj'}
                                            hrefOutside={`tel:${animal?.owner_info?.phone}`}
                                            empty={true}
                                        />
                                    )}
                                    {animal?.owner_info?.email && (
                                        <Button
                                            className={style.phoneNumButton}
                                            icon='mail'
                                            label={'Napisz do nas'}
                                            hrefOutside={`mailto:${animal?.owner_info?.email}`}
                                            empty={true}
                                        />
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                        <CharacteristicsBlock animal={animal} />
                    {animal.location?.coordinates ? (
                        <iframe
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
                    <RichTextViewer content={animal.descriptions} />
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
        {animal.organization && (
            <div className={style.bottomContainer}>
                {comments.length !== 0 && (
                    <Card>
                        <div className={style.organizationOpinionText}>
                            <h3>Opinie o fundacji</h3>
                            <p>średnia ocen: {animal.organization.rating} na 5</p>
                        </div>

                        <List
                            className={style.comments}
                            // isLoading={isLoading}
                            emptyText="Brak komentarzy"
                        >
                            {comments.map((comment: any) => (
                                <Comment key={comment.id} comment={comment} noEditAllowed /> 
                            ))}
                        </List>
                    </Card>
                )}

                <div className={style.related}>
                    <div className={style.title}>
                        <h4>Inni <span style={{color: '#277D23'}}>podopieczni</span> fundacji</h4>
                        <p onClick={() => router.push(Routes.ORGANIZATION_PROFILE(animal.organization.id))}>Zobacz stronę fundacji</p>
                    </div>
                    <div className={style.relatedAnimals}>
                        <RelatedAnimals organizationId={animal.organization.id} />
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default AnimalInformation


