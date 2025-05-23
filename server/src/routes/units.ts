import express from 'express';
import { validateCreateStorageUnit } from '../middlewares/validations';
import { createNewStorageUnit, getAllUnits, getSingleUnit } from '../controllers/units.controller';
import { handleValidationErrors } from '../middlewares/validations/handleValidationErrors';



const router = express.Router();
router.post("/",validateCreateStorageUnit,handleValidationErrors,createNewStorageUnit)
router.get("/",getAllUnits)
router.get("/:id",getSingleUnit)

export default router; 
