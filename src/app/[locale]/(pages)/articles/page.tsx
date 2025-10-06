'use client';

import React, { useEffect, useState } from 'react';

import { List } from 'src/components';
import { IPost } from 'src/constants/types';
import { postsMock } from 'src/mocks/posts';

import PostCard from './components/PostCard';

import style from './PostsPage.module.scss';
import { ArticlesApi } from 'src/api';

const PostsPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<IPost[]>([]);

  const getPosts = async () => {
    setIsLoading(true);
    try {
      const res = await ArticlesApi.getArticlesList();
      setPosts(res.data?.results);
      // console.log("posts:", res?.results)
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
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
          />
        ))
      ) : (
        <div>No posts available.</div>
      )}
      </List>
    </div>
  );
};

export default PostsPage;
