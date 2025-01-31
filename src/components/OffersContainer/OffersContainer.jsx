import React, { useState, useEffect, useCallback } from 'react';
import * as styles from './OffersContainer.module.scss';
import { OffersList } from './OffersList/OffersList';
import { Input } from '../UI/Input/Input';
import { API_CONFIG } from '../../config/api';
import { useDebounce } from '../../hooks/useDebounce';

export const OffersContainer = () => {
   const [searchValue, setSearchValue] = useState('');
   const [locationValue, setLocationValue] = useState('');
   const [offers, setOffers] = useState([]);
   const [filteredOffers, setFilteredOffers] = useState([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState(null);

   const filterOffers = useCallback(
      (search, location) => {
         let filtered = offers;

         if (search) {
            filtered = filtered.filter((offer) =>
               offer.title.toLowerCase().includes(search.toLowerCase()),
            );
         }

         if (location) {
            const [searchCity, searchCountry] = location.split(',').map((str) => str.trim());

            filtered = filtered.filter((offer) => {
               if (searchCountry) {
                  return (
                     offer.city.toLowerCase().includes(searchCity.toLowerCase()) &&
                     offer.country.toLowerCase().includes(searchCountry.toLowerCase())
                  );
               } else {
                  return (
                     offer.city.toLowerCase().includes(location.toLowerCase()) ||
                     offer.country.toLowerCase().includes(location.toLowerCase())
                  );
               }
            });
         }

         setFilteredOffers(filtered);
      },
      [offers],
   );

   // Create a single debounced function that handles both values
   const debouncedFilterOffers = useDebounce(filterOffers, 300);

   // Update both search handlers to use the current values
   const handleSearchChange = useCallback(
      (value) => {
         setSearchValue(value);
         debouncedFilterOffers(value, locationValue);
      },
      [debouncedFilterOffers, locationValue], // Include locationValue in dependencies
   );

   const handleLocationChange = useCallback(
      (value) => {
         setLocationValue(value);
         debouncedFilterOffers(searchValue, value);
      },
      [debouncedFilterOffers, searchValue], // Include searchValue in dependencies
   );

   // Apply filters whenever offers data changes
   useEffect(() => {
      if (offers.length > 0) {
         filterOffers(searchValue, locationValue);
      }
   }, [offers, filterOffers, searchValue, locationValue]);

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
                  `Failed to fetch offers (${response.status} ${response.statusText})`,
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
               setError(error.message || 'Failed to fetch offers. Please try again later.');
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

   return (
      <div className={styles.container}>
         <div className={styles.inputWrapper}>
            <Input
               key="search-input"
               type="search"
               placeholder="Search for"
               offers={offers}
               onSearchChange={handleSearchChange}
               value={searchValue}
               setValue={setSearchValue}
            />
            <Input
               key="location-input"
               type="location"
               placeholder="Search location"
               offers={offers}
               onSearchChange={handleLocationChange}
               value={locationValue}
               setValue={setLocationValue}
            />
         </div>
         <OffersList offers={filteredOffers} isLoading={isLoading} error={error} />
      </div>
   );
};
