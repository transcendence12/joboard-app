import React, { useState, useEffect } from 'react';
import * as styles from './OffersList.module.scss';
import { OffersListItem } from '../OffersListItem/OffersListItem';

export const OffersList = ({ offers }) => {
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      // Since offers are now passed as props, we just need to handle loading state
      setIsLoading(false);
   }, [offers]);

   return (
      <>
         {isLoading && (
            <div className={styles.loadingContainer}>
               <p>Loading offers...</p>
            </div>
         )}

         {error && (
            <div className={styles.errorContainer}>
               <p>Error: {error}</p>
               {/* <button onClick={() => window.location.reload()}>Try Again</button> */}
            </div>
         )}

         {!isLoading && !error && (
            <div className={styles.container}>
               <p className={styles.offersTotalCount}>
                  {offers.length} {offers.length === 1 ? 'offer' : 'offers'} found
               </p>
               <ul className={styles.offersList}>
                  {offers.map((offer) => (
                     <OffersListItem key={offer._id} offer={offer} />
                  ))}
               </ul>
            </div>
         )}
      </>
   );
};
