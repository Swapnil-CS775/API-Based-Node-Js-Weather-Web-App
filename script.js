const condition=document.querySelector(".condition");
const dateElement = document.querySelector('.date');
const temprature="{%tempratureStatus%}";
let cityName="";

if(temprature=="Sunny")
{
    condition.innerHTML="<img src='sunny.svg' alt=''>"
}
else if(temprature=="Clouds")
{
    condition.innerHTML="<img src='cloudy.svg' alt=''>"
}
else if(temprature=="Haze")
{
    condition.innerHTML="<img src='haze.svg' alt=''>"
}


const getCurrentDate=()=>{
    const currTime = new Date();
    const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const day = weekDays[currTime.getDay()];
    const date = currTime.toDateString();
    const currentDate=date.split(" ").slice(1).join(" ");
    const time = currTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    dateElement.innerHTML = `${day} | ${currentDate} | ${time}`;
    console.log(`${day} | ${currentDate} | ${time}`);
}

getCurrentDate();

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("weatherForm");
    const cityInput = document.getElementById("cityInput");

    // Handle form submission
    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get the value of the city input
        cityName = cityInput.value;

        // Fetch weather data asynchronously
        fetch(`/?city=${cityName}`)
            .then(response => response.text())
            .then(data => {
                // Update the page content with the received data
                document.body.innerHTML = data;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    });

    // Handle Enter key press to trigger form submission
    cityInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            form.dispatchEvent(new Event("submit")); // Trigger form submission event
        }
    });
});
