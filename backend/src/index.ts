import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sandboxRouter from './routes/sandbox.js';
import feedbackRouter from './routes/feedback.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON and urlencoded request bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Mount API routes
app.use('/api/sandbox', sandboxRouter);
app.use('/api/feedback', feedbackRouter);

// Base routes / health checks
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

export { app };
