'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { OrganizationsApi, PostsApi } from "src/api";
import Button from "src/components/layout/Buttons/Button"
import { IPost } from "src/constants/types";

type FollowingButtonProps = {
    authorId: number;
    fullWidth?: boolean;
    // followedOrganizations: number[];
    // setFollowedOrganizations: React.Dispatch<React.SetStateAction<number[]>>;
    followedAuthors?: Record<number, number>
    setFollowedAuthors?: React.Dispatch<React.SetStateAction<Record<number, number>>>;
    target_type: string;
}

const FollowingButton = ({ authorId, followedAuthors, setFollowedAuthors, target_type }: FollowingButtonProps) => {
    const session = useSession();
    const myId = session.data?.user?.id;

    const followId = followedAuthors && followedAuthors[authorId];
    const isFollowed = !!followId;

    const IsFollow = async() => {
        try{
            const res = await OrganizationsApi.verifyFollowing(target_type, authorId);
            const backendFollowId = res.data.follow_id;

            if (backendFollowId !== 0) {
                setFollowedAuthors && setFollowedAuthors(prev => ({
                    ...prev,
                    [authorId]: backendFollowId
                }));
            }
        }catch(err){
            console.log(err)
        }
    }
    useEffect(() => {
        if (session.status === "authenticated") {
            IsFollow();
          }
    }, [authorId, session.status])

    const handleFollowing = async() => {
        const isLoggedInUser = session.status === 'authenticated' && !!myId;
        if (!isLoggedInUser) {
            toast.error('Musisz być zalogowany, aby zaczac obserwowac.');
            return;
        }

        if(!isFollowed){
            try{
                const res = await PostsApi.Follow({
                    target_type: target_type,
                    target_id: authorId
                });
                console.log(res)
                if (res?.status === 201) {
                    const newFollowId = res.data.id;
    
                    setFollowedAuthors && setFollowedAuthors(prev => ({
                        ...prev,
                        [authorId]: newFollowId
                    }));
    
                    toast.success("Obserwujesz organizację");
                }
            }catch(err){
                console.log(err)
                toast.error("Nie udalo sie zaobserwowac organizacje")
            }
        } else{
            try{
                const res = await PostsApi.Unfollow(Number(followId));
                console.log(res)
                if (res?.status === 204) {
                    setFollowedAuthors && setFollowedAuthors(prev => {
                        const updated = { ...prev };
                        delete updated[authorId];
                        return updated;
                    });
    
                    toast.success("Przestałeś obserwować");
                }
            }catch(err){
                console.log(err)
                toast.error("Nie udalo sie usunac obserwacje organizacje")
            }
        }
    }

    return(
        <>
            <Button 
                icon={isFollowed ?  "starFilled" : "star"}
                label={isFollowed ? 'Obserwujesz' : 'Obserwuj'} 
                onClick={handleFollowing}
                gray 
            />
        </>
    )
}

export default FollowingButton;