import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../../models/ticket";

it("returns a 404 if ticket id not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "Concert II",
      price: 40,
    })
    .expect(404);
});

it("returns a 401 if user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "Concert II",
      price: 40,
    })
    .expect(401);
});

it("returns a 401 if user is not same as the one who created the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", global.signin())
    .send({
      title: "Concert II",
      price: 40,
    })
    .expect(201);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin()) //Random Id generated for every request
    .send({ title: "Concert III", price: 50 })
    .expect(401);
});

it("returns a 400 if invalid update details are provided", async () => {
  const userCookie = global.signin(); //To use same cookie for subsequent requests
  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", userCookie)
    .send({
      title: "Concert II",
      price: 40,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userCookie)
    .send({
      title: "",
      price: 40,
    })
    .expect(400);
});

it("returns a 201 if valid update details are provided", async () => {
  const userCookie = global.signin(); //To use same cookie for subsequent requests
  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", userCookie)
    .send({
      title: "Concert II",
      price: 40,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userCookie)
    .send({
      title: "Concert III",
      price: 40,
    })
    .expect(200);

  const updatedResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);

  expect(updatedResponse.body.title).toEqual("Concert III");
  expect(updatedResponse.body.price).toEqual(40);
});

it("publishes an event", async () => {
  const userCookie = global.signin(); //To use same cookie for subsequent requests
  const response = await request(app)
    .post(`/api/tickets/`)
    .set("Cookie", userCookie)
    .send({
      title: "Concert II",
      price: 40,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", userCookie)
    .send({
      title: "Concert III", 
      price: 40,
    })
    .expect(200);

  const updatedResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });

  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(400);
});