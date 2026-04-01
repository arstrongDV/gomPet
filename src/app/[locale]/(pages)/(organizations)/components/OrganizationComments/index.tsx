// 'use client';

// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { Card, Comment, CommentInput, Divider, List } from 'components';
// import { CommentSubmitData } from 'src/components/layout/Comments/CommentInput';
// import { PostsApi } from 'src/api';
// import toast from 'react-hot-toast';
// import style from './OrganizationComments.module.scss';
// import { useTranslations } from 'next-intl';

// type OrganizationCommentsProps = {
//   title?: string;
//   organizationId: number;
//   onComment?: () => void;
//   averageRating?: number;
// };

// const OrganizationComments = ({ title, organizationId, onComment, averageRating }: OrganizationCommentsProps) => {
//   const t = useTranslations();

//   const [comments, setComments] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [updateId, setUpdateId] = useState<number | null>(null);

//   const currentPageRef = useRef(1);
//   const guardRef = useRef<HTMLDivElement | null>(null);
//   const listRef = useRef<HTMLDivElement | null>(null);

//   const isFetchingMoreRef = useRef(false);
//   const hasNextPageRef = useRef(true);

//   const getComments = async (organizationId: number, page = 1) => {
//     try {
//       const res = await PostsApi.getComments(organizationId, 'users.organization', { page });
//       return res ?? { results: [], next: null };
//     } catch (error) {
//       console.error(error);
//       return { results: [], next: null };
//     }
//   };

//   useEffect(() => {
//     currentPageRef.current = 1;
//     setComments([]);
//     setIsLoading(true);
//     hasNextPageRef.current = true;

//     const loadInitial = async () => {
//       const data = await getComments(organizationId, 1);
//       setComments(data.results ?? []);
//       hasNextPageRef.current = !!data.next;
//       setIsLoading(false);
//     };

//     loadInitial();
//   }, [organizationId]);

//   const getMoreComments = useCallback(async () => {
//     if (isFetchingMoreRef.current || !hasNextPageRef.current) return;

//     isFetchingMoreRef.current = true;

//     const nextPage = currentPageRef.current + 1;
//     const data = await getComments(organizationId, nextPage);

//     if (!data.results.length) {
//       hasNextPageRef.current = false;
//       isFetchingMoreRef.current = false;
//       return;
//     }

//     currentPageRef.current = nextPage;
//     setComments(prev => [...prev, ...data.results]);
//     hasNextPageRef.current = !!data.next;
//     isFetchingMoreRef.current = false;
//   }, [organizationId]);

//   useEffect(() => {
//     if (comments.length === 0) return;
//     const guardEl = guardRef.current;
//     if (!guardEl) return;

//     const observer = new IntersectionObserver(entries => {
//       if (entries[0].isIntersecting) getMoreComments();
//     }, { root: listRef.current || null, rootMargin: '200px', threshold: 0 });

//     observer.observe(guardEl);
//     return () => observer.disconnect();
//   }, [comments, getMoreComments]);

//   const createComment = async ({ id, text, rating = 0 }: CommentSubmitData) => {
//     setIsLoading(true);
//     try {
//       if (updateId) {
//         const current = comments.find(c => c.id === updateId);
//         if (!current) return;

//         if (text !== current.body || rating !== current.rating) {
//           await PostsApi.updateComment(updateId, { body: text, rating });
//           setComments(prev => prev.map(c => (c.id === updateId ? { ...c, body: text, rating } : c)));
//         }
//         setUpdateId(null);
//       } else {
//         const res = await PostsApi.addNewComments({ 
//           content_type: 'users.organization', 
//           object_id: organizationId, 
//           body: text, 
//           rating: rating || null 
//         });
//         setComments(prev => [res, ...prev]);
//         toast.success('Komentarz zostal dodany');
//         // onComment && onComment();
//       }
//     } catch (err: any) {
//       console.error(err);
//       toast.error('Nie udało się zapisać komentarza');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteComment = (commentId: number) => {
//     setComments(prev => prev.filter(c => c.id !== commentId));
//   };

//   const editedComment = updateId ? comments.find(c => c.id === updateId) : null;

//   return (
//     <Card className={style.commentsContainer}>
//       <header className={style.header}>
//         <h3 className={style.title}>{title || 'Opinie'}</h3>
//         {averageRating && <span className={style.averageRating}>średnia ocen: {averageRating} na 5</span>}
//       </header>

//       {updateId && (
//         <div className={style.editBanner}>
//           <span>✏️ Edytujesz swój komentarz</span>
//           <button onClick={() => setUpdateId(null)}>Anuluj</button>
//         </div>
//       )}

//       <div className={style.container}>
//         <CommentInput 
//           onSubmit={createComment} 
//           value={editedComment?.body || ''} 
//           ratingValue={editedComment?.rating ?? 0} 
//           withRating 
//         />
//         <Divider />
//         <List ref={listRef} className={style.comments} emptyText="Brak komentarzy" isLoading={isLoading}>
//           {comments.map(item => (
//             <Comment 
//               key={item.id} 
//               comment={item} 
//               commentDel={deleteComment} 
//               setUpdateId={setUpdateId} 
//               inputFieldRef={null} 
//             />
//           ))}
//           <div ref={guardRef} style={{ height: '1px' }} />
//         </List>
//       </div>
//     </Card>
//   );
// };

// export default OrganizationComments;