import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategory } from './dtos/create-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>
    ) {}

    async findAllCategories(): Promise<CategoryEntity[]> {
        const categories = await this.categoryRepository.find();

        if (!categories || categories.length === 0) {
            throw new NotFoundException('Categories empty');
        }

        return categories;
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
