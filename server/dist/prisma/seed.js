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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const units = yield prisma.storageUnit.createMany({
            data: [
                {
                    id: "unit_001",
                    name: "Martişna",
                    size: "Small",
                    location: "Dubai Marina",
                    pricePerDay: 25.5,
                    isAvailable: true
                },
                {
                    id: "unit_002",
                    name: "Blue Haven",
                    size: "Medium",
                    location: "Downtown Dubai",
                    pricePerDay: 35.0,
                    isAvailable: true
                },
                {
                    id: "unit_003",
                    name: "Palm View",
                    size: "Large",
                    location: "Palm Jumeirah",
                    pricePerDay: 45.5,
                    isAvailable: false
                },
                {
                    id: "unit_004",
                    name: "Desert Rose",
                    size: "Small",
                    location: "Dubai Hills",
                    pricePerDay: 28.0,
                    isAvailable: true
                },
                {
                    id: "unit_005",
                    name: "Marina Luxe",
                    size: "Medium",
                    location: "Dubai Marina",
                    pricePerDay: 38.5,
                    isAvailable: true
                },
                {
                    id: "unit_006",
                    name: "Business Bay",
                    size: "Large",
                    location: "Business Bay",
                    pricePerDay: 50.0,
                    isAvailable: true
                }
            ],
            skipDuplicates: true,
        });
        console.log(`Created ${units.count} storage units`);
        const allUnits = yield prisma.storageUnit.findMany();
        const bookingData = [
            {
                id: "book_001",
                userName: "Marckenley",
                unitId: "unit_001",
                startDate: new Date("2024-06-15"),
                endDate: new Date("2024-06-20")
            },
            {
                id: "book_002",
                userName: "Marckenley",
                unitId: "unit_003",
                startDate: new Date("2024-07-01"),
                endDate: new Date("2024-07-05")
            },
            {
                id: "book_003",
                userName: "Marckenley",
                unitId: "unit_005",
                startDate: new Date("2024-08-10"),
                endDate: new Date("2024-08-15")
            },
            {
                id: "book_004",
                userName: "Marckenley",
                unitId: "unit_002",
                startDate: new Date("2025-06-20"),
                endDate: new Date("2025-06-25")
            },
            {
                id: "book_005",
                userName: "Marckenley",
                unitId: "unit_004",
                startDate: new Date("2025-07-15"),
                endDate: new Date("2025-07-20")
            },
            {
                id: "book_006",
                userName: "Marckenley",
                unitId: "unit_006",
                startDate: new Date("2025-08-01"),
                endDate: new Date("2025-08-10")
            }
        ];
        const bookingsWithPrices = bookingData.map(booking => {
            const unit = allUnits.find(u => u.id === booking.unitId);
            if (!unit)
                throw new Error(`Unit ${booking.unitId} not found`);
            const days = Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) /
                (1000 * 60 * 60 * 24));
            const totalPrice = days * unit.pricePerDay;
            return Object.assign(Object.assign({}, booking), { totalPrice });
        });
        // 4. Create bookings with calculated prices
        const bookings = yield prisma.booking.createMany({
            data: bookingsWithPrices,
            skipDuplicates: true,
        });
        console.log(`Created ${bookings.count} bookings with calculated prices`);
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
