// @ts-ignore
import init, { Game } from "../dist/lib";

import { App } from "./App";
import Engine from "./engine";
import Renderer2D, { RendererOptions } from "./engine/Renderer2D";
import EventsManager, { EventObject } from "./engine/EventsManager";
import { Vec2 } from "./type";

window.addEventListener("load", () => {
  init().then(() => {
    const app = new App("app", "Tetris");
    app.render();

    //
    const game: Game = new Game();

    // data
    const rendererOptions: RendererOptions = (() => {
      const rows = game.board.length;
      const columns = game.board[0].length;
      const resolution: Vec2 = [30, 30];

      return {
        width: columns * resolution[0],
        height: rows * resolution[1],
        backgroundColor: [200, 220, 220, 1],
        resolution,
      };
    })();

    const eventObjects: EventObject<any>[] = [
      {
        name: "click",
        eventType: "click",
        $target: app.$container.querySelector("#scene")!,
        dataCallback: ($target: HTMLCanvasElement, event: MouseEvent) => {
          const rect = $target.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;

          return {
            position: [x, y],
          };
        },
      } as EventObject<HTMLCanvasElement>,
      {
        name: "move-to",
        eventType: "keyup",
        $target: document,
        dataCallback: ($target: Document, event: KeyboardEvent) => {
          let direction = null;

          switch (event.key) {
            case "ArrowUp":
              direction = "up";
              break;

            case "ArrowDown":
              direction = "down";
              break;

            case "ArrowLeft":
              direction = "left";
              break;

            case "ArrowRight":
              direction = "right";
              break;

            default:
              break;
          }

          return {
            direction,
          };
        },
      } as EventObject<Document>,
    ];

    // setup
    const renderer = new Renderer2D(
      app.$container.querySelector("#scene")!,
      rendererOptions
    );
    const eventsManager = new EventsManager(eventObjects);
    const engine = new Engine(renderer);

    // bind
    eventsManager.addEventListener(eventObjects[0].name, (data: any) => {
      if (!data.position) {
        return;
      }

      console.log("click:", data.position);
    });
    eventsManager.addEventListener(eventObjects[1].name, (data: any) => {
      if (!data.direction) {
        return;
      }

      console.log("move:", data.direction);
    });

    // loop
    engine.start(() => {
      app.debug(
        (game.board as number[][]).reduce(
          (_result, row) => _result + row.join(" ") + "\n",
          ""
        )
      );
    });
  });
});
