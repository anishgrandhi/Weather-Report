// API access key of OpenWeatherMap
var api_key = "15404b0c33fff0d453ff2dbc8beda284";

function sendRequest () {
    var xhr = new XMLHttpRequest();
    var city = encodeURI(document.getElementById("form-input").value);
    xhr.open("GET", "proxy.php?q="+city+"&appid="+api_key+"&format=json"+"&units=imperial", true); 
    xhr.setRequestHeader("Accept","application/json");
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            var json = JSON.parse(this.responseText);
            
            //Converting the Unix time
            var mTime = new Date(json.sys.sunrise*1000);
            var eTime = new Date(json.sys.sunset*1000);

            //For visibility parameter. Group id with 7** gives the weather conditions like fog, mist, smoke, tornodo etc when the visibility will be less
            var visibility;
            if(json.weather[0].id >= 700 && json.weather[0].id < 800) {
                visibility = "Not Clear";
            }
            else visibility = "Clear";

            //displaying weather details in a tabular format
            document.getElementById("output").innerHTML = 
            "<table> <caption> Weather Report </caption> <tr> <td>City Name</td> <td>"+json.name+"</td> </tr> <tr> <td>Longitude</td> <td>"+json.coord.lon+"</td> </tr>" +
            "<tr> <td>Latitude</td> <td>"+json.coord.lat+"</td> </tr> <tr> <td>Sunrise</td> <td>"+mTime.getHours()+":"+mTime.getMinutes()+":"+mTime.getSeconds()+" CST</td> </tr>"+ 
            "<tr> <td>Sunset</td> <td>"+eTime.getHours()+":"+eTime.getMinutes()+":"+eTime.getSeconds()+" CST</td> </tr> <tr> <td>Temperature</td> <td>"+json.main.temp+"F</td> </tr>"+ 
            "<tr> <td>Minimum temperature</td> <td>"+json.main.temp_min+"F</td> </tr> <tr> <td>Maximum temperature</td> <td>"+json.main.temp_max+"F</td> </tr>"+
            "<tr> <td>Pressure</td> <td>"+json.main.pressure+"hPa</td> </tr> <tr> <td>Humidity</td> <td>"+json.main.humidity+"%</td> </tr>"+
            "<tr> <td>Clouds</td> <td>"+json.clouds.all+"%</td> </tr> <tr> <td>Visibility</td> <td>"+visibility+"</td> </tr>  </table>"; 
            document.getElementById("description").innerHTML = "<p> Weather description in the city:  "+json.weather[0].description+"</p>";

            //try, catch blocks are maintained so that the program catches error(without terminating) when rain and snow parameters are 'undefined'
            //Collects the rain, snow parameter values from json IF they are defined
            try {
                var rains = JSON.stringify(json["rain"]["3h"]);
                var snows = JSON.stringify(json["snow"]["3h"]);
            }
            catch(err) {
                //Rain or snow parameters for the given city are not defined i.e., no rain and snow have been recorded in the place for the past 3 hours
            }
            
            //This block gives suggestion to user based on rain and temperature parameters
            try {
            if(rains > 0) {
            document.getElementById("suggestion1").innerHTML = "<p>  Hey, It's raining. Take an umbrella when you go outside </p>";
            }
            else if (json.main.temp < 68) {
            document.getElementById("suggestion1").innerHTML = "<p>  Hey, It's chilling outside. Make sure to carry a jacket when you step out </p>";
            }
            else {
            document.getElementById("suggestion1").innerHTML = "<p>  Normal weather outside with no rain </p>";
            }
            }
            catch(err) {
                // Caught the error because of undefined value of rain
            }

            try {
            if(snows > 0){
            document.getElementById("suggestion2").innerHTML = "<p> It snowing. Make sure to take necessary precautions when you go out </p>"
            }
            }
            catch(err) {
                // Caught the error because of undefined value of snow which means that no snow has been recorded that the given city
            }

            //To get the icon value in weather data
            var logo = json.weather[0].icon;
            var logoUrl = "http://openweathermap.org/img/w/" + logo + ".png";
            document.getElementById("logo").innerHTML = "<img src="+logoUrl+">";
        }
    };
    xhr.send(null);
}
