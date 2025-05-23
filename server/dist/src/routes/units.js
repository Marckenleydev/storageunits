"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validations_1 = require("../middlewares/validations");
const units_controller_1 = require("../controllers/units.controller");
const handleValidationErrors_1 = require("../middlewares/validations/handleValidationErrors");
const router = express_1.default.Router();
router.post("/", validations_1.validateCreateStorageUnit, handleValidationErrors_1.handleValidationErrors, units_controller_1.createNewStorageUnit);
router.get("/", units_controller_1.getAllUnits);
router.get("/:id", units_controller_1.getSingleUnit);
exports.default = router;
