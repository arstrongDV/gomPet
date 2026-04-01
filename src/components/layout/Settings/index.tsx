'use client';

import React, { useState, useRef, useEffect } from 'react';
import Card from "../Card";
import Icon from "../Icon";
import style from './Settings.module.scss';
import { useSession } from "next-auth/react";
import classNames from "classnames";
import MemberModal from './memberModal';
import Modal from '../Modal';

type SettingsButtonProps = {
  className?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  authId?: number;
  ownerId?: number;
  align?: "left" | "right";
  isDisabled?: boolean;
  organizationId?: number;
  filledButton?: boolean;
};

export default function SettingsButton({
  className,
  onEdit,
  onDelete,
  isDisabled,
  authId,
  ownerId,
  align = "right",
  organizationId,
  filledButton
}: SettingsButtonProps) {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const session = useSession();
  const myId = Number(session.data?.user?.id);

  const canEdit =
  (authId !== undefined && myId === authId) ||
  (ownerId !== undefined && myId === ownerId);

if (!canEdit) return null;

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
        className={classNames(
          style.settingsToggle, 
          { [style.disabledBtn]: isDisabled },
          {[style.filledButton]: filledButton}
        )}
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
          {organizationId && (
            <button
              className={style.settingsBtn}
              onClick={() => {
                setShowModal(prev => !prev);
                setIsOpen(false);
              }}
            >
              Przekaz organizacje
            </button>
          )}
          <button
            className={style.settingsBtn}
            onClick={() => { onDelete?.(); setIsOpen(false); }}
          >
            Usuń
          </button>
        </div>
      )}

        <Modal 
          className={style.modalWin} 
          isOpen={showModal} 
          closeModal={() => setShowModal(false)}
          title='Znajdz nowego wlasciciela'
        >
          <MemberModal organizationId={organizationId} setShowModal={setShowModal} />
        </Modal>
    </div>
  );
}
