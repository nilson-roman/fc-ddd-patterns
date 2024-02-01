import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangedEvent from "../customer-changed.event";

export default class EnviaConsoleLogHandler
  implements EventHandlerInterface<CustomerChangedEvent>
{
  handle(event: CustomerChangedEvent): void {
    const id = event.eventData.id;
    const name = event.eventData.name;
    const address = event.eventData.address;
    const { street, number, zip, city } = address;
    const addressFormatted = `Rua ${street}, número ${number}, zip ${zip}, cidade ${city}`
    console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${addressFormatted}`); 
  }
}
