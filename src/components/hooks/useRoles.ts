'use client'

import { useEffect, useMemo, useState } from "react"
import { OrganizationsApi } from './../../api/index';
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export type Role = {
    label: string;
    value: string;
  };

type ApiRole = {
    label: string;
    value: string;
}

const useRoles = () => {
    const t = useTranslations('pages.common');

    const [data, setData] = useState<ApiRole[]>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getRoles = async() => {
            setLoading(true)
            try{
                const res = await OrganizationsApi.getOrganizationRoles();
                console.log("aaass: ", res);
                setData(res.data.roles)
                setLoading(false)
            }catch(err){
                console.log(err);
                setData([])
                setLoading(false)
            }finally {
                setLoading(false);
            }
        }
        getRoles();
    }, [])

    const roles: Role[] = useMemo(() => {
        return (
            data?.map(item => ({
                value: item.value,
                label: item.label,
            })) ?? []
        );
    }, [data]);
    return { roles, loading };
}

export default useRoles;