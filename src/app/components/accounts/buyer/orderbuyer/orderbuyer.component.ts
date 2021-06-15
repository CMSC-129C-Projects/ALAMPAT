import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from 'src/app/services/order';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

interface item {
  _id?: string;
  // productname?: string;
  // commissioname?:string;
  itemname:string;
  description: string;
  stock?: number;
  slot?: number;
  price: number;
  images: {
    filename: string;
    contentType: string;
    imageBase64: string;
  };
  category:string;
  sellername?: string;
  status:string;
}
@Component({
  selector: 'app-orderbuyer',
  templateUrl: './orderbuyer.component.html',
  styleUrls: ['./orderbuyer.component.css']
})
export class OrderbuyerComponent implements OnInit, OnDestroy {
  totalRecords: number;
  page: BehaviorSubject<any> ;
  pagelimit: number = 10;

  orderdata: item[];
  reload: boolean;
  subs: Subscription[] = [];
  re_sub:Subscription[] = [];
  curr_tab: BehaviorSubject<any>

  constructor(
    private orderserv: OrderService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.re_sub.push(this.orderserv.reload.subscribe((x)=>{
      this.reload = x
    }))
  }

  ngOnInit(): void {

    if(!("pagenum" in localStorage)){
      //const page = Number(localStorage.getItem('curr_category'))
      this.page = new BehaviorSubject<number>(1)  
      // this.sort_ord.next(localStorage.getItem('sort'))
    }

    this.curr_tab = new BehaviorSubject<string>('All')

      if("curr_tab" in localStorage){
        this.curr_tab = new BehaviorSubject<string|null>(localStorage.getItem('curr_category'))
        // this.sort_ord.next(localStorage.getItem('sort'))
      }

      if("pagenum" in localStorage){
        //const page = Number(localStorage.getItem('curr_category'))
        this.page = new BehaviorSubject<any>(Number(localStorage.getItem('pagenum')))
        //console.log("Page Number: " + this.page.value)
        // this.sort_ord.next(localStorage.getItem('sort'))
      }

      //For Tabs
      const tabs = document.querySelectorAll('.tabs li');
      const tabContentBoxes = document.querySelectorAll('#tab-content > div');

      tabs.forEach((tab: any) => {
        tab.addEventListener('click', () => {
          tabs.forEach(item => item.classList.remove('is-active'))
          tab.classList.add('is-active');

          const target = tab.dataset.target;
          tabContentBoxes.forEach( box => {
            console.log(target);
            if (box.getAttribute('id') == target) {
              box.classList.remove('is-hidden');
            } else {
              box.classList.add('is-hidden');
            }
          });
        })
      })

      this.load_wholeorder()
  }

  ngOnDestroy(): void {
    this.subs.forEach((x) => x.unsubscribe())
  }

  //SwitchTab(event:Event) {
  //  const tab = event.target as HTMLInputElement
  //  const tab_choice = tab.value
    //this.marketdata = []
  //  localStorage.setItem('curr_tab', tab_choice)
  //  this.page.next(1)
  //  localStorage.setItem("pagenum", String(this.page.value))

  //  this.curr_tab.next(tab_choice)
  
  //  this.orderserv.order.next([])
  //  this.orderStatusdata(tab_choice)
  //}

  load_wholeorder(){
    this.orderStatusdata(this.curr_tab.value)
  }

  orderStatusdata(tab_choice: string){
    console.log("Selected " , tab_choice)
    this.subs.forEach((x)=> x.unsubscribe())

    this.orderdata = []
    if(tab_choice == "All"){
      
      // this.subs.push(
      //   this.orderserv.getAlldata(String(this.page.value), this.pagelimit, tab_choice ).subscribe( (items) => {
      //   //this.marketdata = items
      //   this.orderdata = items.data.all
      //   this.totalRecords = items.data.totalitems
      //   //this.page = items.data.currpage
      //   //this.temp_list.next(this.marketdata)
      // })
      // )
      //this.marketdata.push(item)
    }
    else if( tab_choice == "Processing"){
      // this.subs.push(
      //   this.orderserv.getProcessingdata(String(this.page.value), this.pagelimit, tab_choice ).subscribe( (items) => {
      //   //this.marketdata = items
      //   this.orderdata = items.data.all
      //   this.totalRecords = items.data.totalitems
      //   //this.page = items.data.currpage
      //   //this.temp_list.next(this.marketdata)
      // })
      // )
    }

    else if( tab_choice == "Completed"){
      // this.subs.push(
      //   this.orderserv.getCompleteddata(String(this.page.value), this.pagelimit, tab_choice ).subscribe( (items) => {
      //   //this.marketdata = items
      //   this.orderdata = items.data.all
      //   this.totalRecords = items.data.totalitems
      //   //this.page = items.data.currpage
      //   //this.temp_list.next(this.marketdata)
      // })
      // )
    }

    else if( tab_choice == "Cancelled"){
      // this.subs.push(
      //   this.orderserv.getCancelleddata(String(this.page.value), this.pagelimit, tab_choice ).subscribe( (items) => {
      //   //this.marketdata = items
      //   this.orderdata = items.data.all
      //   this.totalRecords = items.data.totalitems
      //   //this.page = items.data.currpage
      //   //this.temp_list.next(this.marketdata)
      // })
      // )
    }   
  }

  pageChanged(){
    this.subs.forEach((x) => x.unsubscribe())
    localStorage.setItem("pagenum", String(this.page.value))
    this.orderStatusdata(this.curr_tab.value)
  }

  //ViewItem(item: item){
  //  const _id = item ? item._id : null;
  //  this.marketdata = []
  //  this.subs.forEach((x)=> x.unsubscribe())

   
   // localStorage.setItem("curr_category", this.curr_category.value)
    //console.log("View Item: " + JSON.stringify(_id))

  //  if(item.category == "Commission"){
  //    localStorage.setItem('reload', "false")
  //    this.router.navigate(['/commission-item/', {id: _id} ])
  //  }
  //  else if(item.category == "Product"){
  //    localStorage.setItem('reload', "false")
  //    this.router.navigate(['/product-item/', {id: _id} ])
  //  }
    // else{
    //   localStorage.setItem('reload', "false")
    //   this.router.navigate(['/marketplace/' ])
    // }
  //}
}
