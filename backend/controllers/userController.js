const User = require("../schemas/User");

const postUser = async (req, res) => {
  const { body } = req;
  const user = await User.findOne({ name: body.name, email: body.email });
  if (!user) {
    try {
      await User.create({
        name: body.name,
        email: body.email,
        _id: body.uid,
      });
      return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  } else {
    return res.status(400).json({ message: "User exists" });
  }
};

const changeKeywords = async (req, res) => {
  const { body } = req;
  User.findOneAndUpdate(
    { _id: body.uid },
    { $set: { keywords: body.keywords } },
    { new: true },
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Could not update keywords" });
      } else {
        return res.status(200).json({ message: "Updated keywords" });
      }
    }
  );
};

const changeInterval = async (req, res) => {
  const { body } = req;
  User.findOneAndUpdate(
    { _id: body.uid },
    { $set: { searchInterval: body.interval } },
    { new: true },
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Could not update interval", err });
      } else {
        return res.status(200).json({ message: "Updated interval" });
      }
    }
  );
};

const doesExist = async (req, res) => {
  const { uid } = req.body;
  const savedUser = await User.findOne({ id: uid });
  if (!savedUser) {
    return res.json({ message: false });
  } else {
    return res.json({ message: true });
  }
};

module.exports = { postUser, changeKeywords, changeInterval, doesExist };
