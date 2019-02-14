import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/product.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ProductComponent } from '../product/product.component';
import { MatDialog, MatDialogConfig } from "@angular/material";
import { NotificationService } from 'src/app/shared/notification.service';
import { DialogService } from 'src/app/shared/dialog.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  listData : MatTableDataSource<any>;
  displayedColumns : string[] = ['code','nom', 'type', 'gamme', 'mesure' , 'actions'];
  searchKey;


  constructor(private productService : ProductService,
              private dialog: MatDialog,
              private notificationService: NotificationService,
              private dialogService : DialogService
              ) { }


  
  ngOnInit() {
    this.productService.getProducts().subscribe(
       
      list => { 
        //finaly inside this array we have list of our products retrive from FireBaseDB
        let array  = list.map(item => {
          return {
            $key : item.key,
            ...item.payload.val()
          };
        });

        this.listData = new MatTableDataSource(array);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
      });
    }

    onSearchClear() {
      this.searchKey = "";
      this.applyFilter();
    }
  
    applyFilter() {
      this.listData.filter = this.searchKey.trim().toLowerCase();
    }


    
  onCreate() {
    this.productService.initializeFormGroup();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(ProductComponent,dialogConfig)

  }

  onEdit(row){
    this.productService.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(ProductComponent,dialogConfig)
  }
  onDelete($key){
    // if  (confirm('Are you sure to delete this record?'))
    //   this.productService.deleteProduct($key);
    // this.notificationService.warn('! Deleted Successfully');

    this.dialogService.openConfirmDialog('Are you sure to delete this record ?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.productService.deleteProduct($key);
        this.notificationService.warn('! Deleted successfully');
      }
    });

  }

}
