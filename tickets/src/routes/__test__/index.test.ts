import request from "supertest";
import { app } from "../../app";


const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "Dummy",
      price: 20,
    })
    .expect(201);
};
it("retrieves all the tickets", async () => {
  await createTicket();
  await createTicket();

  const response = await request(app).get("/api/tickets").expect(200);

  expect(response.body.length).toEqual(2);
});
