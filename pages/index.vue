<template>
  <div class="flex text-white">
    <div class="flex items-center justify-center w-full">
      <div id="gameArea" class="w-full max-h-screen"></div>
    </div>
    <footer class="fixed bottom-0 flex justify-between w-full px-4 pb-4 left">
      <div class="w-32">
        <div class="flex items-center justify-start w-full h-1/2">
          <button
            @mousedown="isTurningLeft = true"
            @mouseleave="isTurningLeft = false"
            @mouseup="isTurningLeft = false"
            @touchstart="isTurningLeft = true"
            @touchend="isTurningLeft = false"
            @touchcancel="isTurningLeft = false"
            class="w-16 h-16 text-2xl bg-gray-700 bg-opacity-75 border-2 border-white rounded-full"
          >
            ◀
          </button>
        </div>
        <div class="flex items-center justify-end w-full h-1/2">
          <button
            @mousedown="isTurningRight = true"
            @mouseleave="isTurningRight = false"
            @mouseup="isTurningRight = false"
            @touchstart="isTurningRight = true"
            @touchend="isTurningRight = false"
            @touchcancel="isTurningRight = false"
            class="w-16 h-16 text-2xl bg-gray-700 bg-opacity-75 border-2 border-white rounded-full"
          >
            ▶
          </button>
        </div>
      </div>
      <div class="w-32">
        <div class="flex items-center justify-end w-full h-1/2">
          <button
            @mousedown="isMoving = true"
            @mouseleave="isMoving = false"
            @mouseup="isMoving = false"
            @touchstart="isMoving = true"
            @touchend="isMoving = false"
            @touchcancel="isMoving = false"
            class="w-16 h-16 text-2xl bg-gray-700 bg-opacity-75 border-2 border-white rounded-full"
          >
            C
          </button>
        </div>
        <div class="flex items-center justify-start w-full h-1/2">
          <button
            @mousedown="isMoving = true"
            @mouseleave="isMoving = false"
            @mouseup="isMoving = false"
            @touchstart="isMoving = true"
            @touchend="isMoving = false"
            @touchcancel="isMoving = false"
            class="w-16 h-16 text-2xl bg-gray-700 bg-opacity-75 border-2 border-white rounded-full"
          >
            D
          </button>
        </div>
      </div>
    </footer>
    <footer v-if="isDev" class="fixed bottom-0 left-0 w-full mb-3">
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
      isDev: false,

      Engine: Matter.Engine,
      Render: Matter.Render,
      World: Matter.World,
      Bodies: Matter.Bodies,
      Body: Matter.Body,
      Events: Matter.Events,

      engine: null,
      render: null,

      canvas: {
        w: 1600,
        h: 900,
      },

      worldSize: 10000,

      player: null,
      isMoving: false,
      isTurningLeft: false,
      isTurningRight: false,

      players: [],
      asteroids: [],
    };
  },
  mounted() {
    this.canvas.w = window.innerWidth;
    this.canvas.h = window.innerHeight;
    this.start();
    window.addEventListener("keydown", this.keyHandlerStart, false);
    window.addEventListener("keyup", this.keyHandlerStop, false);

    this.Events.on(this.render, "afterRender", this.centerCameraOnPlayer)
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
          pixelRatio: '1',
          background: "transparent",
          wireframeBackground: "transparent",
          enabled: true,
          wireframes: false,
          showVelocity: true,
          showAngleIndicator: false,
          showCollisions: true,
          hasBounds: true
        },
      });

      this.engine.world.gravity.y = 0;

      let walls = [
        // Parede Esquerda
        this.Bodies.rectangle((this.worldSize / 2) * -1, 0, 50, this.worldSize, {
          friction: 0,
          isStatic: true,
        }),
        // Parede Direita
        this.Bodies.rectangle(this.worldSize / 2, 0, 50, this.worldSize,
          { friction: 0, isStatic: true }
        ),
        this.Bodies.rectangle(0, this.worldSize / 2, this.worldSize, 50, {
          friction: 0,
          isStatic: true,
        }),
        this.Bodies.rectangle(0, (this.worldSize / 2) * -1, this.worldSize, 50, {
          friction: 0,
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
      for (let i = 0; i < 20; i++) {
        this.addAsteroid();
      }
    },

    // =============== CAMERAS =============== \\
    centerCameraOnPlayer() {
      if (this.player) {
        console.log("a");
        this.Render.lookAt(this.render, this.player, {x: 0, y: (this.canvas.h - 48) / 2})        
      }      
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
            this.player.angularVelocity - 1 / 250
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
            this.player.angularVelocity + 1 / 250
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
        let triangle = this.Bodies.trapezoid(0, 0, 34, 48, 1, {
          render: {
            sprite: {
              texture: "/img/player.png",
            },
          },
        });
        if (me) {
          this.player = triangle;
        }
        triangle.friction = 0.05;
        triangle.mass = 3;
        this.players.push(triangle);
        this.World.add(this.engine.world, triangle);
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
      let x = Math.floor((Math.random() * this.worldSize) + 1) - this.worldSize / 2;
      let y = Math.floor((Math.random() * this.worldSize) + 1) - this.worldSize / 2;
      let asteroid = null;
      if (type == 1) {
        asteroid = this.Bodies.polygon(x, y, 8, 11, {
          render: {
            sprite: {
              texture: "/img/asteroid-xs.png",
            },
          },
        });
        asteroid.mass = 1;
      } else if (type == 2) {
        asteroid = this.Bodies.polygon(x, y, 8, 17, {
          render: {
            sprite: {
              texture: "/img/asteroid-sm.png",
            },
          },
        });
        asteroid.mass = 2;
      } else if (type == 3) {
        asteroid = this.Bodies.polygon(x, y, 8, 25, {
          render: {
            sprite: {
              texture: "/img/asteroid-md.png",
            },
          },
        });
        asteroid.mass = 3;
      } else {
        asteroid = this.Bodies.polygon(x, y, 8, 41, {
          render: {
            sprite: {
              texture: "/img/asteroid-lg.png",
            },
          },
        });
        asteroid.mass = 4;
      }
      asteroid.friction = 0.05;
      this.asteroids.push(asteroid);
      this.World.add(this.engine.world, asteroid);
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