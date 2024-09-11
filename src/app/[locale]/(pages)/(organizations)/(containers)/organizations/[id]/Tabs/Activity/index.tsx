'use client';

import React, { useEffect, useState } from 'react';

import BusinessCard from 'src/app/[locale]/(pages)/(organizations)/components/BusinessCard';
import OrganizationAnimals from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationAnimals';
import OrganizationComments from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationComments';
import OrganizationOnMap from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationOnMap';
import PostCard from 'src/app/[locale]/(pages)/posts/components/PostCard';
import { List } from 'src/components';
import { IOrganization, IPost } from 'src/constants/types';
import { postsMock } from 'src/mocks/posts';

import style from './Activity.module.scss';

type ActivityProps = {
  organization: IOrganization;
};

const Activity = ({ organization }: ActivityProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<IPost[]>([]);

  const getPosts = async () => {
    try {
      setIsLoading(true);
      setPosts(postsMock);
    } catch (error) {
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [organization.id]);

  if (!organization) return null;
  return (
    <div className={style.container}>
      <List
        isLoading={isLoading}
        className={style.list}
      >
        {posts.map((post) => (
          <PostCard
            className={style.post}
            key={post.id}
            post={post}
          />
        ))}
      </List>

      <aside className={style.aside}>
        <BusinessCard
          organization={organization}
          variant='vertical'
        />
        <OrganizationOnMap organization={organization} />
      </aside>
    </div>
  );
};

export default Activity;
