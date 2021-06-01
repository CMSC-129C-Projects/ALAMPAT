import { Component, Input, OnInit,OnDestroy } from '@angular/core';
//import { Portfolio } from 'src/app/models/Portfolio';
import { UploadService } from 'src/app/services/upload';
import { DomSanitizer } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage'
import { max } from 'rxjs/operators';

interface Portfolio {
  _id?: string;
  artworkname: string;
  description: string;
  images: {
      filename: string,
      contentType: string, 
      imageBase64: string
  }
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})


export class PortfolioComponent implements OnInit, OnDestroy {
  showAddArtworkModal: boolean = false;
  showEditArtworkModal: boolean = false;
  openDeleteModal: boolean = false;
  openImageModal: boolean = false;
  openMaxModal: boolean = false;
  showed: boolean = false;
  sureDelete: boolean = false;

  maxItems: number = 12;
  itemID: any;
  item: any;
  index: any;
  artwork: any;

  subscriptions: Subscription[] = [];

  @Input() portfolioList: Portfolio[] = [];
  imageSRC: any ;
  userID: string = '607fe491958fa65f08f14d0e';

  constructor(private domSanitizer: DomSanitizer, 
    private uploadService: UploadService,
    private afStorage: AngularFireStorage,) { 
    
     this.subscriptions.push(
       this.uploadService.refresh().subscribe((m:any) => {
        this.uploadService.getPortfoliodata()
        console.log(m);
        this.ngOnInit();
      })
     )
    
    this.subscriptions.push(
      this.uploadService.showAdd.subscribe((x)=>{
        this.showAddArtworkModal = x
      })
    )
    this.subscriptions.push(
      this.uploadService.showEdit.subscribe((x)=>{
        this.showEditArtworkModal = x
      })
    )
  }

  ngOnInit(): void {
    
    this.subscriptions.push(
      this.uploadService.portfolio.asObservable().pipe().subscribe((artwork)=>{
      this.portfolioList = artwork;
      console.log("Portfolio: " + JSON.stringify(this.portfolioList))
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
    this.imageSRC = this.portfolioList[index].images.imageBase64;
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
    if(this.openMaxModal) {
      this.openMaxModal = false;
    }
  }

  onClickAddArtwork () {
    if (this.portfolioList.length == this.maxItems) {
      this.openMaxModal = !this.openMaxModal;
    }
    if (this.portfolioList.length < this.maxItems) {
      this.uploadService.addswitch(true)
    }
    
    //this.showAddArtworkModal = !this.showAddArtworkModal;
  }
  
  onClickEditArtwork (item: any) {
    //console.log("Passed Item: "+ JSON.stringify(item))
    this.uploadService.selectArt(item)
    this.uploadService.editswitch(true)
    //this.ngOnDestroy()
    //this.ngOnInit()
    //this.showEditArtworkModal = !this.showEditArtworkModal;
  }

  onClickDelete (item: any, index: any) {
    this.openDeleteModal = !this.openDeleteModal;
    this.itemID = item._id;
    this.item = item;
    this.index = index;
    this.imageSRC = this.portfolioList[index].images.imageBase64;
  }

  onClickSureDelete () {
    this.afStorage.storage.refFromURL(this.imageSRC).delete();
    this.uploadService.selectArt(this.item);
    this.uploadService.deletePortfoliodata(this.itemID);
    //console.log(this.index);
    this.portfolioList = []
    this.uploadService.getPortfoliodata()
    
    if(this.index !== -1) {
      this.portfolioList.splice(this.index, 1);
    }
    this.openDeleteModal = false;
  }
    

  onClickGoback(){
    //Code that goes back to seller shop menu
  }
}
