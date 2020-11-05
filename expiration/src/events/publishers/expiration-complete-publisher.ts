import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from "@sumanth-ticketing/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  readonly subject = Subjects.ExpirationComplete;
}
