
$(document).ready(function() {
  // --- our code goes here ---
  console.log('At the ready!')
  $('textarea').keyup(function() {
    const input = $(this);
    const count = input.val();
    const output = $('output');
    output.text(140 - `${count.length}`);
    if (output.val() < 0) {
      $('output').css('color', '#ff0000');
    } else {
      $('output').css('color', '#000000');
    }
  })
});