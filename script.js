const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAcessContainer = document.querySelector(".grant-location-container");
const searchContainer = document.querySelector(".form-container");
const loadingConatiner = document.querySelector(".loading-conatiner");
const userInfoContainer = document.querySelector(".user-information");


let currentTab = userTab;
currentTab.classList.add("current-tab");
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

getfromSessionStorage();
//switch Function

function switchTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchContainer.classList.contains("active")){
            grantAcessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchContainer.classList.add("active");
        }
        else{

            searchContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //agar pahle se location store hai to grant access pe nahi jao 

            getfromSessionStorage();

        }
    }
}
// switch Tab

userTab.addEventListener('click' , ()=>{
    switchTab(userTab);
});

searchTab.addEventListener('click' , ()=>{
    switchTab(searchTab);
});

//check if coordinates are present in session storage;

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        grantAcessContainer.classList.add("active");
    }
    else{

        const coordinates = JSON.parse(localCoordinates);
        fetchUserInfo(coordinates);
        // userInfoContainer.classList.add("active");
    }
}

async function fetchUserInfo(coordinates){
    const {lat , lon} = coordinates;

    // make grant container invisible

    grantAcessContainer.classList.remove("active");
    loadingConatiner.classList.add("active");

    //API CALL

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const result = await response.json();
        renderWeatherInfo(result);
        setTimeout(() => {
            loadingConatiner.classList.remove("active");
            userInfoContainer.classList.add("active");
        }, 500);
        
    }
    catch(er){
        loadingConatiner.classList.remove("active");
        console.log("Eror Occur " , er);
    }
}



function renderWeatherInfo(result){

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const weatherDesc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloud]");
    const temp = document.querySelector("[data-temp]");

    cityName.innerText =  result?.name;
    countryIcon.src =  `https://flagcdn.com/144x108/${result?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText = result?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${result?.weather?.[0]?.icon}.png`;
    temp.innerText = `${result?.main?.temp} °C`;
    windSpeed.innerText = `${result?.wind?.speed} m/s`;
    humidity.innerText = `${result?.main?.humidity} %`;
    clouds.innerText = `${result?.clouds?.all} %`;
}


const grantAccesbtn = document.querySelector("[grant-locaton-acess]");
grantAccesbtn.addEventListener('click' , getLoaction);

function getLoaction(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        //show alert for no geolocation
    }
}

function showposition(position){
    const userCordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates" , JSON.stringify(userCordinates));
    fetchUserInfo(userCordinates);
}

const searchform = document.querySelector("[data-searchForm]");
let searchInput = document.querySelector("[data-searchInput]");

searchform.addEventListener('submit' , (e) => {
    e.preventDefault();
    if(searchInput.value === "") return;
    fetchWeatherInfo(searchInput.value);
});

async function fetchWeatherInfo(city){
    loadingConatiner.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAcessContainer.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const result = await response.json();
        loadingConatiner.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(result);
    }
    catch(er){
        loadingConatiner.classList.remove("active");
        //handle HW
    }
    
}



