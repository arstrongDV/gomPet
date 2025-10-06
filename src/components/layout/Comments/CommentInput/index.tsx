'use client';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import { Avatar, Button, Comment, StarRating, Textarea } from 'components';

import style from './CommentInput.module.scss';

export type CommentSubmitData = {
  id?: string | number;
  text: string;
  rating?: number;
};

type CommentInputProps = {
  className?: string;
  placeholder?: string;
  onSubmit: (payload: CommentSubmitData) => Promise<void>;
  withRating?: boolean;

  value?: string;
};

const CommentInput = ({ className, onSubmit, placeholder, withRating = false, value }: CommentInputProps) => {
  const t = useTranslations();
  const session = useSession();

  const [text, setText] = useState<string>('');
  const [rating, setRating] = useState<number>(0);

  // useEffect(() => {
  //   if(value) setText(value);
  // }, [value])
  useEffect(() => {
    setText(value ?? '');
  }, [value]);

  const clearForm = () => {
    setText('');
    setRating(0);
  };

  const handleSubmit = async () => {
    const payload: CommentSubmitData = {
      text: text.trim(),
      rating: withRating ? rating : undefined
    };

    await onSubmit(payload);
    clearForm();
  };

  return (
    <>
      <div className={classNames(style.container, className)}>
        <Avatar
          className={style.image}
          profile={session.data?.user}
        />
        <div className={style.inputWrapper}>
          <Textarea
            className={style.textarea}
            name='comment'
            id='comment-input'
            placeholder={placeholder || 'Przekaż swoją opinię...'}
            altStyle
            rule='required'
            value={text}
            onChangeText={setText}
          />
          <div className={style.footer}>
            {withRating && (
              <StarRating
                className={style.rating}
                rating={rating}
                onChange={setRating}
              />
            )}
            <Button
              className={style.submitButton}
              label={t('common.action.publish')}
              icon='paw'
              onClick={handleSubmit}
              disabled={text.length === 0}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentInput;
