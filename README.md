If we want to add script in head section then we must add the keyword defer.
  <script src="script.js" defer></script>

VT323 font is used because it gives retro vibe.

   const head={...snake[0]};
This is copy of snake first element
.unshift helps in appending the head to the snake element.hence, in movement we are appending the head to the start and removing the last element.

   score.textContent=currentScore.toString().padStart(3,'0');
The above line indicates:
Length of the score should be 3 digits, if not add 0 to the start
