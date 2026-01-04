const User = require("../model/User");

exports.getUsers = async (req, res) => {
  res.json(await User.find().lean());
};

exports.getUserById = async (req, res) => {
  res.json(await User.findById(req.params.id));
};

exports.updateUser = async (req, res) => {
  const updated = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json({ message: "User updated successfully!", updated });
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
};
