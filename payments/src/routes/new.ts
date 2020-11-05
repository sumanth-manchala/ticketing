import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@sumanth-ticketing/common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { Order } from "../models/order";
import { Payment } from "../models/payment";
import { natsWrapper } from "../nats-wrapper";
import { stripe } from "../stripe";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("Cannot pay for cancelled order");
    }
    try {
      // const charge = await stripe.charges.create({     //Stripe apis changed
      //   currency: "usd",
      //   amount: order.price * 100,
      //   source: token,
      //   description: "Software development services"
      // });

      const charge = {
        id: "dummy_charge_id",
      };
      const payment = Payment.build({
        orderId: order.id,
        stripeId: charge.id,
      });

      await payment.save();
      new PaymentCreatedPublisher(natsWrapper.client).publish({
        orderId: payment.orderId,
        stripeId: payment.stripeId,
        id: payment.id,
      });

      res.status(201).send({ id: payment.id });
    } catch (err) {
      console.log(err.message);
      res.status(400).send(err.message);
    }
  }
);

export { router as createChargeRouter };
