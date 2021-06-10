'use strict';

(() => {
  class PuzzleRenderer {
    constructor(puzzle, canvasN) {
      this.puzzle = puzzle; //
      this.canvas = canvas;
      this.ctx = this.canvas.getContext('2d');
      this.TILE_SIZE = 70; // размер 1 плитки 280/4=70
      this.img = document.createElement('img'); // создается элемент img
      this.img.src = 'img/animal3.png'; // по пути img/..
      this.img.addEventListener('load', () => {
        this.render();
      });
      this.canvas.addEventListener('click', e => { // добавляет действие на клик мышью
        if (this.puzzle.getCompletedStatus()) {
          document.getElementById("")
          return;
        }

        const rect = this.canvas.getBoundingClientRect(); // переменная отвечающая за обьект, его размеры и положение
        const col = Math.floor((e.clientX - rect.left) / this.TILE_SIZE); // колона
        const row = Math.floor((e.clientY - rect.top) / this.TILE_SIZE); // строка
        this.puzzle.swapTiles(col, row);


        this.render();
        if (this.puzzle.isComplete()) {
          this.puzzle.setCompletedStatus(true);
        }
      });
    }

    render() { // рендер фукция
      for (let row = 0; row < this.puzzle.getBoardSize(); row++) { // кол-во строк
        for (let col = 0; col < this.puzzle.getBoardSize(); col++) { // кол-во колон

          this.renderTile(this.puzzle.getTile(row, col), col, row);
        }
      }
    }

    renderTile(n, col, row) { // алгорим рендера плитки
      if (n === this.puzzle.getBlankIndex()) {
        this.ctx.fillStyle = '#eee'; // окрашиваем ячкйку в белый цвет
        this.ctx.fillRect(col * this.TILE_SIZE, row * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE);
      } else {
        this.ctx.drawImage(
          this.img,
          (n % this.puzzle.getBoardSize()) * this.TILE_SIZE, Math.floor(n / this.puzzle.getBoardSize()) * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE,
          col * this.TILE_SIZE, row * this.TILE_SIZE, this.TILE_SIZE, this.TILE_SIZE
        );
      }

    }
  }

  class Puzzle { // массив игрового поля
    constructor(level) {
      this.level = level;
      this.tiles = [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
      ];
      this.UDLR = [
        [0, -1], // up
        [0, 1], // down
        [-1, 0], // left
        [1, 0], // right
      ];
      this.isCompleted = false;
      this.BOARD_SIZE = this.tiles.length; // размер размер границ
      this.BLANK_INDEX = this.BOARD_SIZE ** 2 - 1;
      do {
        this.shuffle(this.level);
      } while (this.isComplete());
    }

    getBoardSize() { // Возвращает длину
      return this.BOARD_SIZE;
    }

    getBlankIndex() { // возвращает индекс поля
      return this.BLANK_INDEX;
    }

    getCompletedStatus() {
      return this.isCompleted;
    }

    setCompletedStatus(value) { // врзвращает знаение клетки
      this.isCompleted = value;
    }

    getTile(row, col) { // возвращает данные ячейки плитки
      return this.tiles[row][col];
    }

    shuffle(n) { // алгоритм перетасовки игрового поля
      let blankCol = this.BOARD_SIZE - 1;
      let blankRow = this.BOARD_SIZE - 1;

      for (let i = 0; i < n; i++) {
        let destCol;
        let destRow;
        do {
          const dir = Math.floor(Math.random() * this.UDLR.length);
          destCol = blankCol + this.UDLR[dir][0];
          destRow = blankRow + this.UDLR[dir][1];
        } while (this.isOutside(destCol, destRow));

        [
          this.tiles[blankRow][blankCol],
          this.tiles[destRow][destCol],
        ] = [
          this.tiles[destRow][destCol],
          this.tiles[blankRow][blankCol],
        ];

        [blankCol, blankRow] = [destCol, destRow];
      }
    }

    swapTiles(col, row) { // алгоритм хода
      if (this.tiles[row][col] === this.BLANK_INDEX) {
        return;
      }

      for (let i = 0; i < this.UDLR.length; i++) {
        const destCol = col + this.UDLR[i][0];
        const destRow = row + this.UDLR[i][1];

        if (this.isOutside(destCol, destRow)) {
          continue;

        }

        if (this.tiles[destRow][destCol] === this.BLANK_INDEX) {
          [
            this.tiles[row][col],
            this.tiles[destRow][destCol],
          ] = [
            this.tiles[destRow][destCol],
            this.tiles[row][col],
          ];
          count++; //счетчик хода увеличивается на 1
          break;
        }
      }
    }

    isOutside(destCol, destRow) {
      return (
        destCol < 0 || destCol > this.BOARD_SIZE - 1 ||
        destRow < 0 || destRow > this.BOARD_SIZE - 1
      );
    }

    isComplete() {
      let i = 0;
      for (let row = 0; row < this.BOARD_SIZE; row++) {
        for (let col = 0; col < this.BOARD_SIZE; col++) {
          if (this.tiles[row][col] !== i++) {
            return false;
          }
        }
      }
      return true;
    }
  }

  const canvas = document.querySelector('canvas'); // переменная элемента канвас
  if (typeof canvas.getContext === 'undefined') {
    return;
  }
  new PuzzleRenderer(new Puzzle(200), canvas);
})();


// счетчик JQuery
let count = 0;

$("#canvas").click(function () {
  $("#counter").html("Колиество использованных ходов: " + count);
});