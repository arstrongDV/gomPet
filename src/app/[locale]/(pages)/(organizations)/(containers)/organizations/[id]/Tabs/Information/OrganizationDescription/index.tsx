'use client';
import { useState, useEffect, useCallback, useMemo } from "react";
import style from './AnimalDescription.module.scss';
import Prism from "prismjs";
import "prismjs/themes/prism.css";

// Minimalne potrzebne importy języków
import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";

type Props = {
  text: string | any; // Allow any type to prevent crashes
  maxLines?: number;
};

const DescriptionTranslate = ({ text, maxLines = 5 }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formattedText, setFormattedText] = useState<React.ReactNode>(null);
  
  // Safely convert text to string
  const textContent = useMemo(() => {
    if (typeof text === 'string') return text;
    if (text === null || text === '') return '';
    if (typeof text === 'object') return text; // Allow object input
    try {
      return String(text);
    } catch {
      return '';
    }
  }, [text]);

  console.log("text: ", textContent);

  if(textContent == ''){
    return "No text there"
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 550);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const processRichText = () => {
      try {
        // Ensure we're working with a string
        const contentString = textContent;
        
        if (contentString.trim().startsWith('{') && contentString.trim().endsWith('}')) {
          const parsed = JSON.parse(contentString);

          if (parsed?.root?.children) {
            const processNode = (node: any, index: number): React.ReactNode => {
              // Tekst z formatowaniem
              if (node.type === "text") {
                let element: React.ReactNode = node.text;

                // Formatowanie tekstu - poprawione wartości bitowe
                if (node.format & 1) element = <strong key={index}>{element}</strong>;
                if (node.format & 2) element = <em key={index}>{element}</em>;
                if (node.format & 4) element = <u key={index}>{element}</u>;
                if (node.format & 8) element = <s key={index}>{element}</s>;
                if (node.format & 16) element = <code className={style.inlineCode} key={index}>{element}</code>;

                return element;
              }

              // Link
              if (node.type === "link") {
                return (
                  <a 
                    key={index}
                    href={node.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={style.link}
                  >
                    {node.children?.map((child: any, i: number) => processNode(child, i))}
                  </a>
                );
              }

              // Nagłówki
              if (node.type === "heading") {
                const Tag = `h${node.tag || 2}` as keyof JSX.IntrinsicElements;
                return (
                  <Tag key={index} className={style.heading}>
                    {node.children?.map((child: any, i: number) => processNode(child, i))}
                  </Tag>
                );
              }

              // Paragrafy z wyrównaniem - POPRAWIONE dla stringów
              if (node.type === "paragraph") {
                // Obsłuż zarówno stringi jak i liczby
                let alignClass = style.alignLeft;
                
                if (typeof node.format === 'string') {
                  alignClass = 
                    node.format === "center" ? style.alignCenter :
                    node.format === "right" ? style.alignRight :
                    node.format === "justify" ? style.alignJustify :
                    style.alignLeft;
                } else if (typeof node.format === 'number') {
                  alignClass = 
                    node.format === 2 ? style.alignCenter :
                    node.format === 3 ? style.alignRight :
                    node.format === 4 ? style.alignJustify :
                    style.alignLeft;
                }

                return (
                  <p key={index} className={alignClass}>
                    {node.children?.map((child: any, i: number) => processNode(child, i))}
                  </p>
                );
              }

              // Listy
              if (node.type === "list") {
                if (node.listType === "bullet") {
                  return (
                    <ul key={index} className={style.list}>
                      {node.children?.map((child: any, i: number) => processNode(child, i))}
                    </ul>
                  );
                }
                if (node.listType === "number") {
                  return (
                    <ol key={index} className={style.list} start={node.start || 1}>
                      {node.children?.map((child: any, i: number) => processNode(child, i))}
                    </ol>
                  );
                }
              }

              if (node.type === "listitem") {
                return (
                  <li key={index} className={style.listItem}>
                    {node.children?.map((child: any, i: number) => processNode(child, i))}
                  </li>
                );
              }

              // Cytaty
              if (node.type === "quote") {
                return (
                  <blockquote key={index} className={style.blockquote}>
                    {node.children?.map((child: any, i: number) => processNode(child, i))}
                  </blockquote>
                );
              }

              // Kod
              if (node.type === "code") {
                const codeString = node.children?.map((child: any) => child.text).join("\n") || "";
                const lang = node.language || "plaintext";
                
                try {
                  const actualLang = lang === "html" || lang === "xml" ? "markup" : lang;
                  const grammar = Prism.languages[actualLang] || Prism.languages.plaintext;
                  const highlighted = Prism.highlight(codeString, grammar, actualLang);
                  
                  return (
                    <div key={index} className={style.codeBlock}>
                      <pre className={`language-${actualLang}`}>
                        <code 
                          className={`language-${actualLang}`}
                          dangerouslySetInnerHTML={{ __html: highlighted }} 
                        />
                      </pre>
                      {actualLang !== "plaintext" && (
                        <span className={style.codeLanguage}>{lang}</span>
                      )}
                    </div>
                  );
                } catch (error) {
                  return (
                    <div key={index} className={style.codeBlock}>
                      <pre className="language-plaintext">
                        <code>{codeString}</code>
                      </pre>
                    </div>
                  );
                }
              }

              if (node.type === "code-highlight") {
                return (
                  <code key={index} className={style.inlineCode}>
                    {node.text}
                  </code>
                );
              }

              if (node.type === "paragraph" && (!node.children || node.children.length === 0)) {
                return <br key={index} />;
              }

              // Kontener ogólny
              if (node.children) {
                return (
                  <div key={index}>
                    {node.children.map((child: any, i: number) => processNode(child, i))}
                  </div>
                );
              }

              return null;
            };

            const elements = parsed.root.children
              .filter((node: any) => node.type !== "paragraph" || node.children?.length > 0) // Filtruj puste paragrafy
              .map((node: any, index: number) => processNode(node, index));

            setFormattedText(<div className={style.richTextContainer}>{elements}</div>);
            return;
          }
        }
      } catch (error) {
        console.error('Error parsing rich text:', error);
      }
      setFormattedText(
        <div className={style.plainText}>
          {typeof textContent === 'string' ? textContent.replace(/<[^>]*>/g, '') : String(textContent)}
        </div>
      );
    };

    processRichText();
  }, [textContent]);

  const isLongText = typeof textContent === 'string' && textContent.length > 200;
  const clampStyle = !expanded && isMobile && isLongText ? {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    WebkitLineClamp: maxLines,
  } : {};

  return (
    <div className={style.infoTextBlock}>
      <div 
        // style={clampStyle}
        className={style.textDescription}
      >
        {formattedText}
      </div>

      {(isMobile && isLongText) && (
        <div className={style.readMoreContainer}>
          <button
            className={style.readMoreBtn}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Zwiń opis" : "Czytaj więcej"}
          </button>
        </div>
      )}
    </div>
  );
};

export default DescriptionTranslate;


// const processRichText = () => {
//   const parsed = text;

//   if (parsed?.root?.children) {
//     const processNode = (node: any, index: number): React.ReactNode => {
//       if (node.type === "text") {
//         let element: React.ReactNode = node.text;
//         if (node.format & 1) element = <strong key={index}>{element}</strong>;
//         return element;
//       }

//       if (node.type === "paragraph") {
//         return (
//           <p key={index}>
//             {node.children?.map((child: any, i: number) => processNode(child, i))}
//           </p>
//         );
//       }

//       return null;
//     };

//     const elements = parsed.root.children.map((node: any, index: number) =>
//       processNode(node, index)
//     );

//     setFormattedText(<div>{elements}</div>);
//   }
// };

// processRichText();
