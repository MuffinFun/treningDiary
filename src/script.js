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

class Workout {
  date = new Date();
  id = (Date.now() + " ").slice(-10);
  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
  }
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;
    this.calcSpeed();
  }
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

class App {
  _map;
  _mapEvent;
  _workouts = [];
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

    const validInputs = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));

    const allPositive = (...inputs) => inputs.every((inp) => inp > 0);

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this._mapEvent.latlng;

    let workout;

    if (type === "running") {
      const cadence = +inputCadence.value;
      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        return alert("You must write prime positive number!");
      }
      workout = new Running([lat, lng], distance, duration, cadence);
    }
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      ) {
        return alert("You must write prime positive number!");
      }
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }
    this._workouts.push(workout);

    console.log(this._workouts);

    inputElevation.value =
      inputDistance.value =
      inputCadence.value =
      inputDuration.value =
        "";

    this.renderWorkMarker(workout);
  }
  renderWorkMarker(workout) {
    L.marker(workout.coords)
      .addTo(this._map)
      .bindPopup(
        L.popup({
          autoClose: false,
          className: "mark-popup",
          closeOnClick: false,
        })
      )
      .openPopup()
      .setPopupContent(`${workout.distance + " "}`);
  }
}

const app = new App();
app._getPosition;
