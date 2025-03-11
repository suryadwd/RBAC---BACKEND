const express = require("express");
const router = express.Router();

const { signup, login, logout, home, createAdmin,deleteAdmin, noOfUsers, noOfAdmins, createUserBySuperAdmin, promoteOrDemoteUser, deleteUserBySuperAdmin, createUserByAdmin, deleteUserByAdmin } = require("../controller/auth.controller");

const { protectedRoute, isSuperAdmin, isAdmin, isAdminOrSuperAdmin} = require("../middleware/auth.middleware");

router.get("/", (req, res) => res.send("Hello World! go through the readme.md file to check more"));

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get("/me", protectedRoute, home);

router.post("/createAdmin",protectedRoute, isSuperAdmin, createAdmin); //can be hitted by superadmin only to create admin 

router.delete("/deleteAdmin",protectedRoute, isSuperAdmin, deleteAdmin); //can be hitted by superadmin only to delete admin 

router.get("/noOfUsers",protectedRoute, isAdminOrSuperAdmin, noOfUsers); //can be hitted by superadmin or admin

router.get("/noOfAdmins",protectedRoute, isSuperAdmin, noOfAdmins); //hitted  by superadmin only

router.post("/promoteOrDemoteUser",protectedRoute, isSuperAdmin, promoteOrDemoteUser); //can be hitted by superadmin to promote the roles 

router.post("/createUserBySuperAdmin",protectedRoute, isSuperAdmin, createUserBySuperAdmin); //can be hitted by superadmin only and create the new user with the role selered by the superadmin

router.delete("/deleteUserBySuperAdmin",protectedRoute, isSuperAdmin, deleteUserBySuperAdmin); //can be hitted by superadmin only and delete the user selected by the superadmin

router.post("/createUserByAdmin",protectedRoute, isAdmin, createUserByAdmin); //can be hitted by admin only and create the new user with the role selered by the admin

router.delete("/deleteUserByAdmin",protectedRoute, isAdmin, deleteUserByAdmin); //can be hitted by admin only and delete the user selected by the admin




module.exports = router;
