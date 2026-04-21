require("dotenv").config();

const { app } = require("./src/app");
const { connectToDatabase } = require("./src/config/database");
const { startReminderEngine } = require("./src/services/reminderService");

const PORT = Number(process.env.PORT || 4000);

async function bootstrap() {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Healthcare medication tracker API listening on port ${PORT}`);
  });

  startReminderEngine();
}

bootstrap().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
