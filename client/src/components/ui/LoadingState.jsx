import { Loader } from './Loader.jsx';
import { Card } from './Card.jsx';
import { mergeClassNames } from '../../lib/classNames.js';

export function LoadingState({ className, label = 'Loading...' }) {
  return (
    <Card className={mergeClassNames('grid min-h-40 place-items-center p-6', className)}>
      <Loader label={label} />
    </Card>
  );
}
