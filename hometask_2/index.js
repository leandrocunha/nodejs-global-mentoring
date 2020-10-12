const express = require("express");
const Joi = require("joi");
const generateId = require("./utils/generateID");
const findIndexById = require("./utils/findIndexById");
const filterByLogin = require("./utils/filterByLogin");

const app = express();
const port = 3000;

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

const resource = [];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/users", (req, res) => {
  res.send(resource);
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
