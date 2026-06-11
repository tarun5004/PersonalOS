import { PlaceholderPage } from '../../../components/shared/PlaceholderPage.jsx';

export function NotFoundPage() {
  return (
    <PlaceholderPage
      eyebrow="404"
      summary="The route you requested is not part of the current navigation."
      title="Page not found"
    />
  );
}
