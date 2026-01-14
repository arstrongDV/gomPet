'use client';
import React from 'react';
import styles from './FamilyTree.module.scss';
import { useRouter } from 'next/navigation';

interface Props {
  node: any;
  depth: number;
}

export const FamilyTreePyramid: React.FC<Props> = ({ node, depth }) => {
  if (!node) return null;
  const router = useRouter();
  const hasChildren = node.children && node.children.length > 0;
  console.log(node)
  const levelClass =
  depth === 1
    ? styles.parentsLevel
    : depth === 2
    ? styles.grandparents
    : '';
  return (
    <div className={`${styles.level} ${levelClass}`}>
      {hasChildren && (
        <div
          className={`${styles.parents} ${levelClass}`}
          style={{
            display: 'flex',
            justifyContent: node.children.length === 1 ? 'center' : 'space-between',
          }}
        >
          {node.children.map((child: any) => (
            <FamilyTreePyramid key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}

      {/* Renderuj tylko rodziców/dziadków (depth > 0) */}
      {depth > 0 && (
        <div className={styles.node}>
          {node.image ? (
            <img src={node.image} alt={node.name} onClick={() => router.push(`/animals/${node.id}`)} />
          ) : (
            <div className={styles.noPhoto} onClick={() => router.push(`/animals/${node.id}`)} />
          )}
          <p>{node.name}</p>
        </div>
      )}
    </div>
  );
};
