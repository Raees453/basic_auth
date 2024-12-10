const app = require('./src/app.js');
const { connectDB, disconnectDB } = require('./src/db');

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, '0.0.0.0', async () => {
  await connectDB();

  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown function
async function gracefulShutdown() {
  server.close(async (err) => {
    if (err) {
      console.error('Error closing server:', err);

      process.exit(1);
    }

    await disconnectDB();
  });
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
