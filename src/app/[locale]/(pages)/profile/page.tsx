'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AccountsApi, AnimalsApi, OrganizationsApi } from 'src/api';
import { IAnimal, IOrganization, IUser } from "src/constants/types";
import { signOut, useSession } from "next-auth/react";
import ProfileForm from "./UserProfile";
import { Routes } from "src/constants/routes";
import { Loader } from "src/components";

const ProfilePage = () => {
  const router = useRouter();

  const session = useSession();
  const userId = session.data?.user.id;

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [userData, setUserData] = useState<IUser | null>(null);
  const [userOrganizations, setUserOrganizations] = useState<IOrganization[]>([]);
  const [userAnimals, setUserAnimals] = useState<IAnimal[]>([]);

    const getProfile = async() => {
      setIsLoading(true)
        try{
            const res = await AccountsApi.getUserData(Number(userId));
            setUserData(res.data);
            console.log(res.data);
            setIsLoading(false)
        }catch(err){
            setUserData(null)
            setIsLoading(false)
            toast.error('Profile not found!');
            router.push(Routes.LANDING);
        }
    }
    useEffect(() => {
        getProfile();
    }, [])

    const getMyOrganizations = async() => {
      setIsLoading(true)
      try{
        const res = await OrganizationsApi.getMyOrganizations(true, String(session.data?.access_token), 5);
        setUserOrganizations(res.data.results)
        setIsLoading(false)
      }catch(err){
        // toast.error('Profile not found!');
        console.log(err);
        setIsLoading(false)
        setUserOrganizations([]);
      }
    }
    useEffect(() => {
      getMyOrganizations();
  }, [])

  const auth = useSession();
  const getMyAnimals = async() => {
    setIsLoading(true);
    try {
      const response = await AnimalsApi.getMyAnimals(5);
      setUserAnimals(response.data.results);
    } catch (error) {
      setUserAnimals([]);
    } finally {
      setIsLoading(false);
    }
  };
useEffect(() => {
    getMyAnimals();
}, []);


  const handleSuccess = () => {
    toast.success('Profile updated successfully!');
    router.refresh();
  };

  const handleDelete = () => {
    toast.success("Profile zostal usuniety!")
    void signOut({ callbackUrl: Routes.LANDING });
  };

  const handleCancel = (err: any) => {
    if (err.phone) toast.error("Telefon: " + err.phone[0]);
    if (err.name) toast.error("Imie: " + err.name[0]);
    if (err.surname) toast.error("Nazwisko: " + err.surname[0]);
    if (err.image) toast.error("Zdjęcie: " + err.image[0]);
    if (err.email) toast.error("Email: " + err.email[0]);

    if (err.location) toast.error("Lokacja: " + err.location[0]);

    if (!(
        err.phone ||
        err.name ||
        err.surname ||
        err.image ||
        err.email ||
        err.location
    )) {
        toast.error("Cos poszlo nie tak");
    }
};

  if (!userData) {
    return <Loader />;
  }

  return (
    <ProfileForm
      userData={userData} 
      userOrganizations={userOrganizations}
      userAnimals={userAnimals}
      onSuccess={handleSuccess}
      onDelete={handleDelete}
      onCancel={handleCancel}
      isLoading={isLoading}
    />
  );
};

export default ProfilePage;
