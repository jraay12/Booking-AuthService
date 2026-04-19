import app from "./app";
import { connectRedis } from "./utils/redis";

const PORT = Number(process.env.PORT) || 8000;

const startServer = async () => {
  try {
    
    await connectRedis();

    
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server listening on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();