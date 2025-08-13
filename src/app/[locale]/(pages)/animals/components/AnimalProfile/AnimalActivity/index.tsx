'use client';
import React from 'react';
import { List } from 'src/components';
import { IPost } from 'src/constants/types';
import PostCard from 'src/app/[locale]/(pages)/posts/components/PostCard';
import style from './PostsPage.module.scss';

type AnimalActivityProps = {
  postsData?: IPost[];
};

const AnimalActivity = ({ postsData = [] }: AnimalActivityProps) => {
  console.log("Posts data:", postsData);

  return (
    <div className={style.container}>
      <List
        isLoading={false}
        className={style.list}
      >
        {Array.isArray(postsData) && postsData.length > 0 ? (
          postsData.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))
        ) : (
          <div>No posts available</div>
        )}
      </List>
    </div>
  );
};

export default AnimalActivity;