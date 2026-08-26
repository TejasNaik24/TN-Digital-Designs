import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Shell } from '@/components/layout/Section';
import { Reveal } from '@/components/ui/Reveal';
import { LinkButton } from '@/components/ui/Button';
import { ConceptBadge } from '@/components/projects/ConceptBadge';
import { ProjectSection } from '@/components/projects/ProjectSection';
import { ProjectMeta } from '@/components/projects/ProjectMeta';
import { ProjectNav } from '@/components/projects/ProjectNav';
import { ScreenFrame } from '@/components/projects/ScreenFrame';
import { getScreen } from '@/components/projects/screens/registry';
import { NotFoundPage } from './NotFoundPage';
import { getAdjacent, getProject } from '@/data/projects';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import { useAnchorNavigate } from '@/lib/navigation';

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;

  // An unknown slug renders the real 404 rather than crashing or showing an
  // empty shell. Hooks below this line are fine because NotFoundPage is a
  // separate component with its own hooks.
  if (!project) return <NotFoundPage />;

  return <ProjectCaseStudy key={project.slug} slug={project.slug} />;
}

function ProjectCaseStudy({ slug }: { slug: string }) {
  const project = getProject(slug);
  const adjacent = getAdjacent(slug);
  const { hrefFor, onClickFor } = useAnchorNavigate();

  useDocumentMeta({
    title: project ? project.meta.title : '',
    description: project ? project.meta.description : '',
  });

  if (!project) return null;

  const Hero = getScreen(project.slug, project.heroScreen);

  return (
    <article>
      {/* ── Hero ── */}
      <Shell className="pb-14 pt-28 sm:pt-32 lg:pt-36">
        <Reveal>
          <Link
            to="/work"
            className="group inline-flex items-center gap-2.5 text-[0.875rem] text-ink-2 transition-colors duration-200 hover:text-ink"
          >
            <ArrowLeft
              aria-hidden="true"
              className="size-4 transition-transform duration-[320ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
              strokeWidth={1.75}
            />
            Back to work
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <span className="mono-label text-ink-3">{project.category}</span>
            <ConceptBadge type={project.type} size="lg" />
            <span className="mono-label text-ink-3">{project.year}</span>
          </div>

          <h1 className="mt-7 max-w-4xl text-hero font-medium text-ink">
            {project.title}
          </h1>

          <p className="mt-7 max-w-2xl text-lede text-ink-2">
            {project.description}
          </p>
        </Reveal>
      </Shell>

      {/* ── Hero screen, full bleed within the shell ── */}
      {Hero && (
        <Shell className="pb-16 lg:pb-24">
          <Reveal>
            <div
              style={{ '--glow': project.accent } as React.CSSProperties}
              className="relative"
            >
              {/* inset-x-0, not -inset-x-10: a negative horizontal inset here
                  pushes the glow 40px past the shell on each side, which at
                  375px is real horizontal overflow. The gradient already fades
                  to transparent, so it loses nothing by staying in bounds. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 -bottom-10 -top-6 -z-10"
                style={{
                  background: `radial-gradient(60% 70% at 50% 40%, ${project.accent}1f, transparent 70%)`,
                }}
              />
              <ScreenFrame variant="browser" label={`${project.slug}.com`}>
                <Hero accent={project.accent} />
              </ScreenFrame>
            </div>
          </Reveal>
        </Shell>
      )}

      {/* ── Body + sticky meta ── */}
      <Shell className="pb-24 lg:pb-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
          <div className="flex flex-col gap-20 lg:gap-28">
            {project.sections.map((section, index) => (
              <ProjectSection
                key={`${section.kind}-${index}`}
                section={section}
                project={project}
              />
            ))}
          </div>

          <ProjectMeta project={project} />
        </div>
      </Shell>

      {/* ── Next / previous ── */}
      {adjacent && (
        <Shell className="pb-20">
          <Reveal>
            <ProjectNav prev={adjacent.prev} next={adjacent.next} />
          </Reveal>
        </Shell>
      )}

      {/* ── CTA ── */}
      <Shell className="pb-28 lg:pb-36">
        <Reveal>
          <div className="card-surface relative overflow-hidden rounded-panel px-7 py-12 text-center sm:px-10 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10"
              style={{
                background:
                  'radial-gradient(70% 120% at 50% 0%, rgb(77 141 255 / 0.14), transparent 70%)',
              }}
            />
            <h2 className="text-title font-medium text-ink">
              Want something like this for your company?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-ink-2">
              Tell me what you’re building and I’ll tell you honestly whether
              I’m the right fit.
            </p>
            <LinkButton
              href={hrefFor('contact')}
              onClick={onClickFor('contact')}
              variant="glow"
              size="lg"
              arrow="right"
              className="mt-8 max-sm:w-full"
            >
              Start a project
            </LinkButton>
          </div>
        </Reveal>
      </Shell>
    </article>
  );
}
