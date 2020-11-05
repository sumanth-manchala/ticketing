import request from "supertest";
import { app } from "../../app";

it("responds with user details", async () => {
  const cookie = await global.signin();
  //console.log("Cookie: ", cookie);

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});
