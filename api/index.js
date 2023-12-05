import express from "express";
import Product from "../models/Product.js";
import Stripe from 'stripe';
import axios from 'axios';
import dotenv from "dotenv";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();
const slackWebhook = process.env.SLACK_WEBHOOK;

router.post('/webhook', async (req, res) => {
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
  router.post('/create-intent', async (req, res) => {
    console.log(req.body)
    const intent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'usd',
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {enabled: true},
    });
    res.json({client_secret: intent});
  });
  
  router.get("/products", async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  });
  
  router.post("/product", async (req, res) => {
    try {
      const product = await Product.create(req.body);
      res.status(200).json(product);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  });
  
  router.put("/product/:_id", async (req, res) => {
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
  
  
  router.delete("/product/:_id", async (req, res) => {
    const { _id } = req.params;
    try {
      const product = await Product.findByIdAndDelete(_id);
      res.status(200).json(product);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err });
    }
  });


export default router;

