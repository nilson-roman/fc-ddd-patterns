import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total()
      },
      {
        where: {
          id: entity.id,
        }
      }
    );

    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
      },
      {
        where: {
          id: entity.id,
        }
      }
    );

    entity.items.map((item) =>
      OrderItemModel.update(
        {
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        },
        {
          where: {
            id: item.id,
          }
        }
      )
    )
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({ where: { id }, include: ["items"] });

    if (orderModel) {

      const items = orderModel.items.map((item) => (
        new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
      ))

      const order = new Order(orderModel.id, orderModel.customer_id, items)
      return order;
    }

    throw new Error("Order not find.");
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: ["items"] });

    if (orderModels && orderModels.length > 0) {
      const orders = orderModels.map((orderModel) => {
        const items = orderModel.items.map((item) => (
          new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
        ));
        return new Order(orderModel.id, orderModel.customer_id, items);
      });

      return orders;
    }
    
    throw new Error("No orders found.");
  }
}
