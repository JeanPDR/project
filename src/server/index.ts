import express from "express";
import cors from "cors";
import { urlRoutes } from "./routes/urls";
import { userRoutes } from "./routes/users";
import { stripeRoutes } from "./routes/stripe";
import { analyticsRoutes } from "./routes/analytics";
import { insightsRoutes } from "./routes/insights";
import { initializeDatabase } from "./database/init";

if (!process.env.CLERK_SECRET_KEY) {
  throw new Error('Missing CLERK_SECRET_KEY');
}

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3001"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use("/api", urlRoutes);
app.use("/api", userRoutes);
app.use("/api", stripeRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", insightsRoutes);

// Redirect route - MUST be after API routes
app.use("/", urlRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      throw new Error("Failed to initialize database");
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();