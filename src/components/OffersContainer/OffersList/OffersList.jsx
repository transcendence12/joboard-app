import React, { useState, useEffect } from 'react';
import * as styles from './OffersList.module.scss';
import { OffersListItem } from '../OffersListItem/OffersListItem';

export const OffersList = () => {
   const [offers, setOffers] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const url = 'https://training.nerdbord.io/api/v1/joboard/offers';
      
      const fetchJobs = async () => {
         try {
            const response = await fetch(url, {
               headers: {
                  'Content-Type': 'application/json',
               }
            });
            const data = await response.json();
            setOffers(data);
         } catch (error) {
            setError(error.message);
         } finally {
            setIsLoading(false);
         }
      };

      fetchJobs();
   }, []);

   return (
      <>
         {isLoading && <p>Loading...</p>}
         {error && <p>Error: {error}</p>}
         <div className={styles.container}>
            <p className={styles.offersTotalCount}>{offers.length} offers found</p>
            <ul className={styles.offersList}>
               {offers.map((offer) => (
                  <OffersListItem
                     key={offer._id}
                     offer={offer}
                  />
               ))}
            </ul>
         </div>
      </>
   );
};
