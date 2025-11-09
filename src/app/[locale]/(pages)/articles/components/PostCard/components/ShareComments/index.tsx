import React from 'react';
import { Button, Card, Input } from 'components';
import style from './ShareComments.module.scss';
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
        <Button icon="link" gray onClick={handleCopy} />
        <Button icon="twitter" gray onClick={() => openShareLink(twitterShareUrl)} />
        <Button icon="whatsApp" gray onClick={() => openShareLink(whatsappShareUrl)} />
      </div>
    </Card>
  )
}

export default ShareComments