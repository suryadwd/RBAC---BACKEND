const redis = require("redis");

// Create a Redis client with your cloud credentials
const redisClient = redis.createClient({
    username: "default",
     password: "FEIZyhYGjQC1IDMeZt0DugJuOFggAENq",
     socket: {
       host: "redis-19566.c52.us-east-1-4.ec2.redns.redis-cloud.com",
       port: 19566,
     }
   });

// Handle connection events
redisClient.on("connect", () => console.log(" Connected to Redis successfully!"));
redisClient.on("error", (err) => console.error(" Redis Connection Error:", err));

// Connect to Redis
redisClient.connect()
  .then(() => console.log(" Redis connection established!"))
  .catch((err) => console.log(" Redis connection failed:", err));

module.exports = redisClient;
