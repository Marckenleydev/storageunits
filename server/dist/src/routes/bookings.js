"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking__controller_1 = require("../controllers/booking..controller");
const handleValidationErrors_1 = require("../middlewares/validations/handleValidationErrors");
const validations_1 = require("../middlewares/validations");
const router = express_1.default.Router();
router.post("/book", validations_1.validateCreateBooking, handleValidationErrors_1.handleValidationErrors, booking__controller_1.createNewBooking);
router.get("/bookings", booking__controller_1.getUserBooking);
exports.default = router;
