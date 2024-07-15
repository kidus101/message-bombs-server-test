import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import cors from "cors"; // Import cors

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/create-payment-intent", async (req, res) => {
  const { price, name } = req.body;
  const priceInCents = Math.floor(price * 100);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: name,
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://messagebombs.lol/success", // Customize with your URLs
    cancel_url: "https://messagebombs.lol/cancel",
  });
  res.json({ sessionId: session.id });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
