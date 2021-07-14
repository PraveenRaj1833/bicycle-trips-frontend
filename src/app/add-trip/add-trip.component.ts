import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { Router , ActivatedRoute, ParamMap } from '@angular/router';
import { Trip } from '../trip';
import { UserService } from '../user.service';

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.css']
})
export class AddTripComponent implements OnInit {

  @ViewChild('search')
  public start !: ElementRef;

  @ViewChild('search1')
  public end!: ElementRef;

  public origin : any;
  public destination : any;
  public back : boolean = false;
  distance = 0.00;

  latitude = 28.6139;
  longitude = 77.2090;

  directionService !: google.maps.DirectionsService;
  directionRenderer !: google.maps.DirectionsRenderer;

  map !: google.maps.Map ;
  mapClickListener : google.maps.MapsEventListener | undefined;

  trip = new Trip(undefined,'','',0.0,false);

  constructor(private router : Router, private route : ActivatedRoute, private ngZone : NgZone, 
    private mapsAPILoader : MapsAPILoader, private readonly _userService : UserService) { }
  email = '';

  public mapReadyHandler(map : google.maps.Map){
    this.map = map;
    const geoCoder = new google.maps.Geocoder();
    const infoWindow = new google.maps.InfoWindow();
    this.mapClickListener = this.map.addListener('click',(e:google.maps.MouseEvent)=>{
      console.log(e);
      this.latitude = e.latLng.lat();
      this.longitude = e.latLng.lng();
      const latLng = {
        lat : this.latitude,
        lng : this.longitude
      }

      geoCoder.geocode({location : latLng},(results,status)=>{
        if(status=='OK'){
          if(results[0]){
            this.map.setZoom(11);
            const marker = new google.maps.Marker({
              position : latLng,
              map : this.map
            });
            if(this.trip.startingPoint===null || this.trip.startingPoint===''){
              this.trip.startingPoint = results[0].formatted_address;
              this.origin = latLng;
            }
            else{
              this.trip.farthestPoint = results[0].formatted_address;
              this.destination = latLng;
              this.calculateDistance();
              this.getRoute();
            }
            infoWindow.setContent(results[0].formatted_address);
            infoWindow.open(this.map,marker);
          
          }else{
            alert("No result found");
          }
        }else{
          alert("something went wrong");
        }
      })
    })
  }

  ngOnInit(): void {
    // this.route.paramMap.subscribe((params : ParamMap)=>{
    //   let email = params.get('email');
    //   this.email = email==null?'':email;
    // })
    if(window.sessionStorage.getItem('email')===null || window.sessionStorage.getItem('email')==='')
      this.router.navigate(['/']);
    this.email = window.sessionStorage.getItem('email')!;

    this.mapsAPILoader.load().then(
      ()=>{
        this.directionService = new google.maps.DirectionsService();
        this.directionRenderer = new google.maps.DirectionsRenderer();
        let autoComplete = new google.maps.places.Autocomplete(this.start?.nativeElement, {});

        autoComplete.addListener('place_changed',()=>{
          this.ngZone.run(()=>{
            let place: google.maps.places.PlaceResult = autoComplete.getPlace();
            this.trip.startingPoint =  place.formatted_address?place.formatted_address:'';
            console.log("place 1",place.formatted_address);
            if(place.geometry===undefined || place.geometry===null)
              return;
            console.log(place.geometry.location);
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.origin = {lat : this.latitude, lng : this.longitude}
          })
        })

        let autoComplete1 = new google.maps.places.Autocomplete(this.end?.nativeElement, {});

        autoComplete1.addListener('place_changed',()=>{
          this.ngZone.run(()=>{
            let place: google.maps.places.PlaceResult = autoComplete1.getPlace();
            this.trip.farthestPoint =  place.formatted_address?place.formatted_address:'';
            console.log("place 2",place.formatted_address);
            if(place.geometry===undefined || place.geometry===null)
              return;
            console.log(place.geometry.location);
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.destination = {lat : this.latitude, lng: this.longitude};
            const o = new google.maps.LatLng( 24.799448,120.979021);
            const d = new google.maps.LatLng( 24.799524,120.975017);
            //this.distance = google.maps.geometry.spherical.computeDistanceBetween(o,d);
            //console.log(this.distance);

            this.calculateDistance();
            this.getRoute();
          })
        })
      }
    )
  }

  public getRoute = ()=>{
    this.directionRenderer.setMap(null);
    this.directionRenderer.setMap(this.map);
    
    var request = {
      origin: new google.maps.LatLng(this.origin.lat,this.origin.lng),
      destination: new google.maps.LatLng(this.destination.lat,this.destination.lng),
      travelMode: google.maps.TravelMode.DRIVING
      };
    this.directionService.route(request, (response, status)=> {
        if (status == 'OK') {
          this.directionRenderer.setMap(this.map);
          this.directionRenderer.setDirections(response);
          console.log(response);
        }
        else{
          console.log(response);
          console.log("err");
        }
      });      
  }

  public calculateDistance = ()=>{
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins : [new google.maps.LatLng(this.origin.lat,this.origin.lng)],
      destinations : [new google.maps.LatLng(this.destination.lat,this.destination.lng)],
      travelMode : google.maps.TravelMode.DRIVING,
      unitSystem : google.maps.UnitSystem.METRIC,
    },(response,status)=>{
      if(status=='OK')
      {
        console.log(JSON.stringify(response));
        let distance = response.rows[0].elements[0].distance.text;
        this.distance = parseFloat(distance.split(' ')[0].replace(',',''));
        this.trip.distance = this.distance;
      }
      else
        console.log("error");
    })
  }

  public ngOnDestroy():void{
    if(this.mapClickListener){
      this.mapClickListener.remove();
    }
  }

  addTrip(){
    if(this.trip.back){
      this.trip.distance = this.distance*2;
    }
    console.log(JSON.stringify(this.trip));
    if(this.trip.startingPoint!=='' && this.trip.farthestPoint!=='' && this.trip.distance>0.00){
      // alert("ok");
      this._userService.addTrip({
        startingPoint : this.trip.startingPoint,
        farthestPoint : this.trip.farthestPoint,
        distance :this.trip.distance,
        back : this.trip.back,
        'user' : {
          email : this.email
        }
      }).subscribe(
        (data)=>{
          console.log(data);
          alert("trip succesfully added");
          // this.router.navigate(['/home',this.email]);
          this.router.navigate(['/home']);
        },
        (err)=>{
          console.log("err",err);
          alert("something went wrong");
        }
      )
    }
    else{
      alert("Please Enter valid details");
    }
    
  }

}
