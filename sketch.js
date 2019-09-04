// TODO: check history:
// https://github.com/generative-design/Code-Package-p5.js/commits/master/02_M/M_1_5_02/sketch.js
//
// M_1_5_02
//
// Generative Gestaltung – Creative Coding im Web
// ISBN: 978-3-87439-902-9, First Edition, Hermann Schmidt, Mainz, 2018
// Benedikt Groß, Hartmut Bohnacker, Julia Laub, Claudius Lazzeroni
// with contributions by Joey Lee and Niels Poldervaart
// Copyright 2018
//
// http://www.generative-gestaltung.de
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * noise values (noise 2d) are used to animate a bunch of agents.
 *
 * KEYS
 * 1-2                 : switch noise mode
 * space               : new noise seed
 * backspace           : clear screen
 * s                   : save png
 */

'use strict';


var sketch = function(p) {
  var agents = [];
  var agentCount = 3000;
  var noiseScale = 150;
  var noiseStrength = 6;
  var overlayAlpha = 10;
  var agentAlpha = 90;
  var strokeWidth = 0.3;
  var drawMode = 1;
  var isAgentBlack = 0;
  var serial;
  var portName = '/dev/cu.wchusbserial1410';
  var inData = 0.0;

  p.setup = function() {
    p.fullscreen(true);

    p.createCanvas(2000, 1200);

    for (var i = 0; i < agentCount; i++) {
      agents[i] = new Agent();
    }
    serial = new p5.SerialPort();
    serial.on('data', function() {
      inData = Number(serial.read());
      //console.log(inData * 360 / 255);
    });     // callback for when new data arrives
    var options = { baudRate: 115200 };
    serial.open(portName, options);
  };

  p.draw = function() {
    p.fill(255 * isAgentBlack, overlayAlpha);
    p.noStroke();
    p.rect(0, 0, p.width, p.height);

    // Draw agents
    p.stroke(255 * (1 - isAgentBlack), agentAlpha);

    let angle = (inData * 360. / 255)*3.14159/180;
    angle *= p.noise(p.frameCount/300); // add a touch of randomness

    for (var i = 0; i < agentCount; i++) {
      if (drawMode == 1) {
        agents[i].update1(noiseScale, noiseStrength, strokeWidth, angle);
      } else
        agents[i].update2(noiseScale, noiseStrength, strokeWidth);
    }
  };

  p.keyReleased = function() {
    if (p.key == 's' || p.key == 'S') p.saveCanvas(gd.timestamp(), 'png');
    if (p.key == '1') drawMode = 1;
    if (p.key == '2') drawMode = 2;
    if (p.key == ' ') {
      var newNoiseSeed = p.floor(p.random(10000));
      p.noiseSeed(newNoiseSeed);
    }
    if (p.keyCode == p.DELETE || p.keyCode == p.BACKSPACE) {
      isAgentBlack ^= 1; // toggle
    }
  };
};

var myp5 = new p5(sketch);
