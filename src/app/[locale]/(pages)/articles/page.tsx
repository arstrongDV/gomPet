'use client';

import React, { useEffect, useState } from 'react';

import { List, Pagination } from 'src/components';
import { IPost } from 'src/constants/types';

import style from './PostsPage.module.scss';
import { ArticlesApi, PostsApi } from 'src/api';
import { useRouter, useSearchParams } from 'next/navigation';
import { Params } from 'src/constants/params';
import { paginationConfig } from 'src/config/pagination';
import PostCard from 'src/components/layout/PostCard';

const PostsPage = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const [total, setTotal] = useState<number>(1);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<IPost[]>([]);

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
  };

  const currentPage = Number(searchParams.get('page')) || 1;
  const getPosts = async () => {
    setIsLoading(true);
    try {
      const res = await PostsApi.getAllPosts(currentPage);
      console.log("postspostsposts: ", posts)
      setPosts(res.data?.results);
      setTotal(res.data.count);
    } catch {
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPosts();
  }, [currentPage]);


  const deletePosts = (postId: number) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
  };

  const updatePosts = (updatedPost: IPost) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
  };

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
            deletePosts={deletePosts}
            updatePosts={updatePosts}
            // followedAuthors={followedAuthors}
            // setFollowedAuthors={setFollowedAuthors}
            type="posts.post"
          />
        ))
      ) : (
        <div>No posts available.</div>
      )}
      </List>

      <Pagination
            className={style.pagination}
            totalCount={total}
            pageSize={paginationConfig.articles}
            currentPage={params.get(Params.PAGE) ? Number(params.get(Params.PAGE)) : 1}
            onPageChange={changePage}
        />
    </div>
  );
};

export default PostsPage;
