import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommissionService } from 'src/app/services/comService';
import { SortService } from 'src/app/services/sortingService';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';

interface commission {
  _id?: string;
  commissionname: string;
  description: string;
  images: {
      filename: string,
      contentType: string, 
      imageBase64: string
  };
  slot: number,
  price: number, 
  category: string, 
  createdAt: Date
}
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

  @Input() serviceList: commission[] = [];
  @Input() soldoutList: commission[] = [];
  imageSRC: any;
  userID: string = '607fe491958fa65f08f14d0e';

  constructor(private domSanitizer: DomSanitizer,
    private commissionService: CommissionService,
    private afStorage: AngularFireStorage,
    private sortserv: SortService,
    ) { 
      
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
        //put items to sold out array
        this.soldoutList = [];
        this.serviceList = [];
        service.forEach((item:commission) => {
          if (item.slot == 0) {
            this.soldoutList.push(item);
          }
          if(item.slot > 0){
            this.serviceList.push(item);
          }
        })

        //Sorting
        //this.serviceList.sort(this.sortserv.getStrAscendingSortOrder("commissionname"))
        this.serviceList.sort(this.sortserv.getNumAscendingSortOrder("price"))
        //this.serviceList.sort(this.sortserv.getTimeDescendingSortOrder("createdAt"))
        //this.serviceList = service;
        console.log("Service List " + JSON.stringify(service));
      }, (error) => {
        console.log("Error", error)
      })
    )
    

    //For tabs
    const tabs = document.querySelectorAll('.tabs li');
    const tabContentBoxes = document.querySelectorAll('#tab-content > div');

    tabs.forEach((tab: any) => {
      tab.addEventListener('click', () => {
        tabs.forEach(item => item.classList.remove('is-active'))
        tab.classList.add('is-active');

        const target = tab.dataset.target;
        tabContentBoxes.forEach( box => {
          console.log(target);
          if (box.getAttribute('id') == target) {
            box.classList.remove('is-hidden');
          } else {
            box.classList.add('is-hidden');
          }
        });
      })
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
  
  onClickOpen (item:any, index:any, tabId:any) {
    this.openImageModal = true;
    if(tabId == 0) {
      this.imageSRC = this.serviceList[index].images.imageBase64;
    } else {
      this.imageSRC = this.soldoutList[index].images.imageBase64;
    }
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
    if(this.imageSRC){
      this.afStorage.storage.refFromURL(this.imageSRC).delete().catch(error => {
        console.error("Image not found from cloud storage")
      });
    }
    
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
