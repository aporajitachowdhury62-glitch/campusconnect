import React from 'react';
import { ShopkeeperForm } from '../components/shopkeeper/ShopkeeperForm';

export const ShopkeeperSignupPage: React.FC = () => {
  return (
    <main className="py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ShopkeeperForm />
      </div>
    </main>
  );
};
