const express = require("express");
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customer.controller");
const { protectAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { customerValidator } = require("../validators/module.validator");
const validate = require("../middleware/validate.middleware");

router.get("/", protectAdmin, getCustomers);
router.get("/:id", protectAdmin, getCustomerById);
router.post("/", protectAdmin, upload.single("image"), customerValidator, validate, createCustomer);
router.put("/:id", protectAdmin, upload.single("image"), updateCustomer);
router.delete("/:id", protectAdmin, deleteCustomer);

module.exports = router;
