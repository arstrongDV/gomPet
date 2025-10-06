'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
};

export default function SettingsButton({
  className,
  onEdit,
  onDelete,
  authId,
  align = "right",
}: SettingsButtonProps) {

  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [coords, setCoords] = useState<{ 
    top: number; 
    left: number; 
    align: "left" | "right"; 
    placement: "above" | "below";
  } | null>(null);

  const session = useSession();

  const myId = Number(session.data?.user?.id);

  if (authId !== undefined && myId !== authId) return null;

  const toggle = () => {
    if (!toggleRef.current) {
      setIsOpen(prev => !prev);
      return;
    }
    const r = toggleRef.current.getBoundingClientRect();

    // domyślnie nad przyciskiem
    setCoords({
      top: r.top,
      left: align === "right" ? r.right : r.left,
      align,
      placement: "above",
    });

    setIsOpen(prev => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current?.contains(e.target as Node)) return;
      if (toggleRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
    };
  }, [isOpen]);

  return (
    <div className={style.settingsWrapper}>
      <div 
        ref={toggleRef} 
        className={style.settingsToggle} 
        onClick={(e) => { e.stopPropagation(); toggle(); }}
      >
        <Icon name="list" />
      </div>

      {isOpen && coords && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: coords.placement === 'above'
              ? coords.top - (menuRef.current?.offsetHeight ?? 0) - 4
              : coords.top + 4,
            left: coords.align === 'right'
              ? coords.left - (menuRef.current?.offsetWidth ?? 0) + 50
              : coords.left - 50,
            zIndex: 9999,
          }}
        >
          <Card className={classNames(style.settings, className)}>
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
          </Card>
        </div>,
        document.body
      )}
    </div>
  );
}
