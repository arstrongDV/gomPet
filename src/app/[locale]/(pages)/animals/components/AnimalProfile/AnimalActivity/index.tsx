'use client';

import React, { useEffect, useState } from 'react';

import { List } from 'src/components';
import { IPost } from 'src/constants/types';
import { postsMock } from 'src/mocks/posts';

import PostCard from 'src/app/[locale]/(pages)/posts/components/PostCard';

import style from './PostsPage.module.scss';

const AnimalActivity = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<IPost[]>([]);

  const getPosts = async () => {
    setIsLoading(true);
    try {
      setPosts(postsMock);
    } catch (error) {
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <div className={style.container}>
      <List
        isLoading={isLoading}
        className={style.list}
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))}
      </List>
    </div>
  );
};

export default AnimalActivity;
