import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

const MONGODB_USERNAME = process.env.MONGODB_USERNAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME

@Module({
  imports: [ProductsModule, MongooseModule.forRoot(`mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.vmxrkgp.mongodb.net/${MONGODB_DB_NAME}?retryWrites=true&w=majority`)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
