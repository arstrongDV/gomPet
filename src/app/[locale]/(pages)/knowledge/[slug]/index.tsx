'use client'
import DescriptionTranslate from "src/components/layout/Forms/RichTextTranslation";
import { IArticle } from "src/constants/types";
import style from './BlogArticlePage.module.scss'
import { Avatar, Button, Card, Comment, CommentInput, Divider, List, Modal, useWebsocket } from "src/components";
import { CommentSubmitData } from "src/components/layout/Comments/CommentInput";
import { PostsApi } from "src/api";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import PostComments from "src/components/layout/PostCard/components/PostComments";
import PostReactions from "src/components/layout/PostCard/components/PostReactions";
import { WebsocketRoutes } from "src/api/routes";
import ShareComments from "src/components/layout/PostCard/components/ShareComments";
import RichTextViewer from "src/components/layout/Forms/RichTextViewer";

const KnowledgePage = ({ data }: { data: IArticle }) => {
    console.log('data:', data);
    const authorName = data.author?.full_name ?? 'Nieznany autor';

    const [isLoading, setIsLoading] = useState(false);

    const [showComments, setShowComments] = useState<boolean>(false);
    const [showCopyLink, setShowCopyLink] = useState<boolean>(false);
    const [reactions, setReactions] = useState<number>(0);

    const [ready, val, send] = useWebsocket(WebsocketRoutes.GET_REACTIONS_LIST("articles.article", data.id))
  
    useEffect(() => {
      if (val) {
        try {
          let parsedData;
          
          if (typeof val === 'string') {
            try {
              parsedData = JSON.parse(val);
            } catch (e) {
              parsedData = val;
            }
          } else {
            parsedData = val;
          }
  
          if (parsedData?.total_likes !== undefined) {
            setReactions(parsedData.total_likes);
          }
          
        } catch (error) {
          console.error("WS parse error:", error);
        }
      }
    }, [val]);
  
      useEffect(() => {
      if (ready && send) {
          
          const subscriptionMessage = {
          action: 'subscribe_instance',
          pk: data.id,
          request_id: Date.now()
          };
          
          send(JSON.stringify(subscriptionMessage));
      }
      }, [ready, send, data.id]); 
  
    return (
    <Card className={style.container}>
      {showComments && (
        <div className={style.backdrop} onClick={() => setShowComments(false)} />
      )}
      {showCopyLink && (
        <div className={style.backdrop} onClick={() => setShowCopyLink(false)} />
      )}
        <header className={style.header}>
          <h1>{data.title}</h1>

          <div className={style.autorInfo}>
            <p>{authorName}</p>
            <Avatar
              className={style.image}
              profile={data.author}
            />
          </div>
        </header>
  
        <RichTextViewer content={data.content} size="medium" />

        <Divider />

        <Modal 
          className={style.modaSharinglWin} 
          isOpen={showCopyLink} 
          closeModal={() => setShowCopyLink(false)}
          title='Podzieli sie wiedza'
        >
          <ShareComments commentId={data.id} />
        </Modal>

      <Modal 
        className={style.modaCommentslWin} 
        isOpen={showComments} 
        closeModal={() => setShowComments(false)}
        title='Komentarzy'
      >
        <PostComments postId={data.id} type="articles.article" />
      </Modal>

        {/* {showComments && (
          <PostComments postId={data.id} type="articles.article" />
        )}

        {showCopyLink && <ShareComments commentId={data.id} />} */}

        <div className={style.buttons}>
          <PostReactions
            type="articles.article"
            postId={data.id}
            reactionsCount={reactions}
          />
          <Button
            icon="message"
            gray
            onClick={() => setShowComments(prev => !prev)}
          />
          <Button icon="share" gray  onClick={() => setShowCopyLink(prev => !prev)}/>
        </div>
    </Card>
    );
  };

export default KnowledgePage;
