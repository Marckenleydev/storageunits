// API Response Types


// Storage Unit Types


export interface StorageUnit {
  id: string;
  name: string;
  size: string;
  location: string;
  pricePerDay: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StorageUnitWithCount {
  id: string;
  name: string;
  size: string;
  location: string;
  pricePerDay: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    bookings: number;
  };
}
export interface BookUnitFormData {
  userName: string;
  unitId: string;
  startDate: Date;
  endDate: Date;
}
export interface StorageUnitFilters {
  locations: string[];
  sizes: string[];
}

export interface StorageUnitsResponse {
  units: StorageUnitWithCount[];
  filters: StorageUnitFilters;
  total: number;
}

export interface CreateStorageUnitData {
  name: string;
  size: string;
  location: string;
  pricePerDay: number;
  isAvailable?: boolean;
}




// Booking Types

interface Unit {
  name: string;
  size: string;
  location: string;
  pricePerDay: number;
}
export interface Booking {
  id: string;
  userName: string;
  unitId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  unit: Unit;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}


export interface BookingWithUnit {
  id: string;
  userName: string;
  unitId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  unit: {
    name: string;
    size: string;
    location: string;
    pricePerDay: number;
  };
}

export interface BookingWithStatus {
  id: string;
  userName: string;
  unitId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  unit: {
    name: string;
    size: string;
    location: string;
    pricePerDay: number;
  };
  status: 'upcoming' | 'active' | 'past';
}

export interface CreateBookingData {
  userName: string;
  unitId: string;
  startDate: string | Date;
  endDate: string | Date;
}



export interface BookingsResponse {
  bookings: BookingWithStatus[];
  total: number;
}

export interface BookingAvailabilityResponse {
  available: boolean;
  unitId: string;
  startDate: string;
  endDate: string;
}


// Query Parameter Types


export interface UnitsQueryParams {
  location?: string;
  size?: string;
  available?: string;
}

export interface BookingsQueryParams {
  userName?: string;
  unitId?: string;
  status?: 'upcoming' | 'active' | 'past';
}

export interface AvailabilityQueryParams {
  startDate: string;
  endDate: string;
}


// Error & Health Types


export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}


export interface StorageUnitFilters {
  location: string[];
  sizes: string[];
}
export interface CreateUnitData {
  name: string;
  size: "Small" | "Medium" | "Large";
  location: string;
  pricePerDay: number;
  isAvailable: boolean;
}