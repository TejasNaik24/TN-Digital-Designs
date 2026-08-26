import { ScreenSurface, T, Pill, type ScreenProps } from './shared';

/**
 * Vela — an AI product, built as a real interface rather than a picture of one.
 *
 * The hard problem here is density: a workflow tool has to show a lot at once
 * without becoming noise. Any figure on screen is interface decoration (a row
 * count, a duration) — never a business claim, never a fabricated metric.
 */

const VOID = '#07090f';
const PANEL = '#0e131c';
const LINE = 'rgb(150 178 255 / 0.1)';
const TEXT = 'rgb(233 238 248 / 0.92)';
const MUTED = 'rgb(148 162 190 / 0.72)';
const FAINT = 'rgb(148 162 190 / 0.45)';

const NAV = ['Overview', 'Pipelines', 'Datasets', 'Evaluations', 'Settings'];

function Sidebar({ accent, active = 1 }: ScreenProps & { active?: number }) {
  return (
    <div
      className="flex w-[21%] shrink-0 flex-col gap-[1.6cqw] border-r p-[1.8cqw]"
      style={{ borderColor: LINE, background: PANEL }}
    >
      <div className="flex items-center gap-[1.1cqw]">
        <span
          className="shrink-0 rounded-[0.6cqw]"
          style={{ width: '2.2cqw', height: '2.2cqw', background: accent }}
        />
        <T size={1.7} className="font-semibold tracking-[-0.02em]" style={{ color: TEXT }}>
          Vela
        </T>
      </div>

      <div className="mt-[0.6cqw] flex flex-col gap-[0.4cqw]">
        {NAV.map((item, index) => (
          <div
            key={item}
            className="truncate rounded-[0.7cqw] px-[1.1cqw] py-[0.85cqw]"
            style={{
              fontSize: '1.35cqw',
              color: index === active ? TEXT : FAINT,
              background: index === active ? `${accent}1f` : undefined,
            }}
          >
            {item}
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center gap-[1cqw] border-t pt-[1.4cqw]" style={{ borderColor: LINE }}>
        <span
          className="shrink-0 rounded-full"
          style={{ width: '2cqw', height: '2cqw', background: 'rgb(150 178 255 / 0.18)' }}
        />
        <div className="min-w-0">
          <T size={1.2} className="truncate" style={{ color: MUTED }}>
            Ana Petrova
          </T>
          <T size={1.05} className="truncate" style={{ color: FAINT }}>
            Workspace admin
          </T>
        </div>
      </div>
    </div>
  );
}

const RUNS = [
  ['support-triage', 'Completed', '1m 04s', '2,140 rows'],
  ['invoice-extract', 'Running', '—', '860 rows'],
  ['doc-classify', 'Completed', '3m 22s', '11,905 rows'],
  ['tone-check', 'Completed', '48s', '412 rows'],
];

function App({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={VOID}>
      <div className="flex h-full">
        <Sidebar accent={accent} />

        <div className="flex min-w-0 flex-1 flex-col">
          <div
            className="flex items-center justify-between border-b px-[2.4cqw] py-[1.8cqw]"
            style={{ borderColor: LINE }}
          >
            <div>
              <T size={2.2} className="font-semibold tracking-[-0.025em]" style={{ color: TEXT }}>
                Pipelines
              </T>
              <T size={1.2} className="mt-[0.5cqw]" style={{ color: FAINT }}>
                Four active in this workspace
              </T>
            </div>
            <div className="flex gap-[1cqw]">
              <Pill size={1.3} border={LINE} color={MUTED}>Import</Pill>
              <Pill size={1.3} bg={accent} color="#04101f">New pipeline</Pill>
            </div>
          </div>

          <div className="flex min-h-0 flex-1">
            <div className="flex-1 p-[2.4cqw]">
              <div
                className="grid grid-cols-[34%_22%_18%_26%] border-b pb-[1.1cqw]"
                style={{ borderColor: LINE }}
              >
                {['Pipeline', 'Status', 'Duration', 'Processed'].map((head) => (
                  <T key={head} size={1.05} className="font-mono uppercase tracking-[0.16em]" style={{ color: FAINT }}>
                    {head}
                  </T>
                ))}
              </div>

              {RUNS.map(([name, status, duration, rows], index) => {
                const running = status === 'Running';
                return (
                  <div
                    key={name}
                    className="grid grid-cols-[34%_22%_18%_26%] items-center border-b py-[1.35cqw]"
                    style={{
                      borderColor: LINE,
                      background: index === 1 ? `${accent}0f` : undefined,
                    }}
                  >
                    <T size={1.35} className="font-mono truncate" style={{ color: TEXT }}>
                      {name}
                    </T>
                    <div className="flex items-center gap-[0.7cqw]">
                      <span
                        className="shrink-0 rounded-full"
                        style={{
                          width: '0.7cqw',
                          height: '0.7cqw',
                          background: running ? '#22d3ee' : 'rgb(148 162 190 / 0.5)',
                        }}
                      />
                      <T size={1.25} style={{ color: running ? '#22d3ee' : MUTED }}>
                        {status}
                      </T>
                    </div>
                    <T size={1.25} style={{ color: MUTED }}>{duration}</T>
                    <T size={1.25} style={{ color: MUTED }}>{rows}</T>
                  </div>
                );
              })}
            </div>

            {/* Inspector — only present because a row is selected. */}
            <div
              className="w-[27%] shrink-0 border-l p-[1.8cqw]"
              style={{ borderColor: LINE, background: PANEL }}
            >
              <T size={1.05} className="font-mono uppercase tracking-[0.16em]" style={{ color: FAINT }}>
                Inspector
              </T>
              <T size={1.7} className="mt-[1.2cqw] font-mono" style={{ color: TEXT }}>
                invoice-extract
              </T>

              <div className="mt-[1.8cqw] flex flex-col gap-[1.2cqw]">
                {[
                  ['Model', 'claude-sonnet'],
                  ['Trigger', 'On upload'],
                  ['Retries', '2'],
                  ['Output', 'JSON schema'],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-[1cqw]">
                    <T size={1.15} style={{ color: FAINT }}>{label}</T>
                    <T size={1.2} className="truncate font-mono" style={{ color: MUTED }}>
                      {value}
                    </T>
                  </div>
                ))}
              </div>

              <div
                className="mt-[1.8cqw] rounded-[0.8cqw] border p-[1.2cqw]"
                style={{ borderColor: LINE, background: `${accent}12` }}
              >
                <T size={1.1} style={{ color: FAINT }}>Progress</T>
                <div
                  className="mt-[0.9cqw] h-[0.6cqw] w-full overflow-hidden rounded-full"
                  style={{ background: 'rgb(150 178 255 / 0.12)' }}
                >
                  <div className="h-full w-[62%] rounded-full" style={{ background: accent }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenSurface>
  );
}

function Marketing({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={VOID}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(70% 50% at 50% 0%, ${accent}1f, transparent 68%)`,
        }}
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between px-[3.6cqw] py-[2.4cqw]">
          <div className="flex items-center gap-[1.2cqw]">
            <span
              className="shrink-0 rounded-[0.6cqw]"
              style={{ width: '2.2cqw', height: '2.2cqw', background: accent }}
            />
            <T size={2} className="font-semibold tracking-[-0.02em]" style={{ color: TEXT }}>
              Vela
            </T>
          </div>
          <div className="flex items-center gap-[2.4cqw]">
            {['Product', 'Docs', 'Pricing'].map((link) => (
              <T key={link} size={1.4} style={{ color: FAINT }}>{link}</T>
            ))}
            <Pill size={1.35} bg={accent} color="#04101f">Start free</Pill>
          </div>
        </div>

        <div className="mt-[3cqw] flex flex-col items-center px-[3.6cqw] text-center">
          <Pill size={1.15} bg={`${accent}1f`} color={accent}>Now in open beta</Pill>
          <T size={4.6} className="mt-[2cqw] font-semibold tracking-[-0.038em]" style={{ color: TEXT }}>
            Ship AI features,
          </T>
          <T size={4.6} className="font-semibold tracking-[-0.038em]" style={{ color: TEXT }}>
            not prototypes.
          </T>
          <T size={1.5} className="mt-[1.8cqw] leading-[1.55]" style={{ color: MUTED }}>
            One API for retrieval, evaluation, and everything
            <br />
            that happens after the demo works.
          </T>
        </div>

        {/* The product itself, cropped — not a blurred screenshot. */}
        <div
          className="mt-[3cqw] flex-1 overflow-hidden rounded-t-[1.4cqw] border-x border-t"
          style={{ borderColor: LINE, marginInline: '6cqw', background: PANEL }}
        >
          <div className="flex h-full">
            <Sidebar accent={accent} />
            <div className="flex-1 p-[1.8cqw]">
              <T size={1.6} className="font-semibold" style={{ color: TEXT }}>
                Pipelines
              </T>
              <div className="mt-[1.4cqw] flex flex-col gap-[0.9cqw]">
                {RUNS.slice(0, 3).map(([name, status]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-[0.7cqw] border px-[1.2cqw] py-[1cqw]"
                    style={{ borderColor: LINE }}
                  >
                    <T size={1.25} className="font-mono" style={{ color: MUTED }}>{name}</T>
                    <T size={1.15} style={{ color: status === 'Running' ? '#22d3ee' : FAINT }}>
                      {status}
                    </T>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScreenSurface>
  );
}

function Workflow({ accent }: ScreenProps) {
  const nodes = [
    { x: '6%', y: '38%', label: 'Upload', kind: 'Trigger' },
    { x: '31%', y: '18%', label: 'Extract', kind: 'Model' },
    { x: '31%', y: '60%', label: 'Classify', kind: 'Model' },
    { x: '58%', y: '38%', label: 'Validate', kind: 'Rule' },
    { x: '82%', y: '38%', label: 'Deliver', kind: 'Output' },
  ];

  return (
    <ScreenSurface bg={VOID}>
      <div className="flex h-full">
        <Sidebar accent={accent} active={1} />

        <div className="relative min-w-0 flex-1">
          <div
            className="flex items-center justify-between border-b px-[2.4cqw] py-[1.6cqw]"
            style={{ borderColor: LINE }}
          >
            <T size={1.8} className="font-semibold tracking-[-0.02em]" style={{ color: TEXT }}>
              invoice-extract
            </T>
            <div className="flex gap-[1cqw]">
              <Pill size={1.2} border={LINE} color={MUTED}>Test run</Pill>
              <Pill size={1.2} bg={accent} color="#04101f">Publish</Pill>
            </div>
          </div>

          {/* Canvas */}
          <div
            className="relative h-[calc(100%-5cqw)]"
            style={{
              backgroundImage:
                'radial-gradient(rgb(150 178 255 / 0.14) 1px, transparent 1px)',
              backgroundSize: '3cqw 3cqw',
            }}
          >
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 50" preserveAspectRatio="none">
              {[
                'M14,21 C22,21 22,11 33,11',
                'M14,21 C22,21 22,32 33,32',
                'M46,11 C54,11 54,21 60,21',
                'M46,32 C54,32 54,21 60,21',
                'M73,21 L84,21',
              ].map((d, index) => (
                <path
                  key={index}
                  d={d}
                  fill="none"
                  stroke={accent}
                  strokeWidth="0.4"
                  opacity="0.5"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            {nodes.map((node) => (
              <div
                key={node.label}
                className="absolute rounded-[0.8cqw] border px-[1.4cqw] py-[1.1cqw]"
                style={{
                  left: node.x,
                  top: node.y,
                  borderColor: node.kind === 'Model' ? `${accent}66` : LINE,
                  background: PANEL,
                  minWidth: '13cqw',
                }}
              >
                <T size={1.05} className="font-mono uppercase tracking-[0.14em]" style={{ color: FAINT }}>
                  {node.kind}
                </T>
                <T size={1.4} className="mt-[0.5cqw] font-medium" style={{ color: TEXT }}>
                  {node.label}
                </T>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenSurface>
  );
}

function Settings({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={VOID}>
      <div className="flex h-full">
        <Sidebar accent={accent} active={4} />

        <div className="min-w-0 flex-1 p-[2.6cqw]">
          <T size={2.2} className="font-semibold tracking-[-0.025em]" style={{ color: TEXT }}>
            Settings
          </T>
          <T size={1.2} className="mt-[0.6cqw]" style={{ color: FAINT }}>
            Workspace configuration
          </T>

          <div className="mt-[2.4cqw] flex flex-col gap-[1.2cqw]">
            {[
              ['Workspace name', 'Northwind Ops', 'text'],
              ['Default model', 'claude-sonnet', 'select'],
              ['Retry on failure', 'Enabled', 'toggle'],
              ['Redact PII in logs', 'Enabled', 'toggle'],
            ].map(([label, value, control]) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-[0.9cqw] border px-[1.6cqw] py-[1.4cqw]"
                style={{ borderColor: LINE, background: PANEL }}
              >
                <div>
                  <T size={1.4} style={{ color: TEXT }}>{label}</T>
                  <T size={1.15} className="mt-[0.4cqw] font-mono" style={{ color: FAINT }}>
                    {value}
                  </T>
                </div>
                {control === 'toggle' ? (
                  <span
                    className="flex items-center rounded-full p-[0.3cqw]"
                    style={{ width: '4.4cqw', background: `${accent}55` }}
                  >
                    <span
                      className="ml-auto rounded-full"
                      style={{ width: '1.8cqw', height: '1.8cqw', background: accent }}
                    />
                  </span>
                ) : (
                  <T size={1.15} style={{ color: FAINT }}>Edit</T>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScreenSurface>
  );
}

function Mobile({ accent }: ScreenProps) {
  return (
    <ScreenSurface bg={VOID} ratio="9 / 17">
      <div className="flex h-full flex-col">
        <div
          className="flex items-center justify-between border-b px-[5cqw] py-[4cqw]"
          style={{ borderColor: LINE }}
        >
          <div className="flex items-center gap-[2.4cqw]">
            <span
              className="shrink-0 rounded-[1.4cqw]"
              style={{ width: '5cqw', height: '5cqw', background: accent }}
            />
            <T size={4.4} className="font-semibold" style={{ color: TEXT }}>Vela</T>
          </div>
          <div className="flex flex-col gap-[1.1cqw]">
            <span className="h-px w-[5.5cqw]" style={{ background: MUTED }} />
            <span className="h-px w-[5.5cqw]" style={{ background: MUTED }} />
          </div>
        </div>

        <div className="px-[5cqw] pt-[5cqw]">
          <T size={3} className="font-mono uppercase tracking-[0.16em]" style={{ color: FAINT }}>
            Pipelines
          </T>
          <div className="mt-[3cqw] flex flex-col gap-[2.4cqw]">
            {RUNS.map(([name, status, duration]) => {
              const running = status === 'Running';
              return (
                <div
                  key={name}
                  className="rounded-[2.4cqw] border p-[3.4cqw]"
                  style={{
                    borderColor: running ? `${accent}55` : LINE,
                    background: running ? `${accent}12` : PANEL,
                  }}
                >
                  <T size={3.8} className="font-mono" style={{ color: TEXT }}>{name}</T>
                  <div className="mt-[2cqw] flex items-center gap-[2cqw]">
                    <span
                      className="shrink-0 rounded-full"
                      style={{
                        width: '2cqw',
                        height: '2cqw',
                        background: running ? '#22d3ee' : 'rgb(148 162 190 / 0.5)',
                      }}
                    />
                    <T size={3.2} style={{ color: running ? '#22d3ee' : MUTED }}>{status}</T>
                    <T size={3.2} className="ml-auto" style={{ color: FAINT }}>{duration}</T>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom drawer replaces the desktop inspector. */}
        <div
          className="mt-auto rounded-t-[3.4cqw] border-t px-[5cqw] pb-[5cqw] pt-[3.4cqw]"
          style={{ borderColor: LINE, background: PANEL }}
        >
          <span
            className="mx-auto block rounded-full"
            style={{ width: '12cqw', height: '0.9cqw', background: 'rgb(150 178 255 / 0.24)' }}
          />
          <T size={3.6} className="mt-[3cqw] font-mono" style={{ color: TEXT }}>
            invoice-extract
          </T>
          <div
            className="mt-[2.4cqw] h-[1.6cqw] w-full overflow-hidden rounded-full"
            style={{ background: 'rgb(150 178 255 / 0.12)' }}
          >
            <div className="h-full w-[62%] rounded-full" style={{ background: accent }} />
          </div>
        </div>
      </div>
    </ScreenSurface>
  );
}

export const velaScreens = {
  marketing: Marketing,
  app: App,
  workflow: Workflow,
  settings: Settings,
  mobile: Mobile,
};
