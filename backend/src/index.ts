import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sandboxRoutes from './routes/sandbox';
import feedbackRoutes from './routes/feedback';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Parse JSON and urlencoded request bodies with larger limit for screenshots
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Base routes / health checks
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/sandbox', sandboxRoutes);
app.use('/api/feedback', feedbackRoutes);

// Start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

export { app };
