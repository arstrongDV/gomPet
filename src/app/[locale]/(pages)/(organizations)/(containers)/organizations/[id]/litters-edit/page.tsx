'use client'
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { OrganizationsApi } from "src/api"
import { ILitter } from "src/constants/types"
import LittersEditForm from "."
import { Routes } from "src/constants/routes"

const LittersEditPage = () => {
    const [litter, setLitter] = useState<ILitter>();
    const params = useParams();
    const router = useRouter();
    console.log("params::", params)
    useEffect(() => {
        if (!params.id) return; // wait until params.id is ready
        const getLitters = async () => {
            try {
                const res = await OrganizationsApi.getLitter(Number(params.id));
                console.log("API response:", res);
                setLitter(res.data);
            } catch(err) {
                console.log(err);
                toast.error("Nie mogę znalezc tego miotu");
            }
        }
        getLitters();
    }, [params.id]);

    const handleSuccess = () => {
        toast.success('Organization updated successfully!');
        // router.push(Routes.ORGANIZATION_PROFILE(Number(params.id)));
        router.back();
      };
    
      const handleCancel = () => {
        // router.back();
      };
    
    //   if (!litter) {
    //     return <div>Loading...</div>;
    //   }

    return(
        <LittersEditForm 
            onSuccess={handleSuccess}
            onCancel={handleCancel}
            litter={litter} 
        />
    )
}

export default LittersEditPage;