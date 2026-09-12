// In-memory User Store
const users = [];

const User = {
  create: (user) => {
    const newUser = { id: Date.now().toString(), ...user, createdAt: new Date() };
    users.push(newUser);
    return newUser;
  },
  findByEmail: (email) => {
    return users.find((user) => user.email === email);
  },
  findById: (id) => {
    return users.find((user) => user.id === id);
  }
};

module.exports = User;
