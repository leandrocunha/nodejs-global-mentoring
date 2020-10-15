require("dotenv").config({ debug: true });

const express = require("express");
const Joi = require("joi");
const { Client } = require("pg");
const { DataTypes, Model, Sequelize } = require("sequelize");

const app = express();
const port = process.env.PORT || 3000;

const userSchema = Joi.object({
  uuid: Joi.number().integer().required(),
  login: Joi.string().required(),
  password: Joi.string()
    .regex(
      new RegExp("[a-zA-Z0-9]{6,30}"),
      "your password should contain letters, numbers, min of 3 characters and max of 30"
    )
    .required(),
  age: Joi.number().integer().min(4).max(130).required(),
  isDeleted: Joi.boolean().required(),
});

/** for parsing application/json */
app.use(express.json());

/** for parsing application/x-www-form-urlencoded */
app.use(express.urlencoded({ extended: true }));

/** connect to database */
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

sequelize
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) => console.error("Unable to connect to the database:", error));

/** create Users table */
const queryInterface = sequelize.getQueryInterface();
queryInterface.createTable('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  uuid: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

/** Define User Modal */
const User = sequelize.define('User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /[a-zA-Z0-9]{6,30}/
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 4,
        max: 130,
      }
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    timestamps: false,
    tableName: 'User'
  }
);


app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/users", (req, res) => {
  User
    .findAll()
    .then(result => {
      res.send(result);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error)
    });
});

app.get("/users/:uuid", (req, res) => {
  const { uuid } = req.params;
  console.log(uuid);

  User
    .findOne({ where: { uuid } })
    .then(result => res.send(result))
    .catch(error => {
      console.log(error);
      res.status(500).send(error);
    })
});

app.post("/users", (req, res) => {
  const user = req.body;

  User
    .create({ ...user })
    .then(result => res.send(result))
    .catch(error => {
      console.log(error);
      res.status(500).send(error)
    });
});

app.put("/users/:uuid", (req, res) => {
  const { uuid } = req.params;
  const formData = req.body;

  User
    .update({ ...formData }, { where: { uuid } })
    .then(() => res.send("User updated successfully!"))
    .catch(error => {
      console.log(error);
      res.status(500).send(error)
    });
});

app.delete("/users/:uuid", (req, res) => {
  const { uuid } = req.params;
  
  User
    .destroy({ where: { uuid } })
    .then(() => res.send("User deleted successfully!"))
    .catch(error => res.status(500).send(error));
});

app.get("/autosuggest", (req, res) => {
  const { limit, query } = req.body;

  User
    .findAll({
      where: { login: { [Sequelize.Op.like]: `%${query}%` } },
      limit
    })
    .then(result => res.send(result))
    .catch(error => {
      console.log(error);
      res.status(500).send(error)
    });
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
