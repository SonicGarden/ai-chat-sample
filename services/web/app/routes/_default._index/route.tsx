import { Root } from './Root';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'AI Chat Firebase' }, { name: 'description', content: 'Welcome to AI Chat Firebase!' }];
};

export default function RootPage() {
  return <Root />;
}
