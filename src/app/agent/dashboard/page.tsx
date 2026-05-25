import { redirect } from 'next/navigation'

/**
 * /agent/dashboard — redirects to the properties listing.
 * The main dashboard page is the property listing table.
 */
export default function DashboardPage() {
  redirect('/agent/dashboard/properties')
}
