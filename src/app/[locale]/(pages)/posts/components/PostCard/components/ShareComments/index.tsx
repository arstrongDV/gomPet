import React, { useState } from 'react';

import { Card, Divider, Icon, Input } from 'components';

import style from './ShareComments.module.scss';
import { usePathname, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

type ShareCommentsProps = {
    className?: string;
    commentId: number;
}

const ShareComments = ({className, commentId}: ShareCommentsProps) => {

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const postUrl = `${baseUrl}/post/${commentId}`;

    const handleCopy = async () => {
        try{
            await navigator.clipboard.writeText(postUrl);
            toast.success('Link copied!');
        }
        catch{
            toast.error('Failed to copy')
        }
    }

    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${postUrl}&text=Check this out!`;
    const whatsappShareUrl = `https://wa.me/?text=${postUrl}`;

    const openShareLink = (url: string) => {
        window.open(url, '_blank');
      };

  return (
    <Card className={`${style.container} ${className || ''}`}>
      <Input value={postUrl} readOnly title="Click the copy icon to copy" />
      <div className={style.copyingLink}> 
        <div className={style.iconContainer} onClick={handleCopy}>
            <Icon className={style.iconCopy} name='link'/>
        </div>
        <Icon className={style.icon} name='twitter' onClick={() => openShareLink(twitterShareUrl)} />
        <Icon className={style.icon} name='whatsApp' onClick={() => openShareLink(whatsappShareUrl)} />
      </div>
    </Card>
  )
}

export default ShareComments