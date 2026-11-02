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
          title="Websites for the businesses on your street."
          lede="Three fictional local businesses, each with a real, working website you can click through. They’re concepts, not clients — built to show what your business could have."
        />

        <div className="mt-14 lg:mt-16">
          <WorkGallery />
        </div>
      </Shell>
    </Section>
  );
}
