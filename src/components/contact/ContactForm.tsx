import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, Check, Loader2, Mail } from 'lucide-react';
import { useRef, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { SelectField, TextAreaField, TextField } from './Field';
import { buildMailto, isContactConfigured, sendEnquiry } from '@/lib/contact';
import { EASE_EXPO } from '@/lib/motion';
import {
  EMPTY_CONTACT,
  validateAll,
  validateField,
  type ContactErrors,
  type ContactValues,
} from '@/lib/validation';

const PROJECT_TYPES = [
  'New website',
  'Website redesign',
  'Web application',
  'AI feature or integration',
  'Something else',
] as const;

const BUDGETS = [
  'Under $2,500',
  '$2,500 – $5,000',
  '$5,000 – $10,000',
  '$10,000+',
  'Not sure yet',
] as const;

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [problem, setProblem] = useState<string>('');
  const [fallbackMailto, setFallbackMailto] = useState<string>('');

  const refs = {
    name: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    projectType: useRef<HTMLSelectElement>(null),
    message: useRef<HTMLTextAreaElement>(null),
  };

  const set = (field: keyof ContactValues) => (value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    // Clear an error the moment the visitor starts fixing it.
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  /** Validate on blur, not on every keystroke — nobody wants to be told their
   *  email is invalid while they're still typing it. */
  const handleBlur = (field: keyof ContactValues) => () => {
    const error = validateField(field, values[field]);
    setErrors((current) => ({ ...current, [field]: error }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === 'submitting') return;

    const found = validateAll(values);
    setErrors(found);

    const firstInvalid = (Object.keys(found) as (keyof ContactValues)[])[0];
    if (firstInvalid) {
      refs[firstInvalid as keyof typeof refs]?.current?.focus();
      return;
    }

    setStatus('submitting');
    setProblem('');

    const result = await sendEnquiry(values);

    if (result.status === 'sent') {
      setStatus('success');
      setFallbackMailto('');
      return;
    }

    // Unconfigured or a genuine send failure — either way, hand over a
    // prefilled email instead. Never swallow the message.
    setStatus('error');
    setFallbackMailto(buildMailto(values));
    setProblem(
      result.status === 'unconfigured'
        ? 'This form isn’t connected to a delivery service yet. Your message is ready to send by email instead.'
        : result.reason,
    );
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE_EXPO }}
        className="card-surface flex min-h-[28rem] flex-col items-start justify-center gap-5 rounded-panel p-8 sm:p-10"
      >
        <motion.span
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.08, ease: EASE_EXPO }}
          className="grid size-12 place-items-center rounded-full border border-aqua/30 bg-aqua/10 text-aqua shadow-[0_0_28px_-6px_rgb(34_211_238/0.5)]"
        >
          <Check className="size-5" strokeWidth={2} />
        </motion.span>
        <h3 className="text-title font-medium text-ink">Message received.</h3>
        <p className="max-w-md text-ink-2">
          Thanks {values.name.split(' ')[0]} — it’s with me now. I’ll get back to
          you at {values.email} shortly, usually within a day.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setValues(EMPTY_CONTACT);
            setStatus('idle');
          }}
        >
          Send another
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="card-surface rounded-panel p-6 sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          ref={refs.name}
          label="Name"
          name="name"
          autoComplete="name"
          placeholder="Jane Okafor"
          value={values.name}
          onChange={(event) => set('name')(event.target.value)}
          onBlur={handleBlur('name')}
          error={errors.name}
        />
        <TextField
          ref={refs.email}
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="jane@company.com"
          value={values.email}
          onChange={(event) => set('email')(event.target.value)}
          onBlur={handleBlur('email')}
          error={errors.email}
        />
        <TextField
          label="Company"
          name="company"
          autoComplete="organization"
          placeholder="Company name"
          optional
          value={values.company}
          onChange={(event) => set('company')(event.target.value)}
        />
        <SelectField
          ref={refs.projectType}
          label="Project type"
          name="projectType"
          placeholder="Select one"
          options={PROJECT_TYPES}
          value={values.projectType}
          onChange={(event) => set('projectType')(event.target.value)}
          onBlur={handleBlur('projectType')}
          error={errors.projectType}
        />
        <SelectField
          label="Budget"
          name="budget"
          placeholder="Select a range"
          options={BUDGETS}
          optional
          className="sm:col-span-2"
          value={values.budget}
          onChange={(event) => set('budget')(event.target.value)}
        />
        <TextAreaField
          ref={refs.message}
          label="Project details"
          name="message"
          placeholder="What are you building, who is it for, and when do you need it live?"
          className="sm:col-span-2"
          value={values.message}
          onChange={(event) => set('message')(event.target.value)}
          onBlur={handleBlur('message')}
          error={errors.message}
        />
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: EASE_EXPO }}
            className="overflow-hidden"
          >
            <div
              role="alert"
              className="mt-6 flex gap-3 rounded-xl border border-amber/25 bg-amber/[0.07] p-4"
            >
              <AlertTriangle
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-amber"
                strokeWidth={1.75}
              />
              <div className="flex flex-col items-start gap-3">
                <p className="text-[0.875rem] leading-relaxed text-ink-2">{problem}</p>
                {fallbackMailto && (
                  <a
                    href={fallbackMailto}
                    className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-azure underline decoration-azure/30 underline-offset-4 transition-colors hover:decoration-azure"
                  >
                    <Mail aria-hidden="true" className="size-3.5" strokeWidth={2} />
                    Open it in your email app
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        {!isContactConfigured && (
          <p className="order-2 text-[0.8125rem] text-ink-3 sm:order-1">
            EmailJS not configured yet — see .env.example.
          </p>
        )}

        <Button
          type="submit"
          variant="glow"
          size="lg"
          arrow={status === 'submitting' ? false : 'right'}
          disabled={status === 'submitting'}
          className="order-1 max-sm:w-full sm:order-2"
        >
          {status === 'submitting' ? (
            <span className="inline-flex items-center gap-2.5">
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              Sending
            </span>
          ) : (
            'Send message'
          )}
        </Button>
      </div>
    </form>
  );
}
