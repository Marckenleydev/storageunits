'use client';

import { useState, useEffect } from 'react';

import { storageUnitsApi } from '@/utils/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { StorageUnit } from './types';
import UnitCard from '@/components/UnitCard';
import HeroSection from '@/layout/HeroSection';
import CallToActionSection from '@/layout/CallToActionSection';
import FooterSection from '@/layout/FooterSection';
import Testimonial from '@/layout/Testimonial';



export default function HomePage() {
  const [units, setUnits] = useState<StorageUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const response = await storageUnitsApi.getUnits();
      setUnits(response.units);
      setError(null);
    } catch (err) {
      setError('Failed to load storage units. Please try again.');
      console.error('Error fetching units:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">{error}</div>
        <button
          onClick={fetchUnits}
          className="bg-primary-600 hover:bg-primary-700 text-black px-6 py-2 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className=''>
      {/* Hero Section */}
      <HeroSection/>

      {/* Results Summary */}
      <div className="mb-6 flex mt-4 flex-col items-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Available Storage Units
        </h2>
        <p className="text-gray-600">
          {units.length} {units.length === 1 ? 'unit' : 'units'} available
        </p>
      </div>

      {/* Units Grid */}
      {units.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-10">
          {units.map((unit) => (
            
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            No storage units currently available.
          </div>
        </div>
      )}

     
     
      <Testimonial/>
      <CallToActionSection/>
      <FooterSection/>
    </div>

  );
}