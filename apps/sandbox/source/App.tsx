import { useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Checkbox,
  Input,
  SegmentedControl,
  Spinner,
  Switch,
  Tooltip,
} from '@dotm4x/notable';

type Theme = 'light' | 'dark';
type Density = 'comfortable' | 'compact' | 'spacious';

const densityOptions = [
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Compact', value: 'compact' },
  { label: 'Spacious', value: 'spacious' },
] satisfies {
  label: string;
  value: Density;
}[];

export function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [density, setDensity] = useState<Density>('comfortable');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [weeklySummaryEnabled, setWeeklySummaryEnabled] = useState(false);
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);

  return (
    <main className="sandbox" data-theme={theme}>
      <div className="sandbox__container">
        <header className="sandbox__header">
          <a aria-label="Notable home" className="brand" href="#">
            <span aria-hidden="true" className="brand__mark">
              n
            </span>
            <span>notable</span>
          </a>
          <div className="sandbox__header-actions">
            <Badge variant="secondary">Sandbox</Badge>
            <Button
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              onClick={() =>
                setTheme((currentTheme) =>
                  currentTheme === 'light' ? 'dark' : 'light',
                )
              }
              size="small"
              variant="outline"
            >
              {theme === 'light' ? 'Dark theme' : 'Light theme'}
            </Button>
          </div>
        </header>

        <section aria-labelledby="intro-title" className="intro">
          <p className="eyebrow">Design system · React</p>
          <h1 id="intro-title">Small details. Better interfaces.</h1>
          <p className="intro__description">
            A place to explore Notable components, their states, and themes as
            the library continues to evolve.
          </p>
          <div className="intro__actions">
            <Button onClick={() => setSaved(true)}>
              {saved ? 'Changes saved' : 'Try an interaction'}
            </Button>
            <Tooltip content="This button shows an accessible tooltip.">
              <Button variant="ghost">Hover for a tooltip</Button>
            </Tooltip>
          </div>
          <div aria-label="Team members" className="intro__team">
            <AvatarGroup max={4} size="small">
              <Avatar aria-label="Alex Lee" size="small">
                <Avatar.Fallback>AL</Avatar.Fallback>
              </Avatar>
              <Avatar aria-label="Morgan Chen" size="small">
                <Avatar.Fallback>MC</Avatar.Fallback>
              </Avatar>
              <Avatar aria-label="Sam Rivera" size="small">
                <Avatar.Fallback>SR</Avatar.Fallback>
              </Avatar>
              <Avatar aria-label="Jamie Kim" size="small">
                <Avatar.Fallback>JK</Avatar.Fallback>
              </Avatar>
              <Avatar aria-label="Taylor Diaz" size="small">
                <Avatar.Fallback>TD</Avatar.Fallback>
              </Avatar>
            </AvatarGroup>
            <span>Made for working together</span>
          </div>
        </section>

        <div className="component-grid">
          <section aria-labelledby="buttons-title" className="demo-card">
            <div className="demo-card__heading">
              <div>
                <p className="eyebrow">01 · Actions</p>
                <h2 id="buttons-title">Buttons and badges</h2>
              </div>
              <Badge variant="success">Ready</Badge>
            </div>
            <p className="demo-card__description">
              Variants for primary, secondary, and subtle actions.
            </p>
            <div className="button-row">
              <Button>Continue</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Subtle</Button>
              <Button variant="danger">Delete</Button>
            </div>
            <div className="badge-row" aria-label="Badge variants">
              <Badge>Default</Badge>
              <Badge variant="info">In progress</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="danger">Attention</Badge>
            </div>
          </section>

          <section aria-labelledby="form-title" className="demo-card">
            <div className="demo-card__heading">
              <div>
                <p className="eyebrow">02 · Inputs</p>
                <h2 id="form-title">Fields and selections</h2>
              </div>
              <Badge variant="info">Interactivo</Badge>
            </div>
            <Input
              autoComplete="name"
              label="Your name"
              onChange={(event) => setName(event.currentTarget.value)}
              placeholder="Enter your name"
              value={name}
            />
            <SegmentedControl
              label="Interface density"
              onChange={setDensity}
              options={densityOptions}
              value={density}
            />
            <div className="form-options">
              <Checkbox
                checked={weeklySummaryEnabled}
                label="Recibir resumen semanal"
                onChange={(event) =>
                  setWeeklySummaryEnabled(event.currentTarget.checked)
                }
              />
              <Switch
                checked={notificationsEnabled}
                description="You can change this setting at any time."
                label="Notifications"
                onChange={(event) =>
                  setNotificationsEnabled(event.currentTarget.checked)
                }
              />
            </div>
          </section>

          <section aria-labelledby="feedback-title" className="demo-card">
            <div className="demo-card__heading">
              <div>
                <p className="eyebrow">03 · Status</p>
                <h2 id="feedback-title">Feedback and loading</h2>
              </div>
              <Badge variant="secondary">En vivo</Badge>
            </div>
            <p className="demo-card__description">
              Clear status feedback helps everyone understand what is happening.
            </p>
            <div className="feedback-row">
              <span className="feedback-row__spinner">
                <Spinner label="Loading preview" size="small" />
              </span>
              <span>Preparing your preview</span>
            </div>
            <div aria-live="polite" className="saved-note">
              {saved
                ? 'Nice! You tried an interaction.'
                : 'Select “Try an interaction” to see a response.'}
            </div>
            <div className="density-note">
              Selected density: <strong>{density}</strong>
            </div>
          </section>
        </div>

        <footer className="sandbox__footer">
          <span>Notable UI</span>
          <span>A library in progress, open to new ideas.</span>
        </footer>
      </div>
    </main>
  );
}
