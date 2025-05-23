import  { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiError, BookingsResponse, BookingWithStatus } from '../types';

const prisma = new PrismaClient()

function calculateDays(startDate: string | Date, endDate: string | Date): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1; // Minimum 1 day
}

async function checkBookingConflict(
  unitId: string, 
  startDate: string | Date, 
  endDate: string | Date, 
  excludeBookingId?: string
): Promise<boolean> {
  const where: any = {
    unitId,
    OR: [
      {
        AND: [
          { startDate: { lte: new Date(startDate) } },
          { endDate: { gte: new Date(startDate) } }
        ]
      },
      {
        AND: [
          { startDate: { lte: new Date(endDate) } },
          { endDate: { gte: new Date(endDate) } }
        ]
      },
      {
        AND: [
          { startDate: { gte: new Date(startDate) } },
          { endDate: { lte: new Date(endDate) } }
        ]
      }
    ]
  };

  if (excludeBookingId) {
    where.id = { not: excludeBookingId };
  }

  const conflictingBookings = await prisma.booking.findMany({ where });
  return conflictingBookings.length > 0;
}

export const createNewBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userName, unitId, startDate, endDate } = req.body;

    

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    // Date validations
    if (start >= end) {
      res.status(400).json({ 
        error: 'Start date must be before end date' 
      });
      return;
    }

    if (start < new Date(now.setHours(0, 0, 0, 0))) {
      res.status(400).json({ 
        error: 'Start date cannot be in the past' 
      });
      return;
    }

    // Check if unit exists and is available
    const unit = await prisma.storageUnit.findUnique({
      where: { id: unitId }
    });

    if (!unit) {
      res.status(404).json({ error: 'Storage unit not found' });
      return;
    }

    if (!unit.isAvailable) {
      res.status(400).json({ 
        error: 'Storage unit is not available for booking' 
      });
      return;
    }

    // Check for booking conflicts
    const hasConflict = await checkBookingConflict(unitId, startDate, endDate);
    if (hasConflict) {
      res.status(409).json({ 
        error: 'Unit is already booked for the selected dates' 
      });
      return;
    }

    // Calculate total price
    const days = calculateDays(startDate, endDate);
    const totalPrice = days * unit.pricePerDay;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userName,
        unitId,
        startDate: start,
        endDate: end,
        totalPrice
      },
      include: {
        unit: {
          select: {
            name: true,
            size: true,
            location: true,
            pricePerDay: true
          }
        }
      }
    });

    res.status(201).json({
      ...booking,
      days,
      message: 'Booking created successfully'
    });
  } catch (error) {
    console.error('Error creating booking:', error);
     res.status(500).json({ error: "Internal server error" });
  }
}


export const getUserBooking = async (
  req: Request<{}, BookingsResponse | ApiError, {}, { userName: string }>,
  res: Response<BookingsResponse | ApiError>
): Promise<void> => {
  try {
    const { userName } = req.query;



    const bookings = await prisma.booking.findMany({
      where: { userName },
      include: {
        unit: {
          select: {
            name: true,
            size: true,
            location: true,
            pricePerDay: true
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    });

    // Add status to each booking
    const now = new Date();
    const bookingsWithStatus: BookingWithStatus[] = bookings.map(booking => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      
      let bookingStatus: 'upcoming' | 'active' | 'past' = 'upcoming';
      if (startDate <= now && endDate >= now) {
        bookingStatus = 'active';
      } else if (endDate < now) {
        bookingStatus = 'past';
      }
      
      return {
        ...booking,
        status: bookingStatus
      };
    });

    const response: BookingsResponse = {
      bookings: bookingsWithStatus,
      total: bookingsWithStatus.length
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching bookings:', error);
     res.status(500).json({ error: "Internal server error" });
  }
}