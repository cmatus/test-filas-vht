export function generateTicketNumber() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  let ticketNumber = "";

  // Generate 1 random letter
  ticketNumber += letters.charAt(Math.floor(Math.random() * letters.length));

  // Generate 2 random digits
  for (let i = 0; i < 2; i++) {
    ticketNumber += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return ticketNumber;
}
