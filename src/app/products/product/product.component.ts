import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/product.service';
import { NotificationService } from 'src/app/shared/notification.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(public productService : ProductService,
    private notificationService : NotificationService,
    public dialogRef: MatDialogRef<ProductComponent>
    ) { }


  types = [
    {id:1, value:'Fruit'},
    {id:2, value:'Légume'},
    {id:3, value:'Fleur/Plante'},
    {id:4, value:'Terreau'},
    {id:4, value:'Jus de Fruit'}  
  ]


  ngOnInit() {
    this.productService.getProducts();
  }

  onClear(){
    this.productService.form.reset();
    this.productService.initializeFormGroup();
  }

  onSubmit(){
    if (this.productService.form.valid){
      if(!this.productService.form.get('$key').value)
        this.productService.insertProduct(this.productService.form.value);
      else
        this.productService.updateProduct(this.productService.form.value);

      this.productService.form.reset();
      this.productService.initializeFormGroup();
      this.notificationService.success('Submitted successfully');
      this.onClose();
    }
  }
  
  onClose() {
    this.productService.form.reset();
    this.productService.initializeFormGroup();
    this.dialogRef.close();
  }
}
