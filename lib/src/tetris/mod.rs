use serde::{Deserialize, Serialize};

// mod helpers;
// use helpers::*;

// mod js;
// use js::*;

mod piece;
use piece::*;

type Board = Vec<Vec<usize>>;

//
#[derive(Debug, Serialize, Deserialize)]
pub struct Tetris {
    rows: usize,
    columns: usize,
    board: Board,
    current_piece: Piece,
}

// missing checks for position in range
impl Tetris {
    pub fn new() -> Self {
        let rows: usize = 20;
        let columns: usize = 10;

        Self {
            rows,
            columns,
            board: Tetris::new_board(columns, rows),
            current_piece: Tetris::new_piece([columns.div_euclid(2), 0]),
        }
    }

    // getters
    pub fn board(&self) -> Board {
        self.board.clone()
    }

    pub fn current_piece(&self) -> Piece {
        self.current_piece.clone()
    }

    // static
    fn new_board(columns: usize, rows: usize) -> Board {
        let row: Vec<usize> = (0..columns).into_iter().map(|_| 0).collect();

        (0..rows).into_iter().map(|_| row.clone()).collect()
    }

    fn new_piece(position: Position) -> Piece {
        Piece::new(position)
    }

    //
    pub fn next(&mut self) -> bool {
        if !self.is_in_board([
            self.current_piece.position[0] as isize,
            self.current_piece.position[1] as isize,
        ]) {
            return false;
        }

        self.current_piece.position[1] += 1;

        true
    }

    pub fn update_current_piece_position(&mut self, positionOffset: [isize; 2]) -> bool {
        let new_position: [isize; 2] = [
            self.current_piece.position[0] as isize + positionOffset[0],
            self.current_piece.position[1] as isize + positionOffset[1],
        ];

        if !self.is_in_board(new_position) {
            return false;
        }

        self.current_piece.position = [new_position[0] as usize, new_position[1] as usize];

        true
    }

    //
    fn is_in_board(&self, position: [isize; 2]) -> bool {
        0 <= position[0]
            && self.columns as isize > position[0]
            && 0 <= position[1]
            && self.rows as isize > position[1]
    }
}
