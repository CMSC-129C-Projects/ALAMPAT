import { Component, Input, OnInit } from '@angular/core';
import { Portfolio } from 'src/app/models/Portfolio';
import { UploadService } from 'src/app/services/upload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  showAddArtworkModal: boolean = false;
  showEditArtworkModal: boolean = false;
  openDeleteModal: boolean = false;
  openImageModal: boolean = false;
  showed: boolean = false;
  sureDelete: boolean = false;

  itemID: any;
  item: any;
  index: any;
  artwork: any;
  @Input() portfolioList: any = [];
  public imageSRC: any ;
  userID: string = '607fe491958fa65f08f14d0e';

 

  constructor(private domSanitizer: DomSanitizer, private uploadService: UploadService) { 
     this.uploadService.refresh().subscribe((m:any) => {
      console.log(m);
      this.ngOnInit();
    })
  }

  ngOnInit(): void {
    this.uploadService.getPortfoliodata()
    this.uploadService.portfolio.asObservable().pipe().subscribe((artwork)=>{
      this.portfolioList = artwork;
      //console.log("Portfolio: " + JSON.stringify(this.portfolioList))
    }, (error) => {
      console.log("Error", error)
    })
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
  }

  onClickAddArtwork () {
    this.showAddArtworkModal = !this.showAddArtworkModal;
  }
  
  onClickEditArtwork (item: any) {
    //console.log("Passed Item: "+ JSON.stringify(item))
    this.uploadService.selectArt(item)
    this.showEditArtworkModal = !this.showEditArtworkModal;
  }

  onClickDelete (item: any, index: any) {
    this.openDeleteModal = !this.openDeleteModal;
    this.itemID = item._id;
    this.item = item;
    this.index = index;
  }

  onClickSureDelete () {
    this.uploadService.selectArt(this.item);
    this.uploadService.deletePortfoliodata(this.itemID);
    //console.log(this.index);
    if(this.index !== -1) {
      this.portfolioList.splice(this.index, 1);
    }
    this.openDeleteModal = false;
  }
    

  onClickGoback(){
    //Code that goes back to seller shop menu
  }
}
