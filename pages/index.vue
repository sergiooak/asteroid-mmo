<template>
  <div
    class="container h-screen mx-auto text-white"
  >
    <div class="flex flex-col justify-between w-full h-full py-6">
      <header class="mb-3">{{player}}</header>
      <div class="w-full aspect-w-16 aspect-h-9">
        <canvas width="1600px" height="900px" class="w-full bg-black"></canvas>
      </div>
      <footer>
        WIP
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
      canvas: null,
      ctx: null,

      player: {
        x: 0,
        y: 0,
        angle: 0,
        vel: 0,
      },

      playersSizes: {
        width: 100,
        height: 100,
      },

      fps: 30,
    };
  },
  mounted() {
    this.start();
  },
  methods: {
    start() {
      this.canvas = document.querySelector("canvas");
      this.ctx = this.canvas.getContext("2d");

      // Keys listeners
      window.addEventListener("keydown", this.keyHandler, false);

      // Reset player in the middle
      this.player.x = this.canvas.width / 2;
      this.player.y = this.canvas.height / 2;

      this.draw();
    },

    erase() {
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    async draw() {
      this.erase();

      // Desenha player
      this.calcPlayer();
      this.renderPlayer(
        this.player.x,
        this.player.y,
        this.playersSizes.width,
        this.playersSizes.height
      );

      await wait(1000 / this.fps);
      this.draw();
    },

    // Moviments
    speedUp() {
      this.player.vel++;
    },

    speedDown() {
      this.player.vel--;
    },

    angleRight() {
      this.player.angle+= 5;
    },

    angleLeft() {
      this.player.angle-= 5;
    },

    // Rederer
    renderPlayer(x, y, width, height) {
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate((this.player.angle * Math.PI) / 180);
      this.ctx.fillStyle = "#FF0000";
      this.ctx.fillRect(0 - width / 2, 0 - height / 2, width, height);
      this.ctx.restore();
      // this.ctx.rotate(0)
    },

    // Calc positions
    calcPlayer(){

    },

    // Utils
    keyHandler(e) {
      let code = e.keyCode;
      switch (code) {
        case 37:
          this.angleLeft();
          break; //Left key
        case 38:
          this.speedUp();
          break; //Up key
        case 39:
          this.angleRight();
          break; //Right key
        case 40:
          this.speedDown();
          break; //Down key
      }
    },
  },
};
</script>