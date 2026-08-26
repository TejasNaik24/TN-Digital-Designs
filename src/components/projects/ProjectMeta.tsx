import { LinkButton } from '@/components/ui/Button';
import { ConceptBadge } from './ConceptBadge';
import { useAnchorNavigate } from '@/lib/navigation';
import type { Project } from '@/data/projects';

/**
 * The sticky metadata rail.
 *
 * Deliberately quiet and deliberately small — it exists to make a long case
 * study scannable and to keep the CTA reachable without a scroll back to the
 * top, not to compete with the work it sits beside. Desktop only: on a phone
 * it would be a wall of chrome above the content.
 */
export function ProjectMeta({ project }: { project: Project }) {
  const { hrefFor, onClickFor } = useAnchorNavigate();

  const rows: [string, string][] = [
    ['Category', project.category],
    ['Year', project.year],
    ['Direction', project.designDirection],
  ];

  return (
    <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
      <div className="card-surface rounded-panel p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
            {project.title}
          </span>
          <ConceptBadge type={project.type} />
        </div>

        <dl className="mt-6 flex flex-col gap-4 border-t border-hairline pt-5">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="mono-label text-ink-3">{label}</dt>
              <dd className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-2">
                {value}
              </dd>
            </div>
          ))}

          <div>
            <dt className="mono-label text-ink-3">Built with</dt>
            <dd className="mt-2.5">
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-full border border-hairline-soft bg-elevated/70 px-2.5 py-1 font-mono text-[0.6875rem] text-ink-3"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>

        <LinkButton
          href={hrefFor('contact')}
          onClick={onClickFor('contact')}
          variant="glow"
          arrow="right"
          className="mt-6 w-full"
        >
          Start a project
        </LinkButton>
      </div>
    </aside>
  );
}
