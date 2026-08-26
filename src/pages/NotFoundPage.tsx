import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Section';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { LinkButton } from '@/components/ui/Button';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

export function NotFoundPage() {
  const navigate = useNavigate();

  useDocumentMeta({
    title: 'Page not found — Tejas Naik',
    description: 'That page doesn’t exist.',
  });

  /** Keep the real href (copyable, crawlable) but navigate client-side. */
  const link = (to: string) => ({
    href: to,
    onClick: (event: React.MouseEvent) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      navigate(to);
    },
  });

  return (
    <Shell className="flex min-h-[70vh] flex-col justify-center py-32">
      <div className="max-w-xl">
        <MonoLabel>404</MonoLabel>
        <h1 className="mt-6 text-display font-medium text-ink">
          That page doesn’t exist.
        </h1>
        <p className="mt-6 text-lede text-ink-2">
          The link may be out of date, or the address may have a typo in it.
          Everything worth seeing is one click away.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <LinkButton
            {...link('/')}
            variant="glow"
            size="lg"
            arrow="right"
            className="max-sm:w-full"
          >
            Back to home
          </LinkButton>
          <LinkButton
            {...link('/work')}
            variant="secondary"
            size="lg"
            className="max-sm:w-full"
          >
            See the work
          </LinkButton>
        </div>
      </div>
    </Shell>
  );
}
