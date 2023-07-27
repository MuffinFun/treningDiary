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

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (pos) {
      console.log(pos);
      const { latitude, longitude } = pos.coords;
      const userCoord = [latitude, longitude];
      const map = L.map("map").setView(userCoord, 13);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(userCoord)
        .addTo(map)
        .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
        .openPopup();
    },
    function () {
      alert("Вы не предоставили вашу геолокацию");
    }
  );
}
