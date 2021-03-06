$("document").ready(function () {
  // Celscius = Kelvin - 273.15
  // Selectors: $('#cityInput')   $('#searchBtn')   $('.listSearchedCities')   $('.currentData')   $('.currentData .date')   $('.date')    $('.weather')    $('.icon')   $('.temp')    $('.humid')
  /* ************************* Global Variables ************************* */
  var city;
  const apiKey = "aaf6c28ed5b2ad844bd61b20d43ffe8c";
  let queryURL;
  let citiesSearchedObject = {};
  let citiesSearchedObjectsArray = [];
  let ajaxFlag = 0;
  /* ************************* Function Declarations ************************* */
  /* --------------- Global --------------- */
  function init() {
    console.log("init()");
    loadSearchedCities();
  }
  function runAjax(url, thenFunction) {
    console.log("runAjax()");
    $.ajax({
      url: url,
      method: "GET",
    }).then(function (response) {
      if (thenFunction) {
        thenFunction(response);
      } else {
        /* console.log("No thenFunction");
        console.log("2nd Response: ", response); */
        return response;
      }
    });
  }
  /* --------------- Search Cities --------------- */
  function loadSearchedCities() {
    console.log("loadSearchedCities()");
    // Empty the searched cities list
    $(".listSearchedCities").empty();

    // Load searched cities from local storage
    if (localStorage.getItem("searchedCitiesObjects")) {
      console.log("YES searchedCitiesObjects");
      citiesSearchedObjectsArray = localStorage.getItem(
        "searchedCitiesObjects"
      );
      citiesSearchedObjectsArray = JSON.parse(citiesSearchedObjectsArray);
      console.log("citiesSearchedObjectsArray: ", citiesSearchedObjectsArray);
      // Display searched cities list
      if (citiesSearchedObjectsArray) {
        citiesSearchedObjectsArray.forEach(function (object) {
          var newSearchedCity = $("<a>");
          newSearchedCity.attr("href", "#");
          newSearchedCity.attr("searchedCity", object.city);
          newSearchedCity.attr(
            "class",
            "list-group-item list-group-item-action list-group-item-light listItemSearchedCity"
          );
          newSearchedCity.text(object.city);
          $(".listSearchedCities").append(newSearchedCity);
        });
        displayCityInCurrentWeather(
          citiesSearchedObjectsArray[0].city,
          citiesSearchedObjectsArray[0].data
        );
      }
    } else {
      console.log("No searchedCitiesObjects");
      citiesSearchedObjectsArray = [];
    }
    $(".listSearchedCities").hide();
    $(".listSearchedCities").fadeIn(1000);
  }

  function displayCityInSearchedCities(res) {
    console.log("displayCityInSearchedCities()");
    loadSearchedCities();
    // Empty the city search input
    $("#cityInput").val("");
    // Add city to the searched cities list array and data
    citiesSearchedObject = {
      city: city,
      data: res,
    };
    citiesSearchedObjectsArray.unshift(citiesSearchedObject);
    // Save searched cities array and data to local storage
    var citiesSearchedObjectsArrayString = JSON.stringify(
      citiesSearchedObjectsArray
    );
    localStorage.setItem(
      "searchedCitiesObjects",
      citiesSearchedObjectsArrayString
    );
    console.log(
      "citiesSearchedObjectsArrayString: ",
      citiesSearchedObjectsArrayString
    );

    // Append new city element to the searched list
    var newSearchedCity = $("<a>");
    newSearchedCity.attr("href", "#");
    newSearchedCity.attr("searchedCity", city);
    newSearchedCity.attr(
      "class",
      "list-group-item list-group-item-action list-group-item-success listItemSearchedCity",
      "list-group-item list-group-item-action newCity listItemSearchedCity"
    );
    newSearchedCity.text(city);
    $(".listSearchedCities").prepend(newSearchedCity);
    $(".listSearchedCities").hide();
    $(".listSearchedCities").fadeIn(1000);
    displayCityInCurrentWeather(
      citiesSearchedObjectsArray[0].city,
      citiesSearchedObjectsArray[0].data
    );
  }
  /* --------------- City Current --------------- */
  function displayCityInCurrentWeather(city, cityData) {
    console.log("displayCityInCurrentWeather()");
    console.log("City Data: ", cityData);
    date = new Date(cityData.current.dt * 1000);
    var utc_date = date.toUTCString();
    date = moment.utc(utc_date);
    date = date.format("MMMM Do YYYY");
    console.log("date: ", date);

    var icon = `http://openweathermap.org/img/wn/${cityData.current.weather[0].icon}@2x.png`;
    temp = (cityData.current.temp - 273.15).toFixed(1);
    var uv = cityData.current.uvi;
    console.log("UV INDEX: ", uv);

    $(".currentData .city").text(city);
    $(".currentData .date").text(date);
    $(".currentData .icon").attr("src", icon);
    $(".currentData .icon").show();
    $(".currentData .weather").text(
      "Weather: " + cityData.current.weather[0].description
    );
    $(".currentData .temp").text("Temp: " + temp + "ºC");
    $(".currentData .humid").text(
      "Humidity: " + cityData.current.humidity + "%"
    );
    $(".currentData .wind").text(
      "Wind speed: " + cityData.current.wind_speed + " mts/s"
    );
    if (uv >= 0 && uv <= 2) {
      $(".currentData .uv").text("UV Index: ", uv);
      $(".currentData .flag").text(" Low ");
      $(".currentData .flag").css("background", "#d4edda");
      $(".currentData .flag").css("color", "gray");
    } else if (uv >= 3 && uv <= 5) {
      console.log("uv >= 3 && uv <= 5");
      $(".currentData .uv").text("UV Index: " + uv);
      $(".currentData .flag").text(" Moderate ");
      $(".currentData .flag").css("background", "#fff3cd");
      $(".currentData .flag").css("color", "gray");
    } else if (uv >= 6 && uv <= 7) {
      $(".currentData .uv").text("UV Index: " + uv);
      $(".currentData .flag").text(" High ");
      $(".currentData .flag").css("background", "#fff3cd");
      $(".currentData .flag").css("color", "gray");
    } else if (uv >= 8 && uv <= 10) {
      $(".currentData .uv").text("UV Index: " + uv);
      $(".currentData .flag").text(" Very High ");
      $(".currentData .flag").css("background", "#f8d7da");
      $(".currentData .flag").css("color", "gray");
    } else if (uv >= 11) {
      $(".currentData .uv").text("UV Index: " + uv);
      $(".currentData .flag").text(" Extreme ");
      $(".currentData .flag").css("background", "#721c24");
      $(".currentData .flag").css("color", "white");
    }

    /* displayForcast(
      false,
      cityData.name,
      cityData.coord.lat,
      cityData.coord.lon
    ); */
    $(".currentData").hide();
    $(".currentData").fadeIn(1000);
    displayForcastDay(cityData);
  }

  /* --------------- City Forcast --------------- */
  function displayForcastDay(cityData) {
    console.log("displayForcastDay()");
    cityData = cityData.daily;
    cityData.forEach(function (dayData, index) {
      if (index <= 4) {
        // Handling The Data
        date = new Date(dayData.dt * 1000);
        var utc_date = date.toUTCString();
        date = moment.utc(utc_date);
        date = date.format("MMMM Do YYYY");
        var icon = `http://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png`;
        var weather = dayData.weather[0].description;
        var temp = (dayData.temp.day - 273.15).toFixed(1) + "ºC";
        var humid = dayData.humidity + "%";
        var windSpeed = dayData.wind_speed + " mts/s";
        var uv = dayData.uvi;

        // Display in the DOM
        $(".forecast .date").eq(index).text(date);
        $(".forecast .icon").eq(index).attr("src", icon);
        $(".forecast .icon").eq(index).show();
        $(".forecast .weather")
          .eq(index)
          .text("W: " + weather);
        $(".forecast .temp")
          .eq(index)
          .text("T: " + temp);
        $(".forecast .humid")
          .eq(index)
          .text("H: " + humid);
        $(".forecast .wind")
          .eq(index)
          .text("W. S.: " + windSpeed);

        if (uv >= 0 && uv <= 2) {
          $(".forecast .uv").eq(index).text("UV: ", uv);
          $(".forecast .flag").eq(index).text(" Low ");
          $(".forecast .flag").eq(index).css("background", "#d4edda");
          $(".forecast .flag").eq(index).css("color", "gray");
        } else if (uv >= 3 && uv <= 5) {
          $(".forecast .uv")
            .eq(index)
            .text("UV: " + uv);
          $(".forecast .flag").eq(index).text(" Moderate ");
          $(".forecast .flag").eq(index).css("background", "#fff3cd");
          $(".forecast .flag").eq(index).css("color", "gray");
        } else if (uv >= 6 && uv <= 7) {
          $(".forecast .uv")
            .eq(index)
            .text("UV: " + uv);
          $(".forecast .flag").eq(index).text(" High ");
          $(".forecast .flag").eq(index).css("background", "#fff3cd");
          $(".forecast .flag").eq(index).css("color", "gray");
        } else if (uv >= 8 && uv <= 10) {
          $(".forecast .uv")
            .eq(index)
            .text("UV: " + uv);
          $(".forecast .flag").eq(index).text(" Very High ");
          $(".forecast .flag").eq(index).css("background", "#f8d7da");
          $(".forecast .flag").eq(index).css("color", "gray");
        } else if (uv >= 11) {
          $(".forecast .uv")
            .eq(index)
            .text("UV: " + uv);
          $(".forecast .flag").eq(index).text(" Extreme ");
          $(".forecast .flag").eq(index).css("background", "#721c24");
          $(".forecast .flag").eq(index).css("color", "white");
        }
      }
    });
    $(".forecast").hide();
    $(".forecast").fadeIn(1000);
  }

  function getCurrentAndForcastData(res) {
    console.log("getCurrentAndForcastData()");
    if (ajaxFlag === 0) {
      console.log("1st Response: ", res);
      console.log("City Name: ", res.name);
      console.log("Latitude: ", res.coord.lat);
      console.log("Longitude: ", res.coord.lon);
      ajaxFlag = 1;

      // Current and forecasts weather data
      queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${res.coord.lat}&lon=${res.coord.lon}&
exclude=hourly&appid=${apiKey}`;
      queryURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${res.coord.lat}&lon=${res.coord.lon}&exclude=hourly&appid=${apiKey}`;
      runAjax(queryURL, getCurrentAndForcastData);
    } else {
      console.log("2nd Response: ", res);
      displayCityInSearchedCities(res);
    }
  }
  /* ************************* Event Listeners ************************* */
  init();
  $("#searchBtn").on("click", function (event) {
    event.preventDefault();
    city = $("#cityInput").val();
    ajaxFlag = 0;
    // Call current weather data for one location (to get latitude and longitude)
    queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    runAjax(queryURL, getCurrentAndForcastData);
  });
  $(".listSearchedCities").on("click", function (event) {
    loadSearchedCities();
    citiesSearchedObjectsArray.forEach(function (object) {
      if (object.city === $(event.target).attr("searchedcity")) {
        displayCityInCurrentWeather(object.city, object.data);
      }
    });
  });
});