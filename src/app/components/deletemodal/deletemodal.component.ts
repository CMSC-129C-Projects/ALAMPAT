import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-deletemodal',
  templateUrl: './deletemodal.component.html',
  styleUrls: ['./deletemodal.component.css']
})
export class DeletemodalComponent implements OnInit {
  @Input() openDeleteModal: boolean = true;
  submitted: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSubmit = () => {
    this.submitted = true;
  }
  onClickExit = () => {
    this.openDeleteModal = false;
  }
}
