import {
  OrderCreatedEvent,
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@sumanth-ticketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}


