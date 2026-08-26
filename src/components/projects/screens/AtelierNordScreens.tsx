import { ScreenSurface, T, type ScreenProps } from './shared';

/**
 * Atelier Nord — an editorial architecture site.
 *
 * Deliberately LIGHT. Every other surface on tn-digital is near-black, and a
 * studio that can only make dark tech websites is a studio with one trick.
 * Warm off-white paper, charcoal type, and a single cool accent used only for
 * interaction — Swiss-modern discipline rather than decoration.
 */

const PAPER = '#ece9e4';
const INK = '#14161a';
const STONE = '#8b8d92';
const RULE = 'rgb(20 22 26 / 0.14)';

/**
 * A masonry elevation.
 *
 * The thing this has to avoid is reading as a bar chart — five plain
 * rectangles of stepped height is exactly a column chart, which is the worst
 * possible signal on a page about an architecture practice. What turns the
 * same silhouette into buildings is fenestration: a real window grid on both
 * axes, a couple of lit windows, a ground line, and setbacks that break the
 * flat-topped rhythm a chart would have.
 */
function Elevation({ accent, tall = false }: { accent: string; tall?: boolean }) {
  const blocks = [
    { left: '3%', width: '17%', height: '48%', tone: 0.09, rows: 3, cols: 3, lit: [2] },
    { left: '21%', width: '13%', height: '72%', tone: 0.15, rows: 6, cols: 2, lit: [3, 8] },
    { left: '35%', width: '23%', height: '94%', tone: 0.2, rows: 8, cols: 4, lit: [5, 17, 26] },
    { left: '59%', width: '15%', height: '62%', tone: 0.12, rows: 5, cols: 3, lit: [7] },
    { left: '75%', width: '21%', height: '38%', tone: 0.07, rows: 2, cols: 4, lit: [3] },
  ];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: tall ? '46cqw' : '34cqw', background: '#dedad3' }}
    >
      {/* Sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgb(255 255 255 / 0.55), transparent 62%)',
        }}
      />

      {blocks.map((block, index) => (
        <div
          key={index}
          className="absolute bottom-0"
          style={{
            left: block.left,
            width: block.width,
            height: block.height,
            background: `rgb(20 22 26 / ${block.tone})`,
            // A hairline top edge reads as a parapet and separates the volume
            // from the sky.
            borderTop: '1px solid rgb(20 22 26 / 0.3)',
          }}
        >
          <div
            className="grid h-full w-full gap-[10%] p-[12%]"
            style={{
              gridTemplateColumns: `repeat(${block.cols}, 1fr)`,
              gridTemplateRows: `repeat(${block.rows}, 1fr)`,
            }}
          >
            {Array.from({ length: block.rows * block.cols }).map((_, cell) => (
              <span
                key={cell}
                style={{
                  background: block.lit.includes(cell)
                    ? accent
                    : 'rgb(20 22 26 / 0.26)',
                  opacity: block.lit.includes(cell) ? 0.85 : 1,
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Ground line — anchors the volumes instead of letting them float. */}
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: 'rgb(20 22 26 / 0.35)' }}
      />
    </div>
  );
}

function Nav({ accent }: ScreenProps) {
  return (
    <div
      className="flex items-center justify-between border-b px-[4cqw] py-[2.6cqw]"
      style={{ borderColor: RULE }}
    >
      <T size={1.9} className="font-semibold uppercase tracking-[0.16em]" style={{ color: INK }}>
        Atelier Nord
      </T>
      <div className="flex items-center gap-[3cqw]">
        {['Works', 'Studio', 'Journal'].map((link) => (
          <T key={link} size={1.5} style={{ color: STONE }}>
            {link}
          </T>
        ))}
        <T size={1.5} className="font-medium" style={{ color: accent }}>
          Contact
        </T>
      </div>
    </div>
  );
}

function Home({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={PAPER}>
      <div className="flex h-full flex-col">
        <Nav accent={accent} />

        <div className="flex items-end justify-between px-[4cqw] pb-[2.4cqw] pt-[4cqw]">
          <div>
            <T size={1.25} className="font-mono uppercase tracking-[0.22em]" style={{ color: accent }}>
              Selected work — 01
            </T>
            <div className="mt-[1.6cqw]">
              <T size={5.4} className="font-semibold tracking-[-0.04em]" style={{ color: INK }}>
                Light, mass, and
              </T>
              <T size={5.4} className="font-semibold tracking-[-0.04em]" style={{ color: INK }}>
                the space between.
              </T>
            </div>
          </div>
          <div className="pb-[1cqw] text-right">
            <T size={1.4} style={{ color: STONE }}>
              Rill House
            </T>
            <T size={1.4} style={{ color: STONE }}>
              Nordland, NO
            </T>
          </div>
        </div>

        <Elevation accent={accent} />

        <div
          className="mt-auto grid grid-cols-3 gap-[3cqw] border-t px-[4cqw] py-[2.4cqw]"
          style={{ borderColor: RULE }}
        >
          {[
            ['Practice', 'Founded 2009, Oslo'],
            ['Focus', 'Housing, civic, adaptive reuse'],
            ['Enquiries', 'studio@ateliernord.no'],
          ].map(([label, value]) => (
            <div key={label}>
              <T size={1.15} className="font-mono uppercase tracking-[0.18em]" style={{ color: STONE }}>
                {label}
              </T>
              <T size={1.45} className="mt-[0.8cqw]" style={{ color: INK }}>
                {value}
              </T>
            </div>
          ))}
        </div>
      </div>
    </ScreenSurface>
  );
}

const INDEX_ROWS = [
  ['2025', 'Rill House', 'Nordland', 'Residential'],
  ['2024', 'Kvarts Pavilion', 'Bergen', 'Civic'],
  ['2024', 'Nordre Workshops', 'Trondheim', 'Adaptive reuse'],
  ['2023', 'Sundt Terrace', 'Oslo', 'Housing'],
  ['2022', 'Fjell Chapel', 'Ålesund', 'Civic'],
];

function Index({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={PAPER}>
      <div className="flex h-full flex-col">
        <Nav accent={accent} />

        <div className="px-[4cqw] pt-[3.4cqw]">
          <T size={3.6} className="font-semibold tracking-[-0.035em]" style={{ color: INK }}>
            Works
          </T>
          <T size={1.4} className="mt-[1cqw]" style={{ color: STONE }}>
            Twenty-eight completed projects, 2009—2026.
          </T>
        </div>

        <div className="mt-[2.6cqw] px-[4cqw]">
          <div
            className="grid grid-cols-[10%_38%_28%_24%] border-b pb-[1.2cqw]"
            style={{ borderColor: RULE }}
          >
            {['Year', 'Project', 'Location', 'Type'].map((head) => (
              <T key={head} size={1.1} className="font-mono uppercase tracking-[0.18em]" style={{ color: STONE }}>
                {head}
              </T>
            ))}
          </div>

          {INDEX_ROWS.map(([year, name, place, type], index) => (
            <div
              key={name}
              className="grid grid-cols-[10%_38%_28%_24%] items-center border-b py-[1.5cqw]"
              style={{
                borderColor: RULE,
                // First row shown in its hover state — the index reveals its
                // image on hover rather than preloading twenty-eight of them.
                background: index === 0 ? 'rgb(20 22 26 / 0.035)' : undefined,
              }}
            >
              <T size={1.35} style={{ color: STONE }}>{year}</T>
              <T size={1.6} className="font-medium" style={{ color: index === 0 ? accent : INK }}>
                {name}
              </T>
              <T size={1.35} style={{ color: STONE }}>{place}</T>
              <T size={1.35} style={{ color: STONE }}>{type}</T>
            </div>
          ))}
        </div>
      </div>
    </ScreenSurface>
  );
}

function Detail({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={PAPER}>
      <div className="flex h-full flex-col">
        <Nav accent={accent} />
        <Elevation accent={accent} tall />

        <div className="grid flex-1 grid-cols-[36%_1fr] gap-[4cqw] px-[4cqw] py-[3cqw]">
          <div>
            <T size={1.15} className="font-mono uppercase tracking-[0.18em]" style={{ color: accent }}>
              2025 · Nordland
            </T>
            <T size={3} className="mt-[1.4cqw] font-semibold tracking-[-0.035em]" style={{ color: INK }}>
              Rill House
            </T>
          </div>
          <div className="flex flex-col gap-[1.4cqw]">
            <T size={1.55} className="leading-[1.6]" style={{ color: '#4a4d54' }}>
              A single-storey house set into a north-facing slope, organised
              around a covered court that collects the low winter light.
            </T>
            <T size={1.55} className="leading-[1.6]" style={{ color: '#4a4d54' }}>
              Local stone, untreated pine, and a roof that follows the grade so
              the building reads as part of the hillside rather than an object
              placed on it.
            </T>
          </div>
        </div>
      </div>
    </ScreenSurface>
  );
}

function Philosophy({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={PAPER}>
      <div className="flex h-full flex-col">
        <Nav accent={accent} />

        <div className="flex flex-1 flex-col justify-center px-[4cqw]">
          <T size={1.25} className="font-mono uppercase tracking-[0.22em]" style={{ color: accent }}>
            The practice
          </T>
          <div className="mt-[2.4cqw] max-w-[80%]">
            <T size={3.6} className="font-semibold leading-[1.24] tracking-[-0.035em]" style={{ color: INK }}>
              We work slowly, in one place, with people who intend to stay.
            </T>
          </div>
          <div
            className="mt-[3cqw] h-px w-[22%]"
            style={{ background: accent }}
          />
          <T size={1.5} className="mt-[2.4cqw] max-w-[52%] leading-[1.65]" style={{ color: '#4a4d54' }}>
            A studio of nine in Oslo. We take on four projects a year so that
            each one gets the attention it needs, and we stay involved through
            construction.
          </T>
        </div>
      </div>
    </ScreenSurface>
  );
}

function Mobile({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={PAPER} ratio="9 / 17">
      <div className="flex h-full flex-col">
        <div
          className="flex items-center justify-between border-b px-[6cqw] py-[4cqw]"
          style={{ borderColor: RULE }}
        >
          <T size={4} className="font-semibold uppercase tracking-[0.14em]" style={{ color: INK }}>
            Atelier
          </T>
          <div className="flex flex-col gap-[1.2cqw]">
            <span className="h-px w-[6cqw]" style={{ background: INK }} />
            <span className="h-px w-[6cqw]" style={{ background: INK }} />
          </div>
        </div>

        <div className="px-[6cqw] pt-[6cqw]">
          <T size={3} className="font-mono uppercase tracking-[0.2em]" style={{ color: accent }}>
            Works — 01
          </T>
          <T size={9} className="mt-[3cqw] font-semibold tracking-[-0.04em]" style={{ color: INK }}>
            Light, mass,
          </T>
          <T size={9} className="font-semibold tracking-[-0.04em]" style={{ color: INK }}>
            and the space
          </T>
          <T size={9} className="font-semibold tracking-[-0.04em]" style={{ color: INK }}>
            between.
          </T>
        </div>

        <div className="mt-[5cqw]">
          <Elevation accent={accent} tall />
        </div>

        {/* No hover on a phone, so the index shows its images outright. */}
        <div className="flex flex-col px-[6cqw] pt-[4cqw]">
          {INDEX_ROWS.slice(0, 3).map(([year, name]) => (
            <div
              key={name}
              className="flex items-center justify-between border-b py-[3cqw]"
              style={{ borderColor: RULE }}
            >
              <T size={4} className="font-medium" style={{ color: INK }}>
                {name}
              </T>
              <T size={3.2} style={{ color: STONE }}>
                {year}
              </T>
            </div>
          ))}
        </div>
      </div>
    </ScreenSurface>
  );
}

export const atelierNordScreens = {
  home: Home,
  index: Index,
  detail: Detail,
  philosophy: Philosophy,
  mobile: Mobile,
};
