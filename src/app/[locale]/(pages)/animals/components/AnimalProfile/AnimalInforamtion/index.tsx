'use client';
import React, { useState } from 'react'
import Image from 'next/image';
import { IAnimal } from 'src/constants/types';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import classNames from 'classnames';
import style from './AnimalProfile.module.scss';
import { Icon } from 'src/components';
import { IconNames } from 'src/assets/icons';

import ICON_FUNDATION from '../images/fundationIcon.png'
import IMAGE_ANIMALS_HELP from '../images/AnimalsHelp.png'
import FILL_BONE from '../images/coloredBone.png'
import NO_FILL_BONE from '../images/nocoloredBone.png'
import LOCATION_IMAGE from '../images/Location.png'
import PHONE_IMAGE from '../images/phone.png'
import PAW_IMAGE from '../images/paw.png'
import MAP_IMAGE from '../images/Rectangle13.png'
import AVATAR from '../images/avatar.png'

type AnimalProfileProps = {
    animal: IAnimal;
  };

const localState = {
    MaxboneCount: 5,
    boneCount: 4,
    price: 2100,

    characteristicBoard: [
        {title: 'akceptuje koty', bool: true},
        {title: 'sterylizacja/kastracja', bool: false},
        {title: 'szczepienia', bool: true},
        {title: 'szkolony', bool: true},
        {title: 'przyjazny dzieciom', bool: false},
        {title: 'uwielbia zabawę', bool: false},
        {title: 'uwielbia spacery', bool: false},
    ],

    textDescription: "Lobo to około 2-3 letni samiec w typie amstaffa który był towarzyszem Flory oraz ojcem ich potomstwa. Jego stan jest nieco lepszy niż suczki, ale tylko nie wiele.",

    images: [
        'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
        'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
        'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
        'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
        'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
        'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
        'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg',
    ],

    famillyTree: {
        parents: [
            {photo: 'https://zoodoptuj.pl/uploads/pets/7bbc4a4f05eb.jpg', name: 'Lobo 2.0'},
            {photo: '', name: 'Lobo 2.1'},
        ],
        grandparents:[
            {photo: '', name: 'Lobo 2.1'},
            {photo: '', name: 'Lobo 2.1'},
            {photo: '', name: 'Lobo 2.1'},
            {photo: '', name: 'Lobo 2.1'}
        ]
    },

    comments: [
        {
            userName: 'Użytkownik',
            data: '25.03.2024, godz. 13:30',
            avatar: AVATAR,
            boneCount: 4,
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc porttitor vel sapien eu laoreet. Donec dapibus justo ac porta vestibulum. Sed tincidunt elit mauris, at interdum mi sollicitudin a.'
        },
        {
            userName: 'Użytkownik',
            data: '25.03.2024, godz. 13:30',
            avatar: AVATAR,
            boneCount: 3,
            comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        }
    ]
}

const genderIconNames: { [key: string]: IconNames } = {
    male: 'genderMale',
    female: 'genderFemale'
  };

const AnimalInformation = ({ animal }: AnimalProfileProps) => {
    const [mainPhoto, setMainPhoto] = useState(animal.image)
    const t = useTranslations('pages.animals');
    const {push} = useRouter();

    const BoneCount = ({ boneCount, maxBoneCount }: { boneCount: number; maxBoneCount: number }) => (
        <div>
          {Array.from({ length: boneCount }).map((_, index) => (
            <Image key={`fill-${index}`} src={FILL_BONE} alt="bone-fill-image" width={22} height={22} />
          ))}
          {Array.from({ length: maxBoneCount - boneCount }).map((_, index) => (
            <Image key={`nofill-${index}`} src={NO_FILL_BONE} alt="bone-fill-image" width={22} height={22} />
          ))}
        </div>
      );

      const RelatedAnimals = ({ animal }: AnimalProfileProps) => {
        return(
            <div className={style.cardClasses} style={{backgroundImage: `url(${animal.image})`}}>
            <div className={style.content} onDoubleClick={() => {push(`/animals/${animal.id}`)}}>
                <div className={style.top}>
                <div className={style.about}>
                    <h2 className={classNames(style.badge, style.title)}>{animal.name}</h2>
                    <div className={classNames(style.badge, style.age)}>+{animal.age}</div>
                    {animal.characteristics.length > 0 && (
                    <div className={classNames(style.badge, style.characteristics)}>
                        {t(`characteristics.${animal.species}.${animal.characteristics[0]}`)}
                    </div>
                    )}
                </div>
                <button className={style.addBookmark}>
                    <Icon name='heart' />
                </button>
                </div>

                <div className={style.hoverContent}>
                <div className={style.data}>
                    <div className={classNames(style.badge, style.gender)}>
                    <span>Płeć: {t(`gender.${animal.gender}`)}</span>
                    <Icon name={genderIconNames[animal.gender]} />
                    </div>
                    <div className={classNames(style.badge, style.size)}>Wielkość: {t(`size.${animal.size}`)}</div>
                    <div className={classNames(style.badge, style.ageText)}>Wiek: Dorosły</div>
                </div>
                </div>

                <div className={style.bottom}>
                <div className={style.location}>
                    <Icon name='mapPin' />
                    <span>{animal.owner.address.city}</span>
                </div>
                </div>
            </div>
        </div>
        )
      }

      
  return (
    <div className={style.mainBlock}>
        <div className={style.infoWrapper}>
            <div className={style.photos}>
                <div className={style.mainImage}>
                    {animal.image ? (
                    <img src={`${mainPhoto}`} alt={`${animal.name} photo`} width={460} height={611} />
                    ) : (
                    <p>No image available</p>
                    )}
                </div>
                <div className={style.imagesList}>
                    {localState.images.map((image, i) => (
                        <img 
                            key={i} 
                            src={image} 
                            alt={`${animal.name} photo`} 
                            className={style.thumbnail}
                            onClick={() => setMainPhoto(image)}
                        />
                    ))}
                </div>
            </div>
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
                        <p>Dodany dnia: <span style={{color: '#000'}}>{animal.created_at}</span></p>
                    </div>
                    <div className={style.contactsBlock}>
                        <div className={style.mainInfo}>
                        <div className={style.logoFundation}>
                            <Image src={ICON_FUNDATION} alt='fundation-image' width={24} /> <p className={style.fundation}>Fundacja</p>
                        </div>
                        <div className={style.logoHelp}>
                            <Image src={IMAGE_ANIMALS_HELP} alt='animals-help-image' width={90} height={40} />
                        </div>
                        <p>Ratujemy zwierzaki</p>
                        </div>
                        <div className={style.contactInfo}>
                        <div className={style.boneCount}>
                        <div className={style.boneCount}>
                            <BoneCount boneCount={localState.boneCount} maxBoneCount={localState.MaxboneCount} />
                        </div>
                        </div>
                        <div className={style.location}>
                            <Image src={LOCATION_IMAGE} alt='location-image' /> <p style={{color: '#000'}}>{animal.owner.address.city}</p>
                        </div>
                        <p><span style={{color: '#798177'}}>Cena:</span> {localState.price} zł</p>
                        <button className={style.phoneNumButton}>
                            <Image src={PHONE_IMAGE} alt='phone-image' width={18}  /> <p className={style.call}>Zadzwoń i zapytaj</p>
                        </button>
                        </div>
                    </div>
                    <div className={style.characteristicsBlock}>
                        {localState.characteristicBoard.map(c => (
                        <div className={style.AnimalCharacter}>
                            <div className={style.caracteristicImage}>
                            {c.bool ? <Image src={PAW_IMAGE} alt='paw-image' width={20} /> : <></>}
                            </div> 
                            <p className={style.caracteristicTitle}>{c.title}</p>
                        </div>
                        ))}
                    </div>
                    <div className={style.mapBlock}>
                        <Image src={MAP_IMAGE} alt='phone-image'/>
                    </div>

                </div>
                <div className={style.infoTextBlock}>
                    <p>
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
                    </p>
                </div>
                <div className={style.myFamilly}>
                    <div className={style.aboutFamilly}>
                        <h3>Poznaj moją rodzinę</h3>
                        <p>Aby poznać dalszych przodków,  poruszaj się pomiędzy profilami zwierząt z 
                            poniższego drzewa genealogicznego</p>
                    </div>
                    <div className={style.famillyTree}>
                        <div className={style.animalParents}>
                            {localState.famillyTree.grandparents.map((parent, i) => (
                                <div>
                                    {parent.photo !== '' ? <img key={i} src={`${parent.photo}`}alt='animal-tree' /> : <div className={style.noPhoto} />}
                                    <p>{parent.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className={style.animalParents}>
                            {localState.famillyTree.parents.map((parent, i) => (
                                <div>
                                    {parent.photo !== '' ? <img key={i} src={`${parent.photo}`}alt='animal-tree' /> : <div className={style.noPhoto} />}
                                    <p>{parent.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className={style.mainAnimal}>
                            <img src={`${animal.image}`} alt='animal-tree' />
                            <p>{animal.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className={style.bottomContainer}>
            <div className={style.opinion}>
                <div className={style.opinionTitle}>
                    <h3>Opinie o fundacji</h3>
                    <p>średnia ocen: 4.3 na 5</p>
                </div>
                {localState.comments.map((com, i) => (
                    <div key={i} className={style.comments}>
                        <div className={style.userComInfo}>
                            <Image className={style.avatar} src={com.avatar} alt='user-icon' width={24} height={24} />
                            <div className={style.comContainer}>
                                <div className={style.commentWrraper}>
                                    <div className={style.userNameData}>
                                        <h4>{com.userName}</h4>
                                        <p>{com.data}</p>
                                    </div>
                                    <div className={style.recomendation}>
                                        <BoneCount boneCount={com.boneCount} maxBoneCount={localState.MaxboneCount} />
                                    </div>
                                </div>
                                <div className={style.userComment}>
                                        <p>{com.comment}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={style.related}>
                <div className={style.title}>
                    <h4>Inni <span style={{color: '#277D23'}}>podopieczni</span> fundacji</h4>
                    <p>Zobacz stronę fundacji</p>
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
