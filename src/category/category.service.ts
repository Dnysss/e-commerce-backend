import { BadRequestException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CategoryEntity } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateCategory } from './dtos/create-category.dto';
import { ProductService } from '../product/product.service';
import { ReturnCategory } from './dtos/return-category.dto';
import { CountProduct } from '../product/dtos/count-product.dto';
import { UpdateCategory } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>,

        @Inject(forwardRef((() => ProductService)))
        private readonly productService: ProductService
    ) {}
    // Método auxiliar para encontrar a quantidade de categorias em produtos
    findAmountCategoryInProducts(category: CategoryEntity, countList: CountProduct[]): number {
        const count = countList.find((itemCount) => itemCount.category_id === category.id);

        if (count) {
            return count.total;
        }

        return 0;
    }
    // Método para obter todas as categorias com a quantidade de produtos em cada uma
    async findAllCategories(): Promise<ReturnCategory[]> {
        const categories = await this.categoryRepository.find();

        const count = await this.productService.countProductsByCategory();

        if (!categories || categories.length === 0) {
            throw new NotFoundException('Categories empty');
        }
        // Mapeia as categorias para objetos ReturnCategory incluindo a quantidade de produtos
        return categories.map((category) => new ReturnCategory(category, this.findAmountCategoryInProducts(category, count)));
    }
    // Método para encontrar uma categoria por ID, com ou sem relações
    async findCategoryById(categoryId: number, isRelations?: boolean): Promise<CategoryEntity> {
        const relations = isRelations ? {
            products: true,
        } : undefined

        const category = await this.categoryRepository.findOne({
            where: {
                id: categoryId
            }, relations
        })

        if (!category) {
            throw new NotFoundException(`Id da categoria: '${categoryId}' não foi encontrado`)
        }

        return category;
    }
    // Método para encontrar uma categoria pelo nome
    async findCategoryByName(name: string): Promise<CategoryEntity> {
        const category = await this.categoryRepository.findOne({
            where: {
                name
            }// Método auxiliar para encontrar a quantidade de categorias em produtos
        });

        if (!category) {
            throw new NotFoundException(`Nome da categoria '${name}' não encontrado`)
        }

        return category;
    }
    // Método para criar uma nova categoria
    async createCategory(createCategory: CreateCategory): Promise<CategoryEntity> {
        // Verifica se a categoria com o mesmo nome já existe
        const category = await this.findCategoryByName(createCategory.name).catch(() => (undefined));

        if (category) {
            throw new BadRequestException(`Nome da categoria '${createCategory.name}' já existe`)
        }
        // Salva a nova categoria no banco de dados
        return this.categoryRepository.save(createCategory);
    }

     // Método para deletar uma categoria por ID
    async deleteCategory(categoryId: number): Promise<DeleteResult> {
        const category = await this.findCategoryById(categoryId, true);
        // Verifica se a categoria tem produtos associados antes de deletar
        if (category.products?.length > 0) {
            throw new BadRequestException('Categoria com produtos')
        }
        // Deleta a categoria do banco de dados
        return this.categoryRepository.delete({ id: categoryId })
    }

    // Método para editar uma categoria por ID
    async editCategory(categoryId: number, updateCategory: UpdateCategory ): Promise<CategoryEntity> {
        const category = await this.findCategoryById(categoryId);

        return this.categoryRepository.save({
            ...category,
            ...updateCategory,
        })
    }
}
