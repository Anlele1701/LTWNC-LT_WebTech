import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Component, OnDestroy, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { API } from 'src/app/services/API.service';
import { CartService } from 'src/app/services/cartService/cart.service';
import { cartItem } from 'src/app/services/cartService/cartItem.service';
import { UserServiceService } from 'src/app/services/userService/user-service.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {Subject, takeUntil} from "rxjs";


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};
interface ApiResponse {
  code: number;
  message:string;
}
@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css'],
  providers: [cartItem, API]
})
export class PurchaseComponent implements OnInit, OnDestroy{
  constructor(private userService:UserServiceService, private cartService: CartService, private router: Router, private http:HttpClient, private api:API, private _formBuilder: FormBuilder){}
  userInfo:any
  cartList:cartItem[]
  userOrder={
    id:'',
    hoten:'',
    sdt:'',
    address:'',
    ptTT: 'Thanh toán tiền mặt',
    tongSL: 0,
    tamTinh:0,
    tienKM:20000,
    thueVAT:0,
    tongTien:0,
  }
  orderForm: FormGroup
  ngUnsubscribe$ = new Subject<void>();
  getUserInfo()
  {
    this.userInfo=this.userService.getUser()
    this.userOrder.hoten=this.userInfo.hoTen
    this.userOrder.sdt=this.userInfo.sdt
    this.userOrder.id=this.userInfo._id
  }

  getCartList()
  {
    this.cartList=this.cartService.getCart()
  }

  getTamTinh(){
    this.userOrder.tamTinh=this.cartService.updateTongTien()
    this.userOrder.tongTien=this.userOrder.tamTinh
  }

  getTongSL(){
    this.userOrder.tongSL=this.cartService.updateTongSLMua()
  }

  thanhToan() {
    const tongtien = this.userOrder.tongTien;
    this.http.post<ApiResponse>('http://localhost:3800/donhang/thanhtoanvnpay', {amount: tongtien}, httpOptions)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        if (res.code == 200) {
          window.location.href = res.message;
          this.saveOrderToDB().subscribe({
            next: (data) => {
              if (data) {
                this.router.navigate(['/client/personal']);
                this.cartService.deleteAll();
              }
            },
            error: (err) => {
              console.error('Error saving order:', err);
            }
          });
        } else {
          console.log('Error:', res);
        }
      });
  }

  saveOrderToDB() {
    return this.http.post<ApiResponse>(this.api.getAPI() + '/donhang/muaHang', {userOrder: this.userOrder, cartList: this.cartList})
      .pipe(takeUntil(this.ngUnsubscribe$));
  }

  initForm():void {
    this.orderForm = this._formBuilder.group({
      tongTien: ['']
    })
}

  ngOnInit(): void {
      this.initForm()
      this.getUserInfo()
      this.getCartList()
      this.getTamTinh()
      this.getTongSL()
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
