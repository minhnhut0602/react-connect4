import matches from './matches';

/**
 * Board class
 */
export default class Board {

  /**
   * Board constructor
   * @return {Void}
   */
  constructor(dsclient, player) {
    /**
     * Ref this
     */
    const boardRef = this;

    /**
     * Deepstream client
     */
    boardRef.dsclient = dsclient;
    
    /**
     * Player object
     */
    tboardRefhis.player = player;

    /**
     * Multidimentional array containing our default empty grid
     * @type {Array}
     */
    boardRef.grid = [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0]
    ];

    /**
     * Keeping track of how many pieces have been inserted
     * @type {Number}
     */
    boardRef.inserts = 0;

    /**
     * Grid record
     */
    boardRef.boardRecord = boardRef.dsclient.record.getRecord('board')

    if (boardRef.player.color === 'red') {
      boardRef.dsclient.record.setData('board', {
        grid: [
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0]
        ],
        nextPlayer: 'blue',
        redPlayerInserts: boardRef.inserts,
        bluePlayerInserts: boardRef.inserts
      })
    }

    boardRef.boardRecorfd.whenReady(() => {
      boardRef.boardRecord.subscribe(board => {
        boardRef.grid = board.grid
        boardRef.nextPlayer = board.nextPlayer
        boardRef.isActive = boardRef.nextPlayer === boardRef.player.color
      })
    })

    /**
     * String containing next player
     * @type {String}
     */
    boardRef.nextPlayer = boardRef.player.color === 'red' ? 'blue' : 'red';

    /**
     * Board is active for red players on start (disables when somebody wins)
     * @type {Boolean}
     */
    boardRef.isActive = boardRef.player.color === 'red' ? true : false;

    boardRef.isWinner = false

    boardRef.boardRecord.event.subscribe('game-over', data => {
      boardRef.isActive = false
      boardRef.isWinner = boardRef.player.color === data.winner
    })
  }


  /**
   * Adds piece to grid column
   * @param {Number} columnIndex
   * @param {String} piece
   */
  addPiece(columnIndex, piece) {

    // Column and piece index
    let column = this.grid[columnIndex];
    let cellIndex = -1;

    // Loops through column, looking for zeros (to determine next available cell)
    column.forEach((columnPiece, i) => {
      if (columnPiece === 0) {
        cellIndex = i;
      }
    });

    // Did we find an available cell?
    if (cellIndex >= 0) {

      // Adds piece to column cell
      column[cellIndex] = piece;

      const boardRef = this;

      // Increase inserts count
      boardRef.inserts++;

      boardRef.nextPlayer = refreshPlayer(this.inserts);

      boardRef.boardRecord.set({
        grid: boardRef.grid,
        nextPlayer: boardRef.nextPlayer,
        [boardRef.player.color + 'PlayerInserts']: boardRef.inserts
      })

      // Makes board innactive if somebody won
      if (boardRef.didSomebodyWin()) {
        boardRef.emit('winner', true)
      }
    }
  }

  /**
   * Did somebody win?
   * @return {Bool} [description]
   */
  didSomebodyWin() {

    // Trying to look for matches
    return matches(this.grid);

  }
}


/**
 * 
 * Private properties
 * 
 */


/**
 * List of available players
 * @type {Array}
 */
let availablePlayers = [
  'red',
  'blue'
];

/**
 * Whose turn is it to play?
 * @param  {Number} inserts
 * @return {String}
 */
function refreshPlayer(inserts) {
  return availablePlayers[inserts % 2];
}
