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

    const t1 = useTranslations('pages.animals.profile');
    const t2 = useTranslations('common');
    const t3 = useTranslations('pages.animals');
    const router = useRouter();
    const session = useSession();
    const myId = Number(session.data?.user.id);
    const [followedAuthors, setFollowedAuthors] =
    useState<Record<number, number>>({});

    const formatDate = (dateString: string) => {
        return dayjs.utc(dateString).format('DD.MM.YYYY, godz. HH:mm');
    };

    const speciesKey = (animal?.species as any)?.label ?? animal?.species;
    const breedKey = (animal?.breed as any)?.label ?? animal?.breed;
    const genderKey = animal?.gender?.toLowerCase();
    const sizeKey = animal?.size?.toLowerCase();
    const ageKey = animal?.age;

  return (
    <div className={style.mainBlock}>
        <div className={style.infoWrapper}>
            <AnimalPhotos animal={animal} />
            <div className={style.infoContainer}>
                <div className={style.blocksContainer}>
                    <div className={style.aboutAnimalBlock}>
                        <ul>
                            <li>{t1('fields.name')}: <span style={{color: '#000'}}>{animal?.name ?? t1('noData')}</span></li>
                            <li>{t1('fields.city')}: <span style={{color: '#000'}}>{animal?.city ?? t1('noData')}</span></li>
                            <li>{t1('fields.species')}: <span style={{color: '#000'}}>{speciesKey ? t2(`animalSpecies.${speciesKey}`) : t1('noData')}</span></li>
                            <li>{t1('fields.gender')}: <span style={{color: '#000'}}>{genderKey ? t3(`gender.${genderKey}`) : t1('noData')}</span></li>
                            <li>{t1('fields.age')}: <span style={{color: '#000'}}>{ageKey == 0 ? 'mniej roku' : t1('noData')}</span></li>
                            <li>{t1('fields.size')}: <span style={{color: '#000'}}>{sizeKey ? t3(`size.${sizeKey}`) : t1('noData')}</span></li>
                            <li>{t1('fields.status')}: <span style={{color: '#000'}}>{t1(animal?.status) ?? t1('noData')}</span></li>
                            <li>{t1('fields.breed')}: <span style={{color: '#000'}}>{breedKey ? t2(`animalBreeds.${breedKey}`) : t1('noData')}</span></li>
                            <li>{t1('fields.addedOn')}: <span style={{color: '#000'}}>
                                {animal?.created_at ? formatDate(`${animal.created_at}`) : t1('noData')}
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
                                        <p><span style={{color: '#798177'}}>{t1('price')}:</span> {t1('priceCurrency', { price: animal.price })}</p>
                                    ) : (
                                        <p style={{color: '#798177'}}>{t1('freeAdoption')}</p>
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
                                            label={t1('callUs')}
                                            hrefOutside={`tel:${animal?.organization?.phone}`}
                                            empty={true}
                                        />
                                    ) : (
                                        <Button
                                            className={style.phoneNumButton}
                                            icon='mail'
                                            label={t1('writeToUs')}
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
                                        <p><span style={{color: '#798177'}}>{t1('price')}:</span> {t1('priceCurrency', { price: animal.price })}</p>
                                    ) : (
                                        <p style={{color: '#798177'}}>{t1('freeAdoption')}</p>
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
                                            label={t1('callUs')}
                                            hrefOutside={`tel:${animal?.owner_info?.phone}`}
                                            empty={true}
                                        />
                                    )}
                                    {animal?.owner_info?.email && (
                                        <Button
                                            className={style.phoneNumButton}
                                            icon='mail'
                                            label={t1('writeToUs')}
                                            hrefOutside={`mailto:${animal?.owner_info?.email}`}
                                            empty={true}
                                        />
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                        <CharacteristicsBlock characteristicBoard={animal.characteristicBoard} />
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
                        <div>{t1('noData')}</div>
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
                            <h3>{t1('organizationOpinions')}</h3>
                            <p>{t1('organizationRating', { rating: animal.organization.rating })}</p>
                        </div>

                        <List
                            className={style.comments}
                            emptyText={t2('comments.noComments')}
                        >
                            {comments.map((comment: any) => (
                                <Comment key={comment.id} comment={comment} noEditAllowed />
                            ))}
                        </List>
                    </Card>
                )}

                <div className={style.related}>
                    <div className={style.title}>
                        <h4>{t1.rich('relatedTitle', { highlight: (c) => <span style={{color: '#277D23'}}>{c}</span> })}</h4>
                        <p onClick={() => router.push(Routes.ORGANIZATION_PROFILE(animal.organization.id))}>{t1('relatedLink')}</p>
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
