'use client';

import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { OrganizationsApi } from 'src/api';
import BusinessCard from 'src/app/[locale]/(pages)/(organizations)/components/BusinessCard';
import OrganizationOnMap from 'src/app/[locale]/(pages)/(organizations)/components/OrganizationOnMap';
import { List, Pagination } from 'src/components';
import PostCard from 'src/components/layout/PostCard';
import AddPost from 'src/components/layout/PostCard/components/AddPost';
import { paginationConfig } from 'src/config/pagination';
import { Params } from 'src/constants/params';
import { IOrganization, IPost } from 'src/constants/types';

import style from './Activity.module.scss';

type ActivityProps = {
  organization: IOrganization;
};

const Activity = ({ organization }: ActivityProps) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<IPost[]>([]);

  const session = useSession();
  const myId = session.data?.user.id;
  const [total, setTotal] = useState<number>(1);

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
  };

  const currentPage = Number(searchParams.get('page')) || 1;

  const getPosts = async () => {
    try {
      setIsLoading(true);
      const res_organzationPosts = await OrganizationsApi.getOrganizationPosts(organization.id, {
        page: currentPage
      });
      setPosts(res_organzationPosts.data.results);
      setTotal(res_organzationPosts.data.count || 0);
    } catch (error) {
      setPosts([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [currentPage, organization.id]);

  const deletePosts = (postId: number) => {
    if (myId != organization.user) {
      toast.error("Bled operacji")
      return null;
    }
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const updatePosts = (updatedPost: IPost) => {
    if (myId != organization.user) {
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
          <AddPost 
              organizationId={organization.id} 
              animalOwnerId={organization.user}
              getPosts={getPosts}
          />

          <List
            isLoading={isLoading}
            className={style.list}
          >
            {posts.map((post) => (
              <PostCard
                className={style.post}
                key={post.id}
                post={post}
                type="posts.post"
                deletePosts={deletePosts}
                updatePosts={updatePosts}
                hideFollowButton
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

export default Activity;