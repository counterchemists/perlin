//this code measures a variable resistance using a voltage divider
//and sends it as binary over serial

int sensorValue = 0;
int oldValue = 0;

//smoothing coefficient
const float COEF = 0.1;

//extreme range of measured ADC values
int mini = 10;
int maxi = 200;

void setup() {
  Serial.begin(115200);
}

void loop() {
  sensorValue = analogRead(A0);

  //smooth values
  sensorValue = sensorValue * COEF + oldValue * (1 - COEF);
  oldValue = sensorValue;

  //remap range
  sensorValue = map(sensorValue, mini, maxi, 0, 255);

  //write to serial as binary
  Serial.write(sensorValue);
  delay(1);
}
