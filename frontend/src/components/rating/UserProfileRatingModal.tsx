import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { RatingSummary } from './RatingSummary';
import { RatingsList } from './RatingsList';
import { Rating, RatingSummaryData, UserRoleType } from '../../types';
import { ratingService } from '../../services/ratingService';
import { Star, ShieldCheck, Award } from 'lucide-react';

interface UserProfileRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userRole: UserRoleType;
  subtitle?: string;
}

export const UserProfileRatingModal: React.FC<UserProfileRatingModalProps> = ({
  isOpen,
  onClose,
  userId,
  userName,
  userRole,
  subtitle,
}) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [summary, setSummary] = useState<RatingSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [revs, sum] = await Promise.all([
        ratingService.fetchUserRatings(userId),
        ratingService.fetchUserRatingSummary(userId),
      ]);
      setRatings(revs);
      setSummary(sum);
    } catch (e) {
      console.error('Failed loading profile rating data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      loadData();
    }
  }, [isOpen, userId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={userName}
      subtitle={subtitle || `Verified Ratings & Reviews • ${userRole === 'student' ? 'Student Worker' : 'Local Employer'}`}
    >
      <div className="space-y-5">
        {summary && (
          <RatingSummary
            summary={summary}
            userName={userName}
            role={userRole}
          />
        )}

        <RatingsList
          ratings={ratings}
          isLoading={isLoading}
          emptyTitle={`No ratings received by ${userName} yet`}
          emptySubtitle="Ratings will appear here once work shifts are completed."
        />
      </div>
    </Modal>
  );
};
