import React, { useState } from 'react';
import classNames from 'classnames';

import { Button, Icon, Modal } from 'src/components';
import { Routes } from 'src/constants/routes';
import { IArticle } from 'src/constants/types';
import { Link } from 'src/navigation';

import style from './ArticleCard.module.scss';
import DescriptionTranslate from 'src/components/layout/Forms/RichTextTranslation';
import SettingsButton from 'src/components/layout/Settings';
import { useSession } from 'next-auth/react';
import { ArticlesApi } from 'src/api';
import toast from 'react-hot-toast';
import AddKnowledge from './AddKnowledge';
import { usePathname } from 'next/navigation';
import RichTextViewer from 'src/components/layout/Forms/RichTextViewer';

type ArticleCardProps = {
  className?: string;
  article: IArticle;
  setKnowledge?: React.Dispatch<React.SetStateAction<IArticle[]>>;
};

const KnowledgeCard = ({ article, className, setKnowledge }: ArticleCardProps) => {
  const { id, title, content, image = null, created_at, slug } = article;
  console.log(article);
  const session = useSession();
  const myId = session.data?.user.id
  const pathname = usePathname();

  const deleteKnowledge = async() => {
    try{
      const res = await ArticlesApi.deleteArticlePage(slug);
      console.log(res);
      toast.success("Post zostal usuniaty")
      if(setKnowledge) setKnowledge((prev) => prev.filter((p) => p.slug !== slug));
    }catch(err){
      toast.error("Nie udalo sie usunac posta")
      console.log(err)
    }
  }

  const updateArticleInState = (updated: IArticle) => {
    if (!setKnowledge) return;

    setKnowledge(prev =>
      prev.map(item =>
        item.id === updated.id ? updated : item
      )
    );
  };

  const [isKnowledgeEdit, setIsKnowledgeEdit] = useState<boolean>(false)

  return (
    <article className={classNames(style.article, className)}>
      {article?.author?.id == myId && pathname == '/knowledge' && (
        <div className={style.modalSettings}>
          <SettingsButton 
            authId={article?.author?.id} 
            onDelete={deleteKnowledge}
            onEdit={() => setIsKnowledgeEdit(true)}
          />
        </div>
      )}

      <Link
        className={style.cover}
        href={Routes.BLOG_ARTICLE(slug)}
      >
        {image ? (
          <img
            src={image}
            alt={title}
          />
        ) : (
          <Icon
            className={style.placeholderIcon}
            name='camera'
          />
        )}
      </Link>

      <div className={style.body}>
        <Link href={Routes.BLOG_ARTICLE(slug)}>
          <h2 className={ title.length <= 45 ? style.title : style.titleSmall}>{title}</h2>
        </Link>
        <div className={style.content}>
          <RichTextViewer content={content} size="small" />
        </div>

        <Button
          className={style.readBtn}
          label={'Przeczytaj artykuł'} 
          href={Routes.BLOG_ARTICLE(slug)}
        />
      </div>

      <Modal 
          className={style.modalEditWin} 
          isOpen={isKnowledgeEdit} 
          closeModal={() => setIsKnowledgeEdit(false)}
          title='Dodaj Wiedze'
        >
          <AddKnowledge setIsOpen={setIsKnowledgeEdit} initialState={article} updateArticleInState={updateArticleInState} />
        </Modal>
      {/* {isKnowledgeEdit && (
        <AddKnowledge setIsOpen={setIsKnowledgeEdit} initialState={article} updateArticleInState={updateArticleInState} />
      )} */}
    </article>
  );
};

export default KnowledgeCard;
