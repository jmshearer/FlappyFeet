# FlappyFeet
FlappyFeet game using a laser time-of-flight sensor for the 2023 [Annville Church of the Brethren](https://www.annvillecob.org) Trunk-Or-Treat and using an ultrasonic sensor for the 2024 Trunk-Or-Treat [FlappyPotter](#flappypotter)

![Trunk-Or-Treat](Documentation/Trunk-Or-Treat%20Photo.jpg)

Players run forward to move the shoe ("flappy foot") up and backwards to move the shoe down.  Five difficulty levels increase pipe positioning and speed.  The game can also be used without a laser sensor using a joystick or just a keyboard.

## Run it yourself
1) Clone the repo
2) Load (repo)\game\flappy.html in a browser
3) If no joystick is connected, use arrow keys to move up/down.  Connect a joystick for absolute positioning based on the Y-axis.

If you're really ambitious, keep reading about how we built this to interface with a laser time-of-flight sensor in place of a joystick.

## Build your own
The crux of the project is the ability to sense a player's distance and get that information into a form that can be used by JavaScript.  For that task we chose to emulate a joystick, which is great for analog inputs and can be easily accessed via JavaScript.

### Hardware (Option 1 - More reliable, but expensive)
The following parts comprised the sensor and USB joystick emulator:

- [Banner LTF12IC2LDQ Time-Of-Flight Laser Sensor](https://www.bannerengineering.com/us/en/products/part.94849.html) - This is overkill for this project but I had several on-hand.  The salient information is that it provides a 12V 4ma-20ma output that is proportional to the detected distance.  Adding a 250 ohm resistor converts this to a 0-5vdc output that can be fed into the ADC of a microcontroller.  Note that there would be a number of other sensors that can do this (ultrasonic, time-of-flight, radar)--the important point is to just get a 0-5vdc output that is linearly correlated to distance.
- [Digispark ATTINY85 USB Development Board](http://digistump.com/products/1) - A great little microcontroller: cheap, has an analog input, programmable with the Arduino IDE, has lots of demos, and can act as a HID like a JoyStick with minimal programming.
- [Pololu 5V Step-Up Voltage Regulator](https://www.pololu.com/product/2562) - Steps the 5VDC from the USB bus up to 12VDC for use by the time-of-flight sensor.

The parts are assembled as follows:

![Joystick / LTOF Interface](Documentation/LTOF%20Joystick%20Interface.jpg)

...and can even be contained entirely on the DigiSpark.  Note that the reistor in my circuit is 240Ω instead of 250Ω--it's what I had on hand and cleaner than the four 1K's in parallel on the prototype.

![Assembled PCB](Documentation/Assembled%20PCB.jpg)

We've now created a LTOF to USB interface.

### Hardware (Option 2 - Less reliable, but cheap)
The initial iteration of this project used the LTOF sensor, but a subsequent fork of the project used the JSN SR04T ultrasonic sensor as a budget-friendly alternative.  Depsite manufacturer claims for 600cm sensing distance, I only found it accurate to around 60cm (24").  The code provided for the UltraJoystick includes a dampening function to smooth out the relatively noisy operation of the JSN SR04T.

- [JSN SR04T Ultrasonic Distance Module](https://www.amazon.com/Waterproof-Ultrasonic-JSN-SR04T-Integrated-Transducer/dp/B07FQCNXPP) - This is a much cheaper and easier solution than the LTOF, however I've not found it to be reliable beyond about 2' so mileage may vary. 
- [Digispark ATTINY85 USB Development Board](http://digistump.com/products/1) - A great little microcontroller: cheap, has an analog input, programmable with the Arduino IDE, has lots of demos, and can act as a HID like a JoyStick with minimal programming.

The parts are assembled as follows:

![Joystick / JSN SR04T Interface](https://github.com/jmshearer/FlappyFeet/blob/main/Documentation/Ultrasonic%20(JSN-SR04T)%20Joystick%20Interface.jpg)

### Programming the Microcontroller (Joystick Interface)
The Digispark ATTINY85 controller acts as a joystick HID.  The task is pretty simple--read 0-5vdc on the analog input line and output a byte in the range of 0-255 as the joystick's y axis.  The vast majority of the software is simply the demo provided by Digispark.  It's programmed using the Arduino IDE.

1) Follow instructions from [Starting Electronics](https://startingelectronics.org/tutorials/arduino/digispark/digispark-windows-setup/) to build the toolchain
2) Remember to install the driver (outlined in the instructions above) and to keep the Digispark unplugged from USB
3) Plug in the Digispark when prompted by the Arduino IDE when uploading

One "gotcha" on the Digispark is that P2 is read via analogRead(0).  While the other pins support analog input, they are also shared with other functions like USB and won't work for this application.  Trust me, stick with P2.

The microcontroller expects a 0-5vdc input on P2, which can be accomplished via a variety of sensors.  Just choose your resistor correctly based on the sensor output.

### Game Software
The game software is a lightweight version of "Flappy Birds" produced largely by [ChatGPT](https://chat.openai.com/).  It's written in HTML/CSS/JavaScript.  It is designed to accept input from a joystick, moving the "bird" to an absolute position based on the Y axis reading from the jotstick (-1 = top, 0 = center, 1 = bottom)

```
window.addEventListener("gamepadconnected", function(e) {
    console.log("Gamepad connected!", e.gamepad);    
});
```
To access the position:
```
var gamepadList = navigator.getGamepads();
if (gamepadList[0]) {			        
    var yPosition = gamepadList[0].axes[1];
}
```

**Note** You will likely need to tune the various timing and distance parameters, especially if you use the JSN-SR04T.

## Forks

### FlappyPotter
With relatively little modification, I created a "Harry Potter" themed version for our 2024 Trunk-Or-Treat that uses the JSN SR04T sensor to detect the height of a pivoting broom, allowing the "rider" to control the height of a flying Harry Potter by "flying" a broom.  In this implementaiton, Harry flew between bludgers instead of the columns.  The implementation was a pretty straightforward modification of the original FlappyFeet software.  Because of concerns of intellectual property, this fork is not publically available.  On the other hand, it's a great exercise for the reader!

![Trunk-Or-Treat](Documentation/FlappyPotter.jpg)

## References
Refer to [NOTICES.md](NOTICES.md) for all 3rd party licenses.  Some notable sources for this project:
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- [Konami.js](https://konamijs.mand.is/)
- [Flappy Feet Sprite](https://www.spriters-resource.com/fullview/59894/)
