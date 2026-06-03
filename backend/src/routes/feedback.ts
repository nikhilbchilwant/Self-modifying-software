import { Router } from 'express';
import { saveFeedback } from '../utils/fileStore.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { userPrompt, screenshot, diffContent, sessionId } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: 'userPrompt is required' });
    }
    if (!screenshot) {
      return res.status(400).json({ error: 'screenshot is required' });
    }

    const requestId = await saveFeedback(
      userPrompt,
      screenshot,
      diffContent || '',
      sessionId || ''
    );

    res.status(201).json({
      success: true,
      requestId,
    });
  } catch (error: any) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
