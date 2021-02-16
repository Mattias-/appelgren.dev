const text = {
  content: "Hello World",
  x: 50,
  y: 200,
};
const font = "Permanent Marker";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

WebFont.load({
  google: {
    families: [font],
  },
});
ctx.font = "150px " + font;

// Screen makes cyan + magenta = white
ctx.globalCompositeOperation = "screen";

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
    }, getRandomInt(500, 2000));
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
  constructor() {
    super();
  }

  drawOn() {
    let y = getRandomInt(50, 200);
    let imageData2 = ctx.getImageData(20, y, 1600, 3);
    let dx = getRandomInt(-15, 15);
    ctx.putImageData(imageData2, 20 + dx, y);
  }
}

class TextShiftFlicker extends Flicker {
  constructor(text, color, dx, dxMult) {
    super();
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
    ctx.fillStyle = this.color;
    ctx.fillText(
      this.text.content,
      this.text.x + this.dx + this.dx2,
      this.text.y
    );
  }
}

(function () {
  function main() {
    window.requestAnimationFrame(main);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    cyan.draw();
    magenta.draw();
    line1.draw();
    line2.draw();
    line3.draw();
  }
  let cyan = new TextShiftFlicker(text, "rgba(0, 255, 255, 1)", -5, 1);
  let magenta = new TextShiftFlicker(text, "rgba(255, 0, 255, 1)", 5, -1);
  let line1 = new LineShiftFlicker();
  let line2 = new LineShiftFlicker();
  let line3 = new LineShiftFlicker();

  main(); // Start the cycle
})();
