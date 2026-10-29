/**
 * =========================================================================
 * NxtWave Growth Challenge — Google Sheets + Email Automation Script
 * =========================================================================
 * 
 * HOW TO SET THIS UP IN 60 SECONDS:
 * 1. Open a new Google Sheet (sheets.new).
 * 2. Name it "NxtWave Workshop Registrations".
 * 3. In the top menu, click Extensions > Apps Script.
 * 4. Delete any code in the editor, and paste THIS ENTIRE FILE.
 * 5. Click "Deploy" (top right) > "New deployment".
 * 6. Click the gear icon next to "Select type" > select "Web app".
 * 7. Set:
 *    - Description: "NxtWave Registration Webhook"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (IMPORTANT!)
 * 8. Click "Deploy" > "Authorize access" (choose your Google account, click Advanced > Go to Untitled project).
 * 9. Copy the "Web app URL" (looks like: https://script.google.com/macros/s/.../exec).
 * 10. Paste it into your K:\NxtWave\campaign\.env file:
 *     GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec
 * 
 * THAT'S IT! Every time someone registers on your site:
 * - A new row is automatically added to this Google Sheet in real time.
 * - An official confirmation email is automatically sent to the student from your Gmail!
 */

function testSetup() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Registration ID",
      "Full Name",
      "Email Address",
      "College / Organization",
      "WhatsApp Number",
      "Year of Study",
      "Branch",
      "Referral Code",
      "Referred By"
    ]);
    sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#FF6B35").setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  Logger.log("✅ Sheet is ready and connected!");
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-setup column headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Registration ID",
        "Full Name",
        "Email Address",
        "College / Organization",
        "WhatsApp Number",
        "Year of Study",
        "Branch",
        "Referral Code",
        "Referred By"
      ]);
      // Format header row
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#FF6B35").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else {
      data = e.parameter;
    }

    var timestamp = new Date();
    var id = data.id || Utilities.getUuid();
    var name = data.name || "N/A";
    var email = data.email || "N/A";
    var college = data.college || "N/A";
    var whatsapp = data.whatsapp || "N/A";
    var year = data.year || "N/A";
    var branch = data.branch || "N/A";
    var referralCode = data.referralCode || "N/A";
    var referredBy = data.referredBy || "";

    // Append to Sheet
    sheet.appendRow([
      timestamp,
      id,
      name,
      email,
      college,
      whatsapp,
      year,
      branch,
      referralCode,
      referredBy
    ]);

    // Send confirmation email directly via Google MailApp (Zero SMTP configuration required!)
    if (email && email.indexOf("@") !== -1) {
      var firstName = name.split(" ")[0];
      var referralLink = "https://nxtwave-growth-challenge-public.vercel.app/?ref=" + referralCode;

      var subject = "🎉 Spot Confirmed: Build Your First AI Project in 60 Mins!";
      var htmlBody = 
        "<div style='font-family:sans-serif; background:#0F0B1A; color:#FFF7ED; padding:25px; border-radius:12px; max-width:550px;'>" +
        "<div style='text-align:center;'><h1 style='color:#FF6B35;'>⚡ NxtWave AI Workshop</h1>" +
        "<p style='color:#FFC857; font-weight:bold;'>FREE SPOT CONFIRMED</p></div>" +
        "<p>Hi <strong>" + name + "</strong>,</p>" +
        "<p>Your registration is locked in! In 60 minutes, you will build a real AI project from scratch and earn a verified completion certificate for your resume.</p>" +
        "<div style='background:#1A1428; border:1px solid #FF6B35; padding:15px; border-radius:8px; margin:20px 0;'>" +
        "<p style='margin:0;'><strong>Your Unique Referral Code:</strong> <span style='color:#FFC857; font-size:18px;'>" + referralCode + "</span></p>" +
        "<p style='margin:8px 0 0; font-size:13px; color:#BCA8C8;'>Invite 3 classmates to unlock the AI Project Starter Kit:</p>" +
        "<p style='color:#FF6B35; word-break:break-all;'><strong>" + referralLink + "</strong></p>" +
        "</div>" +
        "<p style='font-size:12px; color:#BCA8C8;'>Workshop link will be dispatched to your WhatsApp (" + whatsapp + ") 24 hours before the event.</p>" +
        "</div>";

      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: htmlBody
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "message": "Lead saved and email sent!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
