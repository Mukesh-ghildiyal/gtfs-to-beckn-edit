import express from 'express';
import cors from 'cors';
import gtfsRoutes from './routes/gtfsRoutes';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/gtfs', gtfsRoutes);

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});