'use client';

import React, { useEffect, useState } from 'react';

import { Button, List, Pagination } from 'src/components';
import { IPost } from 'src/constants/types';
import { postsMock } from 'src/mocks/posts';

import PostCard from './components/PostCard';

import style from './PostsPage.module.scss';
import { ArticlesApi } from 'src/api';
import AddArticle from './components/PostCard/components/AddArticle';
import { useRouter, useSearchParams } from 'next/navigation';
import { Params } from 'src/constants/params';
import { paginationConfig } from 'src/config/pagination';
import { useSession } from 'next-auth/react';

const PostsPage = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const [total, setTotal] = useState<number>(1);

  const session = useSession()
  const myId = session.data?.user.id;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [showAddPost, setShowAddPost] = useState<boolean>(false);

  const changePage = (page: number) => {
    params.set(Params.PAGE, page.toString());
    router.push(`?${params.toString()}`);
  };

  const currentPage = Number(searchParams.get('page')) || 1;
  const getPosts = async () => {
    setIsLoading(true);
    try {
      const res = await ArticlesApi.getArticlesList(currentPage);
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

  return (
    <div className={style.container}>
      {myId && (
        <Button
          icon="plus"
          label="Dodaj post"
          width="200px"
          disabled={!myId}
          onClick={() => setShowAddPost(true)}
        />
      )}
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

      <Pagination
            className={style.pagination}
            totalCount={total}
            pageSize={paginationConfig.animals}
            currentPage={params.get(Params.PAGE) ? Number(params.get(Params.PAGE)) : 1}
            onPageChange={changePage}
        />

      {showAddPost && (
        <AddArticle
          setShowAddPost={setShowAddPost}
          refreshPosts={() => getPosts()}
        />
      )}
    </div>
  );
};

export default PostsPage;
