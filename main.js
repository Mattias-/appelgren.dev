const text = {
  content: "Mattias",
  x: 50,
  y: 200,
  font: "Permanent Marker",
  fontSize: "150px",
};

const ctx = document.getElementById("canvas").getContext("2d");
// Screen makes cyan + magenta = white
ctx.globalCompositeOperation = "screen";

WebFont.load({
  google: {
    families: [text.font],
  },
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

class Flicker {
  on = false;

  constructor() {
    this.flicker();
  }

  flicker() {
    var self = this;
    window.setTimeout(function () {
      self.on = true;
      window.setTimeout(function () {
        self.on = false;
        self.flicker();
      }, getRandomInt(100, 200));
    }, getRandomInt(500, 1000));
  }

  drawOn() {}

  drawOff() {}

  drawFinally() {}

  draw() {
    if (this.on) {
      this.drawOn();
    } else {
      this.drawOff();
    }
    this.drawFinally();
  }
}

class LineShiftFlicker extends Flicker {
  constructor(ctx) {
    super();
    this.ctx = ctx;
  }

  drawOn() {
    let y = getRandomInt(50, 200);
    let imageData2 = ctx.getImageData(20, y, 1600, 3);
    let dx = getRandomInt(-15, 15);
    this.ctx.putImageData(imageData2, 20 + dx, y);
  }
}

class TextShiftFlicker extends Flicker {
  constructor(ctx, text, color, dx, dxMult) {
    super();
    this.ctx = ctx;
    this.text = text;
    this.color = color;
    this.dx = dx;
    this.dx2 = 0;
    // dxMult is multiplier for the random effect.
    // Use -1 to decrease x shift, 1 to increase x shift.
    this.dxMult = dxMult;
  }

  drawOn() {
    this.dx2 = getRandomInt(5, 20) * this.dxMult;
  }

  drawOff() {
    this.dx2 = 0;
  }

  drawFinally() {
    this.ctx.fillStyle = this.color;
    this.ctx.font = `${this.text.fontSize} ${this.text.font}`;
    this.ctx.fillText(
      this.text.content,
      this.text.x + this.dx + this.dx2,
      this.text.y
    );
  }
}

(function () {
  function main() {
    window.requestAnimationFrame(main);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let fx of fxs) {
      fx.draw();
    }
  }

  let cyan = new TextShiftFlicker(ctx, text, "rgba(0, 255, 255, 1)", -5, 1);
  let magenta = new TextShiftFlicker(ctx, text, "rgba(255, 0, 255, 1)", 5, -1);
  let line1 = new LineShiftFlicker(ctx);
  let line2 = new LineShiftFlicker(ctx);
  let line3 = new LineShiftFlicker(ctx);
  let fxs = [
    cyan,
    magenta,
    line1,
    line2,
    line3,
  ];

  main(); // Start the cycle
})();
