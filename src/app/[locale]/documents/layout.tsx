import React from 'react';

import style from './DocumentsLayout.module.scss';

const DocumentsLayout = ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div className={style.container}>
      <main className={style.main}>{children}</main>
    </div>
  );
};

export default DocumentsLayout;
