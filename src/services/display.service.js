const Thought = require("../models/Thought.model");
const Birthday = require("../models/Birthday.model");
const EmployeeMonth = require("../models/EmployeeMonth.model");
const Customer = require("../models/Customer.model");
const Announcement = require("../models/Announcement.model");
const Event = require("../models/Event.model");
const Participation = require("../models/Participation.model");
const IndustryNews = require("../models/IndustryNews.model");

class DisplayService {
  async getPublishedSlides() {
    const slides = [];

    // Welcome Slide
    slides.push({
      id: "slide-welcome",
      kind: "welcome",
      title: "Welcome to Centroxy",
      subtitle: "Innovation • Excellence • Joy",
      badge: "Portal Overview",
      template: "glass",
    });

    // 1. Thoughts
    const thoughts = await Thought.findAll({
      where: { status: "published", isDeleted: false },
      order: [["updatedAt", "DESC"]],
    });
    for (const t of thoughts) {
      slides.push({
        id: `thought-${t.id}`,
        kind: "thought",
        title: t.title || "Thought of the Day",
        subtitle: t.author ? `— ${t.author}` : "",
        body: t.quote,
        image: t.backgroundImage || t.image || "",
        badge: "Daily Inspiration",
        template: t.template,
      });
    }

    // 2. Birthdays
    const birthdays = await Birthday.findAll({
      where: { status: "published", isDeleted: false },
      order: [["updatedAt", "DESC"]],
    });
    for (const b of birthdays) {
      slides.push({
        id: `birthday-${b.id}`,
        kind: "birthday",
        title: `Happy Birthday, ${b.employeeName}! 🎉`,
        subtitle: `${b.designation} • ${b.department}`,
        body: b.greetingMessage,
        image: b.employeePhoto || b.image || "",
        badge: "Celebration",
        template: b.template,
      });
    }

    // 3. Employee of Month
    const employees = await EmployeeMonth.findAll({
      where: { status: "published", isDeleted: false },
      order: [["updatedAt", "DESC"]],
    });
    for (const e of employees) {
      slides.push({
        id: `employee-${e.id}`,
        kind: "employee",
        title: `${e.employeeName} — Employee of the Month`,
        subtitle: e.achievement,
        body: e.description,
        image: e.photo || e.image || "",
        badge: `Star of ${e.month}`,
        template: e.template,
      });
    }

    // 4. New Customers
    const customers = await Customer.findAll({
      where: { status: "published", isDeleted: false },
      order: [["updatedAt", "DESC"]],
    });
    for (const c of customers) {
      slides.push({
        id: `customer-${c.id}`,
        kind: "customer",
        title: `Welcome ${c.companyName}! 🤝`,
        subtitle: `Project: ${c.projectName}`,
        body: c.description,
        image: c.companyLogo || c.image || "",
        badge: "New Partnership",
        template: c.template,
      });
    }

    // 5. Announcements
    const announcements = await Announcement.findAll({
      where: { status: "published", isDeleted: false },
      order: [["updatedAt", "DESC"]],
    });
    for (const a of announcements) {
      slides.push({
        id: `announcement-${a.id}`,
        kind: "announcement",
        title: a.title,
        subtitle: `Priority: ${a.priority.toUpperCase()}`,
        body: a.description,
        image: a.bannerImage || a.image || "",
        badge: "Announcement",
        template: a.template,
      });
    }

    // 6. Events
    const events = await Event.findAll({
      where: { status: "published", isDeleted: false },
      order: [["updatedAt", "DESC"]],
    });
    for (const ev of events) {
      slides.push({
        id: `event-${ev.id}`,
        kind: "event",
        title: ev.title,
        subtitle: `📅 ${ev.date} at ${ev.time} | 📍 ${ev.venue}`,
        body: ev.description,
        image: ev.banner || ev.image || "",
        badge: "Upcoming Event",
        template: ev.template,
      });
    }

    // 7. Participation & Achievements
    const participations = await Participation.findAll({
      where: { status: "published", isDeleted: false },
      order: [["updatedAt", "DESC"]],
    });
    for (const p of participations) {
      slides.push({
        id: `participation-${p.id}`,
        kind: "participation",
        title: `${p.employee} — ${p.achievement}`,
        subtitle: `Competition: ${p.competition}`,
        image: p.photo || p.image || "",
        badge: "Special Recognition",
        template: p.template,
      });
    }

    // 8. Industry News
    const newsItems = await IndustryNews.findAll({
      where: { status: "published", isDeleted: false },
      order: [["updatedAt", "DESC"]],
    });
    for (const n of newsItems) {
      slides.push({
        id: `news-${n.id}`,
        kind: "news",
        title: n.headline,
        subtitle: `Source: ${n.source} • ${n.publishDate || ""}`,
        body: n.description,
        image: n.thumbnail || n.image || "",
        badge: "Industry Insights",
        template: n.template,
      });
    }

    // Thank You Slide
    slides.push({
      id: "slide-thankyou",
      kind: "thank-you",
      title: "Thank You for Visiting Centroxy",
      subtitle: "Empowering People • Driving Excellence",
      badge: "Stay Connected",
      template: "glass",
    });

    return slides;
  }
}

module.exports = new DisplayService();
