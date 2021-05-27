import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommissionService } from 'src/app/services/comService';
import { SortService } from 'src/app/services/sortingService';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask} from '@angular/fire/storage';
import { Form, FormGroup, FormBuilder } from '@angular/forms';

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
  imageSRC: any;

  option: string= "";
  sortForm: FormGroup;

  subscriptions: Subscription[] = [];
  @Input() serviceList: commission[] = [];
  @Input() soldoutList: commission[] = [];

  constructor(private domSanitizer: DomSanitizer,
    private commissionService: CommissionService,
    private afStorage: AngularFireStorage,
    private sortserv: SortService,
    private formBuilder: FormBuilder,
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
        this.selectSortOption(this.option);
      }, (error) => {
        console.log("Error", error)
      })
    )
    //for Sort Form
    this.sortForm = this.formBuilder.group ({
      button: ['--Select Choice--']
    });
    
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

  get formControls() { return this.sortForm.controls; }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

  loadPage(option:string){
    
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
    this.commissionService.editswitch(true);
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

  reloadPage(refresh: boolean){
    if(refresh == true){
      this.commissionService.getItemdata()
      this.ngOnInit()
    }
  }

  Orderby(event: Event){
    const option = event.target as HTMLInputElement
    this.option = option.value
    console.log("Sort Option")
    this.commissionService.getItemdata()
    this.subscriptions.push(
      this.commissionService.commission.asObservable().subscribe((service) => {

        this.soldoutList = [];
        this.serviceList = []; 
        service.forEach((item:commission) => {
          if (item.slot == 0) {
            this.soldoutList.push(item);
          }
          if(item.slot > 0) {
            this.serviceList.push(item);
          }
        })

        this.selectSortOption(option.value)
      }, (error) => {
        console.log("Error", error)
      })
    )
  }

  selectSortOption(option:string){
    if(option == "Alphabetical"){
      this.serviceList.sort(this.sortserv.getStrAscendingSortOrder("commissionname"))
      this.soldoutList.sort(this.sortserv.getStrAscendingSortOrder("commissionname"))
    }
    if(option == "Date Created"){
      this.serviceList.sort(this.sortserv.getTimeAscendingSortOrder("createdAt"))
      this.soldoutList.sort(this.sortserv.getTimeAscendingSortOrder("createdAt"))
    }
    if(option == "Date Modified"){
      this.serviceList.sort(this.sortserv.getTimeDescendingSortOrder("updatedAt"))
      this.soldoutList.sort(this.sortserv.getTimeDescendingSortOrder("updatedAt"))
    }
  }

  onClickGoback(){
    //Code that goes back to seller shop menu
  }

}