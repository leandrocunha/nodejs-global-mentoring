const { Sequelize } = require("sequelize");
const UserModel = require("../models/User");

const autosuggest = (req, res) => {
    const { limit, query } = req.body;
  
    UserModel
      .findAll({
        where: {
          login: {
            [Sequelize.Op.like]: `%${query}%` 
          }
        },
        limit
      })
      .then(result => {
        res.send(result)
      })
      .catch(error => {
        console.log(error);
        res.status(500).send(error)
      });
  };

  module.exports = { autosuggest };