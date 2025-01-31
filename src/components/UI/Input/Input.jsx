import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './Input.module.scss';
import { SearchIcon } from '../../Icons/SearchIcon';
import { LocationIcon } from '../../Icons/LocationIcon';

export const Input = ({
   type = 'search',
   placeholder = 'Search for',
   offers = [],
   onSearchChange,
   value,
   setValue,
}) => {
   const [showSuggestions, setShowSuggestions] = useState(false);
   const inputRef = useRef(null);

   // Memoize suggestions calculation
   const suggestions = useMemo(() => {
      if (!value || type !== 'search') return [];
      
      return offers
         .map(offer => offer.title)
         .filter((title, index, self) => 
            self.indexOf(title) === index && // Remove duplicates
            title.toLowerCase().includes(value.toLowerCase()),
         )
         .slice(0, 5); // Limit to 5 suggestions
   }, [offers, value, type]);

   const handleInputChange = (e) => {
      const inputValue = e.target.value;
      setValue(inputValue);
      setShowSuggestions(inputValue.length > 0);
      onSearchChange?.(inputValue);
   };

   const handleSuggestionClick = (suggestion) => {
      setValue(suggestion);
      setShowSuggestions(false);
      onSearchChange?.(suggestion);
   };

   // Close suggestions when clicking outside
   useEffect(() => {
      const handleClickOutside = (event) => {
         if (inputRef.current && !inputRef.current.contains(event.target)) {
            setShowSuggestions(false);
         }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
   }, []);

   return (
      <div className={styles.inputContainer} ref={inputRef}>
         <div className={styles.inputWrapper}>
            <input
               type="text"
               className={styles.searchInput}
               placeholder={placeholder}
               value={value}
               onChange={handleInputChange}
               onFocus={() => type === 'search' && value && setShowSuggestions(true)}
            />
            <div className={styles.iconWrapper}>
               {type === 'search' ? <SearchIcon /> : <LocationIcon />}
            </div>
         </div>
         {showSuggestions && suggestions.length > 0 && (
            <div className={styles.dropdownResults}>
               {suggestions.map((suggestion, index) => (
                  <div
                     key={index}
                     className={styles.suggestionItem}
                     onClick={() => handleSuggestionClick(suggestion)}
                  >
                     {suggestion}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};
