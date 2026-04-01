import { useEffect, useRef } from "react";
import style from "./AnimalCharacteristics.module.scss";
import { Icon } from "src/components";
import { IAnimal } from "src/constants/types";
import { useTranslations } from "next-intl";

export default function CharacteristicsBlock({ animal }: { animal: IAnimal }) {
  const t = useTranslations('pages.animals.characteristics');

  const contentRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  const characteristicCheck = !!(animal.characteristicBoard && animal.characteristicBoard.length > 0);

  const normalizeKey = (title: string) =>
    title
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toLowerCase();

  const fallbackLabel = (key: string) =>
    key
      .split('_')
      .filter(Boolean)
      .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
      .join(' ');

  const resolveLabel = (title: string) => {
    const key = normalizeKey(title);

    if (!key) {
      return '';
    }

    if (t.has(key)) {
      return t(key);
    }

    return fallbackLabel(key);
  };

  useEffect(() => {
    const content = contentRef.current;
    const thumb = thumbRef.current;
    if (!content || !thumb) return;


    const updateThumb = () => {
      const scrollHeight = content.scrollHeight;
      const clientHeight = content.clientHeight;
      const scrollTop = content.scrollTop;

      const thumbHeight = (clientHeight / scrollHeight) * clientHeight;
      thumb.style.height = `${thumbHeight}px`;

      const thumbTop = (scrollTop / scrollHeight) * clientHeight;
      thumb.style.top = `${thumbTop}px`;
    };

    content.addEventListener("scroll", updateThumb);
    window.addEventListener("resize", updateThumb);
    updateThumb();

    return () => {
      content.removeEventListener("scroll", updateThumb);
      window.removeEventListener("resize", updateThumb);
    };
  }, []);

  return (
    <div className={style.characteristicsBlock}>
      <div className={style.characteristicContent} ref={characteristicCheck ? contentRef : null}>
        {characteristicCheck ? (
          animal.characteristicBoard.map((c, index) => (
            <div className={style.AnimalCharacter} key={`${normalizeKey(c.title)}-${index}`}>
              <div className={style.caracteristicImage}>
                {c.bool ? <Icon name="pawFilled" /> : null}
              </div>
              <p className={style.caracteristicTitle}>{resolveLabel(c.title)}</p>
            </div>
          ))
        ) : (
          <div>No info</div>
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
