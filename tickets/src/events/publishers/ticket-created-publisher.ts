import { Publisher, Subjects, TicketCreatedEvent } from "@sumanth-ticketing/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject = Subjects.TicketCreated
}