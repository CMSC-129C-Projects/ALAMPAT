import { Component, OnInit } from '@angular/core';
import { Portfolio } from 'src/app/models/Portfolio';
import { UploadService } from 'src/app/services/upload';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  showAddArtworkModal: boolean = false;
  showEditArtworkModal: boolean = false;
  showDeleteModal: boolean = false;
  openImageModal: boolean = false;
  showed: boolean = false;

  artwork: any;
  portfolioList: any = [];
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
    this.uploadService.portfolio.subscribe((artwork)=>{
      this.portfolioList = artwork;
      //console.log("Portfolio: " + JSON.stringify(this.portfolioList))
      for(var i in artwork){
        this.portfolioList[i].images.imageBase64 = this.domSanitizer.bypassSecurityTrustUrl(artwork[i].images.imageBase64);
      }

    }, (error) => {
      console.log("Error", error)
    })
  }
  
  onClickOpen (item:any, index:any) {
    this.openImageModal = true;
    this.imageSRC = this.portfolioList[index].images.imageBase64;
  }

  onClickExit () {
    this.openImageModal = false;
    this.showed = false;
    this.imageSRC = '';
  }

  onClickAddArtwork () {
   
    this.showAddArtworkModal = !this.showAddArtworkModal;
  }
  
  onClickEditArtwork (item: any) {
    //console.log("Passed Item: "+ JSON.stringify(item))
    this.uploadService.selectArt(item)
    this.showEditArtworkModal = !this.showEditArtworkModal;
  }

  onClickDelete () {
    this.showDeleteModal = !this.showDeleteModal;
  }

  onClickGoback(){
    //Code that goes back to seller shop menu
  }
}
