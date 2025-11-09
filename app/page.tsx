import { redirect } from 'next/navigation';
import { getOrCreateUser } from '@/lib/getOrCreateUser';

export default async function Home() {
  const user = await getOrCreateUser();
  
  // If user is already signed in, redirect to their dashboard
  if (user) {
    if (user.role === 'STUDENT') {
      redirect('/dashboard/student');
    } else if (user.role === 'PROFESSOR') {
      redirect('/dashboard/professor');
    } else if (user.role === 'ADMIN') {
      redirect('/dashboard/admin');
    }
  }
  
  // If not signed in, redirect to signup
  redirect('/signup');
}
