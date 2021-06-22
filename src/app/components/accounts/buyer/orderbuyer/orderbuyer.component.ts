import {ViewContainerRef, ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from 'src/app/services/order';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

interface order_item {
  _id?: string;
  orderStatus: string,
  orderType: string,
  reservation: {
    _id: string, 

    service:{
      images:{
        filename: string,
        contentType: string,
        imageBase64: string,
      },
      _id: string,
      commissionname: string,
      price: number,
    },

    seller:{
      _id: string,
      name: string,
    },

    buyer:{
          _id: string,
          name: string,
        },

  }
  totalAmount: number
}
@Component({
  selector: 'app-orderbuyer',
  templateUrl: './orderbuyer.component.html',
  styleUrls: ['./orderbuyer.component.css']
})
export class OrderbuyerComponent implements OnInit, OnDestroy {
  showOrderDetailsModal: boolean = false;

  totalRecords: number;
  page: BehaviorSubject<any> ;
  pagelimit: number = 10;

  orderdata: order_item[];
  reload: boolean;
  subs: Subscription[] = [];
  re_sub:Subscription[] = [];
  curr_tab: BehaviorSubject<any>

  curritems_amt: number = 0
  items_limit = 5

  load: string = "false"

  constructor(
    private orderserv: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private vcrf: ViewContainerRef
  ) {
    this.re_sub.push(this.orderserv.reload.subscribe((x)=>{
      this.reload = x
    }))
    //Order Details Modal
    this.re_sub.push(
      this.orderserv.showDetails.subscribe((x)=>{
        this.showOrderDetailsModal = x
      })
    )
  }


  ngOnInit(): void {

    if(!("pagenum" in localStorage)){
      this.page = new BehaviorSubject<number>(1)  
    }

    this.curr_tab = new BehaviorSubject<string>('All')

      if("pagenum" in localStorage){
        this.page = new BehaviorSubject<any>(Number(localStorage.getItem('pagenum')))
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

  load_wholeorder(){
    this.orderStatusdata(this.curr_tab.value)
  }

  orderStatusdata(tab_choice: string){
    console.log("Selected " , tab_choice)
    this.subs.forEach((x)=> x.unsubscribe())

    this.orderdata = []
    if(tab_choice == "All"){
      
      this.subs.push(
        this.orderserv.getAlldata(String(this.curritems_amt)).subscribe(items => {
          this.orderdata = items.data.orderArray
          this.curritems_amt = this.curritems_amt + this.items_limit
          if(items.data.orderArray.length > 0){
            this.load = "true"
            
          }
        })
      )
    }
    else if( tab_choice == "Processing"){
      this.subs.push(
        this.orderserv.getProcessingdata('P', String(this.curritems_amt)).subscribe(items => {
          this.orderdata = items.data.orderArray
          this.curritems_amt = this.curritems_amt + this.items_limit
          if(items.data.orderArray.length > 0){
            this.load = "true"
            
          }
        })
      )
    }

    else if( tab_choice == "Completed"){
      this.subs.push(
        this.orderserv.getProcessingdata('Co', String(this.curritems_amt)).subscribe(items => {
          this.orderdata = items.data.orderArray
          this.curritems_amt = this.curritems_amt + this.items_limit
          if(items.data.orderArray.length > 0){
            this.load = "true"
            
          }
        })
      )
    }

    else if( tab_choice == "Cancelled"){
      this.subs.push(
        this.orderserv.getProcessingdata('Ca', String(this.curritems_amt)).subscribe(items => {
          this.orderdata = items.data.orderArray
          this.curritems_amt = this.curritems_amt + this.items_limit
          if(items.data.orderArray.length > 0){
            this.load = "true"
            
          }
        })
      )
    }   
  }

  //Function for the Order Details Modal
  onClickOrderDetails (item:any) {
    this.orderserv.detailsswitch(true);
    console.log('item id ' + item._id)
    this.orderserv.save_OrderID(item._id)
  }

  pageChanged(){
    this.subs.forEach((x) => x.unsubscribe())
    localStorage.setItem("pagenum", String(this.page.value))
    this.orderStatusdata(this.curr_tab.value)
  }

  ChangeTab(tab:string){
    this.curr_tab.next(tab)
    this.curritems_amt = 0
    this.load = 'false'
    this.orderStatusdata(tab)
  }

  LoadMore(){
    this.subs.forEach((x)=> x.unsubscribe())
    setTimeout(()=>{
      if(this.curr_tab.value == "All"){
      
        this.subs.push(
          this.orderserv.getAlldata(String(this.curritems_amt)).subscribe(items => {
            items.data.orderArray.forEach( order => {
              this.orderdata.push(order)
            })
            if(items.data.orderArray.length == 0){
              this.load = "false"
            }

            this.curritems_amt = this.curritems_amt + this.items_limit
          })
        )
      }
      else if( this.curr_tab.value == "Processing"){
        this.subs.push(
          this.orderserv.getProcessingdata('P', String(this.curritems_amt)).subscribe(items => {
            items.data.orderArray.forEach( order => {
              this.orderdata.push(order)
            })
            if(items.data.orderArray.length == 0){
              this.load = "false"
              
            }
            this.curritems_amt = this.curritems_amt + this.items_limit
          })
        )
      }
  
      else if( this.curr_tab.value == "Completed"){
        this.subs.push(
          this.orderserv.getProcessingdata('Co', String(this.curritems_amt)).subscribe(items => {
            items.data.orderArray.forEach( order => {
              this.orderdata.push(order)
            })
            if(items.data.orderArray.length == 0){
              this.load = "false"
              
            }
            this.curritems_amt = this.curritems_amt + this.items_limit
          })
        )
      }
  
      else if( this.curr_tab.value == "Cancelled"){
        this.subs.push(
          this.orderserv.getProcessingdata('Ca', String(this.curritems_amt)).subscribe(items => {
            items.data.orderArray.forEach( order => {
              this.orderdata.push(order)
            })
            if(items.data.orderArray.length == 0){
              this.load = "false"
              
            }
            this.curritems_amt = this.curritems_amt + this.items_limit
          }) 
        )
      } 
      this.cdr.detectChanges()
    }, 500)
  }
}
