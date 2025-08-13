import React from 'react';
import styles from './FamilyTree.module.scss';
import { ICategory } from 'src/constants/types';

interface Props {
  node: ICategory;
  depth: number;
}

export const FamilyTreePyramid: React.FC<Props> = ({ node, depth }) => {
  if (!node) return null;
  console.log(node.name)
  return (
    <div className={styles.level}>
      {node.children && node.children.length > 0 && (
        <div className={styles.parents}>
          {node.children.map((child) => (
            <FamilyTreePyramid key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}

      <div className={styles.node}>
        {node.image ? (
          <img src={node.image} alt={node.name} />
        ) : (
          <div className={styles.noPhoto} />
        )}
        <p>{node.name}</p>
      </div>
    </div>
  );
};
