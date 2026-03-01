'use client'

import { IAnimal, IOrganization, IUser } from "src/constants/types"
import style from './Profile.module.scss'
import { Avatar, Card, HorizontalScroll, List, SectionHeader } from "src/components"
import OrganizationCard from "../../(organizations)/components/OrganizationCard"
import AnimalCard from "../../animals/components/AnimalCard"
import dayjs from "dayjs"

type Props = {
  user: IUser;
  organizations: IOrganization[];
  memberships: any;
  animals: IAnimal[];
}

const UserPublicProfile = ({ user, memberships, animals }: Props) => {
  console.log("user: ", user)
  console.log("organizations: ", memberships)
   console.log("animals: ", animals)

   const formatDate = (dateString: string) => {
    return dayjs(dateString).format('DD.MM.YYYY, godz. HH:mm');
    };

  if (!user) {
    return (
      <div className={style.mainContainer}>
        <div>User not found</div>
      </div>
    )
  }

  return (
    <div className={style.mainContainer}>
      <SectionHeader
          title={'Profile uzytkownika'}
          // subtitle={'Zaprezentuj zwierzę na platformie'}
          margin
        />

      <div className={style.cardContainer}>
        <Card className={style.infoCard}>
          <Avatar 
              className={style.avatar}
              src={typeof user.image === 'string' ? user.image : undefined}
              profile={user && user} 
          />

          <ul className={style.userInfoContainer}>
            <li className={style.userInfoElement}>
              <p>Imie:<span>{user.full_name ?? '-'}</span></p>
            </li>
            <li className={style.userInfoElement}>
              <p>Email:<span>{user.email ?? '-'}</span></p>
            </li>
            <li className={style.userInfoElement}>
              <p>Telefon:<span>{user.phone !== "" ? user.phone : '-'}</span></p>
            </li>
            <li className={style.userInfoElement}>
              <p>Konto stworzone dnia:<span>{formatDate(user.created_at) ?? '-'}</span></p>
            </li>
          </ul>
        </Card>
        
        <Card className={style.roleCard}>
          <h3>Role: </h3>
          <ul className={style.userRoleContainer}>
            {memberships.map((membership: any) => (
            <li className={style.userRoleElement}>
              <p><span>{membership.role}</span> ( {membership.organization.name} )</p>
            </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className={style.userDataWrapper}>
          <div>
            <SectionHeader
                title={'Organizacje uzytkownika'}
                // subtitle={'Zaprezentuj zwierzę na platformie'}
                margin
            />

            <List
                  className={style.list}
                >
                  {memberships && memberships.map((memberships: any) => (
                    <OrganizationCard
                      key={memberships.organization.id}
                      organization={memberships.organization}
                    />
                  ))}
            </List>
          </div>
          <div>
            <SectionHeader
                title={'Zwierza uzytkownika'}
                // subtitle={'Zaprezentuj zwierzę na platformie'}
                margin
            />
            <List
                className={style.list}
              >
                  {animals.map((animal) => (
                    <AnimalCard key={animal.id} animal={animal} />
                  ))}
              </List>
          </div>
        </div>
    </div>
  )
}

export default UserPublicProfile