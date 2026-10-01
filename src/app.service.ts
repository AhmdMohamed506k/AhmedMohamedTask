import { Injectable } from '@nestjs/common';



@Injectable()
export class AppService {



  getHello(): string {
    return 'Welcome to Ahmed mohamed EasyGeneratorTask API!';
  }




}
