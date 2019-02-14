import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productList : AngularFireList<any>;


  constructor( private firebaseDB : AngularFireDatabase) { }

// form is a property of type FormGroup , we initialaize it with  the costructor of Form group
//inside that we must provide an {OBJECT} containing FormControls
// first FormControl is $Key property(use as primaryKey => is a unique identifie of each product record from the collection)
//in order to use this formGroup property in other components classes we have to inject this SerieService in app.module.ts
  form: FormGroup = new FormGroup({
    $key : new FormControl(null),//primaryKey hidden
    code :  new FormControl('', Validators.required),
    nom :  new FormControl('', Validators.required),
    type : new FormControl(''),//selectControl dropdownList
    gamme :  new FormControl(''),//radioButton
    mesure :  new FormControl(''),//radioButton
    imageUrl: new FormControl(''),
    enStock:  new FormControl(false)//checkBox
  });


  initializeFormGroup(){
    this.form.setValue({
      $key : null,
      code : '',
      nom : '',
      type :'',
      gamme : '',
      mesure : '',
      imageUrl:'',
      enStock: false
    });
  }


  getProducts(){
     this.productList = this.firebaseDB.list('products');
     return this.productList.snapshotChanges();
  }

  insertProduct(product){
    this.productList.push({
      code : product.code,
      nom : product.nom,
      type : product.type,
      gamme : product.gamme,
      mesure :product.mesure,
      imageUrl: product.imageUrl,
      enStock : product.enStock
    });
  }


  
  updateProduct(product){
    this.productList.update(product.$key,{
      code : product.code,
      nom : product.nom,
      type : product.type,
      gamme : product.gamme,
      mesure :product.mesure,
      imageUrl: product.imageUrl,
      enStock : product.enStock
    });
  }

  deleteProduct($key: string){
    this.productList.remove($key); 
  }

  populateForm(row){
    this.form.setValue(row);
  }

}
