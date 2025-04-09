use serde::{Deserialize, Serialize};

pub type PieceVertices = [[usize; 4]; 4];
pub type Position = [usize; 2];

#[derive(Debug, Copy, Clone, Serialize, Deserialize)]
pub struct Piece {
    pub position: Position,
    vertices: PieceVertices,
}

// missing checks for position in range
impl Piece {
    pub fn new(position: Position) -> Self {
        Self {
            vertices: Piece::new_empty_vertices(),
            position,
        }
    }

    // getters
    pub fn vertices(&self) -> PieceVertices {
        self.vertices.clone()
    }

    // static
    fn new_empty_vertices() -> PieceVertices {
        [[0, 0, 0, 0], [0, 0, 0, 0], [0, 1, 0, 0], [1, 1, 1, 0]]
    }

    //
}
