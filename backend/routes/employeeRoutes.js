const express = require("express");
const upload = require("../middleware/upload");
const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
  updateEmployee,
  getEmployeeByCompany
} = require("../controllers/employeeController");

const router = express.Router();

router.post("/", upload.single("photo"), createEmployee);
router.get("/", getAllEmployees);
router.get("/:employeeId", getEmployeeById);
router.delete("/:employeeId", deleteEmployee);
router.patch("/:employeeId", upload.single("photo"), updateEmployee);
router.get("/company/:company", getEmployeeByCompany);

module.exports = router;
