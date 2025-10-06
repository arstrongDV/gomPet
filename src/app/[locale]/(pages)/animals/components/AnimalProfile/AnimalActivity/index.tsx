'use client';
import React, { useEffect, useState } from 'react';
import { Button, List } from 'src/components';
import { IPost } from 'src/constants/types';
import PostCard from './components/PostCard';
import style from './PostsPage.module.scss';
import AddPost from './components/AddPost';
import { PostsApi } from 'src/api';

type AnimalActivityProps = {
  postsData?: IPost[];
  animalId: number;
};

const AnimalActivity = ({ animalId }: AnimalActivityProps) => {
  const [showAddPost, setShowAddPost] = useState<boolean>(false);
  const [animalPosts, setAnimalPosts] = useState<IPost[]>([]);

  const getAnimalPosts = async (animalId: number): Promise<void> => {
    try {
      const res = await PostsApi.getAnimalPosts(animalId);
      setAnimalPosts(res.results || []);
      console.log("res.results: ", res.results)
    } catch (error) {
      console.error("Failed to fetch animal posts:", error);
    }
  };

  const deletePosts = (postId: number) => {
    setAnimalPosts(prev => prev.filter(post => post.id !== postId));
  };

  const updatePosts = (updatedPost: IPost) => {
    setAnimalPosts(prev =>
      prev.map(post =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
  };

  // const updatePosts = async () => {
  //   await getAnimalPosts(animalId);
  // };


  useEffect(() => {
    getAnimalPosts(animalId);
  }, [animalId]);

  return (
    <div className={style.container}>
      <Button
        icon="plus"
        label="Dodaj post"
        width="200px"
        onClick={() => setShowAddPost(true)}
      />

      <List isLoading={false} className={style.list}>
        {animalPosts.length > 0 ? (
          animalPosts.map((post) => (
            <PostCard key={post.id} post={post} updatePosts={updatePosts} deletePosts={deletePosts} />
          ))
        ) : (
          <div className={style.noPost}>No posts available</div>
        )}
      </List>

      {showAddPost && (
        <AddPost
          animalId={animalId}
          setShowAddPost={setShowAddPost}
          refreshPosts={() => getAnimalPosts(animalId)}
        />
      )}
    </div>
  );
};

export default AnimalActivity;
