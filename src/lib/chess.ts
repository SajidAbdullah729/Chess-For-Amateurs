import { Chess } from 'chess.js';

const game = new Chess();

export function makeMove(from: string, to: string) {
  return game.move({ from, to, promotion: 'q' });
}

export function getFen() {
  return game.fen();
}
