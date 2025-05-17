'use client';

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import toast, { Toaster } from 'react-hot-toast';

export default function ChessBoardComponent() {
  const [game, setGame] = useState(new Chess());
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');

  const safeGameMutate = (modify: (game: Chess) => void): Chess => {
    const updated = new Chess(game.fen());
    modify(updated);
    setGame(updated);
    return updated;
  };

  const isMoveLegal = (from: string, to: string) => {
    const moves = game.moves({ verbose: true });
    return moves.some((m) => m.from === from && m.to === to);
  };

  const makeMove = (from: string, to: string): boolean => {
    if (!isMoveLegal(from, to)) return false;

    let move = null;
    const updatedGame = safeGameMutate((game) => {
      move = game.move({ from, to, promotion: 'q' });
    });

    // Flip the board to the current turn player after move
    setBoardOrientation(updatedGame.turn() === 'w' ? 'white' : 'black');

    if (updatedGame.isGameOver()) {
      let message = 'Game over!';

      if (updatedGame.isCheckmate()) {
        const winner = updatedGame.turn() === 'w' ? 'Black' : 'White';
        message = `Checkmate! ${winner} wins.`;
      } else if (updatedGame.isStalemate()) {
        message = "Stalemate! It's a draw.";
      } else if (updatedGame.isDraw()) {
        message = 'Draw!';
      }

      setGameOverMessage(message);
      toast.success(message, { duration: 10000 });
    } else {
      setGameOverMessage(null);
    }

    return move !== null;
  };

  const handlePieceDrop = (
    sourceSquare: string,
    targetSquare: string,
    piece: string
  ): boolean => {
    if (gameOverMessage) return false;
    return makeMove(sourceSquare, targetSquare);
  };

  const restartGame = () => {
    setGame(new Chess());
    setGameOverMessage(null);
    setBoardOrientation('white'); // reset to white on restart
  };

  return (
    <>
      <style>
        {`
          /* Responsive container to stack button and board */
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 40px 20px;
            min-height: 100vh;
            background-color: #121212;
            color: #fff;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }

          .button-container {
            margin-bottom: 20px;
            width: 100%;
            display: flex;
            justify-content: center;
          }

          button {
            padding: 12px 28px;
            font-size: 18px;
            cursor: pointer;
            border-radius: 8px;
            border: none;
            background-color: #1e90ff;
            color: #fff;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(30,144,255,0.6);
            transition: background-color 0.3s ease;
            max-width: 300px;
            width: 100%;
          }

          button:hover {
            background-color: #3ea0ff;
          }

          .chessboard-container {
            box-shadow: 0 8px 20px rgba(0,0,0,0.8);
            border-radius: 12px;
          }

          h1 {
            font-size: 36px;
            margin-bottom: 30px;
            text-align: center;
          }

          /* For wider screens, put button below the board */
          @media (min-width: 600px) {
            .container {
              flex-direction: column;
            }

            .button-container {
              order: 2;
              margin-top: 30px;
              margin-bottom: 0;
            }

            .chessboard-container {
              order: 1;
            }
          }
        `}
      </style>

      <div className="container">
        <h1>♟️ Chess Game</h1>

        <div className="button-container">
          <button onClick={restartGame}>Restart Game</button>
        </div>

        <div className="chessboard-container">
          <Chessboard
            position={game.fen()}
            onPieceDrop={handlePieceDrop}
            boardWidth={480}
            customLightSquareStyle={{ backgroundColor: '#eee' }}
            customDarkSquareStyle={{ backgroundColor: '#666' }}
            boardOrientation={boardOrientation}
          />
        </div>
      </div>

      <Toaster position="top-center" />
    </>
  );
}
