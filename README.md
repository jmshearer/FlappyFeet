# FlappyFeet
FlappyFeet game using a laser time-of-flight sensor for the 2023 [Annville Church of the Brethren](https://www.annvillecob.org) Trunk-Or-Treat.

## Run it yourself
1) Clone the repo
2) Load (repo)\game\flappy.html in a browser
3) If no joystick is connected, use arrow keys to move up/down.  Connect a joystick for absolute positioning based on the Y-axis.

If you're really ambitious, keep reading about how we built this to interface with a laser time-of-flight sensor in place of a joystick.

## Build your own
The crux of the project is the ability to sense a player's distance and get that information into a form that can be used by JavaScript.  For that task we chose to emulate a joystick, which is great for analog inputs and can be easily accessed via JavaScript.

### Hardware
The following parts comprised the sensor and USB joystick emulator:

- [Banner LTF12IC2LDQ Time-Of-Flight Laser Sensor](https://www.bannerengineering.com/us/en/products/part.94849.html) - This is overkill for this project but I had several on-hand.  The salient information is that it provides a 12V 4ma-20ma output that is proportional to the detected distance.  Adding a 250 ohm resistor converts this to a 0-5vdc output that can be fed into the ADC of a microcontroller.  Note that there would be a number of other sensors that can do this (ultrasonic, time-of-flight, radar)--the important point is to just get a 0-5vdc output that is linearly correlated to distance.
- [Digispark ATTINY85 USB Development Board](http://digistump.com/products/1) - A great little microcontroller: cheap, has an analog input, programmable with the Arduino IDE, has lots of demos, and can act as a HID like a JoyStick with minimal programming.
- [Pololu 5V Step-Up Voltage Regulator](https://www.pololu.com/product/2562) - Steps the 5VDC from the USB bus up to 12VDC for use by the time-of-flight sensor.

The parts are assembled as follows:

![Joystick / LTOF Interface](Documentation/LTOF%20Joystick%20Interface.jpg)

...and can even be contained entirely on the DigiSpark.  Note that the reistor in my circuit is 240Ω instead of 250Ω--it's what I had on hand and cleaner than the four 1K's in parallel on the prototype.


![Assembled PCB](Documentation/Assembled%20PCB.jpg)

We've now created a LTOF to USB interface.

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

## References
- [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
