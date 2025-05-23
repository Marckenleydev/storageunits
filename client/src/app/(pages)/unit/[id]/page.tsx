/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "next/navigation";
import { bookingsApi, storageUnitsApi } from "@/utils/api";

// Define the booking form data type
interface BookUnitFormData {
  userName: string;
  unitId: string;
  startDate: Date;
  endDate: Date;
}

// Props type for the component
type Props = {
  currentUserName?: string;
  onSuccess?: (booking: any) => void;
  onError?: (error: string) => void;
}

const BookUnitForm = ({ currentUserName = "", onSuccess, onError }: Props) => {
  const { id } = useParams<{ id: string }>();
  console.log(id)
  const [isLoading, setIsLoading] = useState(false);
  const [unitDetails, setUnitDetails] = useState<any>(null);
  
  const [formData, setFormData] = useState<BookUnitFormData>({
    userName: currentUserName,
    unitId: id || "",
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
  });

  // Fetch unit details on component mount
  useEffect(() => {
    const fetchUnitDetails = async () => {
      if (id) {
        try {
          const unit = await storageUnitsApi.getUnitById(id);
          setUnitDetails(unit);
        } catch (error) {
          console.error("Error fetching unit details:", error);
        }
      }
    };

    fetchUnitDetails();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | null, field: 'startDate' | 'endDate') => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        [field]: date
      }));
    }
  };

  const calculateTotalCost = () => {
    if (!unitDetails || !formData.startDate || !formData.endDate) return 0;
    
    const diffTime = Math.abs(formData.endDate.getTime() - formData.startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays * unitDetails.pricePerDay;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const bookingData = {
        userName: formData.userName,
        unitId: formData.unitId,
        startDate: formData.startDate.toISOString().split('T')[0],
        endDate: formData.endDate.toISOString().split('T')[0]
      };

      console.log(bookingData)

      const createdBooking = await bookingsApi.createBooking(bookingData);
      
      // Call success callback
      if (onSuccess) {
        onSuccess(createdBooking);
      }

      console.log('Booking created successfully:', createdBooking);

    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Failed to create booking';
      
      if (onError) {
        onError(errorMessage);
      }

      console.error('Error creating booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="font-semibold text-xl">Book Storage Unit</span>
      
      {unitDetails && (
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-semibold text-lg">{unitDetails.name}</h3>
          <p className="text-sm text-gray-600">
            Size: {unitDetails.size} | Location: {unitDetails.location}
          </p>
          <p className="text-sm text-gray-600">
            Price: £{unitDetails.pricePerDay} per day
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        <label className="text-gray-700 text-sm font-semibold">
          Your Name
          <input
            className="border mt-1 rounded w-full py-2 px-3 font-normal text-gray-700"
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleInputChange}
            placeholder="Enter your name"
            required
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="text-gray-700 text-sm font-semibold">
            Start Date
            <div className="mt-1">
              <DatePicker
                selected={formData.startDate}
                onChange={(date) => handleDateChange(date, 'startDate')}
                minDate={new Date()}
                className="border rounded w-full py-2 px-3 font-normal text-gray-700"
                dateFormat="yyyy-MM-dd"
                required
              />
            </div>
          </label>

          <label className="text-gray-700 text-sm font-semibold">
            End Date
            <div className="mt-1">
              <DatePicker
                selected={formData.endDate}
                onChange={(date) => handleDateChange(date, 'endDate')}
                minDate={formData.startDate}
                className="border rounded w-full py-2 px-3 font-normal text-gray-700"
                dateFormat="yyyy-MM-dd"
                required
              />
            </div>
          </label>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Booking Summary</h2>
        <div className="bg-[#f5d6d6] p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Cost: £{calculateTotalCost().toFixed(2)}
          </div>
          <div className="text-sm">
            Duration: {Math.ceil(Math.abs(formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
          </div>
          <div className="text-sm">
            From: {formData.startDate.toLocaleDateString()} to {formData.endDate.toLocaleDateString()}
          </div>
          <div className="text-xs">Includes all applicable charges</div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-[#eb8686] cursor-pointer py-2 px-6 text-white font-semibold hover:bg-[#f67a7a] disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          {isLoading ? "Creating Booking..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookUnitForm;