// Server Component
import { SharePageClient } from './client';
import { headers } from 'next/headers';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params;
  
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const publicUrl = `${protocol}://${host}/wishlists/public/${id}`;

  return <SharePageClient id={id} publicUrl={publicUrl} />;
} 