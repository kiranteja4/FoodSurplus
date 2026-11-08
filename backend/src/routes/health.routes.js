import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();
router.get('/', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({ success: true, service: 'foodsurplus-api', database: states[mongoose.connection.readyState] });
});
export default router;
