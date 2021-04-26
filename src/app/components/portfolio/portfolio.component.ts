import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
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
