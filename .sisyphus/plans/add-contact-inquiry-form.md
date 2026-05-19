# Add Contact Info and Inquiry Form

Add a contact number display and an inquiry form to the property gallery page. Form submissions are emailed to jxjwilliam@gmail.com via a Next.js API route using nodemailer + Gmail SMTP.

## Files to create

### 1. API route — `src/app/api/inquiry/route.ts`

- Accept POST with JSON body: `{ name, email, date, checkIn, checkOut, guests, message }`
- Use `nodemailer` with `service: "gmail"` 
- Auth via `process.env.SMTP_EMAIL` and `process.env.SMTP_PASSWORD`
- Send to `jxjwilliam@gmail.com` with a styled HTML table of the form fields
- Return `{ success: true }` or `{ success: false, error }` on failure
- Gracefully handle missing SMTP credentials (log warning, still return success)

### 2. Form component — `src/components/inquiry-form.tsx`

- `"use client"` component
- Fields:
  - Name (text input)
  - Email (email input)
  - Date (date input)
  - Check-in time (time input)
  - Check-out time (time input)
  - Number of guests (number input)
  - Message (textarea, optional)
- Submit button with loading state
- On submit: POST to `/api/inquiry`, show success/error toast
- Styled consistently with the gallery dark theme using the same CSS variables
- Glassmorphism panel styling matching the existing design language

### 3. `.env.local` update

Add (or the user adds):
```
SMTP_EMAIL=your-gmail@gmail.com
SMTP_PASSWORD=your-gmail-app-password
```

## Files to edit

### 4. `src/app/page.tsx`

- Add a contact section below the gallery footer note
- Show: **Contact: William — 236-992-3846**
- Render the `<InquiryForm>` component
- Keep existing gallery and footer note intact

## Verification

- `npm run build` — zero errors
- Form renders at the bottom of the page with all fields visible
- Contact number is displayed: **William — 236-992-3846**
- Submitting the form with valid data sends a POST to `/api/inquiry`
- Form shows loading state during submission, success message on completion
- API route gracefully handles missing SMTP credentials

## Order of execution

1. Create `src/app/api/inquiry/route.ts`
2. Create `src/components/inquiry-form.tsx`
3. Edit `src/app/page.tsx` to add contact info and form
4. Update `.env.local` with SMTP vars (user provides credentials)
5. `npm run build` to verify
