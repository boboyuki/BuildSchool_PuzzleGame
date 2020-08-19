let range = $('#blocks');
let rangeLabel = $("label[for='blocks']");
let puzzles = $('#puzzles');
let start = $('.start');
let auto = $('.auto');
let reset = $('.reset');
let number = 0;
let puzzleArr = [];
reset.attr('disabled', true);
range.on('change', function () {
  rangeLabel.text(`調整塊數${range.val()}x${range.val()}`);
  if (start.attr('disabled') === 'disabled') {
    setPuzzle();
  }
});

start.click(function () {
  setPuzzle();
  upsetPuzzle();
  $(this).attr('disabled', true);
  range.attr('disabled', true);
  reset.attr('disabled', false);
});
reset.click(function () {
  setPuzzle();
  start.attr('disabled', false);
  range.attr('disabled', false);
});
function setPuzzle() {
  number = parseInt(range.val());
  puzzles.empty();
  for (let i = 0; i < number * number; i++) {
    let div = $(`<div class='puzzle'></div>`);
    let img = $("<img src='https://picsum.photos/500/500/?random=45'>");
    // 計算列行公式
    let row = parseInt(i / number);
    let col = i % number;
    // 答案
    puzzleArr.push(i);
    div
      .css('height', `calc(100% / ${number})`)
      .css('width', `calc(100% / ${number})`)
      .css('overflow', 'hidden')
      .attr('id', `${i}`);
    img
      .css('margin-left', (col * -1 * 500) / number)
      .css('margin-top', (row * -1 * 500) / number);
    div.append(img);
    puzzles.append(div);
  }
  $('.puzzle:first-child img').css('opacity', '0');
}
$('#puzzles').click(function (e) {
  let puzzleId = $(`div#${$(e.target).parent().attr('id')}`);
  console.log(e.target,puzzleId.attr('id'));
  if (puzzleId.attr('id') !== '0') {
    let index = $('#puzzles').children().index(puzzleId)
    movePuzzle(index);
  }
  if (checkPuzzle()) {
    Swal.fire({
      icon: 'success',
      title: '成功通關',
      showConfirmButton: true,
      text: 'Something went wrong!',
    });
  }
});

function movePuzzle(index) {
  if (isEmpty(index + number)) {
    move(index, index + number);
  } else if (isEmpty(index - number)) {
    move(index, index - number);
  } else if (isEmpty(index + 1) && (index + 1) % number !== 0) {
    move(index, index + 1);
  } else if (isEmpty(index - 1) && (index - 1) % number !== number - 1) {
    move(index, index - 1);
  }
}
function isEmpty(index) {
  if (index >= 0 && $(`.puzzle`).eq(index).attr('id') === '0') {
    return true;
  } else {
    return false;
  }
}

function move(fromIndex, toIndex) {
  // 先把原本區塊存起來，不然會fromIndex的區塊刪掉，toIndex存取不到
  let toIndexBlock = $('.puzzle').eq(toIndex).prop('outerHTML');
  let fromIndexBlock = $('.puzzle').eq(fromIndex).prop('outerHTML');
  $('.puzzle').eq(fromIndex).after(toIndexBlock);
  $('.puzzle').eq(fromIndex).remove();
  $('.puzzle').eq(toIndex).after(fromIndexBlock);
  $('.puzzle').eq(toIndex).remove();
}

function checkPuzzle() {
  let currentArr = [];
  $('.puzzle').each(function () {
    currentArr.push(this.id);
  });
  let currentAns = currentArr.toString();
  let puzzleAns = puzzleArr.toString();
  if (puzzleAns === currentAns && puzzleAns !== '') {
    return true;
  }
}

function upsetPuzzle() {
  let time = 0;
  for (let i = 0; i < number * number * 100; i++) {
    let randomStep = parseInt(Math.random() * (number * number));
    if ($('.puzzle').eq(randomStep).attr('id') !== 0) {
      movePuzzle(randomStep);
    }
  }
  // 判斷 迴圈跑完是否還是答案
  if (checkPuzzle()) {
    return upsetPuzzle();
  }
}
