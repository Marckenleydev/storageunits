import { StorageUnit } from '@/app/types';
import Link from 'next/link';


interface UnitCardProps {
  unit: StorageUnit;
}

const UnitCard: React.FC<UnitCardProps> = ({ unit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link
              href={`/unit/${unit.id}`}
              className=""
            >
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900">{unit.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            unit.isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {unit.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4a1 1 0 011-1h4m-4 8v8a1 1 0 001 1h4m6-9V4a1 1 0 011-1h4v4m-4 4h4v8a1 1 0 01-1 1h-4m-6-4V8" />
            </svg>
            <span className="text-sm">Size: {unit.size}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">Location: {unit.location}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-primary-600">
              ${unit.pricePerDay}
            </span>
            <span className="text-gray-500">/day</span>
          </div>
          
          
        </div>

 
      </div>
      </Link>
    </div>
  );
};

export default UnitCard;