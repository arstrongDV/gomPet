'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AnimalsApi, OrganizationsApi } from 'src/api';
import { IAnimal, IOrganization } from "src/constants/types";
import AnimalUpdateForm from './index'
import { useParams } from "next/navigation";
import { OptionType } from "dayjs";
import OrganizationUpdateForm from "./index";

const OrganizationEditPage = () => {
  const [organization, setOrganization] = useState<IOrganization | null>(null);

  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res_org = await OrganizationsApi.getOrganizationProfile(Number(params.id));

        setOrganization(res_org.data);
      } catch (error) {
        console.error('Error fetching organization:', error);
        toast.error('Organization not found');
      }
    };
    fetchOrganization();
  }, [params.id]);

  const handleSuccess = () => {
    toast.success('Organization updated successfully!');
    router.push(`/organizations/${params.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  if (!organization) {
    return <div>Loading...</div>;
  }

  return (
    <OrganizationUpdateForm 
      organization={organization} 
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  );
};

export default OrganizationEditPage;
