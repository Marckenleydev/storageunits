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
exports.getSingleUnit = exports.getAllUnits = exports.createNewStorageUnit = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createNewStorageUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, size, location, pricePerDay, isAvailable = true } = req.body;
        const unit = yield prisma.storageUnit.create({
            data: {
                name,
                size,
                location,
                pricePerDay: parseFloat(pricePerDay.toString()),
                isAvailable
            }
        });
        res.status(201).json(unit);
        return;
    }
    catch (error) {
        console.error("Error creating storage unit:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.createNewStorageUnit = createNewStorageUnit;
const getAllUnits = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { location, size, available } = req.query;
        const where = {};
        if (location && location !== 'all') {
            where.location = location;
        }
        if (size && size !== 'all') {
            where.size = size;
        }
        if (available !== undefined) {
            where.isAvailable = available === 'true';
        }
        const units = yield prisma.storageUnit.findMany({
            where,
            orderBy: [
                { isAvailable: 'desc' },
                { pricePerDay: 'asc' }
            ],
            include: {
                _count: {
                    select: { bookings: true }
                }
            }
        });
        const allUnits = yield prisma.storageUnit.findMany({
            select: {
                location: true,
                size: true
            }
        });
        const locations = [...new Set(allUnits.map(unit => unit.location))].sort();
        const sizes = [...new Set(allUnits.map(unit => unit.size))].sort();
        res.json({
            units,
            filters: {
                locations,
                sizes
            },
            total: units.length
        });
    }
    catch (error) {
        console.error('Error fetching units:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getAllUnits = getAllUnits;
const getSingleUnit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const unit = yield prisma.storageUnit.findUnique({
            where: { id },
            include: {
                bookings: {
                    select: {
                        startDate: true,
                        endDate: true,
                        userName: true
                    },
                    orderBy: {
                        startDate: 'asc'
                    }
                }
            }
        });
        if (!unit) {
            res.status(404).json({ error: 'Storage unit not found' });
        }
        res.json(unit);
    }
    catch (error) {
        console.error('Error fetching unit:', error);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getSingleUnit = getSingleUnit;
