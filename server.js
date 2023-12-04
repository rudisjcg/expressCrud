const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const axios = require("axios");
require("dotenv").config();
const cors = require("cors");
const app = express();

const mongoURI = process.env.MONGO_URI;
const slackWebhook = process.env.SLACK_WEBHOOK;


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello node Api");
});

app.post('/webhook', async (req, res) => {
  const data = req.body;

  console.log(data)

  //send the information to the webhooks of slack/discord
  if (data) {
   await sendToSlack(slackWebhook, data);
  }
  res.status(200).send("OK")

});

async function sendToSlack(webhookUrl, data) {
  const payload = {text: `Message for slack: ${data?.text} ${data?.name} ${data?.email} your job has been created with the id: 101238319`};
  console.log(payload)

  await axios.post(webhookUrl, payload)
  .then(response => {
    console.log(`Message sent to slack: ${response.status}`);
  })
  .catch(error => {
    console.log(`Error sending message to slack: ${error}`);
  });
};

//Stripe Payment Intent testing
app.post('/create-intent', async (req, res) => {
  console.log(req.body)
  const intent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'usd',
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {enabled: true},
  });
  res.json({client_secret: intent.client_secret});
});

app.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.post("/product", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.put("/product/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const product = await Product.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});


app.delete("/product/:_id", async (req, res) => {
  const { _id } = req.params;
  try {
    const product = await Product.findByIdAndDelete(_id);
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("connected to Mongo!, and app listening on port 3500, Ready to go!");
    app.listen(3500);
    
  })
  .catch((error) => {
    console.log("error connecting to Mongo", error);
  });

