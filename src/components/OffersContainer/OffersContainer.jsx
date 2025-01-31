import React, { useState, useEffect } from 'react';
import * as styles from './OffersContainer.module.scss';
import { OffersList } from './OffersList/OffersList';
import { Input } from '../UI/Input/Input';
import { API_CONFIG } from '../../config/api';

export const OffersContainer = () => {
   const [searchValue, setSearchValue] = useState('');
   // const [locationValue, setLocationValue] = useState('');
   const [offers, setOffers] = useState([]);
   const [filteredOffers, setFilteredOffers] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchJobs = async () => {
         try {
            setIsLoading(true);
            setError(null);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.OFFERS}`, {
               headers: {
                  'Content-Type': 'application/json',
               },
               signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
               throw new Error(
                  `Failed to fetch offers (${response.status} ${response.statusText})`
               );
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
               throw new Error('Invalid data format received from server');
            }

            setOffers(data);
            setFilteredOffers(data);
         } catch (error) {
            console.error('Error fetching offers:', error);
            if (error.name === 'AbortError') {
               setError('Request timed out. Please check your connection and try again.');
            } else if (!navigator.onLine) {
               setError('No internet connection. Please check your network and try again.');
            } else {
               setError(
                  error.message || 'Failed to fetch offers. Please try again later.'
               );
            }
         } finally {
            setIsLoading(false);
         }
      };

      fetchJobs();

      // Cleanup function
      return () => {
         setOffers([]);
         setFilteredOffers([]);
      };
   }, []);

   const handleSearchChange = (value) => {
      setSearchValue(value);
      filterOffers(value);
   };

   // const handleLocationChange = (value) => {
   //    setLocationValue(value);
   //    filterOffers(searchValue, value);
   // };

   const filterOffers = (search) => {
      let filtered = offers;

      if (search) {
         filtered = filtered.filter((offer) =>
            offer.title.toLowerCase().includes(search.toLowerCase()),
         );
      }

      // if (location) {
      //    filtered = filtered.filter(offer =>
      //       offer.city.toLowerCase().includes(location.toLowerCase()) ||
      //       offer.country.toLowerCase().includes(location.toLowerCase())
      //    );
      // }

      setFilteredOffers(filtered);
   };

   return (
      <div className={styles.container}>
         <div className={styles.inputWrapper}>
            <Input
               type="search"
               placeholder="Search for"
               offers={offers}
               onSearchChange={handleSearchChange}
               value={searchValue}
               setValue={setSearchValue}
            />
            {/* <Input 
               type="location"
               placeholder="Search location"
               onSearchChange={handleLocationChange}
               value={locationValue}
               setValue={setLocationValue}
            /> */}
         </div>
         <OffersList offers={filteredOffers} isLoading={isLoading} error={error} />
      </div>
   );
};
