import { redirect } from 'next/navigation';

/** Keeps the public catalog path working after docs moved under `/docs`. */
export default function ComponentsCatalogPage() {
  redirect('/docs/components');
}
