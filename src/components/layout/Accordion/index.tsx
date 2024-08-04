'use client';

import React from 'react';
import { useRef, useState } from 'react';
import classNames from 'classnames';

import Icon from '../Icon';

import style from './Accordion.module.scss';

type IndexType = number | null;

export type AccordionDataType = {
  id: number;
  header: React.ReactNode;
  text: React.ReactNode;
};

type AccordionItemProps = {
  data: AccordionDataType;
  active: IndexType;
  handleToggle: (id: IndexType) => void;
  card?: boolean;
};

type AccordionProps = {
  data: AccordionDataType[];
  card?: boolean;
  activeIndex?: IndexType;
};

const AccordionItem = (props: AccordionItemProps) => {
  const { data, active, handleToggle, card = false } = props;
  const { header, id, text } = data;

  const contentEl = useRef<HTMLDivElement>(null);

  return (
    <div
      className={classNames(style.card, style.toggle, {
        [style.active]: active === id,
        [style.background]: card
      })}
    >
      <div
        className={style.header}
        onClick={() => handleToggle(id)}
      >
        <h4 className={style.title}>{header}</h4>
        <Icon
          name={'chevronDown'}
          className={classNames(style.icon, {
            [style.active]: active === id
          })}
        />
      </div>
      <div
        ref={contentEl}
        className={classNames(style.collapse, {
          [style.active]: active === id
        })}
        style={{
          height: active === id ? contentEl.current?.scrollHeight : '0px'
        }}
      >
        <div className={style.body}>
          <p className={style.description}>{text}</p>
        </div>
      </div>
    </div>
  );
};

const Accordion = ({ data, card, activeIndex }: AccordionProps) => {
  const [active, setActive] = useState<IndexType>(activeIndex || null);

  const handleToggle = (index: IndexType) => {
    setActive(active === index ? null : index);
  };

  return (
    <div className={style.container}>
      {data.map((item) => {
        return (
          <AccordionItem
            key={item.id}
            active={active}
            data={item}
            handleToggle={handleToggle}
            card={card}
          />
        );
      })}
    </div>
  );
};

export default Accordion;
