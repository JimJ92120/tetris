use serde::{Deserialize, Serialize};

// mod helpers;
// use helpers::*;

// mod js;
// use js::*;

type Board = Vec<Vec<usize>>;

//
#[derive(Debug, Serialize, Deserialize)]
pub struct Tetris {
    board: Board,
}

// missing checks for position in range
impl Tetris {
    pub fn new() -> Self {
        Self {
            board: Tetris::new_board(),
        }
    }

    // getters
    pub fn board(&self) -> Board {
        self.board.clone()
    }

    fn new_board() -> Board {
        let columns = 10;
        let rows = 20;

        let row: Vec<usize> = (0..columns).into_iter().map(|_| 0).collect();

        (0..rows).into_iter().map(|_| row.clone()).collect()
    }
}
