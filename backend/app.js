import express from "express"
import { createServer } from "node:http"
import dotenv from "dotenv";

import mongoose from "mongoose"
import { connectToSocket } from "./controllers/socketManager.js"
import cors from "cors"

import userRoute from "./routes/users_routes.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

const PORT = process.env.PORT || 8000;

// CORS: In production, replace "*" with your frontend URL
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json({ limit: "40kb" }))
app.use(express.urlencoded({ limit: "40kb", extended: true }))

app.use("/api/v1/users", userRoute);

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", uptime: process.uptime() });
});

const start = async () => {
    try {
        const connectionDb = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB connected | Host: ${connectionDb.connection.host}`);

        server.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        process.exit(1);
    }
}

start();

// Graceful shutdown
process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down gracefully...");
    mongoose.connection.close();
    server.close(() => process.exit(0));
});
