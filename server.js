// Import necessary modules
import express from "express"; // Express for handling API requests
import Stripe from "stripe"; // Stripe for payment processing
import dotenv from "dotenv"; // Dotenv for loading environment variables
import cors from "cors"; // CORS middleware to enable cross-origin requests

// Load environment variables from .env file
dotenv.config();

// Initialize Stripe with the secret key from environment variables
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
// Initialize express application
const app = express();

// Middleware to enable CORS
app.use(cors());
// Middleware to parse JSON bodies
app.use(express.json());

// Route to create a payment intent
app.post("/api/create-payment-intent", async (req, res) => {
  // Extract price and name from the request body
  const { price, name } = req.body;
  // Convert price to cents as Stripe expects amounts to be in the smallest currency unit
  const priceInCents = Math.floor(price * 100);
  // Create a checkout session with Stripe
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"], // Specify payment method types
    line_items: [
      {
        price_data: {
          currency: "usd", // Set currency
          product_data: {
            name: name, // Set product name
          },
          unit_amount: priceInCents, // Set price
        },
        quantity: 1, // Set quantity
      },
    ],
    mode: "payment", // Set the mode to "payment" for one-time payments
    success_url: "https://messagebombs.lol/success", // URL to redirect to on successful payment
    cancel_url: "https://messagebombs.lol/cancel", // URL to redirect to if the payment is cancelled
  });
  // Respond with the session ID
  res.json({ sessionId: session.id });
});

app.get("/api/success", (req, res) => {
  res.send("Payment successful");
});

// Define the port to listen on, defaulting to 3001 if not specified in environment variables
const PORT = process.env.PORT || 3001;
// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`); // Log the listening port
});
