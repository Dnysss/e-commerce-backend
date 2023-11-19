import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProductDTO } from './dtos/create-product.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private readonly productRepository: Repository<ProductEntity>,

        private readonly categoryService: CategoryService,
    ) {}

    async findAll(): Promise<ProductEntity[]> {
        const products = await this.productRepository.find();

        if (!products || products.length === 0) {
            throw new NotFoundException('Não foram encotrados produtos');
        }

        return products;
    }

    async createProduct(createProduct: CreateProductDTO): Promise<ProductEntity> {
        await this.categoryService.findCategoryById(createProduct.categoryId);

        return this.productRepository.save({
            ...createProduct
        })
    }
    
    async findProductById(productId: number): Promise<ProductEntity> {
        const product = await this.productRepository.findOne({
            where: {
                id: productId
            },
        });

        if (!product) {
            throw new NotFoundException(`Id do produto: '${productId}' não foi encontrado`);
        }

        return product;
    }

    async deleteProduct(productId: number): Promise<DeleteResult> {
        await this.findProductById(productId);

        return this.productRepository.delete({ id: productId });
    }
}
