import React from 'react';
import * as styles from './OffersListItem.module.scss';
import fallbackImage from '../../../assets/image-placeholder.png';

const formatTimeAgo = (dateString) => {
   const now = new Date();
   const past = new Date(dateString);
   const diffTime = Math.abs(now - past);
   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

   if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
         const diffMinutes = Math.floor(diffTime / (1000 * 60));
         return `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
   } else if (diffDays === 1) {
      return 'yesterday';
   } else if (diffDays < 7) {
      return `${diffDays} days ago`;
   } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
   } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
   } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
   }
};

const formatSalary = (amount) => {
   return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const OffersListItem = ({ offer }) => {
   const handleImageError = (e) => {
      e.target.src = fallbackImage;
   };

   return (
      <li className={styles.container}>
         <div className={styles.offerImage}>
            <img
               src={offer.image || fallbackImage}
               alt={`${offer.companyName} logo`}
               onError={handleImageError}
               className={styles.offerImageContent}
            />
         </div>
         <div className={styles.offerInfo}>
            <p className={styles.offerTitle}>{offer.title}</p>

            <div className={styles.offerInfoBottom}>
               <span className={styles.offerCompanyName}>{offer.companyName}</span>
               <span className={styles.borderDecorationSpan}></span>
               <span className={styles.offerLocation}>
                  {offer.city} {offer.country}
               </span>
               <span className={styles.borderDecorationSpan}></span>
               <span className={styles.offerContractType}>{offer.jobType}</span>
               <span className={styles.borderDecorationSpan}></span>
               <span className={styles.offerSeniorityLevel}>{offer.seniority}</span>
               <span className={styles.borderDecorationSpan}></span>
               <span className={styles.offerSalary}>
                  {formatSalary(offer.salaryFrom)} - {formatSalary(offer.salaryTo)} {offer.currency}{' '}
                  net
               </span>
            </div>
         </div>
         <div className={styles.offerPublishedDateInfo}>{formatTimeAgo(offer.createdAt)}</div>
      </li>
   );
};
