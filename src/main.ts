// Cinema Seat Manager: the box office tool the staff use in the terminal.
// Run with: npm run console

import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import {
  createSeatingChart,
  showRoom,
  reserveSeat,
  countSeats,
  findTwoTogether,
} from "./seats";

if (typeof document !== "undefined") {
  import("./style.css").then(() => {
    const app = document.querySelector<HTMLParagraphElement>("#app");
    if (app) {
      app.textContent = "If you can see this, Tailwind is working.";
    }
  });
}

// Prints the menu the staff choose from.
// In:  nothing.
// Out: nothing is returned. It prints the five numbered choices.
function showMenu(): void {
  console.log("");
  console.log("What would you like to do?");
  console.log("1 Show the room");
  console.log("2 Book a seat");
  console.log("3 Show the counts");
  console.log("4 Find two seats together");
  console.log("5 Quit");
}

// Turns what the staff member typed into a whole number.
// In:  the text typed at the prompt.
// Out: the number, or null if the text is not a whole number (letters, blank,
//      decimals and so on).
function parseWholeNumber(text: string): number | null {
  const trimmed = text.trim();
  if (trimmed === "") {
    return null;
  }
  const value = Number(trimmed);
  if (!Number.isInteger(value)) {
    return null;
  }
  return value;
}

// Runs the box office: one room, then the menu loop until the staff quit.
// In:  nothing.
// Out: nothing is returned. Everything is printed to the terminal.
async function runBoxOffice(): Promise<void> {
  const seats = createSeatingChart();
  const rl = readline.createInterface({ input: stdin, output: stdout });

  console.log("Welcome to the Cinema Seat Manager.");
  showRoom(seats);

  let running = true;
  while (running) {
    showMenu();
    const choice = (await rl.question("Type a number and press Enter: ")).trim();

    if (choice === "1") {
      showRoom(seats);
    } else if (choice === "2") {
      const rowText = await rl.question("Row number (0 to 7): ");
      const row = parseWholeNumber(rowText);
      if (row === null) {
        console.log("That is not a valid row. Please type a whole number from 0 to 7.");
        continue;
      }

      const seatText = await rl.question("Seat number (0 to 9): ");
      const seat = parseWholeNumber(seatText);
      if (seat === null) {
        console.log("That is not a valid seat. Please type a whole number from 0 to 9.");
        continue;
      }

      // reserveSeat handles seats outside the room and seats already taken.
      console.log(reserveSeat(seats, row, seat));
      showRoom(seats);
    } else if (choice === "3") {
      const [occupied, available] = countSeats(seats);
      console.log("Occupied: " + occupied + ", Available: " + available);
    } else if (choice === "4") {
      const pair = findTwoTogether(seats);
      if (pair !== null) {
        console.log(
          "Two seats together are available: row " + pair[0] + ", seats " + pair[1] + " and " + pair[2] + "."
        );
      } else {
        console.log("No two seats together are available.");
      }
    } else if (choice === "5") {
      running = false;
    } else {
      console.log("That is not a menu choice. Please type a number from 1 to 5.");
    }
  }

  console.log("Goodbye.");
  rl.close();
}

runBoxOffice();
