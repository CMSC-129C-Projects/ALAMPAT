import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommissionService } from 'src/app/services/comService';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.css']
})
export class CommissionComponent implements OnInit, OnDestroy {
  showAddServiceModal: boolean = false;
  showEditServiceModal: boolean = false;
  openDeleteModal: boolean = false;
  openImageModal: boolean = false;
  showed: boolean = false;
  sureDelete: boolean = false;

  itemID: any;
  item: any;
  index: any;
  service: any;

  subscriptions: Subscription[] = [];

  @Input() serviceList: any = [];
  imageSRC: any;
  userID: string = '607fe491958fa65f08f14d0e';

  constructor(private domSanitizer: DomSanitizer,
    private commissionService: CommissionService,
    private afStorage: AngularFireStorage) { 

      this.subscriptions.push(
        this.commissionService.refresh().subscribe((m:any) => {
        this.commissionService.getItemdata()
        console.log(m);
        this.ngOnInit();
        })
      )

      this.subscriptions.push(
        this.commissionService.showAdd.subscribe((x) => {
          this.showAddServiceModal = x
        })
      )

      this.subscriptions.push(
        this.commissionService.showEdit.subscribe((x)=>{
          this.showEditServiceModal = x
        })
      )
    }

  ngOnInit(): void {

    this.subscriptions.push(
      this.commissionService.commission.asObservable().pipe().subscribe((service)=>{
        this.serviceList = service;
      }, (error) => {
        console.log("Error", error)
      })
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  onClickOpen (item:any, index:any) {
    this.openImageModal = true;
    this.imageSRC = this.serviceList[index].images.imageBase64;
  }

  onClickExit () {
    if(this.openImageModal) {
      this.openImageModal = false;
      this.showed = false;
      this.imageSRC = '';
    }
    if(this.openDeleteModal) {
      this.openDeleteModal = false;
    }
  }

  onClickAddService () {
    this.commissionService.addswitch(true);
  }

  onClickEditService (item: any) {
    this.commissionService.selectItem(item);
    this.showEditServiceModal = !this.showEditServiceModal;
  }

  onClickDelete (item: any, index: any) {
    this.openDeleteModal = !this.openDeleteModal;
    this.itemID = item._id;
    this.item = item;
    this.index = index;
    this.imageSRC = this.serviceList[index].images.imageBase64;
  }

  onClickSureDelete () {
    this.afStorage.storage.refFromURL(this.imageSRC).delete();
    this.commissionService.selectItem(this.item);
    this.commissionService.deleteItemdata(this.itemID);

    if(this.index !== -1) {
      this.serviceList.splice(this.index, 1);
    }
    this.openDeleteModal = false;
  }

  onClickGoback(){
    //Code that goes back to seller shop menu
  }

}
