import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateOrderDTO } from 'src/order/dtos/create-order.dto';
import { PaymentCreditCardEntity } from './entities/payment-credit-card.entity';
import { PaymentType } from 'src/payment-status/enum/payment-type.enum';
import { PaymentPixEntity } from './entities/payment-pix.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { CartProductEntity } from 'src/cart-product/entities/cart-product.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentRepository: Repository<PaymentEntity>,
  ) {}

  async createPayment(
    createOrderDTO: CreateOrderDTO,
    products: ProductEntity[],
    cart: CartEntity,
  ): Promise<PaymentEntity> {

    const finalPrice = cart.cartProduct?.map((cartProduct: CartProductEntity) => {
        const product = products.find((product) => product.id === cartProduct.productId);

        if (product) {
            return cartProduct.amount * product.price;
        }
        return 0;
  }).reduce((accumulator, currentValue) => accumulator + currentValue, 0)

    if (createOrderDTO.amountPayments) {
      const paymentCreditCart = new PaymentCreditCardEntity(
        PaymentType.Done,
        0,
        0,
        finalPrice,
        createOrderDTO,
      );

      return this.paymentRepository.save(paymentCreditCart);
    } else if (createOrderDTO.codePix && createOrderDTO.datePayment) {
      const paymentPix = new PaymentPixEntity(
        PaymentType.Done,
        0,
        0,
        finalPrice,
        createOrderDTO,
      );

      return this.paymentRepository.save(paymentPix);
    }

    throw new BadRequestException(
      'Pagamento, pix ou data de pagamento não encontrado',
    );
  }
}
