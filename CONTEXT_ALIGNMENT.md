# Context Alignment — Skill Gap & Availability Employee Profiles

This document details the alignment of employee profiles, shared data states, and flow contexts across the manager and employee-facing pages in the prototype.

---

## 👥 Employee Profiles & Contexts

### 1. Employee Portal (`/skill-gap-employee` & `/availability-desktop`)
- **Active Logged-in Employee:** **Jenning Dwight**
- **Profile Avatar Initial:** `JD`
- **Avatar Graphic:** Male profile graphic (loaded via `getAvatarByName("Jenning Dwight")` which resolves to `avatar1`).
- **Data Context:**
  - All counter-proposal submissions, calendar selections, and success notifications on the employee portal represent actions taken by **Jenning Dwight**.
  - Requests saved to `localStorage` (via `saveCounterRequest`) assign the `"Jenning Dwight"` identifier to the request's employee field.

### 2. Manager Portal (`/skill-gap-ask-aura`)
- **View Scope:** Managers review skill gaps across all department members.
- **Adjust Availability Targets:**
  - **Sarah Johnson** (Secondary Skill in Baking, 85% skill gap reduction potential).
  - **Emily Carter** (Tertiary Skill in Baking, featured in chat suggestions).
- **Target Selection:**
  - The manager selects **Sarah Johnson** to send an availability adjustment request.
  - The "Make Adjustment" button is attached specifically to Sarah Johnson's recommendation card to initiate toggling and review workflows.

---

## 💾 LocalStorage & State Sync Alignment

- **Local Storage Key:** `skill_gap_counter_request`
- **Active State Handling:**
  - The employee screen updates `localStorage` with Jenning Dwight's counters (e.g. `Wed 8a-12p` or alternative slots like `12p–2p`).
  - To maintain mock behavior independence and avoid unexpected UI overrides during manager evaluation, direct storage polling triggers were decoupled from the manager dashboard. This ensures the manager page displays the recommended flow correctly for Sarah Johnson while retaining Jenning Dwight's self-contained workflow on the employee page.

---

## 📐 Placement & Layout Consistency

- **Send Request Placements:** 
  - Placed in the top-right header section of both the **Adjust Availability** and **Cross-Train** cards in the Ask Aura manager layout.
- **Top Selected Indicator:**
  - Toggling Sarah Johnson renders selection states (e.g., progress indicators, gap reduction stats) in the top-middle block instead of the card footer, providing layout consistency across both recommendation sections.
