import React from 'react';
import styles from './FamilyTree.module.scss';
import { FamilyTreePyramid } from './FamilyTreePyramid';

export const FamilyTreeWrapper = ({ animal }: { animal: any }) => {
  return (
    <div className={styles.myFamilly}>
      <div className={styles.aboutFamilly}>
        <h3>Poznaj moją rodzinę</h3>
        <p>
          Aby poznać dalszych przodków, poruszaj się pomiędzy profilami zwierząt z
          poniższego drzewa genealogicznego
        </p>
      </div>
      {Array.isArray(animal.famillyTree) && animal.famillyTree.length > 0 ? (
        animal.famillyTree.map((parent) => (
          <FamilyTreePyramid key={parent.id} node={parent} depth={0} />
        ))
      ) : (
        <p className={styles.noFamily}>Brak dostępnych danych o rodzinie</p>
      )}

    </div>
  );
};
