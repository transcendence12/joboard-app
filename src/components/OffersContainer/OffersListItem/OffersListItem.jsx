import React from 'react';
import * as styles from './OffersListItem.module.scss';

export const OffersListItem = (props) => (
   <li className={styles.container}>
      <div className={styles.offerImage}>
         <div className={styles.offerImagePlaceholder}></div>
      </div>
      <div className={styles.offerInfo}>
         <p className={styles.offerTitle}>Java Developer | Greenfield, Microservices</p>

         <div className={styles.offerInfoBottom}>
            <span className={styles.offerCompanyName}>GOPro</span>
            <span className={styles.borderDecorationSpan}></span>
            <span className={styles.offerLocation}>Warsaw, Poland</span>
            <span className={styles.borderDecorationSpan}></span>
            <span className={styles.offerContractType}>Fully-remote</span>
            <span className={styles.borderDecorationSpan}></span>
            <span className={styles.offerSeniorityLevel}>Senior</span>
            <span className={styles.borderDecorationSpan}></span>
            <span className={styles.offerSalary}>100000 - 120000 PLN net</span>
         </div>
      </div>
      <div className={styles.offerPublishedDateInfo}>4 days ago</div>
   </li>
);
