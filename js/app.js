$(document).ready(() => {
   const backgroundEle = $('.weather');
   // ********************* Start of date setup *********************
   const now = new Date();

   // Get current day
   const getDay = () => {
      const days = [
         'Sunday',
         'Monday',
         'Tuesday',
         'Wednesday',
         'Thursday',
         'Friday',
         'Saturday'
      ];

      return days[now.getDay()];
   }
   //End of getMonth function 

   // Get current month
   const getMonth = () => {
      const months = [
         'Jan',
         'Feb',
         'Mar',
         'Apr',
         'May',
         'Jun',
         'Jul',
         'Aug',
         'Sep',
         'Oct',
         'Nov',
         'Dec'
      ];

      return months[now.getMonth()];
   }

   const displayDate = () => {
      const p = document.createElement('time');
      $(p).text(`${getMonth()} ${now.getDate()}, ${getDay()}`);
      backgroundEle.append(p);
   }
   // End of getMonth function
   // ********************* End of date setup *********************

   // ********************* Start of user location setup *********************
   const loadingScreen = $('.loading-screen');
   const errorEle = $('.error')

   const displayWeatherInfo = (type, temp) => {
      const h1 = document.createElement('h1');
      $(h1).text(type);
      const p = document.createElement('p');
      $(p).text(`${temp}°`)

      $(backgroundEle).append(h1);
      $(backgroundEle).append(p)
   }

   const changeBackground = (type) => {
      switch (type) {
         case 'few clouds':
         case 'scattered clouds':
         case 'broken clouds':
            backgroundEle.addClass('weather--clouds');
            break;
         case 'shower rain':
         case 'rain':
            backgroundEle.addClass('weather--rain');
            break;
         case 'snow':
            backgroundEle.addClass('weather--snow');
            break;
         case 'mist':
            backgroundEle.addClass('weather--mist');
            break;
         case 'thunderstorm':
            backgroundEle.addClass('weather--thunderstorm');
            break;
         case 'clear sky':
         default:
            backgroundEle.addClass('weather--clear');
            break;
      }
   }

   // If no errors and supported
   // Get users weather and display
   const displayWeather = (pos) => {
      // Remove loading screen
      loadingScreen.addClass('loading-screen--hidden');

      // Weather API
      const apiPath = {
         url: 'https://api.openweathermap.org/data/2.5/weather?',
         lat: `lat=${pos.coords.latitude}`,
         lon: `&lon=${pos.coords.longitude}`,
         key: '&APPID=662d71acb5ec906ab6915374a80474b6',
         unit: '&units=metric'
      }

      // Full path to weather API
      const fullURL = (
         apiPath.url +
         apiPath.lat +
         apiPath.lon +
         apiPath.key +
         apiPath.unit);

      $.ajax({
         url: fullURL,
         success: (obj) => {
            displayDate();
            changeBackground(obj.weather[0].description);
            displayWeatherInfo(obj.weather[0].main, obj.main.temp);
         },
         error: () => {
            const h1 = document.createElement('h1');
            $(h1).text('Error with API, please try again later');
            $(h1).css('color', '#111');
            $(backgroundEle).append(h1);
         }
      })

   }
   // End of displayWeather function


   // Error handling
   const getError = (err) => {
      loadingScreen.addClass('loading-screen--hidden');
      const h1 = document.createElement('h1');

      // Get error message
      switch (err.code) {
         case err.PERMISSION_DENIED:
            $(h1).text('Request for permission was denied.');
            break;
         case err.POSITION_UNAVAILABLE:
            $(h1).text('Location unavailable.');
            break;
         case err.TIMEOUT:
            $(h1).text('Request for user location timed out.');
            break;
         case err.UNKNOWN_ERROR:
            $(h1).text('An unknown error occurred.');
            break;
      }

      // Return h1 with the appropriate message
      errorEle.append(h1);
      errorEle.addClass('error--show');
   }
   // End of getError function

   // Helper function to return location
   const getLocation = () => {
      // Checking geo API support in browser
      if (!!navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(displayWeather, getError);
      } else {
         loadingScreen.addClass('loading-screen--hidden');
         const h1 = document.createElement('h1');
         $(h1).text('Please update or change to a modern browser');
         $(backgroundEle).append(h1);
      }
   }
   // End of getLocation function

   getLocation();

   // ********************* End of user location setup *********************
})