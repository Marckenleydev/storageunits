import express from 'express';
import { createNewBooking, getUserBooking } from '../controllers/booking..controller';
import { handleValidationErrors } from '../middlewares/validations/handleValidationErrors';
import { validateCreateBooking } from '../middlewares/validations';
const router = express.Router();

router.post("/book",validateCreateBooking,handleValidationErrors,createNewBooking)
router.get("/bookings",getUserBooking)

export default router; 