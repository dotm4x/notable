import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Checkbox,
  Dialog,
  Input,
  Popover,
  Progress,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  SegmentedControl,
  Separator,
  Shortcut,
  Skeleton,
  Spinner,
  Switch,
  Tabs,
  Tooltip,
  toast,
} from '@dotm4x/notable';

type Theme = 'light' | 'dark';
type Density = 'comfortable' | 'compact' | 'spacious';

const recentMessages = [
  'Maya commented on the onboarding copy.',
  'Build #482 finished successfully.',
  'Leo requested review on the billing module.',
  'The weekly summary was delivered.',
  'Two new members joined the workspace.',
  'Design tokens were updated to version 2.4.',
  'Ana resolved three accessibility notes.',
  'Staging deploy is waiting for approval.',
  'The changelog draft is ready to review.',
  'Automated tests passed on main.',
  'A new avatar set was uploaded.',
  'Retention report generated for March.',
];

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
  const [deliveryFrequency, setDeliveryFrequency] = useState('daily');
  const [uploadProgress, setUploadProgress] = useState(25);
  const [deleteStatus, setDeleteStatus] = useState('No draft deleted yet.');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Portaled overlays (dialogs, popovers, toasts, tooltips) render under
  // document.body, outside this component's tree, so the theme must be set on <html>.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <main className="sandbox">
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
            <RadioGroup
              description="Choose how often summaries are sent."
              label="Notification delivery"
              onValueChange={setDeliveryFrequency}
              orientation="horizontal"
              value={deliveryFrequency}
            >
              <RadioGroupItem label="Instant" value="instant" />
              <RadioGroupItem label="Daily digest" value="daily" />
              <RadioGroupItem label="Weekly summary" value="weekly" />
            </RadioGroup>
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
            <div className="progress-row">
              <Progress
                aria-label="Upload progress"
                className="progress-row__bar"
                value={uploadProgress}
              />
              <Progress
                aria-label="Upload progress (circular)"
                size="small"
                value={uploadProgress}
                variant="circular"
              />
              <Button
                onClick={() =>
                  setUploadProgress((current) =>
                    current >= 100 ? 0 : current + 25,
                  )
                }
                size="small"
                variant="outline"
              >
                Advance upload
              </Button>
            </div>
            <div
              className="skeleton-row"
              role="status"
              aria-label="Loading content"
            >
              <Skeleton height={40} variant="circular" width={40} />
              <div className="skeleton-row__lines">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </div>
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

          <section aria-labelledby="navigation-title" className="demo-card">
            <div className="demo-card__heading">
              <div>
                <p className="eyebrow">04 · Navigation</p>
                <h2 id="navigation-title">Tabs and accordion</h2>
              </div>
            </div>
            <p className="demo-card__description">
              Group related content so people can switch views or reveal details
              on demand.
            </p>
            <Tabs defaultValue="overview">
              <Tabs.List aria-label="Project sections">
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="overview">
                <p className="tab-panel">
                  Notable is a shared component library for product teams.
                </p>
              </Tabs.Content>
              <Tabs.Content value="activity">
                <p className="tab-panel">Three changes were made today.</p>
              </Tabs.Content>
              <Tabs.Content value="settings">
                <p className="tab-panel">
                  Workspace settings are managed by admins.
                </p>
              </Tabs.Content>
            </Tabs>
            <Accordion defaultValue="delivery" type="single">
              <AccordionItem title="Delivery options" value="delivery">
                Choose instant, daily, or weekly delivery for notifications.
              </AccordionItem>
              <AccordionItem title="Privacy" value="privacy">
                Summaries never include private message content.
              </AccordionItem>
            </Accordion>
          </section>

          <section aria-labelledby="overlays-title" className="demo-card">
            <div className="demo-card__heading">
              <div>
                <p className="eyebrow">05 · Overlays</p>
                <h2 id="overlays-title">Dialogs, popovers and toasts</h2>
              </div>
            </div>
            <p className="demo-card__description">
              Ask for confirmation, add context on demand, and report outcomes
              without interrupting the flow.
            </p>
            <div className="button-row">
              <Dialog
                onOpenChange={setIsDeleteDialogOpen}
                open={isDeleteDialogOpen}
              >
                <Dialog.Trigger>
                  <Button variant="danger">Delete project</Button>
                </Dialog.Trigger>
                <Dialog.Content size="small">
                  <Dialog.Header>
                    <Dialog.Title>Delete project?</Dialog.Title>
                    <Dialog.Description>
                      This action cannot be undone. All files in the project
                      will be removed.
                    </Dialog.Description>
                  </Dialog.Header>
                  <Dialog.Footer>
                    <Dialog.Close>Cancel</Dialog.Close>
                    <Button
                      variant="danger"
                      onClick={() => {
                        setDeleteStatus('Project deleted.');
                        setIsDeleteDialogOpen(false);
                      }}
                    >
                      Delete
                    </Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog>
              <Popover>
                <Popover.Trigger>
                  <Button variant="outline">Project details</Button>
                </Popover.Trigger>
                <Popover.Content>
                  <Popover.Header>
                    <Popover.Title>Notable workspace</Popover.Title>
                    <Popover.Description>
                      Shared by 12 members across 3 teams.
                    </Popover.Description>
                  </Popover.Header>
                </Popover.Content>
              </Popover>
            </div>
            <p className="overlay-note" aria-live="polite">
              {deleteStatus}
            </p>
            <div className="button-row">
              <Button onClick={() => toast.success('Changes saved.')}>
                Success toast
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.error('Could not save changes.')}
              >
                Error toast
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  toast.promise(
                    new Promise((resolve) => setTimeout(resolve, 1200)),
                    {
                      loading: 'Publishing…',
                      success: 'Published.',
                      error: 'Publish failed.',
                    },
                  )
                }
              >
                Promise toast
              </Button>
            </div>
          </section>

          <section aria-labelledby="layout-title" className="demo-card">
            <div className="demo-card__heading">
              <div>
                <p className="eyebrow">06 · Layout</p>
                <h2 id="layout-title">Separators, scrolling and shortcuts</h2>
              </div>
            </div>
            <p className="demo-card__description">
              Structure content with dividers, keep long lists scannable, and
              surface keyboard shortcuts.
            </p>
            <div className="separator-row">
              <span>Overview</span>
              <Separator orientation="vertical" />
              <span>Activity</span>
              <Separator orientation="vertical" />
              <span>Settings</span>
            </div>
            <Separator />
            <ScrollArea
              aria-label="Recent messages"
              className="scroll-area-demo"
            >
              <ul className="scroll-area-demo__list">
                {recentMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </ScrollArea>
            <div className="shortcut-row">
              <span>Open command palette</span>
              <span className="shortcut-row__keys">
                <Shortcut>Ctrl</Shortcut>
                <span aria-hidden="true">+</span>
                <Shortcut>K</Shortcut>
              </span>
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
