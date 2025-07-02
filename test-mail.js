import nodemailer from "nodemailer";

async function testMail() {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // <--- your real SMTP host
    port: 465, // or 587, depending on your provider
    secure: true, // true for 465, false for 587
    auth: {
      user: "harshitshobhane348@gmail.com", // <--- your real email
      pass: "nkmmpqsogyloggbk",    // <--- your real app password
    },
  });

  let info = await transporter.sendMail({
    from: '"Test" <harshitshobhane348@gmail.com>',
    to: "harshitshobhane348@gmail.com", // recipient email
    subject: "Test Email from Nodemailer",
    text: "Hello world? This is a test email.",
  });

  console.log("Message sent: %s", info.messageId);
}

testMail().catch(console.error); 