const User = require('../models/User');

const PLANS = {
  monthly: { price: 99, duration: 30 },
  yearly: { price: 799, duration: 365 }
};

// @desc    Get subscription plans
// @route   GET /api/subscriptions/plans
const getPlans = async (req, res) => {
  res.json({
    success: true,
    plans: [
      {
        id: 'monthly',
        name: 'Monthly',
        price: PLANS.monthly.price,
        currency: 'INR',
        duration: '1 Month',
        features: ['Access to all Premium templates', 'HD Downloads', 'No watermarks', 'Priority support']
      },
      {
        id: 'yearly',
        name: 'Yearly',
        price: PLANS.yearly.price,
        currency: 'INR',
        duration: '1 Year',
        popular: true,
        features: ['Everything in Monthly', 'Save 33%', 'Exclusive templates', 'Early access to new features']
      }
    ]
  });
};

// @desc    Activate subscription (mock payment)
// @route   POST /api/subscriptions/activate
const activateSubscription = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!PLANS[plan]) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + PLANS[plan].duration);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        isPremium: true,
        premiumExpiry: endDate,
        subscription: {
          plan,
          startDate,
          endDate,
          transactionId: `TXN_${Date.now()}`
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: `${plan} subscription activated successfully!`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        isPremium: true,
        subscription: user.subscription
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get subscription status
// @route   GET /api/subscriptions/status
const getStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      isPremium: user.hasPremium(),
      subscription: user.subscription,
      premiumExpiry: user.premiumExpiry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPlans, activateSubscription, getStatus };
