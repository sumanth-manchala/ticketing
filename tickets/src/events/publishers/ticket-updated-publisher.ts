import { Publisher, Subjects, TicketUpdatedEvent } from "@sumanth-ticketing/common";


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  readonly subject = Subjects.TicketUpdated
}