import React, { useState, useEffect } from 'react';
import * as styles from './OffersList.module.scss';
import { OffersListItem } from '../OffersListItem/OffersListItem';
import { API_CONFIG } from '../../../config/api';

export const OffersList = () => {
   const [offers, setOffers] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchJobs = async () => {
         try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.OFFERS}`, {
               headers: {
                  'Content-Type': 'application/json',
               },
            });

            if (!response.ok) {
               const errorData = await response.json().catch(() => null);
               throw new Error(
                  errorData?.message || 
                  `HTTP error! status: ${response.status} - ${response.statusText}`
               );
            }

            const data = await response.json();
            
            if (!Array.isArray(data)) {
               throw new Error('Invalid data format received from server');
            }

            setOffers(data);
         } catch (error) {
            console.error('Error fetching offers:', error);
            setError(error.message || 'Failed to fetch offers');
         } finally {
            setIsLoading(false);
         }
      };

      fetchJobs();
   }, []);

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
               <button onClick={() => window.location.reload()}>
                  Try Again
               </button>
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
