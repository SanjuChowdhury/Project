const catchAsyncError = require("../middleware/catchAsyncError");
const dotenv=require("dotenv");

const stripe = require("stripe")("sk_test_51MEWlCSBl6NKORhQVxvI9e5ymUjUZDQReMFtIgo6LsJA5ASoLFqtz4IhbOo7WDvD4httItIAfZ731mijAKBjeRw4004yUTqgtc");

exports.processPayment = catchAsyncError(async (req, res, next) => {
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

exports.sendStripeApiKey = catchAsyncError(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: "pk_test_51MEWlCSBl6NKORhQYsh4Qcz1MajO2me64SJJwH8eyB6MXe97wI8czIWHkOveuuloQKAajUO3fzhjaPYXF7YtPMxJ001fZZnuS6"});
});