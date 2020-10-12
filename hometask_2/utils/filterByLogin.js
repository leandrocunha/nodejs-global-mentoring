const filterByLogin = (resource, str, limit = 3) => {
  const users = resource.filter((user) =>
    user.login.toLowerCase().includes(str)
  );

  users.sort((a, b) => (a.login > b.login ? 1 : b.login > a.login ? -1 : 0));

  return users.slice(0, limit);
};

module.exports = filterByLogin;
