require("dotenv").config();

exports.adminAuth = (req, res, next) => {
  const adminKey = req.headers["x-admin-key"];

  if (!adminKey || adminKey !== process.env.MASTER_ADMIN_KEY) {
    return res.status(401).json({
      message: "Unauthorized: Invalid admin key",
    });
  }

  next();
};
