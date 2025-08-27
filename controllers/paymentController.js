const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const secret = (process.env.STRIPE_SECRET_KEY || "").trim();
  if (!secret) {
    return res
      .status(500)
      .json({ success: false, message: "Stripe secret key not configured" });
  }

  const stripe = require("stripe")(secret);

  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  const publishable = (process.env.STRIPE_API_KEY || "").trim();
  if (!publishable) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Stripe publishable key not configured",
      });
  }
  res.status(200).json({ stripeApiKey: publishable });
});
