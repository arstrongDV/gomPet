'use client'
import Modal from "src/components/layout/Modal"
import style from './AddPost.module.scss'
import { useState } from "react";
import Button from "src/components/layout/Buttons/Button";
import { useSession } from "next-auth/react";
import AddPostComponent from "./AddPostComponent";

type AddPostProps = {
    animalId?: number;
    organizationId?: number;
    getPosts: (id: number) => void;
    animalOwnerId?: number;
    organizationOwnerId?: number;
  };

const AddPost = ({animalId, organizationId, animalOwnerId, organizationOwnerId, getPosts}: AddPostProps) => {
    const session = useSession();
    const myId = session.data?.user.id;
    const targetId = animalId ?? organizationId;

    const [showAddPost, setShowAddPost] = useState<boolean>(false);

    return (
        <>
            {(
                (animalOwnerId && myId === animalOwnerId) ||
                (organizationOwnerId && myId === organizationOwnerId)
            ) && (
                <Button
                    icon="plus"
                    label="Dodaj post"
                    width="200px"
                    onClick={() => setShowAddPost(true)}
                />
            )}
            <Modal 
                className={style.modaPostAddWin} 
                isOpen={showAddPost} 
                closeModal={() => setShowAddPost(false)}
                title='Dodaj Post'
            >
                <AddPostComponent 
                      {...(animalId 
                        ? { animalId } 
                        : { organizationId }
                    )}
                    animalId={animalId}
                    setShowAddPost={setShowAddPost} 
                    refreshPosts={() => {
                      if (targetId != null) {
                        getPosts(targetId);
                      }
                    }}
                />
            </Modal>
        </>
    )
}

export default AddPost;
