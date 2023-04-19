import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { SnackbarService } from 'src/app/snackbar';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // name= "Bengaluru";
  // degree= 28.23;
  // condition= "clouds";

  posts: any = {};
  forecast: any;

  constructor(private http: HttpClient, private snackbar: SnackbarService) { }

  ngOnInit() {
    this.dailyWeather();
    this.forecastWeather();
  }

  city="bengaluru";
  name="";
  searchResult: boolean = true;
  search(name: any){
    this.city = name;
    this.dailyWeather();
    this.forecastWeather();
  }

  
  dailyWeather(){
    this.http.get(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=e48fa220c96ffc0340abbe649bb931f9`,)
    .subscribe(post =>{
      this.posts = post;
      // console.log(this.posts);
      // console.log(this.posts.weather[0].main)
      this.posts.temp_celcius = (this.posts.main.temp - 273.15).toFixed(1);
      this.posts.temp_min = (this.posts.main.temp_min - 273.15).toFixed(1);
      this.posts.temp_max = (this.posts.main.temp_max - 273.15).toFixed(1);
      // console.log(this.posts.temp_celcius);
      // console.log(this.posts.temp_min);
      // console.log(this.posts.temp_max);
      
    },
    (error)=>{
      console.log(error);
      this.snackbar.showMessage("Not found");
    }
    )
  }

  forecastWeather(){
    this.http.get(`https://api.openweathermap.org/data/2.5/forecast?q=${this.city}&appid=e48fa220c96ffc0340abbe649bb931f9`,)
    .subscribe((response: any) => {
      const forecasts = response.list;
      const groupedForecasts = {};
      for (const forecast of forecasts) {
        const date = forecast.dt_txt.split(' ')[0];
        if (date !== moment().format('YYYY-MM-DD')) { // Exclude today's data
          if (!groupedForecasts[date]) {
            groupedForecasts[date] = forecast;
          }
        }
      }
      // console.log(groupedForecasts);
      this.forecast = groupedForecasts;

    },
    (error)=>{
      console.log(error);
    }
    )
  }


}
