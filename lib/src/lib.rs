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
}
