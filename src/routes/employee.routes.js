const express = require("express");
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee.controller");
const { protectAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { employeeValidator } = require("../validators/module.validator");
const validate = require("../middleware/validate.middleware");

router.get("/", protectAdmin, getEmployees);
router.get("/:id", protectAdmin, getEmployeeById);
router.post("/", protectAdmin, upload.single("image"), employeeValidator, validate, createEmployee);
router.put("/:id", protectAdmin, upload.single("image"), updateEmployee);
router.delete("/:id", protectAdmin, deleteEmployee);

module.exports = router;
