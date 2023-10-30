import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product } from "./products.model";
// import {v4 as uuidv4} from "uuid";
import { Model } from "mongoose";

@Injectable()
export class ProductsService{

    constructor(@InjectModel("Product") private readonly productModel: Model<Product>){}

    async insertProduct(
        title: string,
        description: string,
        price: number
    ): Promise<Product>{
        const createProduct = new this.productModel({title, description, price})
        const newProduct = await createProduct.save()

        return newProduct
    }

    async getAllProducts(): Promise<Product[]>{
        const products = await this.productModel.find().exec()
        // const allProducts = products.map(prod => ({
        //     id: prod.id,
        //     title: prod.title,
        //     description: prod.description,
        //     price: prod.price
        // }))
        // return allProducts
        return products
    }

    async getOneProduct(id: string): Promise<Product>{
        const product = await this.findProduct(id)

        // return {
        //     id: product.id,
        //     title: product.title,
        //     description: product.description,
        //     price: product.price
        // }
        return product
    }

    async updateProduct(
            id: string,
            title: string,
            description: string,
            price: number
        ): Promise<Product>{
        const updatedProduct = await this.findProduct(id)
        if(title){
            updatedProduct.title = title
        }
        if(description){
            updatedProduct.description = description
        }
        if(price){
            updatedProduct.price = price
        }
        updatedProduct.save()
        
        return updatedProduct
    }

    async removeProduct(id: string){
        const deletedProduct = await this.productModel.deleteOne({_id: id}).exec()
        if (deletedProduct.n===0){
            throw new NotFoundException("The entity was not found")
        }
    }

    private async findProduct(id: string): Promise<Product>{
        let product;
        try {
            product = await this.productModel.findById(id).exec()
        } catch (error) {
            throw new NotFoundException("Cannot find product")
        }
        if(!product){
            throw new NotFoundException("Cannot find product")
        }

        return product
    }
}