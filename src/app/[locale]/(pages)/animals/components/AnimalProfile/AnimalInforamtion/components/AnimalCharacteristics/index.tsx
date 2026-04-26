import { useEffect, useRef } from "react";
import style from "./AnimalCharacteristics.module.scss";
import { Icon } from "src/components";
import { IAnimal } from "src/constants/types";
import { useTranslations } from "next-intl";

interface CharacteristicsBlockProps {
    title: string;
    bool: boolean;
}

export default function CharacteristicsBlock({ characteristicBoard }: { characteristicBoard: CharacteristicsBlockProps[] }) {
  const t = useTranslations('pages.animals.characteristics');
  const tProfile = useTranslations('pages.animals.profile');

  const contentRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const characteristicCheck = !!(characteristicBoard && characteristicBoard.length > 0);

  useEffect(() => {
    const content = contentRef.current;
    const thumb = thumbRef.current;
    if (!content || !thumb) return;

    const updateThumb = () => {
      const { scrollHeight, clientHeight, scrollTop } = content;
      if (scrollHeight <= clientHeight) {
        thumb.style.display = 'none';
        return;
      }
      thumb.style.display = 'block';
      const thumbHeight = (clientHeight / scrollHeight) * clientHeight;
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.top = `${(scrollTop / scrollHeight) * clientHeight}px`;
    };

    let startY = 0;
    let startScrollTop = 0;

    const onThumbMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      startY = e.clientY;
      startScrollTop = content.scrollTop;

      const onMouseMove = (e: MouseEvent) => {
        const delta = e.clientY - startY;
        const scrollRatio = content.scrollHeight / content.clientHeight;
        content.scrollTop = startScrollTop + delta * scrollRatio;
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    thumb.addEventListener('mousedown', onThumbMouseDown);
    content.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);
    updateThumb();

    return () => {
      thumb.removeEventListener('mousedown', onThumbMouseDown);
      content.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
    };
  }, []);

  return (
    <div className={style.characteristicsBlock}>
      <div className={style.characteristicContent} ref={characteristicCheck ? contentRef : null}>
        {characteristicCheck ? (
          characteristicBoard.map((c, index) => (
            <div className={style.AnimalCharacter} key={`${(c.title)}-${index}`}>
              <div className={style.caracteristicImage}>
                {c.bool ? <Icon name="pawFilled" /> : null}
              </div>
              <p className={style.caracteristicTitle}>{t(c.title)}</p>
            </div>
          ))
        ) : (
          <div>{tProfile('noCharacteristics')}</div>
        )}
      </div>
      {characteristicCheck && (
        <div className={style.customScrollbar}>
          <div className={style.customThumb} ref={thumbRef}></div>
        </div>
      )}
    </div>
  );
}
