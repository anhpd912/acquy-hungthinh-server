import express from 'express';
import postRouter from './post.route.js';
import videoRouter from './video.route.js';
import authRouter from './auth.route.js';
import userRouter from './user.router.js';

const router = express.Router();

router.use('/posts', postRouter);
router.use('/videos', videoRouter);
router.use('/auth', authRouter);
router.use('/users', userRouter);

export default router;