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

class App {
  _map;
  _mapEvent;
  constructor() {
    this._getPosition();

    form.addEventListener("submit", this._newWorkout.bind(this));

    inputType.addEventListener("change", this._toogleField);
    
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("Вы не предоставили вашу геолокацию");
        }
      );
    }
  }

  _loadMap(pos) {
    const { latitude, longitude } = pos.coords;
    const userCoord = [latitude, longitude];
    this._map = L.map("map").setView(userCoord, 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this._map);

    L.marker(userCoord)
      .addTo(this._map)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();

    this._map.on("click", this._showForm.bind(this));
  }

  _showForm(mapEv) {
    this._mapEvent = mapEv;
    form.classList.remove("hidden");
    inputDistance.focus();
  }

  _toogleField() {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkout(e) {
    e.preventDefault();
    inputElevation.value =
      inputDistance.value =
      inputCadence.value =
      inputDuration.value =
        "";
    const { lat, lng } = this._mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this._map)
      .bindPopup(
        L.popup({
          autoClose: false,
          className: "mark-popup",
          closeOnClick: false,
        })
      )
      .openPopup()
      .setPopupContent("workout");
  }
}

const app = new App();
app._getPosition;
