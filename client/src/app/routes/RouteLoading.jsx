import { Loader } from '../../components/ui/Loader.jsx';

export function RouteLoading() {
  return (
    <div className="p-8">
      <Loader label="Loading..." />
    </div>
  );
}
