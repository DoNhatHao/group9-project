// Temporary users array for testing
let users = [];

// Get all users
const getUsers = (req, res) => {
  res.json(users);
};

// Create a new user
const createUser = (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);
  res.status(201).json(newUser);
};

// Update a user
const updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const index = users.findIndex(u => u.id == id);
  
  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!name && !email) {
    return res.status(400).json({ message: "Name or email is required for update" });
  }

  users[index] = { 
    ...users[index], 
    ...(name && { name }), 
    ...(email && { email }) 
  };

  res.json(users[index]);
};

// Delete a user
const deleteUser = (req, res) => {
  const { id } = req.params;
  const initialLength = users.length;
  
  users = users.filter(u => u.id != id);
  
  if (users.length === initialLength) {
    return res.status(404).json({ message: "User not found" });
  }
  
  res.json({ message: "User deleted successfully" });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};