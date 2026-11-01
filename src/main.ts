if (typeof document !== "undefined") {
  import("./style.css").then(() => {
    const app = document.querySelector<HTMLParagraphElement>("#app");
    if (app) {
      app.textContent = "If you can see this, Tailwind is working.";
    }
  });
}

console.log("Welcome to the Cinema Seat Manager.");

// Builds a brand new, empty cinema room.
// In:  nothing.
// Out: a number[][] grid of 8 rows with 10 seats each, every seat set to 0
//      (0 = available, 1 = occupied).
function createSeatingChart(): number[][] {
  const seats: number[][] = [];

  for (let row = 0; row < 8; row++) {
    const rowSeats: number[] = [];

    for (let seat = 0; seat < 10; seat++) {
      rowSeats.push(0);
    }

    seats.push(rowSeats);
  }

  return seats;
}

// Prints the seat map so staff can see which seats are free or taken.
// In:  the seats grid (number[][]). It is only read, never changed.
// Out: nothing is returned. It prints a legend, the seat numbers 0 to 9
//      across the top, then one line per row with L (free) or X (taken).
function showRoom(seats: number[][]): void {
  console.log("Seat map (L = free, X = taken):");

  // Header line: two spaces for the row-number column, then 0 to 9.
  let header = "  ";
  for (let seat = 0; seat < seats[0].length; seat++) {
    header += " " + seat;
  }
  console.log(header);

  // One line per row: row number, then X or L for each seat.
  for (let row = 0; row < seats.length; row++) {
    let line = row + " ";
    for (let seat = 0; seat < seats[row].length; seat++) {
      if (seats[row][seat] === 1) {
        line += " X";
      } else {
        line += " L";
      }
    }
    console.log(line);
  }
}

// Books one seat for a customer.
// In:  the seats grid (number[][]), a row number (0 to 7) and a seat/column
//      number (0 to 9).
// Out: a string sentence for the staff. The seat is set to 1 only when the
//      booking works; a taken seat or a seat outside the room is left alone.
function reserveSeat(seats: number[][], row: number, column: number): string {
  // Seat outside the room: change nothing.
  if (row < 0 || row > 7 || column < 0 || column > 9) {
    return "Reservation failed: row " + row + ", seat " + column + " does not exist.";
  }

  // Seat already taken: leave it as it is.
  if (seats[row][column] === 1) {
    return "Reservation failed: row " + row + ", seat " + column + " is already taken.";
  }

  seats[row][column] = 1;
  return "Reservation confirmed: row " + row + ", seat " + column + ".";
}

// Counts how full the room is.
// In:  the seats grid (number[][]). It is only read, never changed.
// Out: a pair [occupied, available]: how many seats are 1 and how many are 0.
function countSeats(seats: number[][]): [number, number] {
  let occupied = 0;
  let available = 0;

  for (let row = 0; row < seats.length; row++) {
    for (let seat = 0; seat < seats[row].length; seat++) {
      if (seats[row][seat] === 1) {
        occupied++;
      } else {
        available++;
      }
    }
  }

  return [occupied, available];
}

// Finds two free seats next to each other for a couple.
// In:  the seats grid (number[][]). It is only read, never changed.
// Out: [row, leftSeat, rightSeat] for the first free pair found, searching
//      row 0 to 7 and left to right, or null if no such pair exists.
function findTwoTogether(seats: number[][]): [number, number, number] | null {
  for (let row = 0; row < seats.length; row++) {
    // Stop at the second-to-last seat so seat + 1 always exists.
    for (let seat = 0; seat < seats[row].length - 1; seat++) {
      if (seats[row][seat] === 0 && seats[row][seat + 1] === 0) {
        return [row, seat, seat + 1];
      }
    }
  }

  return null;
}

// --- Test 1: empty room (no bookings) ---
const emptyRoom = createSeatingChart();
console.log("--- Empty room ---");
showRoom(emptyRoom);
const [emptyOccupied, emptyAvailable] = countSeats(emptyRoom);
console.log("Occupied seats: " + emptyOccupied + ". Available seats: " + emptyAvailable + ".");
const emptyPair = findTwoTogether(emptyRoom);
if (emptyPair !== null) {
  console.log(
    "Two seats together are available: row " + emptyPair[0] + ", seats " + emptyPair[1] + " and " + emptyPair[2] + "."
  );
} else {
  console.log("No two seats together are available.");
}

// --- Test 2: partly filled room (1-3, 1-4 and 2-5 booked) ---
const partlyRoom = createSeatingChart();
reserveSeat(partlyRoom, 1, 3);
reserveSeat(partlyRoom, 1, 4);
reserveSeat(partlyRoom, 2, 5);
console.log("--- Partly filled room ---");
showRoom(partlyRoom);
const [partlyOccupied, partlyAvailable] = countSeats(partlyRoom);
console.log("Occupied seats: " + partlyOccupied + ". Available seats: " + partlyAvailable + ".");
const partlyPair = findTwoTogether(partlyRoom);
if (partlyPair !== null) {
  console.log(
    "Two seats together are available: row " + partlyPair[0] + ", seats " + partlyPair[1] + " and " + partlyPair[2] + "."
  );
} else {
  console.log("No two seats together are available.");
}

// --- Test 3: nearly full room (odd seats booked in every row) ---
const nearlyFullRoom = createSeatingChart();
for (let row = 0; row < 8; row++) {
  for (let seat = 1; seat < 10; seat += 2) {
    reserveSeat(nearlyFullRoom, row, seat);
  }
}
console.log("--- Nearly full room ---");
showRoom(nearlyFullRoom);
const [nearlyOccupied, nearlyAvailable] = countSeats(nearlyFullRoom);
console.log("Occupied seats: " + nearlyOccupied + ". Available seats: " + nearlyAvailable + ".");
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
for (let row = 0; row < 8; row++) {
  for (let seat = 0; seat < 10; seat++) {
    reserveSeat(fullRoom, row, seat);
  }
}
console.log("--- Full room ---");
showRoom(fullRoom);
const [fullOccupied, fullAvailable] = countSeats(fullRoom);
console.log("Occupied seats: " + fullOccupied + ". Available seats: " + fullAvailable + ".");
const fullPair = findTwoTogether(fullRoom);
if (fullPair !== null) {
  console.log(
    "Two seats together are available: row " + fullPair[0] + ", seats " + fullPair[1] + " and " + fullPair[2] + "."
  );
} else {
  console.log("No two seats together are available.");
}

export {};
