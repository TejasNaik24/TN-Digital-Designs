import { Reveal } from '@/components/ui/Reveal';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { ScreenFrame } from './ScreenFrame';
import { getScreen } from './screens/registry';
import { cn } from '@/lib/cn';
import type { CaseStudySection, Project } from '@/data/projects';

/**
 * Renders one case-study section from data.
 *
 * The switch is the whole architecture: a new project is a data edit in
 * projects.ts, not a new page component. Adding a section *type* is the only
 * thing that requires touching this file.
 */

function Heading({
  eyebrow,
  heading,
  body,
  className,
}: {
  eyebrow: string;
  heading: string;
  body?: string;
  className?: string;
}) {
  return (
    <div className={cn('max-w-2xl', className)}>
      <MonoLabel>{eyebrow}</MonoLabel>
      <h2 className="mt-6 text-title font-medium text-ink">{heading}</h2>
      {body && <p className="mt-5 max-w-xl text-lede text-ink-2">{body}</p>}
    </div>
  );
}

/** A screen plus its caption. Returns null if the slug/screen pair is unknown. */
function Screen({
  project,
  screen,
  frame,
  caption,
}: {
  project: Project;
  screen: string;
  frame: 'browser' | 'phone' | 'bare';
  caption?: string;
}) {
  const Component = getScreen(project.slug, screen);
  if (!Component) return null;

  return (
    <figure className="m-0">
      <ScreenFrame variant={frame} label={`${project.slug}.com`}>
        <Component accent={project.accent} />
      </ScreenFrame>
      {caption && (
        <figcaption className="mt-4 font-mono text-[0.75rem] text-ink-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function ProjectSection({
  section,
  project,
}: {
  section: CaseStudySection;
  project: Project;
}) {
  switch (section.kind) {
    case 'prose':
      return (
        <Reveal>
          <div className="max-w-2xl">
            <MonoLabel>{section.eyebrow}</MonoLabel>
            <h2 className="mt-6 text-title font-medium text-ink">
              {section.heading}
            </h2>
            <div className="mt-6 flex flex-col gap-5">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-lede text-ink-2">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Reveal>
      );

    case 'screen': {
      if (section.layout === 'full') {
        return (
          <Reveal>
            <Heading
              eyebrow={section.eyebrow}
              heading={section.heading}
              body={section.body}
            />
            <div className="mt-10">
              <Screen
                project={project}
                screen={section.screen}
                frame={section.frame}
                caption={section.caption}
              />
            </div>
          </Reveal>
        );
      }

      const copyFirst = section.layout === 'split-left';
      return (
        <Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className={cn(!copyFirst && 'lg:order-2')}>
              <Heading
                eyebrow={section.eyebrow}
                heading={section.heading}
                body={section.body}
              />
            </div>
            <div className={cn(!copyFirst && 'lg:order-1')}>
              <Screen
                project={project}
                screen={section.screen}
                frame={section.frame}
                caption={section.caption}
              />
            </div>
          </div>
        </Reveal>
      );
    }

    case 'screens':
      return (
        <Reveal>
          <Heading
            eyebrow={section.eyebrow}
            heading={section.heading}
            body={section.body}
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-8">
            {section.items.map((item) => (
              <Screen
                key={item.screen}
                project={project}
                screen={item.screen}
                frame="browser"
                caption={item.caption}
              />
            ))}
          </div>
        </Reveal>
      );

    case 'palette':
      return (
        <Reveal>
          <Heading
            eyebrow={section.eyebrow}
            heading={section.heading}
            body={section.body}
          />
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {section.swatches.map((swatch) => (
              <li
                key={swatch.name}
                className="card-surface overflow-hidden rounded-card"
              >
                <div
                  className="h-20 w-full border-b border-hairline"
                  style={{ background: swatch.value }}
                />
                <div className="p-4">
                  <p className="text-[0.9375rem] font-medium text-ink">
                    {swatch.name}
                  </p>
                  <p className="mt-1 font-mono text-[0.6875rem] uppercase text-ink-3">
                    {swatch.value}
                  </p>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-2">
                    {swatch.note}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      );

    case 'build':
      return (
        <Reveal>
          <Heading
            eyebrow={section.eyebrow}
            heading={section.heading}
            body={section.body}
          />
          <ul className="mt-10 grid gap-px border-t border-hairline sm:grid-cols-2">
            {section.items.map((item) => (
              <li
                key={item.label}
                className="flex flex-col border-b border-hairline py-6 sm:pr-10"
              >
                <span className="font-mono text-[0.8125rem] text-ink">
                  {item.label}
                </span>
                <span className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
                  {item.detail}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      );
  }
}
