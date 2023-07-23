<!-- first install package.json  -->
npm init -y

<!-- install express -->
npm i express

<!-- how to run  -->
node < ไฟล์ index.js >

<!-- install package เสริมช่วยให้ไม่ต้อง ปิด/เปิด serverg เมื่อมีการแก้ไขต่างๆ -D หมายถึงติดตั้งแบบ dev -->
npm i -D nodemon

<!-- ติดตั้ง Package ให้แสดงเวลาตอนนั้น -->
npm i moment

<!-- package เสริมที่สามารถทำการ gen id ให้แบบไม่ซ้ำกัน -->
npm i uuid

<!-- ติดตั้ง mysql2 -->
npm i mysql2

<!-- ติดตั้ง cross origin สำหรับเชื่อมกับ back-end -->
npm i cors

<!-- ติดตั้ง multer สำหรับจัดการ file แบบ multipart -->
npm i multer

<!-- ติดตั้ง jwt ใช้ในการทำงานเป็น third party ในการ authen -->
npm i jsonwebtoken bcrypt

<!-- ติดตั้ง cookie ให้เก็บข้อมูลในการ authen -->
npm i cookie-parser

<!-- ตั้ง node เป็น dev mode-->
SET NODE_ENV=development

<!-- ติดตั้ง firebase ในการจัดการข้อมูลบน cloud-->
npm i fire-admin