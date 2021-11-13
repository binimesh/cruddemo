const router = require("express").Router();
const { forgotPassword } = require("../controller/userController");
const userController = require("../controllers/userController");
const { verifyUser, verifyAdmin } = require("../middleware/verifyToken");

router.post("/", userController.signUp);

router.post("/login", userController.logIn);

router.post("/password/forgot", userController.forgotPassword);

router.put("/password/reset/:token", userController.resetPassword);

router.patch('/:userId', userController.updateUser);

router.delete('/:userId', userController.deleteUser);

router.get("/data", verifyUser, userController.data);

module.exports = router;

//fileneme index.js - all routes