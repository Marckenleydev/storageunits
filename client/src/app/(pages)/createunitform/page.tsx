/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { CreateUnitData } from "@/app/types";
import { storageUnitsApi } from "@/utils/api";
import React, { useState } from "react";
import { toast } from "sonner"


type Props = {
  onSuccess?: (createdUnit: any) => void;
  onError?: (error: string) => void;
}

const CreateUnitForm = ({ onSuccess }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateUnitData>({
    name: "",
    size: "Small",
    location: "",
    pricePerDay: 0,
    isAvailable: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : 
              type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const createdUnit = await storageUnitsApi.createUnit(formData);
      
      setFormData({
        name: "",
        size: "Small",
        location: "",
        pricePerDay: 0,
        isAvailable: true
      });
    
      if (onSuccess) {
        onSuccess(createdUnit);
      }
      toast.success("Unit created successfully")

      console.log('Unit created successfully:', createdUnit);
    } catch (error: any) {

      console.error('Error creating unit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="font-semibold text-xl">Create New Unit</span>
      
      <div className="grid grid-cols-2 gap-2">
        <label className="text-gray-700 text-sm font-semibold flex-1">
          Unit Name
          <input
            className="border mt-1 rounded w-full py-2 px-3 font-normal text-gray-700"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter unit name"
            required
          />
        </label>

        <label className="text-gray-700 text-sm font-semibold flex-1">
          Size
          <select
            className="border mt-1 rounded w-full py-2 px-3 font-normal text-gray-700"
            name="size"
            value={formData.size}
            onChange={handleInputChange}
            required
          >
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </label>

        <label className="text-gray-700 text-sm font-semibold flex-1">
          Location
          <input
            className="border mt-1 rounded w-full py-2 px-3 font-normal text-gray-700"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter location"
            required
          />
        </label>

        <label className="text-gray-700 text-sm font-semibold flex-1">
          Price Per Day (£)
          <input
            className="border mt-1 rounded w-full py-2 px-3 font-normal text-gray-700"
            type="number"
            name="pricePerDay"
            value={formData.pricePerDay}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
        </label>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Availability</h3>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isAvailable"
            id="isAvailable"
            checked={formData.isAvailable}
            onChange={handleInputChange}
            className="rounded"
          />
          <label htmlFor="isAvailable" className="text-gray-700 text-sm">
            Unit is available for booking
          </label>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Summary</h2>
        <div className="bg-[#f5d6d6] p-4 rounded-md">
          <div className="font-semibold text-lg">
            Unit: {formData.name || "Not specified"}
          </div>
          <div className="text-sm">
            Size: {formData.size} | Location: {formData.location || "Not specified"}
          </div>
          <div className="text-sm">
            Price: £{formData.pricePerDay.toFixed(2)} per day
          </div>
          <div className="text-xs">
            Status: {formData.isAvailable ? "Available" : "Not Available"}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-[#eb8686] cursor-pointer py-2 px-6 text-white font-semibold hover:bg-[#f67a7a] disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          {isLoading ? "Creating..." : "Create Unit"}
        </button>
      </div>
    </form>
  );
};

export default CreateUnitForm;