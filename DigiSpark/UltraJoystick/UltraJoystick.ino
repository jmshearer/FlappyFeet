//DigiJoystick test and usage documentation

#include "DigiJoystick.h"
float voltage, current, sensorValue;

const int TRIGPIN=1;
const int ECHOPIN=2;


void setup() {
  // Do nothing? It seems as if the USB hardware is ready to go on reset
   pinMode(ECHOPIN, INPUT);
   pinMode(TRIGPIN, OUTPUT);
}

float duration;
float distance, inches, per;

const int numSamples = 15;  // Number of samples to average (can be adjusted for more smoothing)
float normSamples[numSamples];  // Array to store the past norm values
int sampleIndex = 0;  // Current index for storing the next sample
float normSum = 0;  // Sum of the samples for quick calculation of the average
float norm = 0;  // Smooth
float newNorm = 0;


void loop() {
  digitalWrite(TRIGPIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIGPIN, HIGH);
  delayMicroseconds(30);
  digitalWrite(TRIGPIN, LOW);  
  duration = pulseIn(ECHOPIN, HIGH, 75000);  
  distance = (duration / 2) * 0.343;
  inches = distance / 25.4;
  per = (inches)/20;
  //norm = 255*per;

  newNorm = 255 * per;

  // Update rolling average
  normSum = normSum - normSamples[sampleIndex];  // Subtract the oldest sample from the sum
  normSamples[sampleIndex] = newNorm;  // Replace the oldest sample with the new value
  normSum = normSum + newNorm;  // Add the new value to the sum

  // Move to the next index in the array (wrap around using modulus)
  sampleIndex = (sampleIndex + 1) % numSamples;

  // Calculate the smoothed norm as the average of the samples
  norm = normSum / numSamples;

  //norm = 128;


  
  // Or we can also set values like this:
  //DigiJoystick.setX((byte) (millis() / 100)); // scroll X left to right repeatedly
  DigiJoystick.setY((byte) norm);
  DigiJoystick.setX((byte) 0x80);
  DigiJoystick.setXROT((byte) 0x60);
  DigiJoystick.setYROT((byte) 0x90);
  DigiJoystick.setZROT((byte) 0xB0);
  DigiJoystick.setSLIDER((byte) 0xF0);
  
  // it's best to use DigiJoystick.delay() because it knows how to talk to
  // the connected computer - otherwise the USB link can crash with the 
  // regular arduino delay() function
  DigiJoystick.delay(10); // wait 50 milliseconds
  
  // we can also set buttons like this (lowByte, highByte)
  //DigiJoystick.setButtons(0x00, 0x00);
}