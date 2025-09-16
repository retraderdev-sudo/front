export interface OtpEmailData {
  email: string;
  otp: string;
  username?: string;
  locale: 'en' | 'fa';
}

export const createOtpEmailTemplate = (data: OtpEmailData) => {
  const { email, otp, username, locale } = data;

  const isRtl = locale === 'fa';
  const dir = isRtl ? 'rtl' : 'ltr';

  const content = {
    en: {
      subject: 'Your OTP Code - Retrader',
      title: 'Welcome to Retrader!',
      message: `Hello${username ? ` ${username}` : ''},`,
      otpLabel: 'Your verification code is:',
      otpNote: 'This code will expire in 5 minutes.',
      footer: "If you didn't request this code, please ignore this email.",
      company: 'Retrader Team',
    },
    fa: {
      subject: 'کد تایید شما - ری‌تریدر',
      title: 'به ری‌تریدر خوش آمدید!',
      message: `سلام${username ? ` ${username}` : ''}،`,
      otpLabel: 'کد تایید شما:',
      otpNote: 'این کد تا 5 دقیقه معتبر است.',
      footer:
        'اگر این کد را درخواست نکرده‌اید، لطفاً این ایمیل را نادیده بگیرید.',
      company: 'تیم ری‌تریدر',
    },
  };

  const t = content[locale];

  return {
    subject: t.subject,
    html: `
<!DOCTYPE html>
<html dir="${dir}" lang="${locale}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${t.subject}</title>
    <style>
        body {
            font-family: ${isRtl ? 'Tahoma, Arial, sans-serif' : 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'};
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }
        .title {
            font-size: 24px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #4b5563;
            margin-bottom: 30px;
        }
        .otp-container {
            background: #f1f5f9;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border: 2px dashed #cbd5e1;
        }
        .otp-label {
            font-size: 16px;
            color: #374151;
            margin-bottom: 15px;
            font-weight: 500;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #1e40af;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            background: white;
            padding: 15px 25px;
            border-radius: 8px;
            display: inline-block;
            border: 2px solid #3b82f6;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .otp-note {
            font-size: 14px;
            color: #6b7280;
            margin-top: 15px;
            font-style: italic;
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
        }
        .footer-text {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 10px;
        }
        .company {
            font-size: 14px;
            color: #9ca3af;
        }
        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e5e7eb, transparent);
            margin: 30px 0;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 20px;
            }
            .otp-code {
                font-size: 24px;
                letter-spacing: 4px;
                padding: 12px 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">${isRtl ? 'ری‌تریدر' : 'Retrader'}</div>
            <h1 class="title">${t.title}</h1>
        </div>
        
        <div class="message">
            <p>${t.message}</p>
            <p>${isRtl ? 'برای تکمیل فرآیند ثبت نام، لطفاً کد تایید زیر را وارد کنید:' : 'To complete your registration, please enter the verification code below:'}</p>
        </div>
        
        <div class="otp-container">
            <div class="otp-label">${t.otpLabel}</div>
            <div class="otp-code">${otp}</div>
            <div class="otp-note">${t.otpNote}</div>
        </div>
        
        <div class="divider"></div>
        
        <div class="footer">
            <p class="footer-text">${t.footer}</p>
            <p class="company">${t.company}</p>
        </div>
    </div>
</body>
</html>
    `,
  };
};

// Utility function to send OTP email (placeholder for now)
export const sendOtpEmail = async (data: OtpEmailData): Promise<boolean> => {
  try {
    // This is a placeholder - you'll implement the actual email sending logic
    // using your preferred email service (SendGrid, Nodemailer, etc.)
    console.log('Sending OTP email:', data);

    // For now, just log the email data
    const template = createOtpEmailTemplate(data);
    console.log('Email subject:', template.subject);
    console.log('Email HTML length:', template.html.length);

    // TODO: Implement actual email sending
    // Example with a hypothetical email service:
    // await emailService.send({
    //   to: data.email,
    //   subject: template.subject,
    //   html: template.html,
    // });

    return true;
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    return false;
  }
};
