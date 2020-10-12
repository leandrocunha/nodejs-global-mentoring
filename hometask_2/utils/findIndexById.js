const findIndexById = (arr, id) =>
  arr.findIndex((user) => user.uuid === Number(id));

module.exports = findIndexById;
