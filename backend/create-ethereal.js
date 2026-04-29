require("dotenv").config();
const nodemailer = require("nodemailer");

async function createEtherealAccount() {
  try {
    // Create a test account
    const testAccount = await nodemailer.createTestAccount();

    console.log("\n✅ Ethereal test account created!");
    console.log("\n📧 Add these to your .env file:\n");
    console.log(`SMTP_HOST=${testAccount.smtp.host}`);
    console.log(`SMTP_PORT=${testAccount.smtp.port}`);
    console.log(`SMTP_SECURE=${testAccount.smtp.secure}`);
    console.log(`SMTP_USER=${testAccount.user}`);
    console.log(`SMTP_PASS=${testAccount.pass}`);
    console.log(`MAIL_FROM=noreply@healthcare.com`);
    
    console.log("\n🔗 View emails at: https://ethereal.email");
    console.log(`   Login: ${testAccount.user}`);
    console.log(`   Password: ${testAccount.pass}\n`);

    // Also create the transporter to test
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // Send a test email
    const info = await transporter.sendMail({
      from: '"Healthcare App" <noreply@healthcare.com>',
      to: "test@example.com",
      subject: "Test Email",
      text: "This is a test email from your Healthcare app!",
      html: "<h1>Test Email</h1><p>This is a test email from your Healthcare app!</p>",
    });

    console.log("📨 Test email sent!");
    console.log(`   Preview URL: ${nodemailer.getTestMessageUrl(info)}\n`);
    
  } catch (error) {
    console.error("Error creating Ethereal account:", error);
  }
}

createEtherealAccount();