require("dotenv").config({ debug: true });

const express = require("express");
const Joi = require("joi");
const { Client } = require("pg");
const { DataTypes, Model, Sequelize } = require("sequelize");

const generateId = require("./utils/generateID");
const findIndexById = require("./utils/findIndexById");
const filterByLogin = require("./utils/filterByLogin");

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
    allowNull: false
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
        max: 4,
        min: 130,
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
      res.status(404).send(error)
    });
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const _index = findIndexById(resource, id);

  res.send(resource[_index]);
});

app.post("/users", (req, res) => {
  const formData = req.body;
  const user = { uuid: generateId(), ...formData, isDeleted: false };
  const { value, error } = userSchema.validate(user);

  if (error) {
    return res.status(400).send(error.message);
  }

  resource.push({ uuid: generateId(), ...user, isDeleted: false });
  res.send("User added successfully!");
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const new_user = req.body;
  const _index = findIndexById(resource, id);
  const { value, error } = userSchema.validate(new_user);

  if (error) {
    return res.status(400).send(error.message);
  }

  resource.splice(_index, 1, { ...resource[_index], ...new_user });
  res.send("User update successfully!");
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const _index = findIndexById(resource, id);

  resource.splice(_index, 1, { ...resource[_index], isDeleted: true });
  res.send("User deleted successfully!");
});

app.get("/autosuggest", (req, res) => {
  const { limit, query } = req.body;

  res.send(filterByLogin(resource, query, limit));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
