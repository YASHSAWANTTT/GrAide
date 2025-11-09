import { getOrCreateUser } from '@/lib/getOrCreateUser';
import { redirect } from 'next/navigation';

export default async function PaymentPage() {
  const user = await getOrCreateUser();
  if (!user) redirect('/login');
  
  // Payment is no longer required - redirect to dashboard
  redirect('/dashboard/student');
}
