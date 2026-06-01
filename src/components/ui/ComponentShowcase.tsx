import { useState } from "react";

import { Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Bell,
  Briefcase,
  Clock,
  DollarSign,
  Eye,
  Filter,
  Grid3X3,
  Home,
  Layout,
  List,
  Monitor,
  Package,
  Settings,
  Star,
  Users,
  Zap,
} from "lucide-react";

// Import all components
import { Alert } from "./alert";
import { AlertsKpi } from "./alerts-kpi";
import { Badge } from "./badge";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Checkbox } from "./checkbox";
import { Chip, ChipGroup } from "./chips";
import { DashboardKpi } from "./dashboard-kpi";
import { DataTable } from "./data-table";
import type { ColumnDef } from "./data-table";
import { Header } from "./header";
import { IconToggle } from "./icon-toggle";
import { Input } from "./input";
import { KpiCard } from "./kpi-card";
import { MoreOptions } from "./more-options";
import { NumberField } from "./number-field";
import { OrgSelector } from "./org-selector";
import { PageHeading } from "./page-heading";
import { Pagination } from "./pagination";
import { ProgressStep } from "./progress-step";
import { Radio } from "./radio";
import { SearchInput } from "./search-input";
import { SegmentControl } from "./segment-control";
import { Select } from "./select";
import { Sidenav, NavItem } from "./sidenav";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";
import { Tabs } from "./tabs";
import { Tag } from "./tags";
import { TimeSelector } from "./time-selector";
import { Toggle } from "./toggle";
import { ToggleSwitch } from "./toggle-switch";
import { Tooltip } from "./tooltip";
import { TreeView, TreeNode } from "./tree-view";
import { WidgetsKpi } from "./widgets-kpi";

type TabItem = { id: string; label: string; badge?: number; icon?: React.ElementType };


// ─── Section wrapper ─────────────────────────────────────────────────────────

function Section({ title, id, children }: { title: string; id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="mb-4 text-[20px] font-semibold text-[#111827]">{title}</h2>
      <div className="rounded-xl border border-[#e5e7eb] bg-white p-6">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start gap-6 border-b border-[#f0f1f4] pb-5 last:border-0 last:pb-0">
      <div className="w-36 shrink-0 pt-1 text-[13px] font-semibold text-[#5c5c5c]">{label}</div>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "quick-links", label: "Quick Links", icon: Zap, badge: 3 },
  { id: "ess", label: "ESS", icon: Clock },
  { id: "communication", label: "Communication", icon: Bell, badge: 7 },
  { id: "standards", label: "Standards", icon: Briefcase },
  { id: "labor-model", label: "Labor Model", icon: Activity },
];

const TREE_NODES: TreeNode[] = [
  {
    id: "1", label: "Bakery Department",
    children: [
      { id: "1-1", label: "Baking", children: [{ id: "1-1-1", label: "Head Baker" }] },
      { id: "1-2", label: "Cake Decoration" },
      { id: "1-3", label: "Bakery Clerk" },
    ],
  },
  {
    id: "2", label: "Produce Department",
    children: [
      { id: "2-1", label: "Fresh Cut" },
      { id: "2-2", label: "Produce Clerk" },
    ],
  },
];

type Employee = { name: string; department: string; role: string; hours: number; status: string };
const TABLE_COLUMNS: ColumnDef<Employee>[] = [
  { key: "name", header: "Name", sortable: true },
  { key: "department", header: "Department", sortable: true },
  { key: "role", header: "Role" },
  { key: "hours", header: "Hours", sortable: true, width: "80px" },
  {
    key: "status", header: "Status", width: "120px",
    render: (row) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-[12px] font-medium ${
        row.status === "Active" ? "bg-[#f0fdf4] text-[#2b9a1f]" : "bg-[#f9fafb] text-[#5c5c5c]"
      }`}>{row.status}</span>
    ),
  },
];
const TABLE_ROWS: Employee[] = [
  { name: "Sarah Johnson", department: "Bakery", role: "Baker", hours: 39, status: "Active" },
  { name: "Emily Carter", department: "Bakery", role: "Pastry Chef", hours: 38, status: "Active" },
  { name: "Michael Chen", department: "Bakery", role: "Decorator", hours: 40, status: "Active" },
  { name: "Jessica Brown", department: "Produce", role: "Clerk", hours: 32, status: "On Leave" },
  { name: "Ryan Anderson", department: "Meat", role: "Butcher", hours: 45, status: "Active" },
];

// ─── Main showcase ────────────────────────────────────────────────────────────

export function ComponentShowcase() {
  // State for interactive demos
  const [tab1, setTab1] = useState("tab1");
  const [tab2, setTab2] = useState("t1");
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(true);
  const [radio1, setRadio1] = useState("a");
  const [toggle1, setToggle1] = useState("week");
  const [toggleSwitch1, setToggleSwitch1] = useState(false);
  const [toggleSwitch2, setToggleSwitch2] = useState(true);
  const [iconToggle1, setIconToggle1] = useState(false);
  const [segment1, setSegment1] = useState("day");
  const [page, setPage] = useState(3);
  const [step, setStep] = useState(1);
  const [calDate, setCalDate] = useState<Date | undefined>(new Date());
  const [numVal, setNumVal] = useState(4);
  const [selectedChips, setSelectedChips] = useState<string[]>(["Bakery"]);
  const [navActive, setNavActive] = useState("home");
  const [org, setOrg] = useState("Store #1042 – Chicago");
  const [timeVal, setTimeVal] = useState<{ hours: number; minutes: number; period: "AM" | "PM" }>({ hours: 9, minutes: 30, period: "AM" });

  const tabs1: TabItem[] = [
    { id: "tab1", label: "Overview" },
    { id: "tab2", label: "Details", badge: 4 },
    { id: "tab3", label: "History" },
  ];
  const tabs2: TabItem[] = [
    { id: "t1", label: "All" },
    { id: "t2", label: "Active", badge: 12 },
    { id: "t3", label: "Pending" },
    { id: "t4", label: "Closed" },
  ];

  return (
    <div className="min-h-screen bg-[#f1f3f9]">
      {/* Page header */}
      <div className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-[1280px] items-center gap-4">
          <Link to="/demo" className="flex items-center gap-1.5 text-[14px] font-medium text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <div className="h-5 w-px bg-[#e5e7eb]" />
          <h1 className="text-[20px] font-bold text-[#111827]">Component Showcase</h1>
          <span className="rounded-full bg-[#e8f2ff] px-2 py-0.5 text-[12px] font-semibold text-primary">
            Figma → Code
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] space-y-8 px-6 py-8">

        {/* ── Buttons & Actions ─────────────────────────────────── */}
        <Section title="Buttons & Actions" id="buttons">
          <div className="space-y-5">
            <Row label="Button variants">
              <Button variant="default">Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="default" disabled>Disabled</Button>
            </Row>
            <Row label="Button sizes">
              <Button size="default">Default (36px)</Button>
              <Button size="sm">Small (32px)</Button>
              <Button size="icon"><Settings className="h-4 w-4" /></Button>
            </Row>
            <Row label="With icons">
              <Button><Filter className="h-4 w-4" /> Filter</Button>
              <Button variant="outline"><Users className="h-4 w-4" /> Add Employee</Button>
              <Button variant="ghost"><Eye className="h-4 w-4" /> View</Button>
            </Row>
          </div>
        </Section>

        {/* ── Badges ───────────────────────────────────────────── */}
        <Section title="Badge" id="badges">
          <div className="space-y-5">
            <Row label="Variants">
              <Badge variant="red">5</Badge>
              <Badge variant="blue">12</Badge>
              <Badge variant="green">3</Badge>
              <Badge variant="gray">99+</Badge>
              <Badge variant="orange">7</Badge>
            </Row>
          </div>
        </Section>

        {/* ── Alerts ───────────────────────────────────────────── */}
        <Section title="Alert | Notification | Toast" id="alerts">
          <div className="space-y-3 max-w-[480px]">
            <Alert variant="info" title="Information" description="Your availability request has been received and is pending review." />
            <Alert variant="success" title="Success" description="Schedule published successfully for the week of May 26–Jun 1." />
            <Alert variant="warning" title="Warning" description="3 employees have not confirmed their availability for next week." />
            <Alert variant="error" title="Critical Skill Gap" description="Bakery - Baking has a 40h unmet skill gap for the current schedule period." onClose={() => {}} />
          </div>
        </Section>

        {/* ── Inputs & Forms ───────────────────────────────────── */}
        <Section title="Inputs & Forms" id="inputs">
          <div className="space-y-5">
            <Row label="Text input">
              <Input placeholder="Enter value…" className="w-56" />
              <Input placeholder="With value" defaultValue="Sarah Johnson" className="w-56" />
              <Input placeholder="Disabled" disabled className="w-56" />
            </Row>
            <Row label="Search input">
              <SearchInput placeholder="Search employees…" className="w-64" />
            </Row>
            <Row label="Number field">
              <NumberField value={numVal} onChange={setNumVal} min={0} max={100} label="Hours" />
              <NumberField value={0} onChange={() => {}} min={0} label="Disabled" disabled />
            </Row>
            <Row label="Select / Dropdown">
              <Select label="Department">
                <option>Bakery</option>
                <option>Produce</option>
                <option>Meat</option>
              </Select>
            </Row>
            <Row label="Checkbox">
              <Checkbox label="Unchecked" checked={checkbox1} onChange={setCheckbox1} />
              <Checkbox label="Checked" checked={checkbox2} onChange={setCheckbox2} />
              <Checkbox label="Indeterminate" checked={false} indeterminate />
              <Checkbox label="Disabled" checked disabled />
            </Row>
            <Row label="Radio">
              <Radio label="Option A" name="demo-radio" value="a" checked={radio1 === "a"} onChange={setRadio1} />
              <Radio label="Option B" name="demo-radio" value="b" checked={radio1 === "b"} onChange={setRadio1} />
              <Radio label="Option C" name="demo-radio" value="c" checked={radio1 === "c"} onChange={setRadio1} />
            </Row>
            <Row label="Time selector">
              <TimeSelector value={timeVal} onChange={setTimeVal} />
            </Row>
          </div>
        </Section>

        {/* ── Navigation ───────────────────────────────────────── */}
        <Section title="Navigation" id="navigation">
          <div className="space-y-5">
            <Row label="Tabs Lv1">
              <div className="w-full">
                <Tabs tabs={tabs1} activeTab={tab1} onChange={setTab1} level={1} />
                <div className="mt-0 border border-t-0 border-[#d0d3da] rounded-b-md bg-white px-4 py-3 text-[14px] text-[#5c5c5c]">
                  Active tab: <strong>{tab1}</strong>
                </div>
              </div>
            </Row>
            <Row label="Tabs Lv2">
              <div className="w-full">
                <Tabs tabs={tabs2} activeTab={tab2} onChange={setTab2} level={2} />
              </div>
            </Row>
            <Row label="Segment control">
              <SegmentControl
                options={[
                  { id: "day", label: "Day" },
                  { id: "week", label: "Week" },
                  { id: "month", label: "Month" },
                  { id: "quarter", label: "Quarter" },
                  { id: "year", label: "Year" },
                ]}
                value={segment1}
                onChange={setSegment1}
              />
            </Row>
            <Row label="Toggle group">
              <Toggle
                options={[{ id: "week", label: "Week" }, { id: "biweek", label: "Bi-Week" }]}
                value={toggle1}
                onChange={setToggle1}
              />
            </Row>
            <Row label="Progress step">
              <div className="w-full max-w-[480px]">
                <ProgressStep
                  steps={["Request", "Approval", "Confirm", "Complete"]}
                  currentStep={step}
                />
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))}>← Back</Button>
                  <Button size="sm" onClick={() => setStep((s) => Math.min(3, s + 1))}>Next →</Button>
                </div>
              </div>
            </Row>
            <Row label="Pagination">
              <Pagination page={page} totalPages={12} onChange={setPage} />
            </Row>
            <Row label="Pagination sm">
              <Pagination page={page} totalPages={12} onChange={setPage} size="sm" showGoTo={false} />
            </Row>
            <Row label="Org selector">
              <OrgSelector
                orgs={["Store #1042 – Chicago", "Store #1105 – Dallas", "Store #1218 – Atlanta"]}
                value={org}
                onChange={setOrg}
              />
            </Row>
          </div>
        </Section>

        {/* ── Selection & Toggle ───────────────────────────────── */}
        <Section title="Selection & Toggles" id="selection">
          <div className="space-y-5">
            <Row label="Chips">
              <ChipGroup
                chips={["Bakery", "Produce", "Meat", "Seafood", "Deli"]}
                selected={selectedChips}
                onSelect={(c) =>
                  setSelectedChips((prev) =>
                    prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
                  )
                }
                onRemove={(c) => setSelectedChips((prev) => prev.filter((x) => x !== c))}
              />
            </Row>
            <Row label="Tags">
              <Tag label="May 26 – Jun 1" />
              <Tag label="Bakery Baking" icon={Briefcase} />
              <Tag label="Removable" onRemove={() => {}} />
            </Row>
            <Row label="Toggle switch">
              <ToggleSwitch label="Notifications" checked={toggleSwitch1} onChange={setToggleSwitch1} />
              <ToggleSwitch label="Auto-schedule" checked={toggleSwitch2} onChange={setToggleSwitch2} />
            </Row>
            <Row label="Icon toggle">
              <IconToggle label="Grid view" checked={iconToggle1} onChange={setIconToggle1} icon={Grid3X3} />
              <IconToggle label="List view" checked={!iconToggle1} onChange={(v) => setIconToggle1(!v)} icon={List} />
            </Row>
          </div>
        </Section>

        {/* ── Feedback ─────────────────────────────────────────── */}
        <Section title="Feedback" id="feedback">
          <div className="space-y-5">
            <Row label="Spinner">
              <Spinner size="xs" />
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </Row>
            <Row label="Skeleton">
              <div className="w-64">
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton lines={3} />
              </div>
              <Skeleton width={64} height={64} rounded className="shrink-0" />
            </Row>
            <Row label="Tooltip">
              <Tooltip content="This is a helpful tooltip" side="top">
                <Button variant="outline" size="sm">Hover me (top)</Button>
              </Tooltip>
              <Tooltip content="Right-side tooltip" side="right">
                <Button variant="outline" size="sm">Hover me (right)</Button>
              </Tooltip>
              <Tooltip content="Bottom tooltip" side="bottom">
                <Button variant="outline" size="sm">Hover me (bottom)</Button>
              </Tooltip>
            </Row>
            <Row label="More options">
              <MoreOptions
                options={[
                  { label: "Edit", onClick: () => {} },
                  { label: "Duplicate", onClick: () => {} },
                  { label: "Delete", onClick: () => {}, danger: true },
                ]}
                onManageColumns={() => {}}
              />
            </Row>
          </div>
        </Section>

        {/* ── Calendar ─────────────────────────────────────────── */}
        <Section title="Calendar" id="calendar">
          <div className="flex flex-wrap gap-6">
            <Calendar value={calDate} onChange={setCalDate} />
            <div className="flex flex-col justify-center">
              <p className="text-[14px] text-[#5c5c5c]">Selected date:</p>
              <p className="mt-1 text-[20px] font-semibold text-[#333333]">
                {calDate ? calDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "None"}
              </p>
            </div>
          </div>
        </Section>

        {/* ── KPI & Data Display ───────────────────────────────── */}
        <Section title="KPI Cards" id="kpis">
          <div className="space-y-5">
            <Row label="KPI Card">
              <KpiCard value="2,840" label="Total scheduled hours" date="Week of May 26" trend="up" trendValue="+5.2%" icon={Clock} />
              <KpiCard value="94%" label="Schedule fulfillment" trend="down" trendValue="-1.3%" />
              <KpiCard value="12" label="Open skill gaps" trend="up" trendValue="+3" icon={Users} />
            </Row>
            <Row label="Alerts KPI">
              <AlertsKpi heading="Total Hours" value="2,840" trendPct="+5.2%" trendUp icon={DollarSign} kpiText="vs. last week" description="On track" />
              <AlertsKpi heading="Gaps" value="12" trendPct="+3" trendUp={false} icon={Activity} iconBg="#fef2f2" iconColor="#e22d20" kpiText="Critical items" />
            </Row>
            <Row label="Dashboard KPI">
              <DashboardKpi heading="Schedule Efficiency" icon={Monitor} value="94.2%" subCaption="7-day rolling average" trendPct="+1.1%" trendUp info="Average performance, contact HR for guidance." onDetails={() => {}} />
            </Row>
            <Row label="Widgets KPI">
              <WidgetsKpi
                heading="Labor Costs"
                icon={DollarSign}
                items={[
                  { label: "Regular", value: "$48,200", sublabel: "vs $46k budget" },
                  { label: "Overtime", value: "$3,120" },
                  { label: "Total", value: "$51,320" },
                ]}
              />
            </Row>
          </div>
        </Section>

        {/* ── Data Table ───────────────────────────────────────── */}
        <Section title="Data Table" id="table">
          <DataTable<Employee>
            columns={TABLE_COLUMNS}
            rows={TABLE_ROWS}
          />
          <p className="mt-3 text-[13px] text-[#5c5c5c]">Supports per-column search and sortable headers. Click a column header arrow to sort.</p>
        </Section>

        {/* ── Tree View ────────────────────────────────────────── */}
        <Section title="Tree View" id="tree">
          <div className="max-w-[320px]">
            <TreeView nodes={TREE_NODES} />
          </div>
        </Section>

        {/* ── Layout Components ────────────────────────────────── */}
        <Section title="Layout — Header" id="header">
          <div className="overflow-hidden rounded-lg border border-[#e5e7eb]">
            <Header
              title="Workforce Management"
              user={{ name: "Jane Manager", role: "Store #1042", avatarUrl: undefined }}
              notificationCount={5}
            />
          </div>
        </Section>

        <Section title="Layout — Sidenav" id="sidenav">
          <div className="flex h-[340px] overflow-hidden rounded-lg border border-[#e5e7eb]">
            <Sidenav
              items={NAV_ITEMS}
              activeId={navActive}
              onChange={setNavActive}
            />
            <div className="flex flex-1 items-center justify-center bg-[#f8f9fb] text-[15px] text-[#5c5c5c]">
              Active: <strong className="ml-1 text-primary">{navActive}</strong>
            </div>
          </div>
        </Section>

        <Section title="Layout — Page Heading" id="page-heading">
          <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white">
            <PageHeading
              title="Skill Gap — AI Recommendations"
              onBack={() => {}}
              onHelp={() => {}}
              actions={<Button size="sm">Export</Button>}
            />
          </div>
        </Section>

        {/* Footer note */}
        <div className="pb-12 text-center text-[13px] text-[#888888]">
          All 56 Figma components implemented · Bot Experience Design System
        </div>
      </div>
    </div>
  );
}
