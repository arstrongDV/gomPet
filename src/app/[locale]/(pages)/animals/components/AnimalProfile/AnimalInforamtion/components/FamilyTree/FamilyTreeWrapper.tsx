'use client';
import React from 'react';
import styles from './FamilyTree.module.scss';
import { FamilyTreePyramid } from './FamilyTreePyramid';

interface FamilyTreeWrapperProps {
  familyTree: any[];
  rootName: string;
  rootImages?: string | null; //string[]
}
// Przykładowa funkcja do konwersji
const normalizeFamilyTree = (parents: any[]) => {
  console.log("parents:::", parents);
  return parents.map(parent => ({
    id: parent.animal_id,
    name: parent.name,
    image: parent.photos,
    children: parent.grandparents?.map((gp: any) => ({
      id: gp.animal_id,
      name: gp.name,
      image: gp.photos,
      children: []
    })) || []
  }));
};

export const FamilyTreeWrapper: React.FC<FamilyTreeWrapperProps> = ({ familyTree, rootName, rootImages }) => {
  const normalizedTree = normalizeFamilyTree(familyTree);

  return (
    <div className={styles.myFamilly}>
      <div className={styles.aboutFamilly}>
        <h3>Poznaj moją rodzinę</h3>
        <p>Aby poznać dalszych przodków, poruszaj się pomiędzy profilami zwierząt z poniższego drzewa genealogicznego</p>
      </div>

      <div className={styles.pyramidWrapper}>
        {normalizedTree.length > 0 ? (
          <>
            {/* Rodzice i dziadkowie */}
            <FamilyTreePyramid node={{ children: normalizedTree }} depth={0} />

            {/* Główne zwierzę na dole */}
            <div className={styles.rootNode}>
              {rootImages?.[0] ? (
                <img src={rootImages} alt={rootName} />
              ) : (
                <div className={styles.noPhoto} />
              )}
              <p>{rootName}</p>
            </div>
          </>
        ) : (
          <div className={styles.noFamily}>Brak dostępnych danych o rodzinie</div>
        )}
      </div>
    </div>
  );
};
