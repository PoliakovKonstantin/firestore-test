import { Controller, Delete, Get, Post, Put, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as admin from "firebase-admin"
import * as dotenv from "dotenv";
import * as serviceAccount from "./firestore-test-18de9-firebase-adminsdk-bjyxb-acd9ad198c.json"
import { request, response } from 'express';
dotenv.config({ path: 'C:/firestore-test/firestore-test/src/url.env'})

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
    databaseURL: process.env.database_url
  });
const db=admin.firestore()
console.log('ok')
@Controller()
export class AppController {
  @Get('api/books')
  async getBooks(@Res() response): Promise<any> {
    var books=await db.collection('books').get();
    let arr=[]
    ;(await books).forEach(element => {
      console.log(element.id+":",element.data())
      arr.push(element.data())
      
    });
    response.send(arr)
  }
  @Get('api/books/:id')
  async getBook(@Req() request,@Res() response){
    const {id}=request.params
    const finder=db.collection('books').doc(id)
    const doc=await finder.get()
    if(doc.exists) {response.send(doc.data())}
    else {
      console.log('not found')
      response.status(404).send('Not found')}
  }
  @Post('api/books')
  async createBook(@Req() request,@Res() response, body:any) {
    const doc=await db.collection('books').add(request.body)
    response.send([doc.id,request.body])
  }
  @Put('api/books/:id')
  async putBook(@Req() request,@Res() response) {
    const {id}=request.params
    const finder=db.collection('books').doc(id)
    var doc=await finder.get()
    if(doc.exists) {finder.update(request.body)}
    else{response.status(404).send('Not found')}
  }
  @Delete('api/books/:id')
  async deleteBook(@Req() request,@Res() response){
    const {id}=request.params
    db.collection('books').doc(id).delete();
    response.send('Книга успешно удалена!')
  }
}
