import { OrderCancelledEvent, Publisher, Subjects } from "@sumanth-ticketing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}