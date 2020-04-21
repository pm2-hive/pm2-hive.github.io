const fs = require("fs");
const angle = (Math.PI * 2 * 10) / 360;

function getBG(isOdd) {
  const HEIGHT = 5000;
  const WIDTH = 5000;
  const pageWidth = 630;
  const position = isOdd
    ? WIDTH / 2 - pageWidth / 2
    : WIDTH / 2 + pageWidth / 2;
  const cornerSize = 78;
  const f = x => (WIDTH - x) * Math.tan(angle);
  const d = [
    `M 0 ${f(0) + cornerSize}`,
    `L ${position} ${f(position) + cornerSize}`,
    `L ${position + 22} ${f(position) + 10}`,
    `Q ${position + 30},${f(position + 35)} ${position + 45},${f(
      position + 45
    )}`,
    `L ${WIDTH} ${f(WIDTH)}`,
    `L ${WIDTH} ${HEIGHT}`,
    `L 0 ${HEIGHT}`
  ];

  return `\
  <svg viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <path d="${d.join(" ")}" fill="blue"/>
  </svg>
  `;
}

function getHexa() {
  const WIDTH = 300;
  const HEIGHT = 100;
  const center = [WIDTH - HEIGHT / 2, HEIGHT / 2];
  const p = Math.PI / 3;
  const radius = HEIGHT / 2;

  function c(d) {
    // This is the equation of an hexagon in a polar coordinate system
    // https://www.wolframalpha.com/input/?i=polar+plot+r%3Dsqrt(3)+%2F+(2+*+sin(theta+-+pi+%2F+3+*+(-1+%2B+floor(theta+%2F+(pi+%2F+3)))))+for+theta+%3D+0+to+pi+*+2
    const distance =
      Math.sqrt(3) / (
        2 * Math.sin(d - p * (-1  + Math.floor(d / p))))
    // Convert to our coordinate system
    const x = WIDTH - radius + Math.cos(d) * radius * distance
    const y = radius + Math.sin(d) * radius * distance
    return [x,y]
  }

  function corner(d) {
    const m = p * 0.1;
    return [
      `L ${c(d + m)}`,
      `Q ${c(d)} ${c(d - m)}`,
    ];
  }

  const m = p * 0.1;

  const d = [
    `M 0 ${c(p)[1]}`,
    ...corner(p),
    ...corner(0),
    ...corner(-p),
    `L 0 ${c(-p)[1]}`
  ];
  const extraHeight = WIDTH * Math.sin(Math.PI * 10 / 180)
  const extraWidth = HEIGHT * Math.sin(Math.PI * 10 / 180)
  return `\
  <svg viewBox="0 0 ${WIDTH + extraWidth} ${HEIGHT + extraHeight}" width="${WIDTH + extraWidth}" height="${HEIGHT + extraHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gradient">
        <stop offset="0%" stop-color="transparent" />
        <stop offset="90%" stop-color="black" />
      </linearGradient>
    </defs>
    <path
      d="${d.join(" ")}"
      fill="url(#gradient)"
      transform="rotate(-10) translate(0, ${extraHeight})"
    />
  </svg>
  `;
}

fs.writeFileSync("./assets/bg-odd.svg", getBG(true));
fs.writeFileSync("./assets/bg-even.svg", getBG(false));
fs.writeFileSync("./assets/hexa.svg", getHexa());
