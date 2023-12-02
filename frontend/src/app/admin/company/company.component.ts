import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, flatMap } from 'rxjs';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['../shared/AdminIndex.css'],
})
export class CompanyComponent implements OnInit {
  stringLoaiSP: string = '';
  constructor(private http: HttpClient) {}
  brandName: string = '';
  brandList: any[] = [];
  deleted: boolean;
  notdelted: boolean;
  brandList$: Observable<any[]>;

  readonly API = 'http://localhost:3800';
  createNewBrand() {
    this.http
    .post(this.API + '/hang/createNewHang', { tenHang: this.brandName })
    .pipe(
    flatMap(async () => this.showAllBrand())
    )
    .subscribe((data: any) => {this.showAllBrand()
    });
    }
  showAllBrand() {
    const brandListSubject = new BehaviorSubject<any[]>([]);
    this.http.get(this.API + '/hang/getAllHang').subscribe((data: any) => {
      brandListSubject.next(data);
    });
    this.brandList$ = brandListSubject.asObservable();
  }
  deleteBrand(idSP) {
    this.http
      .delete(this.API + '/hang/delete/' + idSP)
      .subscribe((data: any) => {
        if (data.status) {
          this.showAllBrand();
          this.deleted = true;
        } else {
          console.log(data.status);
          this.notdelted = true;
        }
      });
  }
  ngOnInit(): void {
    this.showAllBrand();
  }
  // FUNCTIONS
  AddFormVisible: boolean = false;

  toggleAddForm() {
    this.AddFormVisible = !this.AddFormVisible;
  }
  hideAddForm() {
    this.AddFormVisible = false;
  }
  returnStringLoaiSP(itemHang) {
    this.stringLoaiSP = '';
    itemHang.forEach((item) => {
      this.stringLoaiSP = this.stringLoaiSP + item + ', ';
    });
    return this.stringLoaiSP;
  }
}
