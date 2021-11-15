import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from './product';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getProducts(): any {
    return this.http
      .get<{ [key: string]: Product }>(
        'https://eshop-d4997.firebaseio.com/products.json'
      )
      .pipe(
        map((resData) => {
          const postsArray: Product[] = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              postsArray.push({ ...resData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errResponse) => {
          return throwError(errResponse);
        })
      );
  }

  getProduct(id: string) {
    return this.http.get<Product>(
      `https://eshop-d4997.firebaseio.com/products/${id}.json/`
    );
  }

  addProduct(product) {
    return this.http.post<any>(
      `https://eshop-d4997.firebaseio.com/products.json`,
      product
    );
  }

  updateProduct(id: string, product) {
    return this.http.patch(
      `https://eshop-d4997.firebaseio.com/products/${id}.json/`,
      product
    );
  }

  deleteProduct(id: string) {
    this.http
      .delete(`https://eshop-d4997.firebaseio.com/products/${id}.json/`)
      .subscribe((res) => {
        this.getProducts();
      });
  }
}
