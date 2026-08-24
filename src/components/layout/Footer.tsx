import { Mail } from 'lucide-react';
import { Shell } from './Section';
import { GithubIcon, LinkedinIcon } from '@/components/ui/SocialIcons';
import { navLinks, site } from '@/data/site';
import { scrollToId } from '@/lib/scroll';

const socials = [
  { label: 'GitHub', href: site.social.github, icon: GithubIcon },
  { label: 'LinkedIn', href: site.social.linkedin, icon: LinkedinIcon },
  { label: 'Email', href: `mailto:${site.email}`, icon: Mail },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-hairline">
      <Shell className="py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[0.75rem] text-ink-3">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-7 gap-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToId(link.href.replace('#', ''));
                    }}
                    className="text-[0.875rem] text-ink-2 transition-colors duration-200 hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            {socials.map((social) => {
              const Icon = social.icon;
              const external = social.href.startsWith('http');
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  {...(external
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                  className="grid size-9 place-items-center rounded-full border border-hairline text-ink-3 transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-hairline-strong hover:text-ink"
                >
                  <Icon className="size-4" strokeWidth={1.75} aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      </Shell>
    </footer>
  );
}
