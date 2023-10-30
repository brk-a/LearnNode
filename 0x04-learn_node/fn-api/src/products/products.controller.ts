import { Body, Controller, Get, Param, Patch, Post} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { Product } from "./products.model";

@Controller('products')
export class ProductsController{
    constructor(private readonly productsService: ProductsService){}
    @Post()
    addProduct(
        @Body() completeBody: {title: string, description: string, price: number} 
    ): Product {
        const product = this.productsService.insertProduct(
            completeBody.title, completeBody.description, completeBody.price
        )

        return product
    }

    @Get()
    getAllProducts(): Product[]{
        const products = this.productsService.getAllProducts()

        return products
    }

    @Get(":id")
    getOneProduct(
        @Param() id: string
    ): Product{
        const product = this.productsService.getOneProduct(id)

        return product
    }
    
    @Patch(":id")
    updateProduct(
        @Param() id: string, 
        @Body() completeBody: {title: string, description: string, price: number}
    ){}
}