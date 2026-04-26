'use client';

import { useRouter } from 'next/navigation';
import style from './DocumentsLayout.module.scss';

const BackButton = ({ label }: { label: string }) => {
  const router = useRouter();
  return (
    <button className={style.backButton} onClick={() => router.back()}>
      ← {label}
    </button>
  );
};

export default BackButton;
