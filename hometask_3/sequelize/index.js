const { Sequelize } = require("sequelize");
const InitDatabase = require("./create_database_init");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

/** Creat initial database */
InitDatabase(sequelize);

module.exports = sequelize;
