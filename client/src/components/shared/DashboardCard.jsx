import { motion } from 'framer-motion';
import { Card } from '../ui/Card.jsx';
import { mergeClassNames } from '../../lib/classNames.js';

export function DashboardCard({
  action,
  children,
  className,
  eyebrow,
  title,
  ...props
}) {
  return (
    <Card
      as={motion.section}
      className={mergeClassNames(
        'p-5',
        className,
      )}
      initial={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
      {...props}
    >
      {(eyebrow || title || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {eyebrow ? (
              <p className="m-0 text-xs font-bold uppercase text-muted">{eyebrow}</p>
            ) : null}
            {title ? (
              <h2 className="mt-1 text-lg font-extrabold text-body">{title}</h2>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      {children}
    </Card>
  );
}
