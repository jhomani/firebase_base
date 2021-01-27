import mongoose from "mongoose";

type interfaceDatabase = {
  db: string;
};

export default ({ db }: interfaceDatabase) => {
  const connect = () => {
    mongoose
      .connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
      .then(() => {
        return console.info(`Successfully connected to ${db}`);
      })
      .catch((error) => {
        console.error("Error connecting to database: ", error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on("disconnected", connect);
};
