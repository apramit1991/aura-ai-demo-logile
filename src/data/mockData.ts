import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  Clock3,
  Home,
  Landmark,
  LayoutGrid,
  Mail,
  MessageSquare,
  NotepadText,
  ShieldCheck,
  ShoppingBasket,
  Star,
  Store,
  Users,
} from "lucide-react";

export const employee = {
  name: "Jenning Dwight",
  role: "Employee",
  orgPosition: "(149) Front End Dept/Employee",
  avatar: "JD",
  badge: 9,
};

export const navItems = [
  { label: "Home", icon: Home },
  { label: "Quick Links", icon: Star },
  { label: "ESS", icon: CalendarDays },
  { label: "Communi...", icon: Mail },
  { label: "Standards", icon: ShieldCheck },
  { label: "Labor Model", icon: BriefcaseBusiness, active: true },
  { label: "Forecast", icon: NotepadText },
  { label: "Staffing", icon: Users },
  { label: "Labor Report", icon: ClipboardList },
  { label: "Food Safety", icon: Landmark },
  { label: "Queue Management", icon: LayoutGrid },
  { label: "Store Operations", icon: Store },
  { label: "Scheduling", icon: CalendarDays },
  { label: "Time and Attendance", icon: Clock3 },
  { label: "Associate Management", icon: Users },
  { label: "Reports", icon: NotepadText },
  { label: "Labor Admin", icon: ShoppingBasket },
];

export const headerActions = [
  { icon: CalendarDays, count: 0, label: "Calendar" },
  { icon: ClipboardList, count: 0, label: "Tasks" },
  { icon: Mail, count: 0, label: "Messages" },
  { icon: MessageSquare, count: 0, label: "Comments" },
  { icon: Bell, count: 99, label: "Notifications" },
];

export const request = {
  dateRange: "6/10/24 - 6/16/24",
  rotations: ["Default", "Opening", "Closing", "Weekend"],
  reasons: ["Nothing selected", "School", "Childcare", "Medical", "Second job"],
  preferences: [
    { label: "Hours Per Week", value: "30" },
    { label: "Day Per Week", value: "5" },
  ],
  rules: [
    { label: "Min hours/day", value: "4" },
    { label: "Min days/week", value: "1" },
    { label: "Max hours/day", value: "10" },
    { label: "Max days/week", value: "5" },
  ],
  weeklyRange: "20-40",
};

export const availabilityDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
].map((day) => ({
  day,
  start: "00:00a/p",
  end: "00:00a/p",
  hours: "0h",
}));
