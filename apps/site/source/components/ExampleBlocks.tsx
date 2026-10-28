import { useEffect, useState, type PointerEvent, type ReactNode } from 'react';
import {
  Accordion,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Calendar,
  Card,
  Checkbox,
  CheckboxGroup,
  Collapsible,
  DropdownMenu,
  Empty,
  Fieldset,
  Input,
  Link,
  NumberFlow,
  Pagination,
  Progress,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  SegmentedControl,
  Select,
  Shortcut,
  Skeleton,
  Slider,
  Spinner,
  Switch,
  Tabs,
  Tooltip,
} from '@notable/react';

function LoginBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Sign in</Card.Title>
        <Card.Description>Welcome back to Notable.</Card.Description>
      </Card.Header>
      <Card.Content>
        <form
          className="site-block__stack"
          onSubmit={(event) => event.preventDefault()}
        >
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
          />
          <Input label="Password" name="password" type="password" required />
          <Button type="submit">Continue</Button>
        </form>
      </Card.Content>
    </Card>
  );
}

function PricingBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Team</Card.Title>
        <Card.Description>For growing product teams.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__row">
          <span className="site-block__metric">$24</span>
          <Badge variant="success">Popular</Badge>
        </div>
        <ul className="site-block__list">
          <li>Unlimited projects</li>
          <li>Shared workspaces</li>
          <li>Priority support</li>
        </ul>
        <Button variant="primary">Start trial</Button>
      </Card.Content>
    </Card>
  );
}

function SettingsBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Preferences</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <Switch label="Airplane mode" description="Turns off wireless." />
          <Switch
            defaultChecked
            label="Auto-save"
            description="Saves every change."
          />
        </div>
      </Card.Content>
    </Card>
  );
}

function TabsBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Project overview</Card.Title>
        <Card.Description>Keep track of your next milestone.</Card.Description>
      </Card.Header>
      <Card.Content>
        <Tabs defaultValue="overview">
          <Tabs.List aria-label="Project sections">
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="overview">
            <div className="site-block__stack site-block__stack--tight">
              <div className="site-block__row">
                <Badge variant="success">On track</Badge>
                <span className="site-block__muted">12 tasks remaining</span>
              </div>
              <Progress value={65} aria-label="Milestone progress" />
            </div>
          </Tabs.Content>
          <Tabs.Content value="activity">
            <p className="site-block__muted">Last update 14 minutes ago.</p>
          </Tabs.Content>
        </Tabs>
      </Card.Content>
    </Card>
  );
}

function CalendarBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Schedule</Card.Title>
        <Card.Description>Select a date for your next review.</Card.Description>
      </Card.Header>
      <Card.Content>
        <Calendar defaultValue={new Date(2025, 2, 14)} />
      </Card.Content>
    </Card>
  );
}

function AccordionBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Account help</Card.Title>
        <Card.Description>Answers to common questions.</Card.Description>
      </Card.Header>
      <Card.Content>
        <Accordion type="single">
          <Accordion.Item value="billing" title="Billing">
            <p className="site-block__muted">
              Invoices are sent on the first day of each month.
            </p>
          </Accordion.Item>
          <Accordion.Item value="security" title="Security">
            <p className="site-block__muted">
              Two-factor authentication is enabled.
            </p>
          </Accordion.Item>
          <Accordion.Item value="team" title="Team access">
            <p className="site-block__muted">
              Invite teammates from your workspace settings.
            </p>
          </Accordion.Item>
        </Accordion>
      </Card.Content>
    </Card>
  );
}

function SelectBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Deploy</Card.Title>
        <Card.Description>Choose where to ship this build.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <Select.Root defaultValue="production">
            <Select.Label>Environment</Select.Label>
            <Select.Trigger>
              <Select.Value placeholder="Select an environment" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Content>
              <Select.List>
                <Select.Item value="staging">Staging</Select.Item>
                <Select.Item value="production">Production</Select.Item>
              </Select.List>
            </Select.Content>
          </Select.Root>
          <div className="site-block__row">
            <Badge variant="success">Checks passed</Badge>
            <span className="site-block__muted">main · latest build</span>
          </div>
          <Button variant="secondary">Deploy</Button>
        </div>
      </Card.Content>
    </Card>
  );
}

function EmptyBlock() {
  return (
    <Card>
      <Card.Content>
        <Empty>
          <Empty.Header>
            <Empty.Media variant="icon" />
            <Empty.Title>No files yet</Empty.Title>
            <Empty.Description>Upload a file to get started.</Empty.Description>
          </Empty.Header>
        </Empty>
        <div className="site-block__row">
          <Button variant="outline">Browse files</Button>
          <span className="site-block__muted">or drag files here</span>
        </div>
      </Card.Content>
    </Card>
  );
}

function SliderBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Storage and sound</Card.Title>
        <Card.Description>Adjust your workspace preferences.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <Slider label="Volume" min={0} max={100} step={5} defaultValue={40} />
          <div className="site-block__stack site-block__stack--tight">
            <div className="site-block__row">
              <strong>Storage</strong>
              <Badge>72%</Badge>
            </div>
            <Progress value={72} aria-label="Storage used" />
            <span className="site-block__muted">72 GB of 100 GB used</span>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

function PaginationBlock() {
  const [page, setPage] = useState(2);
  return (
    <Card>
      <Card.Header>
        <Card.Title>Projects</Card.Title>
        <Card.Description>Browse your workspace.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <Breadcrumb>
            <Breadcrumb.Item href="#">Workspace</Breadcrumb.Item>
            <Breadcrumb.Item current>Notable</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-block__row">
            <Badge variant="success">Active</Badge>
            <span className="site-block__muted">Showing page {page} of 8</span>
          </div>
          <Pagination page={page} pageCount={8} onPageChange={setPage} />
        </div>
      </Card.Content>
    </Card>
  );
}

function RadioBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Billing cycle</Card.Title>
        <Card.Description>
          Choose how often your team is billed.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <RadioGroup label="Plan" defaultValue="monthly">
            <RadioGroupItem value="monthly" label="Monthly" />
            <RadioGroupItem value="yearly" label="Yearly" />
          </RadioGroup>
          <Badge variant="success">Save with yearly billing</Badge>
        </div>
      </Card.Content>
    </Card>
  );
}

function CheckboxBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Interests</Card.Title>
        <Card.Description>Choose topics for your workspace.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <CheckboxGroup defaultValue={['design']}>
            <CheckboxGroup.Item value="design" label="Design" />
            <CheckboxGroup.Item value="code" label="Code" />
          </CheckboxGroup>
          <Checkbox name="terms" label="I accept the terms" />
          <Button variant="secondary">Save preferences</Button>
        </div>
      </Card.Content>
    </Card>
  );
}

function FieldsetBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Billing address</Card.Title>
        <Card.Description>Where should we send your invoices?</Card.Description>
      </Card.Header>
      <Card.Content>
        <Fieldset.Root>
          <Fieldset.Legend>Address</Fieldset.Legend>
          <Input label="City" name="city" autoComplete="address-level2" />
          <Input label="Postal code" name="postal" autoComplete="postal-code" />
        </Fieldset.Root>
      </Card.Content>
    </Card>
  );
}

function CodeBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Install</Card.Title>
        <Card.Description>Add Notable to your project.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <pre className="site-block__code">pnpm add @notable/react</pre>
          <p className="site-block__muted">
            Import the styles once at the root of your application.
          </p>
          <pre className="site-block__code">
            import '@notable/react/styles.css';
          </pre>
        </div>
      </Card.Content>
    </Card>
  );
}

function DropdownBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Release notes</Card.Title>
        <Card.Description>Notable 1.0 · Updated today</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <div className="site-block__row">
            <Badge variant="success">Published</Badge>
            <span className="site-block__muted">Visible to your team</span>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>Options</DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item>Rename</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>Delete</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </Card.Content>
    </Card>
  );
}

function CollapsibleBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Latest deployment</Card.Title>
        <Card.Description>Your changes are live.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <div className="site-block__row">
            <Badge variant="success">Ready</Badge>
            <span className="site-block__muted">Production · 14:32</span>
          </div>
          <Collapsible>
            <Collapsible.Trigger>Show details</Collapsible.Trigger>
            <Collapsible.Content>
              <p className="site-block__muted">
                Deployed from main at 14:32 by the release bot.
              </p>
            </Collapsible.Content>
          </Collapsible>
        </div>
      </Card.Content>
    </Card>
  );
}

function MetricBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Active sessions</Card.Title>
        <Card.Description>Visitors across your workspace.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <span className="site-block__metric">
            <NumberFlow value={1284} />
          </span>
          <div className="site-block__row">
            <Badge variant="success">+12%</Badge>
            <span className="site-block__muted">compared with last week</span>
          </div>
          <Progress value={64} aria-label="Weekly session goal" />
          <span className="site-block__muted">64% of your weekly goal</span>
        </div>
      </Card.Content>
    </Card>
  );
}

function TooltipBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Share project</Card.Title>
        <Card.Description>Invite others to view your work.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <div className="site-block__profile">
            <Avatar>
              <Avatar.Fallback>AR</Avatar.Fallback>
            </Avatar>
            <p>Ana Ruiz · Owner</p>
          </div>
          <div className="site-block__row">
            <Tooltip content="Copy link">
              <Button variant="outline" size="icon" aria-label="Copy link">
                <span aria-hidden="true">⧉</span>
              </Button>
            </Tooltip>
            <Tooltip content="Share">
              <Button variant="ghost">Share</Button>
            </Tooltip>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

function SegmentedBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Activity</Card.Title>
        <Card.Description>See how your team is doing.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <SegmentedControl
            size="small"
            defaultValue="week"
            aria-label="Range"
            options={[
              { label: 'Day', value: 'day' },
              { label: 'Week', value: 'week' },
              { label: 'Month', value: 'month' },
            ]}
          />
          <div className="site-block__row">
            <strong className="site-block__metric">24</strong>
            <Badge variant="success">+8%</Badge>
          </div>
          <p className="site-block__muted">Tasks completed this week</p>
        </div>
      </Card.Content>
    </Card>
  );
}

function ActionsBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Project</Card.Title>
        <Card.Description>
          Need help? <Link href="#">Read the guidelines</Link>
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__row">
          <Button variant="primary">Save</Button>
          <Button variant="outline">Cancel</Button>
          <Button variant="danger">Delete</Button>
        </div>
        <div className="site-block__row">
          <Shortcut>⌘</Shortcut>
          <Shortcut>K</Shortcut>
        </div>
      </Card.Content>
    </Card>
  );
}

function TeamBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Team</Card.Title>
      </Card.Header>
      <Card.Content>
        <ScrollArea style={{ height: 120 }}>
          <ul className="site-block__list">
            <li>Ana Ruiz</li>
            <li>Bruno Diaz</li>
            <li>Carla Mena</li>
            <li>Diego Soto</li>
          </ul>
        </ScrollArea>
        <div className="site-block__profile">
          <Avatar>
            <Avatar.Fallback>AR</Avatar.Fallback>
          </Avatar>
          <p>Ana Ruiz</p>
        </div>
      </Card.Content>
    </Card>
  );
}

function LoadingBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Recent activity</Card.Title>
        <Card.Description>Loading your workspace updates.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <div className="site-block__row">
            <Spinner size="small" />
            <Spinner size="medium" />
            <Spinner size="large" />
          </div>
          <div className="site-block__profile">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="site-block__stack site-block__stack--tight">
              <Skeleton variant="text" width={150} height={14} />
              <Skeleton variant="text" width={100} height={12} />
            </div>
          </div>
        </div>
        <div className="site-block__profile">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="site-block__stack site-block__stack--tight">
            <Skeleton variant="text" width={160} height={14} />
            <Skeleton variant="text" width={110} height={12} />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

function BadgesBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Status</Card.Title>
        <Card.Description>
          Track progress across your projects.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <div className="site-block__row">
            <Badge>Draft</Badge>
            <span className="site-block__muted">Brand guidelines</span>
          </div>
          <div className="site-block__row">
            <Badge variant="success">Live</Badge>
            <span className="site-block__muted">Website redesign</span>
          </div>
          <div className="site-block__row">
            <Badge variant="warning">Review</Badge>
            <span className="site-block__muted">Product launch</span>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

function QuoteBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>From the team</Card.Title>
        <Card.Description>A note from our latest review.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <blockquote className="site-block__quote">
            “Clear, calm, and consistent. It lets the work speak.”
          </blockquote>
          <div className="site-block__profile">
            <Avatar>
              <Avatar.Fallback>CM</Avatar.Fallback>
            </Avatar>
            <p>Carla Mena · Design review</p>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

function SwitchGroupBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Notifications</Card.Title>
        <Card.Description>Make this workspace your own.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <Switch
            label="Notifications"
            description="Email me about mentions."
            defaultChecked
          />
          <Switch label="Compact mode" description="Tighter spacing." />
          <Switch
            label="Weekly summary"
            description="A digest of your team's activity."
          />
        </div>
      </Card.Content>
    </Card>
  );
}

function ProfileBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Profile details</Card.Title>
        <Card.Description>Update how you appear to your team.</Card.Description>
      </Card.Header>
      <Card.Content>
        <form
          className="site-block__stack"
          onSubmit={(event) => event.preventDefault()}
        >
          <Input label="Name" name="name" defaultValue="Alex Morgan" />
          <Input label="Role" name="role" defaultValue="Product designer" />
          <Button type="submit" variant="secondary">
            Save profile
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
}

function PrivacyBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Privacy</Card.Title>
        <Card.Description>
          Control what your teammates can see.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <Switch
            label="Show availability"
            description="Share your current status."
            defaultChecked
          />
          <Switch
            label="Public profile"
            description="Allow others to find your profile."
          />
        </div>
      </Card.Content>
    </Card>
  );
}

function ConnectionBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Connected services</Card.Title>
        <Card.Description>Keep your tools in sync.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <div className="site-block__row">
            <strong>GitHub</strong>
            <Badge variant="success">Connected</Badge>
          </div>
          <p className="site-block__muted">
            Sync updates from your repositories.
          </p>
          <Button variant="outline">Manage connection</Button>
        </div>
      </Card.Content>
    </Card>
  );
}

function InviteBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Invite a teammate</Card.Title>
        <Card.Description>Bring someone into your workspace.</Card.Description>
      </Card.Header>
      <Card.Content>
        <form
          className="site-block__stack"
          onSubmit={(event) => event.preventDefault()}
        >
          <Input
            label="Email address"
            name="invite-email"
            type="email"
            placeholder="teammate@company.com"
          />
          <RadioGroup label="Access" defaultValue="member">
            <RadioGroupItem value="member" label="Member" />
            <RadioGroupItem value="viewer" label="Viewer" />
          </RadioGroup>
          <Button type="submit">Send invitation</Button>
        </form>
      </Card.Content>
    </Card>
  );
}

function ChecklistBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Getting started</Card.Title>
        <Card.Description>
          A few steps to set up your workspace.
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <Progress value={33} aria-label="Setup progress" />
          <CheckboxGroup defaultValue={['profile']}>
            <CheckboxGroup.Item value="profile" label="Complete your profile" />
            <CheckboxGroup.Item value="team" label="Invite your team" />
            <CheckboxGroup.Item value="project" label="Create a project" />
          </CheckboxGroup>
        </div>
      </Card.Content>
    </Card>
  );
}

function KeyboardBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Quick actions</Card.Title>
        <Card.Description>Move around your workspace faster.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <div className="site-block__row">
            <span>Search</span>
            <Shortcut>⌘</Shortcut>
            <Shortcut>K</Shortcut>
          </div>
          <div className="site-block__row">
            <span>New project</span>
            <Shortcut>⌘</Shortcut>
            <Shortcut>N</Shortcut>
          </div>
          <span className="site-block__muted">
            Keyboard shortcuts are shown for macOS.
          </span>
        </div>
      </Card.Content>
    </Card>
  );
}

function AppearanceBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Appearance</Card.Title>
        <Card.Description>Choose a comfortable workspace.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <SegmentedControl
            aria-label="Appearance"
            defaultValue="system"
            options={[
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
              { label: 'System', value: 'system' },
            ]}
          />
          <Switch
            label="Reduce motion"
            description="Use fewer animated transitions."
          />
        </div>
      </Card.Content>
    </Card>
  );
}

function MilestoneBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Next milestone</Card.Title>
        <Card.Description>Prepare for the product launch.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <div className="site-block__row">
            <Badge variant="warning">In review</Badge>
            <span className="site-block__muted">Due Friday</span>
          </div>
          <Progress value={75} aria-label="Launch progress" />
          <span className="site-block__muted">9 of 12 tasks complete</span>
        </div>
      </Card.Content>
    </Card>
  );
}

function SupportBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Need a hand?</Card.Title>
        <Card.Description>Find the right place to start.</Card.Description>
      </Card.Header>
      <Card.Content>
        <Accordion type="single">
          <Accordion.Item value="workspace" title="Set up a workspace">
            <p className="site-block__muted">
              Create a workspace and invite your team.
            </p>
          </Accordion.Item>
          <Accordion.Item value="projects" title="Organize projects">
            <p className="site-block__muted">
              Group related work into projects.
            </p>
          </Accordion.Item>
          <Accordion.Item value="account" title="Manage your account">
            <p className="site-block__muted">
              Update your profile and preferences.
            </p>
          </Accordion.Item>
        </Accordion>
      </Card.Content>
    </Card>
  );
}

function SecurityBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Security</Card.Title>
        <Card.Description>Protect access to your account.</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <div className="site-block__row">
            <Badge variant="success">Protected</Badge>
            <span className="site-block__muted">
              Two-step verification is on
            </span>
          </div>
          <Switch
            label="Sign-in alerts"
            description="Get notified about new devices."
            defaultChecked
          />
          <Button variant="outline">Review sessions</Button>
        </div>
      </Card.Content>
    </Card>
  );
}

function InvoiceBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Latest invoice</Card.Title>
        <Card.Description>Team plan · October</Card.Description>
      </Card.Header>
      <Card.Content>
        <div className="site-block__stack">
          <div className="site-block__row">
            <strong className="site-block__metric">$96.00</strong>
            <Badge variant="success">Paid</Badge>
          </div>
          <span className="site-block__muted">4 members · billed monthly</span>
          <Button variant="secondary">View invoice</Button>
        </div>
      </Card.Content>
    </Card>
  );
}

function FeedbackBlock() {
  return (
    <Card>
      <Card.Header>
        <Card.Title>Share feedback</Card.Title>
        <Card.Description>Help us make your workspace better.</Card.Description>
      </Card.Header>
      <Card.Content>
        <form
          className="site-block__stack"
          onSubmit={(event) => event.preventDefault()}
        >
          <RadioGroup label="How was your experience?" defaultValue="good">
            <RadioGroupItem value="good" label="Good" />
            <RadioGroupItem value="okay" label="Okay" />
            <RadioGroupItem value="poor" label="Needs improvement" />
          </RadioGroup>
          <Button type="submit" variant="secondary">
            Send feedback
          </Button>
        </form>
      </Card.Content>
    </Card>
  );
}

const columns: ReactNode[][] = [
  [
    <LoginBlock key="login" />,
    <AppearanceBlock key="appearance" />,
    <PrivacyBlock key="privacy" />,
  ],
  [
    <TabsBlock key="tabs" />,
    <PricingBlock key="pricing" />,
    <LoadingBlock key="loading" />,
  ],
  [
    <ProfileBlock key="profile" />,
    <KeyboardBlock key="keyboard" />,
    <QuoteBlock key="quote" />,
  ],
  [
    <CalendarBlock key="calendar" />,
    <DropdownBlock key="release" />,
    <ActionsBlock key="actions" />,
  ],
  [
    <SliderBlock key="storage" />,
    <SupportBlock key="support" />,
    <AccordionBlock key="help" />,
  ],
  [
    <InviteBlock key="invite" />,
    <ChecklistBlock key="checklist" />,
    <BadgesBlock key="status" />,
  ],
  [
    <FieldsetBlock key="address" />,
    <RadioBlock key="billing" />,
    <CodeBlock key="install" />,
  ],
  [
    <SwitchGroupBlock key="notifications" />,
    <SegmentedBlock key="activity" />,
    <InvoiceBlock key="invoice" />,
  ],
  [
    <FeedbackBlock key="feedback" />,
    <PaginationBlock key="projects" />,
    <EmptyBlock key="empty" />,
  ],
  [
    <SelectBlock key="deploy" />,
    <TeamBlock key="team" />,
    <ConnectionBlock key="connections" />,
  ],
  [
    <MilestoneBlock key="milestone" />,
    <TooltipBlock key="share" />,
    <CollapsibleBlock key="deployment" />,
    <SettingsBlock key="settings" />,
  ],
  [
    <CheckboxBlock key="interests" />,
    <SecurityBlock key="security" />,
    <MetricBlock key="metric" />,
  ],
];

function StageRow() {
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    if (!pressed) return;
    const release = () => setPressed(false);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    return () => {
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
    };
  }, [pressed]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button === 0) setPressed(true);
  };

  const group = (hidden: boolean) => (
    <div className="site-stage__group" aria-hidden={hidden || undefined}>
      {columns.map((cells, index) => (
        <div className="site-stage__column" key={index}>
          {cells}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`site-stage__row${pressed ? ' site-stage__row--paused' : ''}`}
      onPointerDown={handlePointerDown}
    >
      {group(false)}
      {group(true)}
      {group(true)}
    </div>
  );
}

export default function ExampleBlocks() {
  return (
    <div className="site-stage">
      <StageRow />
    </div>
  );
}
