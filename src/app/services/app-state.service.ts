import { Injectable } from '@angular/core';
import {Product} from "../model/product.model";

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
public productState:any={
   products:[],
   keyword :"",
  totalPages:0,
  pageSize:3,
  currentPage:1,
  totalProduct:0,
  status:"",
  errorMessage:"",
};
  constructor() { }

  public  setProductState(state:any):void{
    //... ca veut dire copier tout les attributs
    this.productState={...this.productState,...state};
  }
}
