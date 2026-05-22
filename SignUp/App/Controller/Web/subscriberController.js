const modelSubscriber = require("../../Models/subscriber.Model.js");

const subscribeEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if email is provided
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // 2. Check if email already exists in subscribers collection
    const emailExist = await modelSubscriber.findOne({ email });
    if (emailExist) {
      return res.status(400).json({ 
        success: false, 
        message: "You are already a subscriber! ✨" 
      });
    }

    // 3. Save new email to database
    const newSubscriber = new modelSubscriber({ email });
    await newSubscriber.save();

    res.status(200).json({ 
      success: true, 
      message: "Subscribed successfully! 🎉 Thank you." 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server error, please try again later.", 
      error: error.message 
    });
  }
};

module.exports = { subscribeEmail };