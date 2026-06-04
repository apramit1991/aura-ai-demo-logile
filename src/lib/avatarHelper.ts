import avatar1 from "../assets/avatar-1.png";
import avatar2 from "../assets/avatar-2.png";
import avatar3 from "../assets/avatar-3.png";
import avatar4 from "../assets/avatar-4.png";
import avatar5 from "../assets/avatar-5.png";
import avatar6 from "../assets/avatar-6.png";
import avatar7 from "../assets/avatar-7.png";

import profileAvatar from "../assets/skill-gap/profile.png";
import sarahAvatar from "../assets/skill-gap/sarah-johnson.png";
import emilyAvatar from "../assets/skill-gap/emily-carter.png";
import michaelAvatar from "../assets/skill-gap/michael-chen.png";
import jessicaAvatar from "../assets/skill-gap/jessica-brown.png";
import ryanAvatar from "../assets/skill-gap/ryan-anderson.png";
import alexAvatar from "../assets/skill-gap/alex-thompson.png";
import jordanAvatar from "../assets/skill-gap/jordan-mitchell.png";

/**
 * Returns a consistent, gender-appropriate avatar image URL (imported asset) for a given name.
 */
export function getAvatarByName(name: string): string | undefined {
  if (!name) return undefined;

  // Normalize the name by removing commas, trailing periods/spaces, and converting to lowercase
  const clean = name.toLowerCase().replace(/,/g, "").replace(/\./g, "").trim();

  // "Smith, Jane" / "Jane Smith" / "Jane Manager" -> Female (Jane Smith uses avatar7, profileAvatar is also same)
  if (clean.includes("jane") && (clean.includes("smith") || clean.includes("manager"))) {
    return avatar7;
  }

  // "Jenning Dwight" / "Dwight Jennings" -> Male (uses avatar1)
  if ((clean.includes("jenning") || clean.includes("jennings")) && clean.includes("dwight")) {
    return avatar1;
  }

  // "Bessie Cooper" -> Female (uses avatar3)
  if (clean.includes("bessie") && clean.includes("cooper")) {
    return avatar3;
  }

  // "Sarah Johnson" -> Female (uses sarahAvatar)
  if (clean.includes("sarah") && clean.includes("johnson")) {
    return sarahAvatar;
  }

  // "Emily Carter" -> Female (uses emilyAvatar)
  if (clean.includes("emily") && clean.includes("carter")) {
    return emilyAvatar;
  }

  // "Michael Chen" -> Male (uses michaelAvatar)
  if (clean.includes("michael") && clean.includes("chen")) {
    return michaelAvatar;
  }

  // "Jessica Brown" -> Female (uses jessicaAvatar)
  if (clean.includes("jessica") && clean.includes("brown")) {
    return jessicaAvatar;
  }

  // "Ryan Anderson" -> Male (uses ryanAvatar)
  if (clean.includes("ryan") && clean.includes("anderson")) {
    return ryanAvatar;
  }

  // "Alex Thompson" -> Male (uses alexAvatar)
  if (clean.includes("alex") && clean.includes("thompson")) {
    return alexAvatar;
  }

  // "Jordan Mitchell" -> Male/Female (uses jordanAvatar)
  if (clean.includes("jordan") && clean.includes("mitchell")) {
    return jordanAvatar;
  }

  // "Alison Parker" / "Allison Park" -> Female (let's use avatar2 as a female default)
  if (clean.includes("alison") || clean.includes("allison")) {
    return avatar2;
  }

  // "Barry Allen" -> Male (let's use avatar5 as a male default)
  if (clean.includes("barry") && clean.includes("allen")) {
    return avatar5;
  }

  // Fallbacks based on first name list or single name keyword if matching
  if (clean === "jane" || clean === "smith jane" || clean === "jane smith") return avatar7;
  if (clean === "sarah") return sarahAvatar;
  if (clean === "emily") return emilyAvatar;
  if (clean === "jessica") return jessicaAvatar;
  if (clean === "bessie") return avatar3;
  if (clean === "alison" || clean === "allison") return avatar2;

  if (clean === "dwight" || clean === "jenning") return avatar1;
  if (clean === "michael") return michaelAvatar;
  if (clean === "ryan") return ryanAvatar;
  if (clean === "alex") return alexAvatar;
  if (clean === "jordan") return jordanAvatar;
  if (clean === "barry") return avatar5;

  return undefined;
}
