import React from 'react';
import * as styles from './OffersContainer.module.scss';
import { OffersList } from './OffersList/OffersList';

export const OffersContainer = (props) => (
   <div className={styles.container}><OffersList /></div>
)
