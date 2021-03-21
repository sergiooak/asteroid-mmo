<template>
  <div class="container h-screen mx-auto text-white">
    <div class="flex flex-col justify-between w-full h-full py-6">
      <header class="mb-3">
        <div v-if="player">
          <div class="flex flex-wrap">
            <button
          @click="jump()"
          class="px-6 py-3 ml-6 border border-white"
        >
          Anda
        </button>
        <button
          @click="down()"
          class="px-6 py-3 ml-6 border border-white"
        >
          Ré
        </button>
        <button
          @click="rotateLeft()"
          class="px-6 py-3 ml-6 border border-white"
        >
          Girar para esquerda
        </button>
        <button
          @click="rotateRight()"
          class="px-6 py-3 ml-6 border border-white"
        >
          Girar para direira
        </button>
          </div>
        </div>
      </header>
      <div id="gameArea" class="w-full aspect-w-16 aspect-h-9"></div>
      <footer>
        <button @click="addPlayer" class="px-6 py-3 border border-white">
          Add Players
        </button>
        <button
          @click="removePlayer"
          class="px-6 py-3 ml-6 border border-white"
        >
          Remove Player
        </button>
        <span class="ml-6">Player: {{ players.length }}</span>
      </footer>
    </div>
  </div>
</template>

<script>
import wait from "waait";
import Matter from "matter-js";

export default {
  name: "AsteroidsMMO",
  data() {
    return {
      Engine: Matter.Engine,
      Render: Matter.Render,
      World: Matter.World,
      Bodies: Matter.Bodies,
      Body: Matter.Body,

      engine: null,
      render: null,

      canvas: {
        w: 1600,
        h: 900,
      },

      player: null,
      players: [],
    };
  },
  mounted() {
    this.start();
    window.addEventListener("keydown", this.keyHandler, false);
  },
  methods: {
    start() {
      this.engine = this.Engine.create();
      this.render = this.Render.create({
        element: document.querySelector("#gameArea"),
        engine: this.engine,
        options: {
          width: this.canvas.w,
          height: this.canvas.h,
          pixelRatio: 1,
          background: "transparent",
          wireframeBackground: "transparent",
          enabled: true,
          wireframes: false,
          showVelocity: true,
          showAngleIndicator: false,
          showCollisions: true,
        },
      });

      this.engine.world.gravity.y = 0;

      let walls = [
        this.Bodies.rectangle(0 - 25, this.canvas.h / 2, 50, this.canvas.h, {
          isStatic: true,
        }),
        this.Bodies.rectangle(
          this.canvas.w + 25,
          this.canvas.h / 2,
          50,
          this.canvas.h,
          { isStatic: true }
        ),
        this.Bodies.rectangle(
          this.canvas.w / 2,
          this.canvas.h + 25,
          this.canvas.w,
          50,
          { isStatic: true }
        ),
        this.Bodies.rectangle(this.canvas.w / 2, 0 - 25, this.canvas.w, 50, {
          isStatic: true,
        }),
      ];

      // add all of the bodies to the world
      this.World.add(this.engine.world, walls);

      // run the engine
      this.Engine.run(this.engine);

      // run the renderer
      this.Render.run(this.render);

      this.addPlayer(true);
    },

    jump() {
      this.Body.setVelocity(this.player, {
        x: Math.cos(this.player.angle - 1.5) * 5,
        y: Math.sin(this.player.angle - 1.5) * 5,
      });
    },
    down() {
      this.Body.setVelocity(this.player, {
        x: Math.cos(this.player.angle - 1.5) * -5,
        y: Math.sin(this.player.angle - 1.5) * -5,
      });
    },
    rotateLeft() {
      if (this.player.angularVelocity > -0.1) {
        this.Body.setAngularVelocity(
          this.player,
          this.player.angularVelocity - 0.05
        );
      }
    },
    rotateRight() {
      if (this.player.angularVelocity < 0.1) {
        this.Body.setAngularVelocity(
          this.player,
          this.player.angularVelocity + 0.05
        );
      }
    },

    async addPlayer(me) {
      let i = 0;
      while (i < 1) {
        const map = (value, x1, y1, x2, y2) =>
          ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
        let x = map(Math.random(), 0, 1, 0 + 20, this.canvas.w - 20);
        let box = this.Bodies.rectangle(x, this.canvas.h / 2, 35, 51, {
          render: {
            sprite: {
              texture: "/img/player.png",
            },
          },
        });
        if (me) {
          this.player = box;
        }
        this.players.push(box);
        this.World.add(this.engine.world, box);
        await wait(50);
        i++;
      }
    },

    removePlayer() {
      Matter.Composite.remove(
        this.engine.world,
        this.players[this.players.length - 1]
      );
      this.players.pop();
    },

    // Utils
    keyHandler(e) {
      let code = e.keyCode;
      switch (code) {
        case 37:
          this.rotateLeft();
          break; //Left key
        case 38:
          this.jump();
          break; //Up key
        case 39:
          this.rotateRight();
          break; //Right key
        case 40:
          this.down();
          break; //Down key
      }
    },
  },
};
</script>