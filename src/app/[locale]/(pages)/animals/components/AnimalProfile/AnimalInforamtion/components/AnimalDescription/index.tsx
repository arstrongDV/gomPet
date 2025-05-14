import { useState, useEffect } from "react";
import style from './AnimalDescription.module.scss';

type Props = {
  text: string;
  maxLines?: number;
};

const AnimalDescription = ({ text, maxLines = 5 }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 550);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const clampStyle: React.CSSProperties = !expanded && isMobile ? {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as 'vertical',
    overflow: 'hidden',
    WebkitLineClamp: maxLines,
  } : {};

  return (
    <div className={style.infoTextBlock}>
      <p style={clampStyle} className={style.textDescription}>
        {text}
      </p>
      {isMobile && (
        <button
          className={style.readMoreBtn}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'read less' : 'read more...'}
        </button>
      )}
    </div>
  );
};

export default AnimalDescription;
