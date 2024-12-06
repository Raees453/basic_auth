const app = require('./src/app.js');
const connectDB = require('./src/db');

const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  await connectDB();

  console.log(`Server is running on port ${PORT}`);
});
