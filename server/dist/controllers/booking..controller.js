"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBooking = exports.createNewBooking = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum 1 day
}
function checkBookingConflict(unitId, startDate, endDate, excludeBookingId) {
    return __awaiter(this, void 0, void 0, function* () {
        const where = {
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
        const conflictingBookings = yield prisma.booking.findMany({ where });
        return conflictingBookings.length > 0;
    });
}
const createNewBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const unit = yield prisma.storageUnit.findUnique({
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
        const hasConflict = yield checkBookingConflict(unitId, startDate, endDate);
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
        const booking = yield prisma.booking.create({
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
        res.status(201).json(Object.assign(Object.assign({}, booking), { days, message: 'Booking created successfully' }));
    }
    catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createNewBooking = createNewBooking;
const getUserBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName } = req.query;
        const bookings = yield prisma.booking.findMany({
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
        const bookingsWithStatus = bookings.map(booking => {
            const startDate = new Date(booking.startDate);
            const endDate = new Date(booking.endDate);
            let bookingStatus = 'upcoming';
            if (startDate <= now && endDate >= now) {
                bookingStatus = 'active';
            }
            else if (endDate < now) {
                bookingStatus = 'past';
            }
            return Object.assign(Object.assign({}, booking), { status: bookingStatus });
        });
        const response = {
            bookings: bookingsWithStatus,
            total: bookingsWithStatus.length
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUserBooking = getUserBooking;
