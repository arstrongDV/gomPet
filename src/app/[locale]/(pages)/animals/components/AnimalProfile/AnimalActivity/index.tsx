'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { PostsApi } from 'src/api';
import { List, Pagination } from 'src/components';
import PostCard from 'src/components/layout/PostCard';
import AddPost from 'src/components/layout/PostCard/components/AddPost';
import { IPost } from 'src/constants/types';

import style from './PostsPage.module.scss';
import { Params } from 'src/constants/params';
import { paginationConfig } from 'src/config/pagination';

type AnimalActivityProps = {
  postsData?: IPost[];
  animalId: number;
  animalOwnerId?: number;
};

const AnimalActivity = ({ animalId, animalOwnerId }: AnimalActivityProps) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const [animalPosts, setAnimalPosts] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const session = useSession();
  const myId = session.data?.user.id;

  const [total, setTotal] = useState<number>(1);

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
  };

  const currentPage = Number(searchParams.get('page')) || 1;

  const getAnimalPosts = async (animalId: number): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await PostsApi.getAnimalPosts(animalId, {
        page: currentPage
      });
      setAnimalPosts(res.results);
      setTotal(res.count);
      setIsLoading(false);
    } catch (error) {
      setAnimalPosts([]);
      setTotal(0);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const deletePosts = (postId: number) => {
    if (myId != animalOwnerId) {
      toast.error("Bled operacji");
      return null;
    }
    setAnimalPosts(prev => prev.filter(post => post.id !== postId));
  };

  const updatePosts = (updatedPost: IPost) => {
    if (myId != animalOwnerId) {
      toast.error("Bled operacji")
      return null;
    }
    setAnimalPosts(prev =>
      prev.map(post =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
  };

  useEffect(() => {
    getAnimalPosts(animalId);
  }, [currentPage, animalId]);

  return (
    <div className={style.container}>
      <AddPost 
          animalId={animalId} 
          animalOwnerId={animalOwnerId}
          getPosts={getAnimalPosts}
      />

      <List isLoading={isLoading} className={style.list}>
          {animalPosts.map((post) => (
            <PostCard 
              type="posts.post" 
              key={post.id} 
              post={post} 
              updatePosts={updatePosts} 
              deletePosts={deletePosts} 
              hideFollowButton
            />
          ))}
      </List>

      <Pagination
          className={style.pagination}
          totalCount={total}
          pageSize={paginationConfig.posts}
          currentPage={params.get(Params.PAGE) ? Number(params.get(Params.PAGE)) : 1}
          onPageChange={changePage}
      />
    </div>
  );
};

export default AnimalActivity;
