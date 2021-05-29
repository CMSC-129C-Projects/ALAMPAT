import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MarketService } from 'src/app/services/market';
import { SortService } from 'src/app/services/sortingService';
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
}
@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css']
})

export class MarketplaceComponent implements OnInit, OnDestroy {
  @ViewChild('select') select: ElementRef

  data: Array<any>;
  totalRecords: number;
  page: number = 1;
  
  marketdata: item[];
  temp_list: BehaviorSubject<item[]>;
  
  subs: Subscription[] = [];
  re_sub:Subscription[] = []
  price_min: EventTarget | null ;
  price_max: EventTarget | null ;
  reload: boolean

  min: number;
  max: number

  pmin: BehaviorSubject<any> 
  pmax: BehaviorSubject<any> 
  word: BehaviorSubject<any> 
  sort_ord: BehaviorSubject<any> 
  curr_category: BehaviorSubject<any> 

  constructor(
    private marketserv: MarketService,
    private sortserv: SortService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.curr_category = new BehaviorSubject<string>('All')
    this.word = new BehaviorSubject<string>('')
    this.pmin = new BehaviorSubject<string|number>('')
    this.pmax = new BehaviorSubject<string|number>('')
    this.sort_ord = new BehaviorSubject<string>('')
    this.temp_list = new BehaviorSubject<item[]>([])

    
    this.re_sub.push(this.marketserv.reload.subscribe((x)=>{
        this.reload = x
   }))
  }

  ngOnInit(): void {
    console.log("I am here " )
     

    if(localStorage.getItem('reload') == "true"){
      this.curr_category.next('All')
      this.load_wholemarket()
      
    }
    else if(localStorage.getItem('reload') == "false"){
      const cat = localStorage.getItem('curr_category') ? localStorage.getItem('curr_category') : null
      this.curr_category.next(cat)
      
      this.categorizeData(this.curr_category.value)
      if("searched_item" in localStorage){
        const word = localStorage.getItem('searched_item') ? localStorage.getItem('searched_item') : null
        this.word.next(word)
        this.searchItem(localStorage.getItem("searched_item"))
      }
      if("p_min" in localStorage && "p_max" in localStorage){
        this.onReload_applyprice()
      }
      if("sort" in localStorage){
        this.Sortby(localStorage.getItem('sort'))

        // /this.select.nativeElement.value = localStorage.getItem('sort')
      }
      this.marketserv.setmarket()
      localStorage.setItem('reload', 'true')
    }

  }

  ngOnDestroy(): void {
    this.subs.forEach((x) => x.unsubscribe())
  }


  Categorizeby(event: Event  ){
    console.log("I am here 2")
    const category = event.target as HTMLInputElement
    const cat_choice = category.value
    //this.marketdata = []
    console.log("Category choice:" + JSON.stringify(category.value))  
    //this.subs.forEach((x)=> x.unsubscribe())
    this.curr_category.next(cat_choice)
    //this.ApplyPrice()
    // /window.location.reload();
    this.marketserv.setmarket()
    //this.marketserv.market = new BehaviorSubject<any>([])
    this.categorizeData(cat_choice)
    
    //this.selectSortOption()
    localStorage.removeItem("searched_item")
    localStorage.removeItem("p_min")
    localStorage.removeItem("p_max")
    localStorage.removeItem('sort')
  }

  categorizeData(cat_choice: string){
    console.log("I am here 3 " , cat_choice)
    this.subs.forEach((x)=> x.unsubscribe())
    this.marketdata = []
    if(cat_choice == "Product"){
      
      this.subs.push(
        this.marketserv.getproductMarket().subscribe( (items: any[]) => {
        //this.marketdata = items
       this.marketdata = items 
        this.temp_list.next(this.marketdata)
      })
      )
      //this.marketdata.push(item)
    }
    else if( cat_choice == "Commission"){
      this.subs.push(
        this.marketserv.getcommissionMarket().subscribe( (items: any[]) => {
        //this.marketdata = items
        this.marketdata = items 
        this.temp_list.next(this.marketdata)
      })
      )

    }
    else if(cat_choice == ''|| cat_choice == 'All' ){
      this.subs.push(
        this.marketserv.getallMarket().subscribe( (items: any[]) => {
        //this.marketdata = items
       this.marketdata = items 
        this.temp_list.next(this.marketdata)
      })
      )
      //this.marketdata.push(item)
    }
    
  }
  
  load_wholemarket(){
    console.log("I am here 4")
    this.subs.forEach((x)=>{
      x.unsubscribe()
    })

    localStorage.removeItem("searched_item")
    this.categorizeData(this.curr_category.value)
    
  }

  ApplyPrice(){
    var p_min = this.price_min as HTMLInputElement
    var p_max = this.price_max as HTMLInputElement
   
    if(p_max == undefined || p_min == undefined || p_min.value == '' || p_max.value == ''){
      // if("searched_item" in localStorage){
      //   this.searchItem(localStorage.getItem("searched_item"))
      // }
      //this.categorizeData(this.curr_category.value)
      return
    }

    var min:number = Number(p_min.value)
    var  max:number = Number(p_max.value)

    console.log( "Value : " + min + "  " + max )
    
    localStorage.setItem("p_min", String(min))
    localStorage.setItem("p_max", String(max))
    this.marketdata = []

    //console.log("Inside data : " + JSON.stringify(this.temp_list.value))
    if( min != undefined || max!= undefined  || (min > 0 || max > 0)){
      this.temp_list.value.forEach((item,index) => {
        if(min <= max){
          if(item.price >= min  && item.price <= max  ){
            this.marketdata.push(item)
            //console.log("Inside data : " + JSON.stringify(item))
          }
        }
        if(min > max){
          if(item.price <= min  && item.price >= max  ){
            this.marketdata.push(item)
            //console.log("Inside data : " + JSON.stringify(item))
          }
        }
        })
    }

    if(this.sort_ord.value == 'A-Z' || this.sort_ord.value == 'Z-A' || this.sort_ord.value == 'L-H' || this.sort_ord.value == 'H-L' ){
      this.Sortby(this.sort_ord.value)
    }
    console.log("I am here 5")
  }

  onReload_applyprice(){
    const min = Number(localStorage.getItem("p_min"))
    const max = Number(localStorage.getItem("p_max"))
    this.pmin.next(min)
    this.pmax.next(max)
    this.subs.forEach((x)=> x.unsubscribe())
    this.marketdata = []
    if( min != undefined || max!= undefined  || (min > 0 || max > 0)){
      this.temp_list.value.forEach((item,index) => {
        if(min <= max){
          if(item.price >= min  && item.price <= max  ){
            this.marketdata.push(item)
            //console.log("Inside data : " + JSON.stringify(item))
          }
        }
        if(min > max){
          if(item.price <= min  && item.price >= max  ){
            this.marketdata.push(item)
            //console.log("Inside data : " + JSON.stringify(item))
          }
        }
        })
    }
    console.log("Reloaded page with price")
  }


  searchItem(word: string | null){
    
    if(word == null){
      //localStorage.removeItem("searched_item")
      return
    }

    console.log("Search the word : " + word)
    this.categorizeData(this.curr_category.value) 
    this.marketdata = this.marketdata.filter(function(ele, i, array){
      let arrayelement = ele.itemname.toLowerCase()
      //console.log("Array element "+arrayelement)
      return arrayelement.includes(word.toLowerCase())
    })
    this.subs.forEach((x)=>{
        x.unsubscribe()
      })
    this.temp_list.next(this.marketdata)
    // /console.log("Searched Items: " + JSON.stringify(this.marketdata))
    localStorage.setItem("searched_item", word)
  }

  ChooseSort(event:Event){
    const option = (event.target as HTMLInputElement).value
    console.log("sort option: " + option)
    localStorage.setItem('sort', option)
    this.Sortby(option)
  }

  Sortby(option: string|null){
    console.log("I am here 6")
    this.sort_ord.next(option)
    this.subs.forEach((x)=> x.unsubscribe())
    //this.marketdata = this.temp_list.value
    if(option == 'A-Z'){
      this.marketdata.sort(this.sortserv.getStrAscendingSortOrder("itemname"))
    }
    if(option == 'Z-A'){
      this.marketdata.sort(this.sortserv.getStrDescendingSortOrder("itemname"))
    }
    if(option == 'H-L'){
      this.marketdata.sort(this.sortserv.getNumDescendingSortOrder("price"))
    }
    if(option == 'L-H'){
      this.marketdata.sort(this.sortserv.getNumAscendingSortOrder("price"))
    }
    
    //console.log("Inside data : " + JSON.stringify(this.temp_list))

  }

  resetFilter(){
    localStorage.removeItem("searched_item")
    localStorage.removeItem("p_min")
    localStorage.removeItem("p_max")
    localStorage.removeItem('sort')
  }

  onResetsearch(){
    localStorage.removeItem("searched_item")
    localStorage.removeItem("p_min")
    localStorage.removeItem("p_max")
    localStorage.removeItem('sort')
  }

  ViewItem(item: item){
    const _id = item ? item._id : null;
    this.marketdata = []
    this.subs.forEach((x)=> x.unsubscribe())
    localStorage.setItem("curr_category", this.curr_category.value)
    //console.log("View Item: " + JSON.stringify(_id))

    if(item.category == "Commission"){
      localStorage.setItem('reload', "false")
      this.router.navigate(['/commission-item/', {id: _id} ])
    }
    else if(item.category == "Product"){
      localStorage.setItem('reload', "false")
      this.router.navigate(['/product-item/', {id: _id} ])
    }
    // else{
    //   localStorage.setItem('reload', "false")
    //   this.router.navigate(['/marketplace/' ])
    // }
  }
}


