//
// At any time, the player can draw cards from the draw pile into the waste
// pile. If there are not enough cards in the draw pile, the waste pile is
// recycled back to the draw pile before drawing.
//
// The default draws one card at a time, but traditionally the game is made
// more challenging by drawing three at a time.
//

export function draw(board, count=1) {
  const { draw, waste } = board;
  
  const needToRecycle = draw.length < count;
  const source = needToRecycle ? waste.slice(0).reverse().concat(draw) : draw;
  const destination = needToRecycle ? [] : waste;

  const moved = source.slice(-count).reverse();
  const remaining = source.slice(0, -count);

  return {
    ...board,
    draw: remaining,
    waste: destination.concat(moved),
  }
}