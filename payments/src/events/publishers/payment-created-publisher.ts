import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from "@sumanth-ticketing/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
