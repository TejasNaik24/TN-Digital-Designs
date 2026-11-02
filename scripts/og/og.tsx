import { createRoot } from 'react-dom/client';
import '@/styles/index.css';
import { ProjectVisual } from '@/components/projects/ProjectVisual';
import { projects } from '@/data/projects';

/** The social share card. Uses the same live previews as the Work section, so
 *  the image shows real work rather than a generic gradient. */
function OgCard() {
  return (
    <div
      className="relative flex h-[630px] w-[1200px] flex-col overflow-hidden bg-canvas px-[72px] pb-[64px] pt-[60px] text-ink"
      style={{
        backgroundImage:
          'radial-gradient(60% 70% at 85% 0%, rgb(77 141 255 / 0.16), transparent 70%), radial-gradient(50% 60% at 0% 100%, rgb(139 92 246 / 0.12), transparent 70%)',
      }}
    >
      <div className="flex items-center gap-4">
        <img src="/favicon.svg" alt="" className="size-12" />
        <span className="text-[22px] font-medium tracking-[-0.01em]">Tejas Naik</span>
        <span className="text-[22px] text-ink-3">Digital Studio</span>
      </div>

      <h1 className="mt-10 max-w-[900px] text-[64px] font-medium leading-[1.04] tracking-[-0.035em]">
        Websites that make people trust you before you say a word.
      </h1>

      <div className="mt-auto grid grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.slug} className="aspect-[16/10] overflow-hidden rounded-[14px] border border-white/10">
            <ProjectVisual kind={project.slug} />
          </div>
        ))}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<OgCard />);
