import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartProductEntity } from './entities/cart-product.entity';
import { Repository } from 'typeorm';
import { InsertCartDTO } from 'src/cart/dtos/insert-cart.dto';
import { CartEntity } from 'src/cart/entities/cart.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class CartProductService {
    constructor(
        @InjectRepository(CartProductEntity)
        private readonly cartProductRepository: Repository<CartProductEntity>,
        private readonly productService: ProductService,
    ) {}

    async verifyProductInCart(productId: number, cartId: number): Promise<CartProductEntity> {
        const cartProduct = await this.cartProductRepository.findOne({
            where: {
                productId,
                cartId
            }
        });

        if(!cartProduct) {
            throw new NotFoundException("Produto não existe no carrinho")
        }

        return cartProduct;
    }

    async createProdcutInCart(insertCartDTO: InsertCartDTO, cartId: number): Promise<CartProductEntity> {
        return this.cartProductRepository.save({
            amount: insertCartDTO.amount,
            productId: insertCartDTO.productId,
            cartId
        });
    }

    async insertProductInCart(insertCartDTO: InsertCartDTO, cart: CartEntity): Promise<CartProductEntity> {
        await this.productService.findProductById(insertCartDTO.productId);
        const cartProduct = await this.verifyProductInCart(insertCartDTO.productId, cart.id).catch(() => undefined);

        if (!cartProduct) {
            return this.createProdcutInCart(insertCartDTO, cart.id);
        }

        return this.cartProductRepository.save({
            ...cartProduct,
            amount: cartProduct.amount + insertCartDTO.amount
        });
    }
}
