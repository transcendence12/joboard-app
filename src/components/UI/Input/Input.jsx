import React, { useState, useEffect, useRef } from 'react';
import styles from './Input.module.scss';
import { SearchIcon } from '../../Icons/SearchIcon';
import { LocationIcon } from '../../Icons/LocationIcon';

export const Input = ({ 
   type = 'search', 
   placeholder = 'Search for',
   offers = [],
   onSearchChange,
   value,
   setValue
}) => {
   const [showSuggestions, setShowSuggestions] = useState(false);
   const [suggestions, setSuggestions] = useState([]);
   const inputRef = useRef(null);

   const handleInputChange = (e) => {
      const inputValue = e.target.value;
      setValue(inputValue);
      
      if (type === 'search') {
         // Get unique job titles that match the input
         const matchingSuggestions = offers
            .map(offer => offer.title)
            .filter((title, index, self) => 
               self.indexOf(title) === index && // Remove duplicates
               title.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 5); // Limit to 5 suggestions

         setSuggestions(matchingSuggestions);
         setShowSuggestions(inputValue.length > 0);
         onSearchChange?.(inputValue);
      }
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
         {showSuggestions && type === 'search' && suggestions.length > 0 && (
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
