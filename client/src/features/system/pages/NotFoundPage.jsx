import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge.jsx';
import { Button } from '../../../components/ui/Button.jsx';
import { EmptyState } from '../../../components/ui/EmptyState.jsx';

export function NotFoundPage() {
  return (
    <section className="max-w-[760px]">
      <Badge variant="muted">404</Badge>
      <EmptyState
        action={
          <Button as={Link} to="/">
            Return to dashboard
          </Button>
        }
        className="mt-5 min-h-80 border-dashed bg-surface-elevated/70 shadow-none"
        description="The route you requested is not part of the current PersonalOS navigation."
        icon={SearchX}
        title="Page not found"
      />
    </section>
  );
}
