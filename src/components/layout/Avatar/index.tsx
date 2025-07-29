'use client';

import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { Tooltip } from 'components';

import { IOrganization, IUser } from 'src/constants/types';
import { Link } from 'src/navigation';

import { avatarBackgrounds } from './backgrounds';
import { generateAvatar, generateInitials } from './functions';

import style from './Avatar.module.scss';

type AvatarProps = {
  className?: string;
  src?: string;
  profile?: IUser | IOrganization;
  rounded?: boolean;
  objectFit?: 'contain' | 'cover';
  tooltip?: string;
  href?: string;
};

const Avatar = (props: AvatarProps) => {
  const { className, src, profile, rounded = true, objectFit = 'cover', tooltip, href, ...rest } = props;

  const [image, setImage] = useState<string | null>(null);

  const containerClasses = classNames(
    style.image,
    {
      [style.rounded]: rounded,
      [style.contain]: objectFit === 'contain'
    },
    className
  );

  const getAvatar = () => {
    if (src) return;
  
    let text = '?';
  
    // Fallback if profile or email is undefined
    const email = profile?.email;
    if (!email) {
      const avatar = generateAvatar(text, '#FFFFFF', '#2A85FF');
      setImage(avatar);
      return;
    }
  
    text = generateInitials(email);
    console.log("Generating avatar for email:", email);
  
    const index = (text.charCodeAt(0) * 2) % avatarBackgrounds.length;
    const background = avatarBackgrounds[index];
  
    const avatar = generateAvatar(text, '#FFFFFF', background);
    setImage(avatar);
  };
  useEffect(() => {
    if (!src || !image) getAvatar();
  }, [src, profile]);

  const inner =
    src || image ? (
      <img
        src={src || image || ''}
        alt={'user-avatar'}
      />
    ) : null;

  if (tooltip)
    return (
      <Tooltip
        content={tooltip}
        className={containerClasses}
        {...rest}
      >
        {inner}
      </Tooltip>
    );

  if (href)
    return (
      <Link
        href={href}
        className={containerClasses}
        {...rest}
      >
        {inner}
      </Link>
    );

  return (
    <div
      className={containerClasses}
      {...rest}
    >
      {inner}
    </div>
  );
};

export default Avatar;
