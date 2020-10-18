require("dotenv").config({ debug: true });

const express = require("express");
const sequelize = require("./sequelize");
const UserRoutes = require("./routers/users");
const AutoSuggestRoutes = require("./routers/autosuggest");

const app = express();
const port = process.env.PORT || 3000;

/** for parsing application/json */
app.use(express.json());

/** for parsing application/x-www-form-urlencoded */
app.use(express.urlencoded({ extended: true }));

/** connect to database */
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

/** start define routes */
app.use("/users", UserRoutes);
app.use("/autosuggest", AutoSuggestRoutes);

app.get("*", (req, res) => {
  res.send("Hello world!");
});

/** start server */
app.listen(port, () => console.log(`Server listening on port ${port}`));
