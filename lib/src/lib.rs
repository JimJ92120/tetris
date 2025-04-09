use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

mod tetris;
use tetris::*;

//
#[wasm_bindgen]
#[derive(Debug, Serialize, Deserialize)]
pub struct Game {
    tetris: Tetris,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            tetris: Tetris::new(),
        }
    }

    // getters
    #[wasm_bindgen(getter)]
    pub fn board(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.tetris.board().clone()).unwrap()
    }

    #[wasm_bindgen(getter)]
    pub fn current_piece(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.tetris.current_piece().clone()).unwrap()
    }

    //
    #[wasm_bindgen]
    pub fn next(&mut self) -> bool {
        self.tetris.next()
    }

    #[wasm_bindgen]
    pub fn update_current_piece_position(&mut self, position_offset: JsValue) -> bool {
        let position_offset: [isize; 2] = serde_wasm_bindgen::from_value(position_offset).unwrap();

        self.tetris.update_current_piece_position(position_offset)
    }
}
