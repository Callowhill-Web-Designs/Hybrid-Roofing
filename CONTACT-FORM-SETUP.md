# Contact Form Setup Instructions

This contact form system allows you to send form submissions to multiple webhooks and includes a thank you popup for users.

## Files Created/Modified

1. **`public/submit-form.php`** - Main form handler
2. **`public/webhook-config.php`** - Configuration file for webhooks and settings
3. **`src/assets/js/contact-form.js`** - JavaScript for form handling and popup
4. **`public/assets/js/contact-form.js`** - Copy for production
5. **Modified `src/content/pages/contact.html`** - Updated form to use PHP instead of Netlify
6. **Modified `src/assets/less/contact.less`** - Added popup styles

## Setup Instructions

### 1. Configure Webhooks

Edit `public/webhook-config.php` and add your webhook URLs:

```php
'webhooks' => [
    'https://hooks.zapier.com/hooks/catch/123456/abcdef/',
    'https://your-crm.com/api/webhook',
    'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
],
```

### 2. Popular Webhook Services

#### Zapier
1. Create a new Zap
2. Choose "Webhooks by Zapier" as trigger
3. Select "Catch Hook"
4. Copy the webhook URL to your config

#### Make.com (formerly Integromat)
1. Create a new scenario
2. Add "Webhooks" > "Custom webhook"
3. Copy the webhook URL to your config

#### Slack
1. Go to your Slack workspace settings
2. Create a new Incoming Webhook
3. Choose the channel and copy the URL

#### Discord
1. Go to your Discord server settings
2. Go to Integrations > Webhooks
3. Create a new webhook and copy the URL

### 3. Server Requirements

- PHP 7.0 or higher
- `curl` extension enabled
- `mail()` function working (for email notifications)

### 4. Email Configuration

Update the email settings in `webhook-config.php`:

```php
'email' => [
    'admin_email' => 'your-email@hybridroofingpa.com',
    'from_email' => 'noreply@hybridroofingpa.com',
    'subject' => 'New Contact Form Submission - Hybrid Roofing PA'
],
```

### 5. Testing

1. Fill out the contact form on your website
2. Check that you receive the email notification
3. Verify that data is sent to your configured webhooks
4. Check the `contact_submissions.log` file for logged submissions

## Data Format Sent to Webhooks

```json
{
    "name": "John Doe",
    "email": "john@example.com", 
    "phone": "(555) 123-4567",
    "message": "I need a roof inspection",
    "submitted_at": "2025-07-29T10:30:00+00:00",
    "ip_address": "192.168.1.1",
    "user_agent": "Mozilla/5.0...",
    "source": "Hybrid Roofing Contact Form"
}
```

## Features

- ✅ Multiple webhook support
- ✅ Email notifications
- ✅ Thank you popup
- ✅ Form validation
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Accessibility features
- ✅ Submission logging

## Troubleshooting

### Form not submitting
- Check that `submit-form.php` is accessible
- Verify PHP is working on your server
- Check browser console for JavaScript errors

### Webhooks not working
- Test webhook URLs manually with a tool like Postman
- Check `contact_submissions.log` for error messages
- Verify your webhook URLs are correct

### Emails not sending
- Check that your server's `mail()` function works
- Consider using SMTP instead of `mail()` for better reliability
- Check spam folders

### Popup not showing
- Verify `contact-form.js` is loading
- Check browser console for JavaScript errors
- Ensure CSS is compiled and loading

## Security Notes

- Form data is validated and sanitized
- Consider adding reCAPTCHA for spam protection
- Monitor `contact_submissions.log` for unusual activity
- Keep webhook URLs secure and don't commit them to public repositories

## Optional Enhancements

1. **Add reCAPTCHA**: Update the config to enable reCAPTCHA
2. **Database logging**: Store submissions in a database
3. **Admin dashboard**: Create a page to view submissions
4. **Auto-responder**: Send confirmation emails to users
5. **Rate limiting**: Prevent spam submissions
