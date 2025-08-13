import React from 'react';
import styles from './FamilyTree.module.scss';
import { FamilyTreePyramid } from './FamilyTreePyramid';

export const FamilyTreeWrapper = ({ familyTree }: { familyTree: any }) => {
  debugger
  return (
    <div className={styles.myFamilly}>
      <div className={styles.aboutFamilly}>
        <h3>Poznaj moją rodzinę</h3>
        <p>
          Aby poznać dalszych przodków, poruszaj się pomiędzy profilami zwierząt z
          poniższego drzewa genealogicznego
        </p>
      </div>
      {Array.isArray(familyTree) && familyTree.length > 0 ? (
        familyTree.map((parent) => (
          <FamilyTreePyramid key={parent.id} node={parent} depth={0} />
        ))
      ) : (
        <div className={styles.noFamily}>Brak dostępnych danych o rodzinie</div>
      )}

    </div>
  );
};
