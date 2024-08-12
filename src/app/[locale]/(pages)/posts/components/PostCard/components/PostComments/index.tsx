import React from 'react';

import { IComment } from 'src/constants/types';

import style from './PostComments.module.scss';

type PostCommentsProps = {
  comments: IComment[];
  className?: string;
};

const PostComments = ({ comments, className }: PostCommentsProps) => {
  return <div className={style.comments}>PostComments</div>;
};

export default PostComments;
