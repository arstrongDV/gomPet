'use client';

import React, { useState, useRef, useEffect } from 'react';
import Card from "../Card";
import Icon from "../Icon";
import style from './Settings.module.scss';
import { useSession } from "next-auth/react";
import classNames from "classnames";

type SettingsButtonProps = {
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  authId?: number;
  align?: "left" | "right";
  isDisabled?: boolean;
};

export default function SettingsButton({
  className,
  onEdit,
  onDelete,
  isDisabled,
  authId,
  align = "right",
}: SettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const session = useSession();
  const myId = Number(session.data?.user?.id);

  if (authId !== undefined && myId !== authId) return null;

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      if (toggleRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [isOpen]);

  return (
    <div className={style.settingsWrapper}>
      <div
        ref={toggleRef}
        className={classNames(style.settingsToggle, { [style.disabledBtn]: isDisabled })}
        onClick={(e) => {
          if (isDisabled) return;
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
      >
        <Icon name="list" />
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className={classNames(style.settings, className, {
            [style.rightSide]: align === "right",
            [style.leftSide]: align === "left",
          })}
        >
          <button
            className={style.settingsBtn}
            onClick={() => { onEdit?.(); setIsOpen(false); }}
          >
            Edytuj
          </button>
          <button
            className={style.settingsBtn}
            onClick={() => { onDelete?.(); setIsOpen(false); }}
          >
            Usuń
          </button>
        </div>
      )}
    </div>
  );
}
