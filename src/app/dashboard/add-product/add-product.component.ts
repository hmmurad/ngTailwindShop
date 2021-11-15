import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  id;
  editMode: boolean = false;
  constructor(
    private dashboardService: DashboardService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private loc: Location
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.editMode = params['id'] != null;
      console.log(this.id);
      if (this.editMode) {
        this.dashboardService.getProduct(this.id).subscribe((res) => {
          this.productForm.setValue({
            title: res.title,
            price: res.price,
            category: res.category,
            imageUrl: res.imageUrl,
          });
        });
      }
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log(this.productForm.value);
      if (this.editMode) {
        this.dashboardService
          .updateProduct(this.id, this.productForm.value)
          .subscribe((res) => {
            console.log('Updated Data: ', res);
            this.router.navigate(['/']);
          });
      } else {
        this.dashboardService
          .addProduct(this.productForm.value)
          .subscribe((res) => {
            console.log('new data : ', res);
            this.router.navigate(['/']);
          });
      }
    }
  }

  initForm() {
    this.productForm = this.fb.group({
      title: [''],
      imageUrl: [''],
      price: [''],
      category: [''],
    });
  }

  onBack() {
    this.loc.back();
  }
}
