// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  total?: number;
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



export interface BookingsResponse {
  bookings: BookingWithStatus[];
  total: number;
}


export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}


