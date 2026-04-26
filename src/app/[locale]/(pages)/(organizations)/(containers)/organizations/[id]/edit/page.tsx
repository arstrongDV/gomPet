'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { OrganizationsApi } from 'src/api';
import { IOrganization } from "src/constants/types";
import { useParams } from "next/navigation";
import OrganizationUpdateForm from "./index";
import { Loader } from "src/components";

const OrganizationEditPage = () => {
  const t = useTranslations('pages.newOrganization');
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
        toast.error(t('toast.notFound'));
      }
    };
    fetchOrganization();
  }, [params.id]);

  const handleSuccess = () => {
    toast.success(t('toast.updateSuccess'));
    router.push(`/organizations/${params.id}`);
  };

  const handleCancel = () => {
    router.back();
  };

  if (!organization) {
    return <Loader />
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
