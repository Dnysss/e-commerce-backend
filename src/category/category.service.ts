import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategory } from './dtos/create-category.dto';
import { ProductService } from 'src/product/product.service';
import { ReturnCategory } from './dtos/return-category.dto';
import { CountProduct } from 'src/product/dtos/count-product.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,
        private readonly productService: ProductService
    ) {}
    findAmountCategoryInProducts(category: CategoryEntity, countList: CountProduct[]): number {
        const count = countList.find((itemCount) => itemCount.category_id === category.id);

        if (count) {
            return count.total;
        }

        return 0;
    }
    async findAllCategories(): Promise<ReturnCategory[]> {
        const categories = await this.categoryRepository.find();

        const count = await this.productService.countProductsByCategory();

        if (!categories || categories.length === 0) {
            throw new NotFoundException('Categories empty');
        }

        return categories.map((category) => new ReturnCategory(category, this.findAmountCategoryInProducts(category, count)));
    }

    async findCategoryById(categoryId: number): Promise<CategoryEntity> {
        const category = await this.categoryRepository.findOne({
            where: {
                id: categoryId
            }
        })

        if (!category) {
            throw new NotFoundException(`Id da categoria: '${categoryId}' não foi encontrado`)
        }

        return category;
    }

    async findCategoryByName(name: string): Promise<CategoryEntity> {
        const category = await this.categoryRepository.findOne({
            where: {
                name
            }
        });

        if (!category) {
            throw new NotFoundException(`Nome da categoria '${name}' não encontrado`)
        }

        return category;
    }

    async createCategory(createCategory: CreateCategory): Promise<CategoryEntity> {
        const category = await this.findCategoryByName(createCategory.name).catch(() => (undefined));

        if (category) {
            throw new BadRequestException(`Nome da categoria '${createCategory.name}' já existe`)
        }

        return this.categoryRepository.save(createCategory);
    }
}
