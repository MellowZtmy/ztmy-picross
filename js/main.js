const $grid = $('#grid');
const $message = $('#message');

const solution = [
  [0, 1, 1, 0, 0],
  [1, 0, 0, 1, 1],
  [1, 1, 1, 0, 0],
  [0, 0, 1, 0, 1],
  [0, 1, 1, 1, 0],
];

function getRowHints(row) {
  const hints = [];
  let count = 0;
  row.forEach((cell) => {
    if (cell === 1) {
      count++;
    } else if (count > 0) {
      hints.push(count);
      count = 0;
    }
  });
  if (count > 0) hints.push(count);
  return hints.length ? hints.join('\n') : '0';
}

function getColHints(colIndex) {
  const col = solution.map((row) => row[colIndex]);
  return getRowHints(col);
}

const cells = [];

for (let row = -1; row < 5; row++) {
  for (let col = -1; col < 5; col++) {
    const $cell = $('<div></div>').addClass('cell');

    if (row === -1 && col === -1) {
      $cell.addClass('hint').text('');
    } else if (row === -1) {
      $cell.addClass('hint').text(getColHints(col));
    } else if (col === -1) {
      $cell.addClass('hint').text(getRowHints(solution[row]));
    } else {
      $cell
        .data('state', 'empty')
        .data('row', row)
        .data('col', col)
        .css('background-color', '#33334d')
        .on('click', function () {
          const state = $cell.data('state');
          if (state === 'empty') {
            $cell
              .css('background-color', '#000')
              .text('')
              .data('state', 'filled');
          } else if (state === 'filled') {
            $cell
              .css('background-color', '#33334d')
              .text('✕')
              .css('color', '#bb86fc')
              .data('state', 'x');
          } else {
            $cell
              .css('background-color', '#33334d')
              .text('')
              .data('state', 'empty');
          }
          autoCheck();
        });

      cells.push($cell);
    }

    $grid.append($cell);
  }
}

function autoCheck() {
  let success = true;
  for (const $cell of cells) {
    const row = parseInt($cell.data('row'));
    const col = parseInt($cell.data('col'));

    const correct = solution[row][col] === 1;
    const filled = $cell.data('state') === 'filled';

    if (correct !== filled) {
      success = false;
      break;
    }
  }

  $message.text(success ? '🎉 クリアおめでとう！' : '');
}
