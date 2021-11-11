const express = require("express");
const { date } = require("joi");
const router = express.Router();
const ProdController = require("../controllers/productController");
//const { verifyUser, verifyAdmin } = require("../middleware/verifyToken");


router.post("/", upload.single("productImage"), ProdController.createProduct);

router.get("/show", ProdController.getProducts);

module.exports = router;