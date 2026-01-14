'use client';

import React, { useEffect, useState } from 'react';

import BusinessCard from 'src/app/[locale]/(pages)/(organizations)/components/BusinessCard';
import OrganizationOnMap from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationOnMap';

import PostCard from 'src/components/layout/PostCard';

import { Button, List } from 'src/components';
import { IOrganization, IPost } from 'src/constants/types';
import { postsMock } from 'src/mocks/posts';

import style from './Activity.module.scss';
import { OrganizationsApi } from 'src/api';
import AddPost from './AddPost';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

type ActivityProps = {
  organization: IOrganization;
};

const Activity = ({ organization }: ActivityProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [showAddPost, setShowAddPost] = useState<boolean>(false);

  const session = useSession()
  const myId = session.data?.user.id

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const res_organzationPosts = await OrganizationsApi.getOrganizationPosts(organization.id);
      setPosts(res_organzationPosts.data.results);
    } catch (error) {
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [organization.id]);

  const deletePosts = (postId: number) => {
    if(myId != organization.user){
      toast.error("Bled operacji")
      return null;
    }
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const updatePosts = (updatedPost: IPost) => {
    if(myId != organization.user){
      toast.error("Bled operacji")
      return null;
    }
    setPosts(prev =>
      prev.map(post =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
  };

  if (!organization) return null;
  return (
    <div className={style.container}>
      
      <div className={style.wrapper}>
        <aside className={style.listWrraper}>
          {organization.user == myId && (
            <Button label="Dodaj post" icon="plus" onClick={() => setShowAddPost(true)} width='300px' />
          )}

          <List
            isLoading={isLoading}
            className={style.list}
          >
            {posts.map((post) => (
              <PostCard
                className={style.post}
                key={post.id}
                post={post}
                deletePosts={deletePosts}
                updatePosts={updatePosts}
              />
            ))}
          </List>
        </aside>

        <aside className={style.aside}>
          <BusinessCard
            organization={organization}
            variant='vertical'
          />
          <div className={style.mapWrraper}>
            <OrganizationOnMap className={style.map} organizations={[organization]} />
          </div>
        </aside>
      </div>

      {showAddPost && (
        <AddPost 
          organizationId={organization.id} 
          setShowAddPost={setShowAddPost} 
          refreshPosts={() => getPosts()}
        />
      )}
    </div>
  );
};

export default Activity;