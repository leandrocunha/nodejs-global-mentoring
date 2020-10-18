const UserModel = require("../models/User");

const listAll = (req, res) => {
  UserModel.findAll()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
};

const get = (req, res) => {
  const { uuid } = req.params;

  UserModel.findOne({ where: { uuid } })
    .then((result) => res.send(result))
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
};

const create = (req, res) => {
  const user = req.body;

  UserModel.create({ ...user })
    .then((result) => res.send(result))
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
};

const update = (req, res) => {
  const { uuid } = req.params;
  const formData = req.body;

  UserModel.update({ ...formData }, { where: { uuid } })
    .then(() => res.send("User updated successfully!"))
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
};

const remove = (req, res) => {
  const { uuid } = req.params;

  UserModel.destroy({ where: { uuid } })
    .then(() => res.send("User deleted successfully!"))
    .catch((error) => res.status(500).send(error));
};

module.exports = { listAll, get, create, update, remove };
