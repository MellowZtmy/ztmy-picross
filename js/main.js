// グリッドとメッセージ表示用の要素を取得
const $grid = $('#grid');
const $message = $('#message');

// ピクロスの解答データ（1が塗りつぶし、0が空白）
const solution = [
  [0, 1, 1, 0, 0],
  [1, 0, 0, 1, 1],
  [1, 1, 1, 0, 0],
  [0, 0, 1, 0, 1],
  [0, 1, 1, 1, 0],
];

// 行のヒントを生成する関数
function getRowHints(row) {
  const hints = []; // ヒントを格納する配列
  let count = 0; // 連続した1の数をカウント

  // 行の各セルをチェック
  row.forEach((cell) => {
    if (cell === 1) {
      count++; // 1ならカウントを増やす
    } else if (count > 0) {
      hints.push(count); // 連続が途切れたらヒントに追加
      count = 0; // カウントをリセット
    }
  });

  // 最後の連続した1をヒントに追加
  if (count > 0) hints.push(count);

  // ヒントが空なら'0'を返す（空行の場合）
  return hints.length ? hints.join('\n') : '0';
}

// 列のヒントを生成する関数
function getColHints(colIndex) {
  // 指定された列のデータを取得
  const col = solution.map((row) => row[colIndex]);
  // 行のヒント生成関数を再利用
  return getRowHints(col);
}

// 全セルを格納する配列
const cells = [];

// グリッドを生成
for (let row = -1; row < 5; row++) {
  // -1はヒント行/列を表す
  for (let col = -1; col < 5; col++) {
    // セル要素を作成
    const $cell = $('<div></div>').addClass('cell');

    if (row === -1 && col === -1) {
      // 左上の空白セル（何も表示しない）
      $cell.addClass('hint').text('');
    } else if (row === -1) {
      // 上部の列ヒントセル
      $cell
        .addClass('hint') // ヒント用のスタイルを適用
        .css('white-space', 'pre') // 改行を反映させる
        .text(getColHints(col)); // 縦列のヒントを表示
    } else if (col === -1) {
      // 左側の行ヒントセル
      $cell.addClass('hint').text(getRowHints(solution[row]));
    } else {
      // 通常のグリッドセル
      $cell
        .data('state', 'empty') // 初期状態は空
        .data('row', row) // 行インデックスを保存
        .data('col', col) // 列インデックスを保存
        .css('background-color', '#33334d') // 初期背景色
        .on('click', function () {
          // セルがクリックされたときの動作
          const state = $cell.data('state'); // 現在の状態を取得
          if (state === 'empty') {
            // 空のセルを塗りつぶし状態に変更
            $cell
              .css('background-color', '#000') // 塗りつぶし色
              .text('') // テキストを空に
              .data('state', 'filled'); // 状態を更新
          } else if (state === 'filled') {
            // 塗りつぶし状態を「×」状態に変更
            $cell
              .css('background-color', '#33334d') // 背景色を戻す
              .text('✕') // 「×」を表示
              .css('color', '#bb86fc') // テキスト色
              .data('state', 'x'); // 状態を更新
          } else {
            // 「×」状態を空に戻す
            $cell
              .css('background-color', '#33334d') // 背景色を戻す
              .text('') // テキストを空に
              .data('state', 'empty'); // 状態を更新
          }
          autoCheck(); // 自動チェックを実行
        });

      // セルを配列に追加
      cells.push($cell);
    }

    // セルをグリッドに追加
    $grid.append($cell);
  }
}

// 自動チェック関数（正解判定）
function autoCheck() {
  let success = true; // 成功フラグ

  // 全セルをチェック
  for (const $cell of cells) {
    const row = parseInt($cell.data('row')); // 行インデックス
    const col = parseInt($cell.data('col')); // 列インデックス

    const correct = solution[row][col] === 1; // 解答データと比較
    const filled = $cell.data('state') === 'filled'; // 塗りつぶし状態か

    if (correct !== filled) {
      // 解答と一致しない場合は失敗
      success = false;
      break;
    }
  }

  // 成功ならメッセージを表示
  $message.text(success ? '🎉 クリアおめでとう！' : '');
}
