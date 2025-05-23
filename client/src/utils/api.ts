import {  BookingsResponse, CreateBookingData, CreateUnitData, StorageUnitsResponse } from '@/app/types';
import axios from 'axios';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});


// Storage Units API
export const storageUnitsApi = {
      createUnit: async (unitData: CreateUnitData) => {
    const response = await api.post('/units', unitData);
    return response.data;
  },


  getUnits: async (location?: string, size?: string): Promise<StorageUnitsResponse> => {
    const params = new URLSearchParams();
    if (location && location !== 'all') params.append('location', location);
    if (size && size !== 'all') params.append('size', size);
    
    const response = await api.get(`/units?${params.toString()}`);
    return response.data;
  },

  getUnitById: async (id: string) => {
    const response = await api.get(`/units/${id}`);
    return response.data;
  },
};

// Bookings API
export const bookingsApi = {
   getBookings: async (userName?: string): Promise<BookingsResponse> => {
    const url = userName 
      ? `/bookings?userName=${encodeURIComponent(userName)}`
      : '/bookings';
    
    const response = await api.get(url);
    return response.data;
  },

  createBooking: async (bookingData: CreateBookingData) => {
    const response = await api.post('/book', {
      ...bookingData,
      startDate: bookingData.startDate.toString(),
      endDate: bookingData.endDate.toString(),
    });
    return response.data;
  },






  checkAvailability: async (unitId: string, startDate: Date, endDate: Date) => {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    
    const response = await api.get(`/bookings/unit/${unitId}/availability?${params.toString()}`);
    return response.data;
  },
};

export default api;