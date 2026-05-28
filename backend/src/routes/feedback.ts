import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { saveFeedbackFiles } from '../utils/fileStore';

const router = Router();

router.post('/submit', async (req, res) => {
  const { prompt, screenshot, diff } = req.body;
  const requestId = uuidv4();

  try {
    await saveFeedbackFiles(requestId, screenshot, {
      requestId,
      timestamp: new Date(),
      prompt,
      diff,
    });
    res.json({ success: true, requestId });
  } catch (error) {
    console.error('Failed to save feedback', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

export default router;
