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
   const [selectedIndex, setSelectedIndex] = useState(-1);
   const [isFocused, setIsFocused] = useState(false);
   const inputRef = useRef(null);

   // Memoize suggestions calculation
   const suggestions = useMemo(() => {
      if (!value) return [];

      if (type === 'search') {
         return offers
            .map((offer) => offer.title)
            .filter(
               (title, index, self) =>
                  self.indexOf(title) === index &&
                  title.toLowerCase().includes(value.toLowerCase()),
            )
            .slice(0, 5);
      }

      if (type === 'location') {
         const locations = offers.reduce((acc, offer) => {
            // Combine city and country for display
            const fullLocation = `${offer.city}, ${offer.country}`;
            if (!acc.includes(fullLocation)) {
               acc.push(fullLocation);
            }
            return acc;
         }, []);

         return locations
            .filter((location) => {
               const searchLower = value.toLowerCase();
               const [city, country] = location.toLowerCase().split(',').map(str => str.trim());
               
               // Check if searching for city or full location
               return (
                  city.includes(searchLower) || 
                  location.toLowerCase().includes(searchLower)
               );
            })
            .slice(0, 5);
      }

      return [];
   }, [offers, value, type]);

   const handleInputChange = (e) => {
      const inputValue = e.target.value;
      setValue(inputValue);
      setShowSuggestions(inputValue.length > 0);
      setSelectedIndex(-1);
      onSearchChange?.(inputValue);
   };

   const handleSuggestionClick = (suggestion) => {
      setValue(suggestion);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      onSearchChange?.(suggestion);
      inputRef.current?.blur();
   };

   const handleFocus = () => {
      setIsFocused(true);
      if (value) {
         setShowSuggestions(true);
      }
   };

   const handleBlur = () => {
      setIsFocused(false);
      // Delay hiding suggestions to allow click events on suggestions to fire
      setTimeout(() => {
         if (!isFocused) {
            setShowSuggestions(false);
         }
      }, 200);
   };

   const handleKeyDown = (e) => {
      if (!suggestions.length) return;

      switch (e.key) {
         case 'Enter':
            e.preventDefault();
            if (selectedIndex >= 0) {
               // If an item is selected from suggestions, use that
               handleSuggestionClick(suggestions[selectedIndex]);
            } else {
               // Otherwise, use the current input value
               setShowSuggestions(false);
               onSearchChange?.(value);
            }
            break;

         case 'Escape':
            setShowSuggestions(false);
            setSelectedIndex(-1);
            break;

         case 'ArrowDown':
            e.preventDefault();
            setShowSuggestions(true);
            setSelectedIndex((prev) => 
               prev < suggestions.length - 1 ? prev + 1 : prev
            );
            break;

         case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
            break;

         default:
            break;
      }
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
               onKeyDown={handleKeyDown}
               onFocus={handleFocus}
               onBlur={handleBlur}
               ref={inputRef}
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
                     className={`${styles.suggestionItem} ${
                        index === selectedIndex ? styles.selected : ''
                     }`}
                     onClick={() => handleSuggestionClick(suggestion)}
                     onMouseDown={(e) => e.preventDefault()} // Prevent onBlur from firing before click
                  >
                     {suggestion}
                  </div>
               ))}
            </div>
         )}
      </div>
   );
};
