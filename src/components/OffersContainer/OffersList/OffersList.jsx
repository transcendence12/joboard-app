import React from 'react';
import * as styles from './OffersList.module.scss';
import { OffersListItem } from '../OffersListItem/OffersListItem';

export const OffersList = (props) => (
   <div className={styles.container}>
      <p className={styles.offersTotalCount}>36 offers found</p>
      <ul className={styles.offersList}>
         <OffersListItem />
         <OffersListItem />
         <OffersListItem />
         <OffersListItem />
         <OffersListItem />
         <OffersListItem />
      </ul>
   </div>
);
