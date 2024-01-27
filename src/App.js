import './App.css';
import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  const squareClassName = isWinningSquare ? 'square winning-square' : 'square';

  return (
    <button className={squareClassName} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function renderBoardRows(squares, onSquareClick, winningLine) {
  const board = [];

  for (let row = 0; row < 3; row++) {
    const squaresInRow = [];

    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      squaresInRow.push(
        <Square 
          key={index} 
          value={squares[index]} 
          onSquareClick={() => onSquareClick(index)} 
          isWinningSquare={winningLine && winningLine.includes(index)}
        />
      );
    }

    board.push(
      <div key={row} className='board-row'>
        {squaresInRow}
      </div>
    );
  }

  return board;
}

function Board({ xIsNext, squares, onPlay }) {
  const [winningLine, setWinningLine] = useState(null);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    setWinningLine(null);

    const winnerInfo = calculateWinner(nextSquares);
  
    if (winnerInfo) {
      setWinningLine(winnerInfo.line);
    }

    onPlay(nextSquares);
  }

  const winnerInfo = calculateWinner(squares);
  let status;

  if (winnerInfo) {
    status = `${winnerInfo.winner} wins!`;
  } else {
    status = `It's ${(xIsNext ? 'X' : 'O')}'s turn`;
  }

  return (
    <>
      <div className='status'>{status}</div>
      {renderBoardRows(squares, handleClick, winningLine)}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className='game'>
      <div className='game-board'>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default Game;
