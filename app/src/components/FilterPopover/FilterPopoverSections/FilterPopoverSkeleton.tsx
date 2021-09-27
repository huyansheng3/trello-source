import React from 'react';
import styles from './FilterPopoverSkeleton.less';

export const FilterPopoverSkeleton = () => (
  <div>
    <div className={styles.skeletonHeader} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonHeader} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonHeader} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonHeader} />
    <div className={styles.skeletonRow} />
    <div className={styles.skeletonRow} />
  </div>
);

export const FilterPopoverBoardsSelectorSkeleton = () => (
  <div>
    <div className={styles.skeletonHeader} />
    <div className={styles.skeletonRow} />
  </div>
);
