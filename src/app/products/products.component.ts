import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ProductService} from "../services/product.service";
import {Product} from "../model/product.model";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {AppStateService} from "../services/app-state.service";



@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit{

  constructor(private productService:ProductService,
              private router:Router,
              public appState:AppStateService ) {
  }
  ngOnInit() {
   this.searchProducts();
  }
  searchProducts(){
    this.productService.searchProducts(this.appState.productState.keyword,this.appState.productState.currentPage,this.appState.productState.pageSize)
      .subscribe({
        next: (resp)=> {
          let products=resp.body as Product[];
          let totalProducts:number=parseInt(resp.headers.get('x-total-count')!);
          //this.appState.productState.totalProduct=totalProducts;
         let totalPages=Math.floor(totalProducts/this.appState.productState.pageSize);
         if(totalProducts % this.appState.productState.pageSize!=0){
           ++totalProducts;
          }
         this.appState.setProductState({
           products: products,
           totalPages:totalPages,
           totalProduct:totalProducts,
           status:"LOADED"
         })
        },
        error: err => {
          this.appState.setProductState({
            errorMessage:err,
            status:"ERROR"
          })
        }
      });

    //this.products$=this.productService.getProducts();
  }



  handleCheckProduct(product: Product) {
    this.productService.checkProduct(product).subscribe({
      next:updatedProduct => {
      product.checked=!product.checked
      }
    })
  }

  handleDelete(product: Product) {
    if(confirm("Are you sure ?"))
    this.productService.deleteProduct(product).subscribe({
      next: value => {
       //this.appState.productState.products=this.appState.productState.products.filter((p:any)=>p.id!=product.id)
        this.searchProducts();
      }
    });
  }


  handleGotoPage(page: number) {
    this.appState.productState.currentPage=page;
    this.searchProducts();
  }

  handleEdit(product: Product) {
  this.router.navigateByUrl("/editProduct/"+product.id)
  }
}
