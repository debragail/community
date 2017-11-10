import express from 'express';
import * as update from '../controllers/update';

const router = express.Router();

router.route('/update/add')
  .post(update.create)

export default router;