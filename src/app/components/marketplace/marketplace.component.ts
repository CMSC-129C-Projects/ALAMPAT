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
  @ViewChild('minfield') min_price: ElementRef
  @ViewChild('maxfield') max_price: ElementRef

  data: Array<any>;
  totalRecords: number;
  page: BehaviorSubject<any> ;
  pagelimit: number = 12;


  marketdata: item[] = [];
  temp_list: BehaviorSubject<item[]>;
  
  subs: Subscription[] = [];
  re_sub:Subscription[] = []
  price_min: EventTarget | null ;
  price_max: EventTarget | null ;
  reload: boolean

  loading:boolean = false

  min: number;
  max: number

  pmin: BehaviorSubject<any> 
  pmax: BehaviorSubject<any> 
  word: BehaviorSubject<any> 
  sort_ord: BehaviorSubject<any> 
  curr_category: BehaviorSubject<any> 

  sort_value: string|null
  constructor(
    private marketserv: MarketService,
    private sortserv: SortService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    
    this.word = new BehaviorSubject<string>('')
    this.pmin = new BehaviorSubject<string|number>('')
    this.pmax = new BehaviorSubject<string|number>('')
    this.sort_ord = new BehaviorSubject<string>('')
    this.temp_list = new BehaviorSubject<item[]>([])
    this.sort_value = ''
    
    this.re_sub.push(this.marketserv.reload.subscribe((x)=>{
        this.reload = x
   }))
  }

  ngOnInit(): void {
    console.log("I am here " )
    
    if(!("pagenum" in localStorage)){
      //const page = Number(localStorage.getItem('curr_category'))
      this.page = new BehaviorSubject<number>(1)  
      // this.sort_ord.next(localStorage.getItem('sort'))
    }
      
    // if(localStorage.getItem('reload') == "true"){
    //   //this.curr_category.next('All')
    //   this.curr_category = new BehaviorSubject<string>('Product')
    //   //this.curr_category.next(localStorage.getItem('curr_category'))
    //   this.load_wholemarket()
      
    // }
    //else if(localStorage.getItem('reload') == "false"){
      this.curr_category = new BehaviorSubject<string>('Product')

      if("curr_category" in localStorage){
        this.curr_category = new BehaviorSubject<string|null>(localStorage.getItem('curr_category'))
        // this.sort_ord.next(localStorage.getItem('sort'))
      }

      if("pagenum" in localStorage){
        //const page = Number(localStorage.getItem('curr_category'))
        this.page = new BehaviorSubject<any>(Number(localStorage.getItem('pagenum')))
        //console.log("Page Number: " + this.page.value)
        // this.sort_ord.next(localStorage.getItem('sort'))
      }
      //const cat = localStorage.getItem('curr_category') ? localStorage.getItem('curr_category') : null

      if("sort" in localStorage){
        this.sort_value = localStorage.getItem('sort')
        if(localStorage.getItem('sort') == 'price'){
          this.sort_value = 'L-H'
        }
        else if(localStorage.getItem('sort') == '-price'){
          this.sort_value = 'H-L'
        }
        else if(localStorage.getItem('sort') == 'commissionname' || localStorage.getItem('sort') == 'productname'){
          this.sort_value = 'A-Z'
        }
        else if(localStorage.getItem('sort') == '-commissionname' || localStorage.getItem('sort') == '-productname'){
          this.sort_value = 'Z-A'
        }
        this.sort_ord.next(localStorage.getItem('sort'))
      }
      
      if("p_min" in localStorage && "p_max" in localStorage){
        this.pmin.next(localStorage.getItem('p_min'))
        this.pmax.next(localStorage.getItem('p_max'))
        
      }
      if("searched_item" in localStorage){
          // const word = localStorage.getItem('searched_item') ? localStorage.getItem('searched_item') : null
          this.word.next(localStorage.getItem('searched_item'))
          // this.searchItem(localStorage.getItem("searched_item"))
        }
      this.load_wholemarket()
      // if("searched_item" in localStorage){
      //   const word = localStorage.getItem('searched_item') ? localStorage.getItem('searched_item') : null
      //   this.word.next(word)
      //   this.searchItem(localStorage.getItem("searched_item"))
      // }
      // if("p_min" in localStorage && "p_max" in localStorage){
      //   this.onReload_applyprice()
      // }
      // if("sort" in localStorage){
      //   this.Sortby(localStorage.getItem('sort'))

      //   // /this.select.nativeElement.value = localStorage.getItem('sort')
      // }
      // this.marketserv.setmarket()
      //localStorage.setItem('reload', 'true')
    //}
    //console.log("Page Number 1 : " + this.page.value)
  }

  ngOnDestroy(): void {
    this.subs.forEach((x) => x.unsubscribe())
  }

  Categorizeby(event: Event  ){
    console.log("I am here 2")
    const category = event.target as HTMLInputElement
    const cat_choice = category.value
    //this.marketdata = []
    localStorage.setItem('curr_category', cat_choice)
    this.page.next(1)
    localStorage.setItem("pagenum", String(this.page.value))
    this.pmin.next('')
    this.pmax.next('')
    this.sort_ord.next('')
    this.word.next('')

    localStorage.removeItem("searched_item")
    localStorage.removeItem("p_min")
    localStorage.removeItem("p_max")
    localStorage.removeItem('sort')

    //console.log("Category choice:" + JSON.stringify(category.value))  
    
    this.curr_category.next(cat_choice)
  
    this.marketserv.market.next([])
    this.categorizeData(cat_choice)
  }

  load_wholemarket(){
    console.log("I am here 4")
    this.categorizeData(this.curr_category.value)
  }

  categorizeData(cat_choice: string){
    console.log("I am here 3 " , cat_choice)
    this.subs.forEach((x)=> x.unsubscribe())

    var pmin = '0'
    var pmax = '999999999999' 

    if(this.pmin.value != '' && this.pmax.value != ''){
      // this.pmin.next('0')
      // this.pmax.next('999999999999')
      pmin = this.pmin.value
      pmax = this.pmax.value 
    }

    this.marketdata = []
    if(cat_choice == "Product"){
      
      this.subs.push(
        this.marketserv.getProductMarketdata(String(this.page.value), this.pagelimit, this.sort_ord.value, pmin, pmax, this.word.value ).subscribe( (items) => {
        //this.marketdata = items
        this.marketdata = items.data.all
        this.totalRecords = items.data.totalitems
        this.loading = true
        //this.page = items.data.currpage
        //this.temp_list.next(this.marketdata)
      })
      )
      //this.marketdata.push(item)
    }
    else if( cat_choice == "Commission"){
      this.subs.push(
        this.marketserv.getCommissionMarketdata(String(this.page.value), this.pagelimit, this.sort_ord.value, pmin, pmax, this.word.value  ).subscribe( (items) => {
        //this.marketdata = items
        this.marketdata = items.data.all
        this.totalRecords = items.data.totalitems
        this.loading = true
        //this.page = items.data.currpage
        //this.temp_list.next(this.marketdata)
      })
      )

    }
    this.loading = false
    // else if(cat_choice == ''|| cat_choice == 'All' ){
    //   this.subs.push(
    //     this.marketserv.getallMarket().subscribe( (items: any[]) => {
    //     //this.marketdata = items
    //    this.marketdata = items 
    //     this.temp_list.next(this.marketdata)
    //   })
    //   )
    //   //this.marketdata.push(item)
    // }
    
  }
  
 

  changepmin(event:Event){
    const input = (event.target as HTMLInputElement).value
    this.pmin.next(input)
    
  }

  changepmax(event:Event){
    const input = (event.target as HTMLInputElement).value
    console.log("input : " + input )
    this.pmax.next(input)
  }

  ApplyPrice(){
    var p_min = this.pmin.value
    var p_max = this.pmax.value

    localStorage.setItem("p_min", p_min)
    localStorage.setItem("p_max", p_max)

    this.page.next(1)
    localStorage.setItem("pagenum", String(this.page.value))

    if(p_max == undefined || p_min == undefined || p_min == '' || p_max== '' ){
      console.log("Ayaw sulod ari")
      this.pmin.next('')
      this.pmax.next('')
      this.load_wholemarket()
      return
    }

    console.log("Ayaw sulod ari 2")
    var min:number = Number(p_min)
    var  max:number = Number(p_max)

    this.pmin.next(String(min))
    this.pmax.next(String(max))
    console.log( "Value : " + min + "  " + max )
      
    
    // this.marketdata = []
    this.load_wholemarket()
  

    console.log("I am here 5")
  }

  searchItem(word: string | null){
    this.page.next(1)
    localStorage.setItem("pagenum", String(this.page.value))

    localStorage.removeItem("p_min")
    localStorage.removeItem("p_max")
    localStorage.removeItem('sort')
    this.pmin.next('')
    this.pmax.next('')
    this.sort_ord.next('')
    if(word == null){
      //localStorage.removeItem("searched_item")
      this.word.next('')
      localStorage.setItem("searched_item", '')
      this.load_wholemarket()
      return
    }
    this.word.next(word)
    localStorage.setItem("searched_item", word)
    
    this.load_wholemarket()
    
  }

  ChooseSort(event:Event){
    const option = (event.target as HTMLInputElement).value
    console.log("sort option: " + option)
    this.sort_value = option

    if(option == 'A-Z'){
      if( this.curr_category.value == 'Commission'){
        this.sort_ord.next('commissionname')
        
      }
      if( this.curr_category.value == 'Product'){
        this.sort_ord.next('productname')
      }
      
    }
    if(option == 'Z-A'){
      if( this.curr_category.value == 'Commission'){
        this.sort_ord.next('-commissionname')
      }
      if( this.curr_category.value == 'Product'){
        this.sort_ord.next('-productname')
      }
    }
    if(option == 'H-L'){
      this.sort_ord.next('-price')
    }
    if(option == 'L-H'){
      this.sort_ord.next('price')
    }
    localStorage.setItem('sort', this.sort_ord.value)
    this.categorizeData(this.curr_category.value)
  }


  pageChanged(){
    this.subs.forEach((x) => x.unsubscribe())
    localStorage.setItem("pagenum", String(this.page.value))
    this.categorizeData(this.curr_category.value)
    
  }

  resetFilter(){
    this.page.next(1)
    localStorage.setItem("pagenum", String(this.page.value))
    this.pmin.next('')
    this.pmax.next('')
    this.sort_ord.next('')
    this.word.next('')

    localStorage.removeItem("searched_item")
    localStorage.removeItem("p_min")
    localStorage.removeItem("p_max")
    localStorage.removeItem('sort')
    this.load_wholemarket()
  }

  onResetsearch(){
    this.pmin.next('')
    this.pmax.next('')
    this.sort_ord.next('')
    this.word.next('')

    localStorage.removeItem("searched_item")
    localStorage.removeItem("p_min")
    localStorage.removeItem("p_max")
    localStorage.removeItem('sort')
    this.load_wholemarket()
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

  GotoReservation(){
    if(localStorage.getItem('userType') == 'buyer' && localStorage.getItem('isloggedIn') == 'true'){
      this.router.navigate(['/reservation/'])
    }
  }
}


