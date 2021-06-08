import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css']
})
export class ReservationsComponent implements OnInit {
  // @Input() openReservationModal: boolean;
  showReservation: boolean = false;
  constructor() {
    this.showReservation = false;
  }

  ngOnInit(): void {

  }
  
  onClickInfo = () => {
    this.showReservation = !this.showReservation;
  }

  onClickExit = () => {
    if(this.showReservation) {
      this.showReservation = false;
    }
  }
}
