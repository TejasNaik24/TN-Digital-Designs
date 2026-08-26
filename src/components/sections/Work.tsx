import { Section, Shell } from '@/components/layout/Section';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WorkGallery } from '@/components/work/WorkGallery';

export function Work() {
  return (
    <Section id="work" labelledBy="work-heading" space="loose" ambient>
      <Shell>
        <SectionHeading
          id="work-heading"
          label="Selected work"
          title="Built to show what’s possible."
          lede="Self-directed concept builds, each one exploring how a different kind of business could feel online. Every project here is labelled as a concept — none of them are client work."
        />

        <div className="mt-14 lg:mt-16">
          <WorkGallery />
        </div>
      </Shell>
    </Section>
  );
}
