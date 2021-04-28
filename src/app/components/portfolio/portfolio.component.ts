import { Component, OnInit } from '@angular/core';
import { Portfolio } from 'src/app/models/Portfolio';
import { UploadService } from 'src/app/services/upload';
import { DomSanitizer } from '@angular/platform-browser';

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
  portfolioList: any = [{}];
  public imageSRC: any ;
  userID: string = '607fe491958fa65f08f14d0e';

  constructor(private domSanitizer: DomSanitizer, private uploadService: UploadService) { }

  ngOnInit(): void {
    this.uploadService.getPortfoliodata()
    this.uploadService.portfolio.subscribe((artwork)=>{
      this.portfolioList = artwork;

    }, (error) => {
      console.log("Error", error)
    })
  }

  onClickOpen () {
    this.openImageModal = true;
  }

  onClickExit () {
    this.openImageModal = false;
    this.showed = false;
  }

  onClickAddArtwork () {
    this.showAddArtworkModal = !this.showAddArtworkModal;
  }
  
  onClickEditArtwork () {
    this.showEditArtworkModal = !this.showEditArtworkModal;
  }
  onClickDelete () {
    this.showDeleteModal = !this.showDeleteModal;
  }
}
