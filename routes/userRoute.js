import express from "express";
import { login, logout, Regitser , loadUser} from "../controller/userController.js";
const  router = express.Router();
import {isAuthenticated} from '../middleware/auth.js'
router.route('/register').post(Regitser)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/loaduser').get(isAuthenticated, loadUser)
// router.route('/getallusers').get(isAuthenticated,getAllUsers)

export default router;
