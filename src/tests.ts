// Terminal tests for the seat manager: four rooms in different states.
// Run with: npm run tests

import {
  createSeatingChart,
  showRoom,
  reserveSeat,
  countSeats,
  findTwoTogether,
} from "./seats";

// --- Test 1: empty room (no bookings) ---
const emptyRoom = createSeatingChart();
console.log("--- Empty room ---");
showRoom(emptyRoom);
const [emptyOccupied, emptyAvailable] = countSeats(emptyRoom);
console.log("Occupied: " + emptyOccupied + ", Available: " + emptyAvailable);
const emptyPair = findTwoTogether(emptyRoom);
if (emptyPair !== null) {
  console.log(
    "Two seats together are available: row " + emptyPair[0] + ", seats " + emptyPair[1] + " and " + emptyPair[2] + "."
  );
} else {
  console.log("No two seats together are available.");
}

// --- Test 2: partly filled room (1-3, 1-4 and 2-5 booked, then two failed bookings) ---
const partlyRoom = createSeatingChart();
console.log("--- Partly filled room ---");
console.log(reserveSeat(partlyRoom, 1, 3));
console.log(reserveSeat(partlyRoom, 1, 4));
console.log(reserveSeat(partlyRoom, 2, 5));
console.log(reserveSeat(partlyRoom, 1, 3)); // already taken
console.log(reserveSeat(partlyRoom, 8, 2)); // does not exist
showRoom(partlyRoom);
const [partlyOccupied, partlyAvailable] = countSeats(partlyRoom);
console.log("Occupied: " + partlyOccupied + ", Available: " + partlyAvailable);
const partlyPair = findTwoTogether(partlyRoom);
if (partlyPair !== null) {
  console.log(
    "Two seats together are available: row " + partlyPair[0] + ", seats " + partlyPair[1] + " and " + partlyPair[2] + "."
  );
} else {
  console.log("No two seats together are available.");
}

// --- Test 3: nearly full room (every seat booked except one scattered seat per row) ---
const nearlyFullRoom = createSeatingChart();
// The seat left free in each row: row 0 keeps seat 2, row 1 keeps seat 6, and so on.
const freeSeatInRow = [2, 6, 0, 9, 4, 7, 1, 5];
let nearlyBooked = 0;
for (let row = 0; row < 8; row++) {
  for (let seat = 0; seat < 10; seat++) {
    if (seat !== freeSeatInRow[row]) {
      reserveSeat(nearlyFullRoom, row, seat);
      nearlyBooked++;
    }
  }
}
console.log("--- Nearly full room ---");
console.log("Booked " + nearlyBooked + " seats.");
showRoom(nearlyFullRoom);
const [nearlyOccupied, nearlyAvailable] = countSeats(nearlyFullRoom);
console.log("Occupied: " + nearlyOccupied + ", Available: " + nearlyAvailable);
const nearlyPair = findTwoTogether(nearlyFullRoom);
if (nearlyPair !== null) {
  console.log(
    "Two seats together are available: row " + nearlyPair[0] + ", seats " + nearlyPair[1] + " and " + nearlyPair[2] + "."
  );
} else {
  console.log("No two seats together are available.");
}

// --- Test 4: full room (all 80 seats booked) ---
const fullRoom = createSeatingChart();
let fullBooked = 0;
for (let row = 0; row < 8; row++) {
  for (let seat = 0; seat < 10; seat++) {
    reserveSeat(fullRoom, row, seat);
    fullBooked++;
  }
}
console.log("--- Full room ---");
console.log("Booked " + fullBooked + " seats.");
showRoom(fullRoom);
const [fullOccupied, fullAvailable] = countSeats(fullRoom);
console.log("Occupied: " + fullOccupied + ", Available: " + fullAvailable);
const fullPair = findTwoTogether(fullRoom);
if (fullPair !== null) {
  console.log(
    "Two seats together are available: row " + fullPair[0] + ", seats " + fullPair[1] + " and " + fullPair[2] + "."
  );
} else {
  console.log("No two seats together are available.");
}

export {};
