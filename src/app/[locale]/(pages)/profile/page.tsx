'use client'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AccountsApi } from 'src/api';
import { IUser } from "src/constants/types";
import { useSession } from "next-auth/react";
import ProfileForm from "./index";
import { Routes } from "src/constants/routes";
import { logout } from "../../auth/logout/actions";

const ProfilePage = () => {
  const router = useRouter();

  const session = useSession();
  const userId = session.data?.user.id;

  const [userData, setUserData] = useState<IUser | null>(null);

    const getProfile = async() => {
        try{
            const res = await AccountsApi.getUserData(Number(userId));
            setUserData(res.data);
            console.log(res.data);
        }catch(err){
            setUserData(null)
            toast.error('Profile not found!');
            router.push(Routes.LANDING);
        }
    }
    useEffect(() => {
        getProfile();
    })

  const handleSuccess = () => {
    toast.success('Profile updated successfully!');
    router.refresh();
  };

  const handleDelete = () => {
    toast.success("Profile zostal usuniety!")
    logout();
    router.push(Routes.LANDING);
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
    return <div>Loading...</div>;
  }

  return (
    <ProfileForm
      userData={userData} 
      onSuccess={handleSuccess}
      onDelete={handleDelete}
      onCancel={handleCancel}
    />
  );
};

export default ProfilePage;