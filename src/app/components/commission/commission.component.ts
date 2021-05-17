import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-commission',
  templateUrl: './commission.component.html',
  styleUrls: ['./commission.component.css']
})
export class CommissionComponent implements OnInit {
  itemID: any;
  item: any;
  index: any;
  service: any;

  @Input() serviceList: any = [];
  imageSRC: any;

  constructor() { }

  ngOnInit(): void {
  }

  onClickOpen (item:any, index:any) {
    //this.openImageModal = true;
    this.imageSRC = this.serviceList[index].images.imageBase64;
  }

  onClickDelete (item: any, index: any) {
    //this.openDeleteModal = !this.openDeleteModal;
    this.itemID = item._id;
    this.item = item;
    this.index = index;
    this.imageSRC = this.serviceList[index].images.imageBase64;
  }

  onClickAddService () {
    //this.uploadService.addswitch(true)
    //this.showAddArtworkModal = !this.showAddArtworkModal;
  }

  onClickEditService (item: any) {
    //console.log("Passed Item: "+ JSON.stringify(item))
    //this.uploadService.selectArt(item)
    //this.showEditArtworkModal = !this.showEditArtworkModal;
  }

  onClickGoback(){
    //Code that goes back to seller shop menu
  }

}
