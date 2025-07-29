# Contact Form Setup with Zapier Integration

This setup enables your contact form to submit data to a Zapier webhook and display a thank you popup upon successful submission.

## Files Modified/Created:

1. **PHP Handler**: `src/assets/php/contact-handler.php` and `public/assets/php/contact-handler.php`
2. **JavaScript**: `src/assets/js/contact-form.js` and `public/assets/js/contact-form.js`
3. **CSS Styles**: Added to `src/assets/css/contact.css`
4. **HTML Form**: Modified `src/content/pages/contact.html`

## Setup Instructions:

### 1. Configure Zapier Webhook
1. Go to your Zapier account and create a new Zap
2. Choose "Webhooks by Zapier" as the trigger
3. Select "Catch Hook" as the trigger event
4. Copy the webhook URL provided by Zapier
5. Update the webhook URL in both PHP files:
   - `src/assets/php/contact-handler.php`
   - `public/assets/php/contact-handler.php`
   
   Replace this line:
   ```php
   $zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/YOUR_WEBHOOK_ID/YOUR_WEBHOOK_KEY/';
   ```
   
   With your actual Zapier webhook URL.

### 2. Test the Webhook
1. Save your Zap in Zapier
2. Test the webhook by submitting the contact form
3. Verify that data is received in Zapier

### 3. Set up Zapier Actions
Configure what should happen when the webhook receives data:
- Send email notifications
- Add to CRM
- Create calendar events
- etc.

## Features:

### Form Functionality:
- ✅ Client-side form validation
- ✅ AJAX submission (no page reload)
- ✅ Loading state during submission
- ✅ Error handling and display
- ✅ Data sanitization and validation on server

### Thank You Popup:
- ✅ Animated popup with success message
- ✅ Auto-close after 5 seconds
- ✅ Manual close button
- ✅ Click outside to close
- ✅ Escape key to close
- ✅ Mobile responsive design

### Data Sent to Zapier:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "phone": "123-456-7890",
  "message": "User message content",
  "submitted_at": "2025-01-29 10:30:45",
  "source": "Website Contact Form"
}
```

## Server Requirements:
- PHP 7.0 or higher
- cURL extension enabled
- Web server with PHP support (Apache, Nginx, etc.)

## Troubleshooting:

### Common Issues:
1. **Form not submitting**: Check browser console for JavaScript errors
2. **Webhook not receiving data**: Verify the webhook URL is correct
3. **PHP errors**: Check server error logs
4. **CORS issues**: Ensure proper headers are set in PHP

### Testing:
1. Submit the form with valid data
2. Check browser network tab for successful POST request
3. Verify data appears in Zapier
4. Confirm thank you popup displays

## File Structure:
```
src/
├── assets/
│   ├── css/contact.css (updated with popup styles)
│   ├── js/contact-form.js (new)
│   └── php/contact-handler.php (new)
└── content/pages/contact.html (updated)

public/
├── assets/
│   ├── js/contact-form.js (new)
│   └── php/contact-handler.php (new)
```

## Security Notes:
- Form data is sanitized before processing
- Input validation on both client and server side
- CSRF protection should be added for production use
- Consider adding rate limiting to prevent spam
