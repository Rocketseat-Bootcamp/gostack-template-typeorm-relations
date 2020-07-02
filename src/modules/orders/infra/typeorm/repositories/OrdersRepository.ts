import { getRepository, Repository } from 'typeorm';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import ICreateOrderDTO from '@modules/orders/dtos/ICreateOrderDTO';
import Order from '../entities/Order';
import OrdersProducts from '../entities/OrdersProducts';

class OrdersRepository implements IOrdersRepository {
  private ormRepository: Repository<Order>;
  private ormProductsRepository: Repository<OrdersProducts>;

  constructor() {
    this.ormRepository = getRepository(Order);
    this.ormProductsRepository = getRepository(OrdersProducts);
  }

  public async create({ customer, products }: ICreateOrderDTO): Promise<Order> {
    const order = this.ormRepository.create({
      customer,
      order_products: products,
    });

    await this.ormRepository.save(order);

    const orders_products: OrdersProducts[] = [];
    products.forEach(product => {
      const item = this.ormProductsRepository.create({
        order_id: order.id,
        product_id: product.product_id,
        price: product.price,
        quantity: product.quantity
      })

      orders_products.push(item);
    })

    await this.ormProductsRepository.save(orders_products);
    return order;
  }

  public async findById(id: string): Promise<Order | undefined> {
    const order = await this.ormRepository.findOne(id, {
      relations: ['order_products', 'customer'],
    });

    return order;
  }
}

export default OrdersRepository;
