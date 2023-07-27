"use strict";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

let map;
let mapEvent;

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      const { latitude, longitude } = pos.coords;
      const userCoord = [latitude, longitude];
      map = L.map("map").setView(userCoord, 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(userCoord)
        .addTo(map)
        .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
        .openPopup();

      map.on("click", (mapEv) => {
        mapEvent = mapEv;
        form.classList.remove("hidden");
        inputDistance.focus();
        //console.log(lat, lng);
      });
    },
    function () {
      alert("Вы не предоставили вашу геолокацию");
    }
  );

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    inputDistance.value = inputCadence.value = inputDuration.value = "";
    const { lat, lng } = mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(
        L.popup({
          autoClose: false,
          className: "mark-popup",
          closeOnClick: false,
        })
      )
      .openPopup()
      .setPopupContent("workout");
  });
}

inputType.addEventListener("change", function (e) {
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
});
