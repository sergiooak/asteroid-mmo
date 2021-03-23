<template>
  <div class="flex text-white">
    <div class="flex items-center justify-center w-full">
      <div id="gameArea" class="w-full max-h-screen aspect-w-16 aspect-h-9"></div>
    </div>
    <footer class="fixed bottom-0 left-0 w-full mb-3">
      <button @click="addPlayer" class="px-6 py-3 border border-white">
        Add Players
      </button>
      <button @click="removePlayer" class="px-6 py-3 ml-6 border border-white">
        Remove Player
      </button>
      <span class="ml-6">Player: {{ players.length }}</span>
      <button @click="addAsteroid" class="px-6 py-3 border border-white">
        Add Asteroid
      </button>
      <button
        @click="removeAsteroid"
        class="px-6 py-3 ml-6 border border-white"
      >
        Remove Asteroid
      </button>
      <span class="ml-6">Asteroids: {{ asteroids.length }}</span>
    </footer>
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
      isMoving: false,
      isTurningLeft: false,
      isTurningRight: false,

      players: [],
      asteroids: [],
    };
  },
  mounted() {
    this.start();
    window.addEventListener("keydown", this.keyHandlerStart, false);
    window.addEventListener("keyup", this.keyHandlerStop, false);
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

    // =============== CONTROLS =============== \\
    async speedUp() {
      while (this.isMoving) {
        this.Body.setVelocity(this.player, {
          x: this.player.velocity.x + Math.cos(this.player.angle - 1.5) / 3,
          y: this.player.velocity.y + Math.sin(this.player.angle - 1.5) / 3,
        });
        await wait(1000 / 30);
      }
    },
    async rotateLeft() {
      while (this.isTurningLeft) {
        if (this.player.angularVelocity > -0.1) {
          this.Body.setAngularVelocity(
            this.player,
            this.player.angularVelocity - 1 / 75
          );
        }
        await wait(1000 / 30);
      }
    },
    async rotateRight() {
      while (this.isTurningRight) {
        if (this.player.angularVelocity < 0.1) {
          this.Body.setAngularVelocity(
            this.player,
            this.player.angularVelocity + 1 / 75
          );
        }
        await wait(1000 / 30);
      }
    },

    // ============== SPAWNNERS ============== \\
    // Players
    async addPlayer(me) {
      let i = 0;
      while (i < 1) {
        const map = (value, x1, y1, x2, y2) =>
          ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
        let x = map(Math.random(), 0, 1, 0 + 20, this.canvas.w - 20);
        let box = this.Bodies.rectangle(x, this.canvas.h / 2, 34, 58, {
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
    async removePlayer() {
      Matter.Composite.remove(
        this.engine.world,
        this.players[this.players.length - 1]
      );
      this.players.pop();
    },

    // Asteroids
    async addAsteroid() {
      const map = (value, x1, y1, x2, y2) =>
        ((value - x1) * (y2 - x2)) / (y1 - x1) + x2;
      let type = Math.floor(Math.random() * 4) + 1;
      console.log(type);
      let x = Math.floor(Math.random() * this.canvas.w) + 1;
      let y = Math.floor(Math.random() * this.canvas.h) + 1;
      let box = null;

      if (type == 1) {
        box = this.Bodies.rectangle(x, y, 22, 22, {
          render: {
            sprite: {
              texture: "/img/asteroid-xs.png",
            },
          },
        });
      } else if (type == 2) {
        box = this.Bodies.rectangle(x, y, 35, 34, {
          render: {
            sprite: {
              texture: "/img/asteroid-sm.png",
            },
          },
        });
      } else if (type == 3) {
        box = this.Bodies.rectangle(x, y, 53, 49, {
          render: {
            sprite: {
              texture: "/img/asteroid-md.png",
            },
          },
        });
      } else {
        box = this.Bodies.rectangle(x, this.canvas.h / 2, 89, 76, {
          render: {
            sprite: {
              texture: "/img/asteroid-lg.png",
            },
          },
        });
      }
      this.asteroids.push(box);
      this.World.add(this.engine.world, box);
    },
    async removeAsteroid() {
      Matter.Composite.remove(
        this.engine.world,
        this.asteroids[this.asteroids.length - 1]
      );
      this.asteroids.pop();
    },

    // ================ UTILS ================ \\
    keyHandlerStart(e) {
      let code = e.keyCode;
      switch (code) {
        case 37:
          this.isTurningLeft = true;
          break; //Left key
        case 38:
          this.isMoving = true;
          break; //Up key
        case 39:
          this.isTurningRight = true;
          break; //Right key
      }
    },
    keyHandlerStop(e) {
      let code = e.keyCode;
      switch (code) {
        case 37:
          this.isTurningLeft = false;
          break; //Left key
        case 38:
          this.isMoving = false;
          break; //Up key
        case 39:
          this.isTurningRight = false;
          break; //Right key
      }
    },
  },
  watch: {
    isMoving(newVal, oldVal) {
      if (newVal == true) {
        this.speedUp();
        this.player.render.sprite.texture = "/img/player-moving.png";
      } else {
        this.player.render.sprite.texture = "/img/player.png";
      }
    },
    isTurningLeft(newVal, oldVal) {
      if (newVal == true) {
        this.rotateLeft();
      }
    },
    isTurningRight(newVal, oldVal) {
      if (newVal == true) {
        this.rotateRight();
      }
    },
  },
};
</script>