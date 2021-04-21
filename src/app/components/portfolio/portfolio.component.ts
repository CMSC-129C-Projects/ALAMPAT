import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  showAddArtworkModal: boolean = false;
  showDeleteModal: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onClickAddArtwork = () => {
    this.showAddArtworkModal = !this.showAddArtworkModal;
  }
  onClickDelete = () => {
    this.showDeleteModal = !this.showDeleteModal;
  }
}
