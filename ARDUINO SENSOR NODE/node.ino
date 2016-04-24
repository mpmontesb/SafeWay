#include "DHT.h"
#define DHTPIN 2     
#define DHTTYPE DHT22 
#include<Wire.h>
#include <Adafruit_BMP085.h>
#include <SoftwareSerial.h>

#define A_R 16384.0
#define G_R 131.0
#define RAD_A_DEG = 57.295779

DHT dht(DHTPIN, DHTTYPE);  
const int MPU=0x68;
int16_t AcX,AcY,AcZ,Tmp,GyX,GyY,GyZ;
Adafruit_BMP085 bmp;
float Acc[2];
float Gy[2];
float Angle[2];


void setup(){
  Wire.begin();
  Wire.beginTransmission(MPU);
  Wire.write(0x6B);  // PWR_MGMT_1 register
  Wire.write(0);     // set to zero (wakes up the MPU-6050)
  Wire.endTransmission(true);
  Serial.begin(9600);  
  dht.begin();
}

void loop(){  
  Wire.beginTransmission(MPU);
  Wire.write(0x3B);  // starting with register 0x3B (ACCEL_XOUT_H)
  Wire.endTransmission(false);
  Wire.requestFrom(MPU,14,true);  // request a total of 14 registers
  AcX=Wire.read()<<8|Wire.read();  // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L)     
  AcY=Wire.read()<<8|Wire.read();  // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
  AcZ=Wire.read()<<8|Wire.read();  // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L)
  Tmp=Wire.read()<<8|Wire.read();  // 0x41 (TEMP_OUT_H) & 0x42 (TEMP_OUT_L)
  GyX=Wire.read()<<8|Wire.read();  // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L)
  GyY=Wire.read()<<8|Wire.read();  // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L)
  GyZ=Wire.read()<<8|Wire.read();  // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L)

   Acc[1] = atan(-1*(AcX/A_R)/sqrt(pow((AcY/A_R),2) + pow((AcZ/A_R),2)))*RAD_TO_DEG;
   Acc[0] = atan((AcY/A_R)/sqrt(pow((AcX/A_R),2) + pow((AcZ/A_R),2)))*RAD_TO_DEG;

    Gy[0] = GyX/G_R;
   Gy[1] = GyY/G_R;

   Angle[0] = 0.98 *(Angle[0]+Gy[0]*0.010) + 0.02*Acc[0];
   Angle[1] = 0.98 *(Angle[1]+Gy[1]*0.010) + 0.02*Acc[1];

   Serial.print("X"); Serial.println(Angle[0]); 
   Serial.print("Y"); Serial.println(Angle[1]); 
   //Accelerometer
  Serial.print("I"); Serial.println(AcX);
  Serial.print("J"); Serial.println(AcY);
  Serial.print("K"); Serial.println(AcZ);
  Serial.print("A"); Serial.println(Tmp/340.00+36.53); 
  
  //Gyroscope
  //Serial.print("X"); Serial.println(GyX);
  //Serial.print("Y"); Serial.println(GyY);
  Serial.print("Z"); Serial.println(GyZ);


  float h = dht.readHumidity();
  float t = dht.readTemperature();
  float f = dht.readTemperature(true);
  float hif = dht.computeHeatIndex(f, h);
  float hic = dht.computeHeatIndex(t, h, false);
  float bmpTem = bmp.readTemperature(); // temperatura sensor bmp 180
  float bmPa = bmp.readPressure();  // presion atmosferica sensor bmp 180
  float bmpH = bmp.readAltitude();  // Altitud con respecto al nivel del mar sensor bmp 180
  
  Serial.print("H");
  Serial.println(h);
  Serial.print("C");
  Serial.println(t);
  Serial.print("F");
  Serial.println(f);
  Serial.print("M");
  Serial.println(hic);
  Serial.print("N");
  Serial.println(hif);
  Serial.print("P");
  Serial.println(bmPa);
  Serial.print("Q");
  Serial.println(bmpH);
  Serial.print("O");
  Serial.println(analogRead(0));
 
  Serial.print("T");
  Serial.println(4.626851);
  Serial.print("L");
  Serial.println("-74.065299");

  
 /* if (sGps.available()) {  
  Serial.write(sGps.read());
 Serial.println("1892009");
   Serial.print("T");
  }*/
 delay(500);
  
}
