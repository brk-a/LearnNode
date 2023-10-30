import { Body, Controller, Delete, Get, Param, Patch, Post} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Product } from "./products.model";

@Controller('products')
export class ProductsController{
    constructor(private readonly productsService: ProductsService){}
    @Post()
    async addProduct(
        @Body() completeBody: {title: string, description: string, price: number} 
    ): Promise<Product> {
        const product = await this.productsService.insertProduct(
            completeBody.title, completeBody.description, completeBody.price
        )

        return product
    }

    @Get()
    async getAllProducts(): Promise<Product[]>{
        const products = await this.productsService.getAllProducts()

        return products
    }

    @Get(":id")
    async getOneProduct(
        @Param('id') id: string
    ): Promise<Product>{
        const product = await this.productsService.getOneProduct(id)

        return product
    }
    
    @Patch(":id")
    async updateProduct(
        @Param('id') id: string, 
        @Body() completeBody: {title: string, description: string, price: number}
    ): Promise<Product>{
        const updatedProduct = await this.productsService.updateProduct(
            id, completeBody.title, completeBody.description, completeBody.price
        )

        return updatedProduct
    }

    @Delete(":id")
    async removeProduct(
        @Param('id') id: string
    ){
        const removedProduct = await this.productsService.removeProduct(id)

        return removedProduct
    }
}