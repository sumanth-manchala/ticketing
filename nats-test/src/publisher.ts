import nats, { Stan } from "node-nats-streaming";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://127.0.0.1:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected");

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  });

  stan.publish("ticket:created", data, () => {
    console.log("Event Published");
  });
});

