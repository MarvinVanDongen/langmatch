import { redirect } from 'next/navigation'

// Old Dutch URL — redirect to the English thank-you page
export default function BedanktRedirect() {
  redirect('/thank-you')
}
