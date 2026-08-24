import { Mail } from 'lucide-react';
import { Section, Shell } from '@/components/layout/Section';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { Reveal } from '@/components/ui/Reveal';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import { ContactForm } from '@/components/contact/ContactForm';
import { site } from '@/data/site';

const channels = [
  { label: 'GitHub', href: site.social.github, icon: GithubIcon },
  { label: 'LinkedIn', href: site.social.linkedin, icon: LinkedinIcon },
] as const;

export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-heading" space="loose" className="relative">
      {/* This section gets its own pool of light — it's where the page is
          asking for something, and it should feel like the destination. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgb(150_178_255/0.24),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(70% 55% at 50% 0%, rgb(77 141 255 / 0.1), transparent 68%)',
        }}
      />

      <Shell>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <MonoLabel>Contact</MonoLabel>
              <h2
                id="contact-heading"
                className="mt-6 text-title font-medium text-ink sm:text-display"
              >
                {site.contact.heading[0]}
                <span className="mt-1 block text-gradient">
                  {site.contact.heading[1]}
                </span>
              </h2>
              <p className="mt-6 max-w-md text-lede text-ink-2">{site.contact.lede}</p>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-10 flex flex-col gap-4">
                <a
                  href={`mailto:${site.email}`}
                  className="group inline-flex w-fit items-center gap-3 text-[1.0625rem] text-ink transition-colors duration-200 hover:text-azure"
                >
                  <span className="grid size-9 place-items-center rounded-full border border-hairline bg-elevated text-ink-3 transition-colors duration-200 group-hover:border-azure/30 group-hover:text-azure">
                    <Mail className="size-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  {site.email}
                </a>

                <div className="flex items-center gap-3 pl-0.5">
                  {channels.map((channel) => {
                    const Icon = channel.icon;
                    return (
                      <a
                        key={channel.label}
                        href={channel.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={channel.label}
                        className="grid size-9 place-items-center rounded-full border border-hairline bg-elevated text-ink-3 transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-hairline-strong hover:text-ink"
                      >
                        <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </Reveal>

          </div>

          <Reveal delay={0.06}>
            <ContactForm />
          </Reveal>
        </div>
      </Shell>
    </Section>
  );
}
