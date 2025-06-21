
const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    user.banned = true;
    user.banReason = reason;
    user.banDate = new Date();
    
    await user.save();

    await AdminLog.create({
      adminId: req.user._id,
      action: "BAN_USER",
      details: {
        targetUserId: userId,
        reason: reason
      }
    });

    res.json({ message: "User banned successfully." });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ message: "Error banning user.", error: error.message });
  }
};

module.exports = {
  banUser
}; 