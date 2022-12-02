const Stripe = require("stripe");
const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT;
const YOUR_DOMAIN = process.env.FRONTEND_URL;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {
    try{
        const params = {
          line_items: req.body.map((item) => {
            return {
              price_data: {
                currency: "pkr",
                unit_amount: item.price * 100,
                product_data: {
                  name: item.title,
                  images: [item.imgURL],
                }
              },
              adjustable_quantity: {
                enabled: true,
                minimum: 1,
              },
              quantity: item.qty,
            };
          }),
          mode: 'payment',
          payment_method_types: ["card"],
          billing_address_collection: "auto",
          shipping_options: [{ shipping_rate: process.env.SHIPPING_RATE }],
          success_url: `${YOUR_DOMAIN}?success=true`,
          cancel_url: `${YOUR_DOMAIN}?canceled=true`,
        }
          const session = await stripe.checkout.sessions.create(params);
          res.status(200).json(session.id)
        //   res.redirect(303, session.url);
    }catch(err){
        res.status(err.statusCode || 500).json(err.message);
    }
 
});

app.listen(PORT, () => console.log("Running on port " + PORT));
