import { AccountsApi, AnimalsApi, OrganizationsApi } from "src/api";
import UserPublicProfile from "./UserPublicProfile";

const getUserData = async (userId: number) => {
  try {
    const res = await AccountsApi.getUserProfileInfo(userId);
    return res.data;
  } catch (error) {
    return null;
  }
};

const getUserOrganizations = async(userId: number) => {
    try{
        const usersOrganizationsRes = await OrganizationsApi.getUserOrganizations(userId);
        return usersOrganizationsRes.data
      }catch(error){
        return null;
      }
}

const getUserAnimals = async(userId: number) => {
    try {
        const userAnimalsRes = await AnimalsApi.getUsersAnimals(userId, {});
        return userAnimalsRes.data;
      } catch (error) {
        return null;
      } 
}

export const generateMetadata = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const userData = await getUserData(Number(id));
    
    if (!userData) {
      return {
        title: 'User Not Found',
        description: 'User not found',
      }
    }

    return {
      title: userData?.user.full_name || 'Unknown User',
      description: userData?.user.email || 'Users details',
      openGraph: {
        images: userData?.user.image ? [userData.user.image] : [],
      },
    };
};

const UserDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    
    const [user, organizations, animals] = await Promise.all([
      getUserData(Number(id)),
      getUserOrganizations(Number(id)),
      getUserAnimals(Number(id))
    ]);
  
    return (
      <UserPublicProfile
        user={user.user}
        memberships={user.memberships}
        organizations={organizations ?? []}
        animals={animals?.results ?? []}
      />
    );
  };
  
  export default UserDetailPage;
