import { Component, OnDestroy, OnInit } from '@angular/core';
import { MarketService } from 'src/app/services/market';
import { SortService } from 'src/app/services/sortingService';
import { Subscription, Subject, BehaviorSubject } from 'rxjs';


interface item {
  _id?: string;
  productname?: string;
  commissioname?:string;
  description: string;
  stock: number;
  price: number;
  images: {
    filename: string;
    contentType: string;
    imageBase64: string;
  };
  category:string;
  sellername?: string;
}
@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})
export class MarketplaceComponent implements OnInit, OnDestroy {
  
  marketdata: item[];
  temp_list: BehaviorSubject<item[]>;

  subs: Subscription[] = [];
  price_min: EventTarget | null ;
  price_max: EventTarget | null ;

  curr_category: BehaviorSubject<string> 

  constructor(
    private marketserv: MarketService,
    private sortserv: SortService
  ) {
    this.curr_category = new BehaviorSubject<string>('')
    this.temp_list = new BehaviorSubject<item[]>([])
   }

  ngOnInit(): void {
    console.log("I am here")
    this.load_wholemarket()
    //this.ngOnDestroy()
  }

  ngOnDestroy(): void {
    this.subs.forEach((x) => x.unsubscribe())
  }

  Categorizeby(event: Event  ){
    console.log("I am here 2")
    const category = event.target as HTMLInputElement
    const cat_choice = category.value
    console.log("Category choice:" + JSON.stringify(category.value))  
    
    this.curr_category.next(cat_choice)
    this.categorizeData(cat_choice)
    
  }

  categorizeData(cat_choice: string){
    console.log("I am here 3")
    this.marketdata = []
    this.temp_list.value.forEach((item,index) => {
      if(item.category == "Product" && cat_choice == "Product"){
        this.marketdata.push(item)
      }
      else if(item.category == "Commission" && cat_choice == "Commission"){
        this.marketdata.push(item)
        //console.log("I am here")
      }
      else if(cat_choice == ''|| cat_choice == 'All' ){
        this.marketdata.push(item)
      }
    })
    //this.temp_list.next(this.marketdata)
    
  }
  
  load_wholemarket(){
    console.log("I am here 4")
    this.subs.push(
      this.marketserv.getMarket().subscribe( (items: any[]) => {
      //this.marketdata = items
      this.marketdata = items
      
      this.temp_list.next(this.marketdata)
      
      // this.marketdata.forEach((item, index)=>{
      //  console.log("Updated Market data: " + JSON.stringify(item))
      //  })
    })
    )
    this.categorizeData(this.curr_category.value)
    
  }

  ApplyPrice(){
    var p_min = this.price_min as HTMLInputElement
    var p_max = this.price_max as HTMLInputElement

    const min:number = Number(p_min.value)
    const max:number = Number(p_max.value)
    console.log( "Value : " + min + "  " + max )
    
    this.load_wholemarket()
      
    

    //this.categorizeData(this.curr_category.value) 
    this.selectSortOption()

    this.marketdata = []
    console.log("Inside data : " + JSON.stringify(this.temp_list.value))

    this.temp_list.value.forEach((item,index) => {
      if(item.price >= min  && item.price <= max  ){
        this.marketdata.push(item)
        console.log("Inside data : " + JSON.stringify(item))
      }
    })
    console.log("Market data : " + JSON.stringify(this.marketdata))
    this.temp_list.next(this.marketdata)
    //this.marketdata = this.temp_list.value
    this.subs.forEach((x)=>{
      x.unsubscribe()
    })
    console.log("I am here 5")
  }

  selectSortOption(){
    console.log("I am here 6")
    //this.marketdata = this.temp_list.value
    
    this.marketdata.sort(this.sortserv.getNumAscendingSortOrder("price"))
    //console.log("Inside data : " + JSON.stringify(this.temp_list))
    this.temp_list.next(this.marketdata)
    
    // if(option == "Alphabetical"){
    //   this.marketdata.sort(this.sortserv.getStrAscendingSortOrder("productname"))
    //   //this.soldoutList.sort(this.sortserv.getStrAscendingSortOrder("productname"))
    // }
    // if(option == "Date Created"){
    //   this.marketdata.sort(this.sortserv.getTimeAscendingSortOrder("createdAt"))
    //   //this.soldoutList.sort(this.sortserv.getTimeAscendingSortOrder("createdAt"))
    // }
    // if(option == "Date Modified"){
    //   this.marketdata.sort(this.sortserv.getTimeDescendingSortOrder("updatedAt"))
    //   //this.soldoutList.sort(this.sortserv.getTimeDescendingSortOrder("updatedAt"))
    // }
  }
}
