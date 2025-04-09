// @ts-ignore
import init, { Game } from "../dist/lib";

import { App } from "./App";
import Engine from "./engine";
import Renderer2D, {
  RendererObject,
  RendererObjectType,
  RendererOptions,
} from "./engine/Renderer2D";
import EventsManager, { EventObject } from "./engine/EventsManager";
import { Vec2 } from "./type";

window.addEventListener("load", () => {
  init().then(() => {
    const app = new App("app", "Tetris");
    app.render();

    //
    const game: Game = new Game();
    console.log(game.current_piece, game.board);

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

    const currentPieceObject: RendererObject = {
      id: "current-piece",
      position: game.current_piece.position as Vec2,
      data: [
        [0, 0, 0],
        [0, 1, 0],
        [1, 1, 0],
        [1, 2, 0],
        [2, 2, 0],
        [2, 1, 0],
        [3, 1, 0],
        [3, 0, 0],
        [0, 0, 0],
      ],
      color: [255, 255, 0, 1],
      scale: [1, 1],
      rotation: [0, 0, 0],
      type: RendererObjectType.Filled,
    };

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
    renderer.add(currentPieceObject);
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

      let positionOffset: [number, number] = [0, 0];
      switch (data.direction) {
        case "down":
          positionOffset[1] = 1;
          break;

        case "left":
          positionOffset[0] = -1;
          break;

        case "right":
          positionOffset[0] = 1;
          break;

        default:
          break;
      }

      if (0 !== positionOffset[0] || 0 !== positionOffset[1]) {
        if (game.update_current_piece_position(positionOffset)) {
          currentPieceObject.position = game.current_piece.position;
        } else {
          console.error(
            `unable to update [${game.current_piece.position.join(
              ", "
            )}] with offset [${positionOffset.join(", ")}]`
          );
        }
      }
    });

    // loop
    let timestamp = Number((Date.now() / 1000).toFixed());
    engine.start(() => {
      app.debug(
        (game.board as number[][]).reduce(
          (_result, row) => _result + row.join(" ") + "\n",
          ""
        )
      );

      const now = Number((Date.now() / 1000).toFixed());
      if (timestamp < now) {
        timestamp = now;

        console.log(`next: ${game.next()}`);

        currentPieceObject.position = game.current_piece.position;
      }
    });

    setTimeout(() => {
      engine.stop();
    }, 60 * 1000);
  });
});
