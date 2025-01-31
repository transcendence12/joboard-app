import { useCallback } from 'react';

export const useDebounce = (func, delay) => {
   return useCallback(
      (() => {
         let timeoutId;

         return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
         };
      })(),
      [func, delay],
   );
}; 