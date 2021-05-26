import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { MarketService } from 'src/app/services/market';

interface commission {
  _id?: string;
  itemname:string;
  description: string;
  //stock?: number;
  slot?: number;
  price: number;
  images: {
    filename: string;
    contentType: string;
    imageBase64: string;
  };
  category:string;
  sellername?: string;
  profileImage: string;
}
@Component({
  selector: 'app-viewcommission',
  templateUrl: './viewcommission.component.html',
  styleUrls: ['./viewcommission.component.css']
})
export class ViewcommissionComponent implements OnInit, OnDestroy {

  comm_item:  commission
  subs : Subscription[] = []
  constructor(
    private route:ActivatedRoute,
    private marketserv: MarketService,
  ) { }

  ngOnInit(): void {
    const com_id = this.route.snapshot.paramMap.get('id');
    //console.log("Item : " + JSON.stringify(com_id))
    this.subs.push(this.marketserv.getcommission(com_id).subscribe((com)=>{
      this.comm_item = com
      console.log("Item : " + JSON.stringify(this.comm_item))
    })
    )
  }

  ngOnDestroy(): void{
    this.subs.forEach((x)=> x.unsubscribe())
  }
}
