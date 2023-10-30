import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';

const MONGODB_USERNAME = process.env.MONGODB_USERNAME
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD

@Module({
  imports: [ProductsModule, MongooseModule.forRoot(`mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.vmxrkgp.mongodb.net/?retryWrites=true&w=majority`)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
