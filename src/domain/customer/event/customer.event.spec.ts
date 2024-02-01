import EventDispatcher from "../../@shared/event/event-dispatcher";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import EnviaConsoleLogHandler from "./handler/envia-console-log-handler";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1-handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2-handler";

describe("Customer Events unit tests", () => {

  it("should call notify event when a Customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler1 = new EnviaConsoleLog1Handler();
    const eventHandler2 = new EnviaConsoleLog2Handler();

    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

    const consoleSpy = jest.spyOn(console, 'log');

    eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(
      2
    );
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler2);

    const customer = Customer.create("1", "Cliente", eventDispatcher);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();

    const expectedMessage1 = "Esse é o primeiro console.log do evento: CustomerCreated"
    const expectedMessage2 = "Esse é o segundo console.log do evento: CustomerCreated"

    expect(consoleSpy).toHaveBeenCalledWith(expectedMessage1);
    expect(consoleSpy).toHaveBeenCalledWith(expectedMessage2);
  });

  it("should call notify event when a Customer Address is changed", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new EnviaConsoleLogHandler();

    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    const consoleSpy = jest.spyOn(console, 'log');

    eventDispatcher.register("CustomerChangedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedEvent"][0]
    ).toMatchObject(eventHandler);

    const customer = Customer.create("1", "Cliente");
    const address = new Address('Rua Abc', 123, "00000-000", 'Santos');
    customer.changeAddress(address, eventDispatcher)

    expect(spyEventHandler).toHaveBeenCalled();

    const expectedMessage = "Endereço do cliente: 1, Cliente alterado para: Rua Rua Abc, número 123, zip 00000-000, cidade Santos"

    expect(consoleSpy).toHaveBeenCalledWith(expectedMessage);
  });
})
