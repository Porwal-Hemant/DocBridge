
import express from 'express';

import authUser from '../middleware/authUser.js';
import authDoctor from '../middleware/authDoctor.js';
import { getStreamToken , getStreamTokenForDoctor , getStreamTokenVideoUser , getStreamTokenVideoDoctor } from "../controllers/chat.controllers.js";

const router = express.Router();

router.get("/token", authUser , getStreamToken);
router.get("/tokenVideoUser", authUser , getStreamTokenVideoUser);

router.get("/token-for-doctor", authDoctor , getStreamTokenForDoctor);    
router.get("/tokenVideoDoctor", authDoctor , getStreamTokenVideoDoctor);

export default router;



