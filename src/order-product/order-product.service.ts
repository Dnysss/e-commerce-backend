import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderProductEntity } from './entities/order-product.entity';
import { Repository } from 'typeorm';
import { ReturnGroupOrderDTO } from './dtos/return-group-order.dto';

@Injectable()
export class OrderProductService {
  constructor(
    @InjectRepository(OrderProductEntity)
    private readonly orderProductRepository: Repository<OrderProductEntity>,
  ) {}
// Método para criar uma nova entrada de produto para um pedido
  async createOrderProduct(
    productId: number,
    orderId: number,
    price: number,
    amount: number,
  ): Promise<OrderProductEntity> {
    // Salva a nova entrada de produto no banco de dados
    return this.orderProductRepository.save({
      amount,
      orderId,
      price,
      productId,
    });
  }
// Método para encontrar a quantidade de produtos em cada pedido
  async findAmountProductsByOrderId(orderId: number[]): Promise<ReturnGroupOrderDTO[]> {
    // Utiliza uma consulta do TypeORM para contar a quantidade de produtos em cada pedido
    return this.orderProductRepository
      .createQueryBuilder('order_product')
      .select('order_product.order_id, COUNT(*) as total')
      .where('order_product.order_id IN (:...ids)', { ids: orderId })
      .groupBy('order_product.order_id')
      .getRawMany();
  }
}
