import { Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "./products.model";
import {v4 as uuidv4} from "uuid";

@Injectable()
export class ProductsService{
    private products: Product[] = []

    insertProduct(
        title: string,
        description: string,
        price: number
    ): Product{
        const newProduct = new Product(uuidv4(), title, description, price)
        this.products.push(newProduct)

        return newProduct
    }

    getAllProducts(): Product[]{
        return [...this.products]
    }

    getOneProduct(id: string): Product{
        const product = this.findProduct(id)[0]

        return {...product}
    }

    updateProduct(
            id: string,
            title: string,
            description: string,
            price: number
        ): Product{
        const [product, index] = this.findProduct(id)
        const updatedProduct = {...product}
        if(title){
            updatedProduct.title = title
        }
        if(description){
            updatedProduct.description = description
        }
        if(price){
            updatedProduct.price = price
        }
        
        return updatedProduct
    }

    removeProduct(id: string): Product{
        const [deletedProduct, productIndex] = this.findProduct(id)
        // this.products.filter(prod => prod.id !== id) //works too
        this.products.splice(productIndex, 1)

        return deletedProduct
    }

    private findProduct(id: string): [Product, number]{
        const productIndex = this.products.findIndex(obj => obj.id===id)
        const product = this.products[productIndex]
        if(!product){
            throw new NotFoundException("Cannot find product")
        }

        return [product, productIndex]
    }
}