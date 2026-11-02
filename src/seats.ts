// The five seat manager functions. The room is a plain two-dimensional
// array of numbers: 0 = available, 1 = occupied.

// Builds a brand new, empty cinema room.
// In:  nothing.
// Out: a number[][] grid of 8 rows with 10 seats each, every seat set to 0
//      (0 = available, 1 = occupied).
export function createSeatingChart(): number[][] {
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
export function showRoom(seats: number[][]): void {
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
export function reserveSeat(seats: number[][], row: number, column: number): string {
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
export function countSeats(seats: number[][]): [number, number] {
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
export function findTwoTogether(seats: number[][]): [number, number, number] | null {
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
