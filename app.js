const PPTX = require("nodejs-pptx");
let pptx = new PPTX.Composer();
const {spawn} = require("child_process");
const addShape=require("./addShape")

shapeslist = JSON.parse(process.argv[2]);
inputimagename = process.argv[3];
finalshape = [];

for (shape of shapeslist) {
  cx = shape[3];
  cy = shape[4];

  if (cx > 15 && cy > 15) {
    finalshape.push(shape);
  }
}

const run = async () => {
  addShape.addShape(finalshape)

  process = spawn("python", ["./addBorder.py", `${finalshape.length}`, inputimagename]);

  process.stdout.on("data", async data => {
    textData = eval(data.toString());
    await pptx.load(`./shapes-test.pptx`);
    await pptx.compose(async pres => {
      for (let i = 0; i < textData.length; i++) {
        await pres.getSlide("slide1").addText(text => {
          text
            .value(textData[i][0])
            .x(textData[i][1])
            .y(textData[i][2])
            .fontFace("Alien Encounters")
            .fontSize(20)
            .textColor("000000")
            .textWrap("none")
            .textAlign("left")
            .textVerticalAlign("center");
        });
      }
    });

    await pptx.save(`./shapes-test.pptx`);
  });
};

run();
