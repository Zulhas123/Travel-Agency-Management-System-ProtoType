(() => {
  "use strict";

  const STORAGE_KEY = "tams_app_v1";

  const ROLES = [
    { id: "super_admin", label: "Super Admin" },
    { id: "admin", label: "Admin" },
    { id: "staff", label: "Staff" },
    { id: "accountant", label: "Accountant" },
    { id: "vendor", label: "Vendor" },
    { id: "customer", label: "Customer" },
  ];

  const NAV = [
    { type: "section", label: "Core" },
    { id: "dashboard", label: "Dashboard", icon: "grid" },
    { id: "bookings", label: "Bookings", icon: "calendar", badge: () => pendingBookingsCount() },
    { id: "packages", label: "Tour Packages", icon: "map" },
    { id: "hotels", label: "Hotels", icon: "building" },
    { id: "cars", label: "Cars", icon: "car" },
    { id: "customers", label: "Customers", icon: "users" },
    { type: "section", label: "Finance" },
    { id: "payments", label: "Payments & Invoices", icon: "credit" },
    { id: "accounting", label: "Accounting", icon: "ledger" },
    { id: "reports", label: "Reports", icon: "chart" },
    { type: "section", label: "Operations" },
    { id: "vendors", label: "Vendors", icon: "handshake" },
    { id: "inquiries", label: "Inquiries", icon: "chat", badge: () => openInquiriesCount() },
    { id: "sms", label: "SMS & Notifications", icon: "bell" },
    { id: "logs", label: "Logs & Audit", icon: "shield" },
    { type: "section", label: "System" },
    { id: "users", label: "Users & Roles", icon: "users" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  const ICONS = {
    grid:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z" stroke="currentColor" stroke-width="1.6"/></svg>',
    calendar:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M7 3v3M17 3v3M4.5 9h15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6.5 6h11A2.5 2.5 0 0 1 20 8.5v11A2.5 2.5 0 0 1 17.5 22h-11A2.5 2.5 0 0 1 4 19.5v-11A2.5 2.5 0 0 1 6.5 6Z" stroke="currentColor" stroke-width="1.6"/></svg>',
    map:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M9 18 3.5 20V6l5.5-2 6 2 5.5-2v14L15 20l-6-2Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 4v14M15 6v14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    building:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M4.5 21h15M7 21V4.5A2.5 2.5 0 0 1 9.5 2h5A2.5 2.5 0 0 1 17 4.5V21" stroke="currentColor" stroke-width="1.6"/><path d="M10 6.5h4M10 10h4M10 13.5h4M10 17h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    car:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M6.5 16.5 5 12l1.8-5.4A2 2 0 0 1 8.7 5h6.6a2 2 0 0 1 1.9 1.6L19 12l-1.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M5.5 12h13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M7.2 18.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4ZM16.8 18.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4Z" stroke="currentColor" stroke-width="1.6"/><path d="M6 20v-2M18 20v-2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    users:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M12 13a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" stroke-width="1.6"/><path d="M20 19c0-1.7-1.2-3.1-2.8-3.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M16.7 6.8a3 3 0 0 1 0 5.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    credit:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M4.5 8h15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M6.5 5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9A2.5 2.5 0 0 1 6.5 5Z" stroke="currentColor" stroke-width="1.6"/><path d="M7 15h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    ledger:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M7 5h11a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" stroke-width="1.6"/><path d="M9 9h7M9 12h7M9 15h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M7 5v16" stroke="currentColor" stroke-width="1.6"/></svg>',
    chart:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M5 19V5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M5 19h15" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 16v-5M12 16V8M16 16v-3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    handshake:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M7.5 12.5 10 10a2 2 0 0 1 2.8 0l.2.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 9 3 12l4.5 4.5a2 2 0 0 0 2.8 0l.7-.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 9l3 3-4.5 4.5a2 2 0 0 1-2.8 0l-3.4-3.4a2 2 0 0 1 0-2.8l1.4-1.4a2 2 0 0 1 2.8 0l2.5 2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chat:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M7 18.5 4 21v-3.2A8.5 8.5 0 1 1 20 12a8.5 8.5 0 0 1-13 6.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8 12h8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M8 9h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    bell:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    shield:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M12 2 20 6v7c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V6l8-4Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 12l2 2 4-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    settings:
      '<svg class="nav__icon" viewBox="0 0 24 24" fill="none"><path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" stroke="currentColor" stroke-width="1.6"/><path d="M19.4 15a8.2 8.2 0 0 0 .1-1l2-1.5-2-3.4-2.4 1a8.6 8.6 0 0 0-1.7-1l-.3-2.6H9l-.3 2.6a8.6 8.6 0 0 0-1.7 1l-2.4-1-2 3.4L4.6 14a8.2 8.2 0 0 0 .1 1l-2 1.5 2 3.4 2.4-1a8.6 8.6 0 0 0 1.7 1l.3 2.6h6.2l.3-2.6a8.6 8.6 0 0 0 1.7-1l2.4 1 2-3.4L19.4 15Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    search:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" stroke-width="1.6"/><path d="M16.5 16.5 21 21" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    plus:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    close:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    bolt:
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  };

  const fmtBDT = new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  });

  const nowISO = () => new Date().toISOString();
  const uid = (prefix) => `${prefix}_${Math.random().toString(16).slice(2, 10)}`;

  const seed = () => {
    const today = new Date();
    const isoDay = (d) => {
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    };
    const daysFromNow = (n) => {
      const d = new Date(today);
      d.setDate(d.getDate() + n);
      return isoDay(d);
    };

    const packages = [
      {
        id: "PKG-COX-3D2N",
        title: "Cox’s Bazar Escape (3D/2N)",
        category: "Local Tour",
        basePrice: 14500,
        capacity: 32,
        nextDate: daysFromNow(10),
        status: "active",
      },
      {
        id: "PKG-SAJ-2D1N",
        title: "Sajek Valley Weekend (2D/1N)",
        category: "Local Tour",
        basePrice: 8900,
        capacity: 18,
        nextDate: daysFromNow(18),
        status: "active",
      },
      {
        id: "PKG-SYL-4D3N",
        title: "Sylhet Nature Trail (4D/3N)",
        category: "Local Tour",
        basePrice: 16200,
        capacity: 26,
        nextDate: daysFromNow(25),
        status: "draft",
      },
      {
        id: "PKG-INTL-KL-5D4N",
        title: "Kuala Lumpur Highlights (5D/4N)",
        category: "International Tour",
        basePrice: 58500,
        capacity: 20,
        nextDate: daysFromNow(35),
        status: "active",
      },
    ];

    const hotels = [
      {
        id: "HTL-SEA-001",
        name: "Sea Pearl Hotel",
        city: "Cox’s Bazar",
        rating: 4.3,
        vendor: "BlueWave Hospitality",
        rooms: [
          { type: "Deluxe", price: 6800, stock: 14 },
          { type: "Premium", price: 9400, stock: 8 },
        ],
      },
      {
        id: "HTL-DHA-014",
        name: "Dhaka Grand Residence",
        city: "Dhaka",
        rating: 4.1,
        vendor: "UrbanStay BD",
        rooms: [
          { type: "Standard", price: 5200, stock: 20 },
          { type: "Executive", price: 8800, stock: 6 },
        ],
      },
    ];

    const cars = [
      { id: "CAR-SUV-03", type: "SUV", brand: "Toyota", model: "Noah", dailyRate: 5200, driver: true, status: "available" },
      { id: "CAR-SED-07", type: "Sedan", brand: "Toyota", model: "Allion", dailyRate: 4500, driver: true, status: "available" },
      { id: "CAR-MIC-11", type: "Microbus", brand: "Nissan", model: "Civilian", dailyRate: 7500, driver: true, status: "maintenance" },
    ];

    const customers = [
      { id: "CUST-0007", name: "Mahmud Hasan", phone: "+88017XXXXXX12", email: "mahmud@example.com", city: "Chattogram", status: "active", lifetimeValue: 74200 },
      { id: "CUST-0015", name: "Nusrat Jahan", phone: "+88018XXXXXX44", email: "nusrat@example.com", city: "Dhaka", status: "active", lifetimeValue: 29800 },
      { id: "CUST-0021", name: "Rafi Ahmed", phone: "+88016XXXXXX93", email: "rafi@example.com", city: "Sylhet", status: "new", lifetimeValue: 0 },
    ];

    const roles = [
      { id: "super_admin", label: "Super Admin", permissions: ["All modules", "System configuration", "Audit access"] },
      { id: "admin", label: "Admin", permissions: ["Operations", "Bookings", "Reports", "Settings (limited)"] },
      { id: "staff", label: "Staff", permissions: ["Bookings", "Inquiries", "Customers", "SMS"] },
      { id: "accountant", label: "Accountant", permissions: ["Payments", "Accounting", "Reports"] },
      { id: "vendor", label: "Vendor", permissions: ["Self records", "Availability updates (limited)"] },
    ];

    const users = [
      { id: "USR-0001", name: "Super Admin", email: "super@agency.com", role: "super_admin", status: "active", lastLogin: nowISO() },
      { id: "USR-0002", name: "Admin User", email: "admin@agency.com", role: "admin", status: "active", lastLogin: nowISO() },
      { id: "USR-0003", name: "Staff A", email: "staff.a@agency.com", role: "staff", status: "active", lastLogin: nowISO() },
      { id: "USR-0004", name: "Accountant", email: "accounts@agency.com", role: "accountant", status: "active", lastLogin: nowISO() },
    ];

    const bookings = [
      {
        id: "BKG-10291",
        type: "Tour",
        refId: packages[0].id,
        customerId: customers[0].id,
        dateFrom: packages[0].nextDate,
        dateTo: daysFromNow(12),
        pax: 3,
        amount: packages[0].basePrice * 3,
        status: "pending",
        createdAt: nowISO(),
      },
      {
        id: "BKG-10304",
        type: "Hotel",
        refId: hotels[0].id,
        customerId: customers[1].id,
        dateFrom: daysFromNow(7),
        dateTo: daysFromNow(9),
        pax: 2,
        amount: 9400 * 2,
        status: "approved",
        createdAt: nowISO(),
      },
      {
        id: "BKG-10311",
        type: "Car",
        refId: cars[1].id,
        customerId: customers[2].id,
        dateFrom: daysFromNow(3),
        dateTo: daysFromNow(4),
        pax: 1,
        amount: 4500,
        status: "pending",
        createdAt: nowISO(),
      },
    ];

    const invoices = bookings.map((b, idx) => ({
      id: `INV-${String(9001 + idx)}`,
      bookingId: b.id,
      customerId: b.customerId,
      subtotal: b.amount,
      vatRate: 0.05,
      vat: Math.round(b.amount * 0.05),
      total: b.amount + Math.round(b.amount * 0.05),
      status: b.status === "approved" ? "paid" : "unpaid",
      createdAt: nowISO(),
    }));

    const payments = [
      {
        id: "PAY-7712",
        invoiceId: invoices[1].id,
        method: "bKash",
        amount: invoices[1].total,
        status: "verified",
        txn: "BKASH-9F72A1",
        paidAt: nowISO(),
      },
    ];

    const inquiries = [
      {
        id: "INQ-204",
        channel: "Website",
        name: "Sadia Karim",
        phone: "+88019XXXXXX33",
        topic: "Sajek Valley package availability",
        status: "open",
        owner: "Staff A",
        createdAt: nowISO(),
      },
      {
        id: "INQ-211",
        channel: "Facebook",
        name: "Imran Hossain",
        phone: "+88017XXXXXX88",
        topic: "Cox’s Bazar hotel + transport combo",
        status: "pending_reply",
        owner: "Staff B",
        createdAt: nowISO(),
      },
      {
        id: "INQ-219",
        channel: "Phone",
        name: "Mithila Rahman",
        phone: "+88018XXXXXX09",
        topic: "Visa assistance & document list",
        status: "closed",
        owner: "Staff A",
        createdAt: nowISO(),
      },
    ];

    const vendors = [
      { id: "VND-011", name: "BlueWave Hospitality", type: "Hotel", phone: "+8802-XXXXXXX", status: "active", city: "Cox’s Bazar" },
      { id: "VND-024", name: "UrbanStay BD", type: "Hotel", phone: "+8802-XXXXXXX", status: "active", city: "Dhaka" },
      { id: "VND-039", name: "RoadRunner Transport", type: "Transport", phone: "+88017-XXXXXXX", status: "pending", city: "Dhaka" },
    ];

    const ledger = [
      { id: uid("LED"), date: isoDay(today), ref: "Opening Balance", type: "Credit", amount: 250000, account: "Cash", note: "Opening balance" },
      { id: uid("LED"), date: isoDay(today), ref: payments[0].txn, type: "Credit", amount: payments[0].amount, account: "Sales", note: "Hotel booking payment" },
      { id: uid("LED"), date: isoDay(today), ref: "Office Rent", type: "Debit", amount: 35000, account: "Expense", note: "Monthly rent" },
    ];

    const smsLogs = [
      { id: uid("SMS"), to: customers[1].phone, template: "Booking Confirmed", status: "sent", at: nowISO() },
      { id: uid("SMS"), to: customers[0].phone, template: "Payment Reminder", status: "queued", at: nowISO() },
    ];

    const auditLogs = [
      { id: uid("LOG"), at: nowISO(), actor: "Admin", action: "Approved booking", target: bookings[1].id, severity: "info" },
      { id: uid("LOG"), at: nowISO(), actor: "Staff B", action: "Updated inquiry status", target: inquiries[1].id, severity: "info" },
      { id: uid("LOG"), at: nowISO(), actor: "System", action: "Login failed (wrong password)", target: "admin@agency.com", severity: "warning" },
    ];

    return {
      session: {
        isAuthed: false,
        user: null,
        sidebarOpen: false,
        route: { page: "login" },
        agency: {
          name: "Bangladesh Travel Pro",
          currency: "BDT",
          vatRate: 0.05,
          hotlineLabel: "24/7 Hotline",
          phone: "+8801700000000",
          email: "support@bangladeshtravelpro.com",
          portalUrl: "https://bangladeshtravelpro.com/login",
        },
      },
      db: {
        users,
        roles,
        packages,
        hotels,
        cars,
        customers,
        bookings,
        invoices,
        payments,
        inquiries,
        vendors,
        ledger,
        smsLogs,
        auditLogs,
      },
      ui: {
        filters: {},
      },
    };
  };

  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return seed();
      const parsed = JSON.parse(raw);
      if (!parsed?.db || !parsed?.session) return seed();
      return parsed;
    } catch {
      return seed();
    }
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  };

  const state = load();

  const el = (sel, root = document) => root.querySelector(sel);
  const els = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const escapeHtml = (s) =>
    String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const roleLabel = (id) => ROLES.find((r) => r.id === id)?.label ?? id;

  const customerById = (id) => state.db.customers.find((c) => c.id === id);
  const bookingById = (id) => state.db.bookings.find((b) => b.id === id);
  const invoiceById = (id) => state.db.invoices.find((inv) => inv.id === id);
  const packageById = (id) => state.db.packages.find((p) => p.id === id);
  const vendorByName = (name) => state.db.vendors.find((v) => v.name === name);

  const pendingBookingsCount = () => state.db.bookings.filter((b) => b.status === "pending").length;
  const openInquiriesCount = () => state.db.inquiries.filter((i) => i.status !== "closed").length;

  const toast = (title, msg) => {
    let wrap = el("#toastWrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "toastWrap";
      wrap.className = "toastWrap";
      document.body.appendChild(wrap);
    }
    const t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = `<div class="toast__title">${escapeHtml(title)}</div><div class="toast__msg">${escapeHtml(msg)}</div>`;
    wrap.appendChild(t);
    setTimeout(() => t.remove(), 3600);
  };

  const openModal = ({ title, bodyHtml, footerHtml }) => {
    const overlay = document.createElement("div");
    overlay.className = "modalOverlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal__head">
          <h3>${escapeHtml(title || "Modal")}</h3>
          <button class="iconBtn" data-modal-close="1" aria-label="Close">${ICONS.close}</button>
        </div>
        <div class="modal__body">
          ${bodyHtml || ""}
          ${footerHtml ? `<div class="divider"></div>${footerHtml}` : ""}
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    overlay.querySelectorAll("[data-modal-close]").forEach((b) => b.addEventListener("click", close));
    setTimeout(() => overlay.querySelector("button")?.focus(), 0);
    return { close };
  };

  const setRoute = (page, params = {}) => {
    const hash = `#/${encodeURIComponent(page)}${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ""}`;
    if (location.hash !== hash) location.hash = hash;
  };

  const parseRoute = () => {
    const hash = location.hash || "#/login";
    const raw = hash.startsWith("#/") ? hash.slice(2) : "login";
    const [pagePart, query] = raw.split("?");
    const page = decodeURIComponent(pagePart || "login");
    const params = Object.fromEntries(new URLSearchParams(query || ""));
    return { page, params };
  };

  const requireAuth = () => {
    if (!state.session.isAuthed) {
      setRoute("login");
      return false;
    }
    return true;
  };

  const logout = () => {
    state.session.isAuthed = false;
    state.session.user = null;
    save();
    toast("Signed out", "You have been signed out.");
    setRoute("login");
  };

  const login = ({ email, password, role }) => {
    if (!email || !password) {
      toast("Missing info", "Enter email and password.");
      return false;
    }
    state.session.isAuthed = true;
    state.session.user = {
      id: uid("USR"),
      name: email.split("@")[0].replaceAll(".", " ").replace(/\b\w/g, (m) => m.toUpperCase()),
      email,
      role,
    };
    state.session.sidebarOpen = false;
    save();
    toast("Welcome", `Signed in as ${roleLabel(role)}.`);
    setRoute("dashboard");
    return true;
  };

  const hasAccess = (page) => {
    const role = state.session.user?.role;
    if (!role) return false;
    if (role === "vendor") return ["dashboard", "hotels", "cars", "vendors", "logs", "settings"].includes(page);
    if (role === "customer") return ["dashboard", "packages", "bookings", "payments", "inquiries", "settings"].includes(page);
    if (role === "accountant") return ["dashboard", "payments", "accounting", "reports", "customers", "users", "settings"].includes(page);
    if (role === "staff") return ["dashboard", "bookings", "packages", "hotels", "cars", "customers", "inquiries", "sms", "settings"].includes(page);
    if (role === "admin") return page !== "logs";
    return true; // admin/super_admin
  };

  const guard = (page) => {
    if (!requireAuth()) return false;
    if (!hasAccess(page)) {
      toast("Access limited", `Your role (${roleLabel(state.session.user.role)}) has limited access.`);
      setRoute("dashboard");
      return false;
    }
    return true;
  };

  const upsertAudit = ({ actor, action, target, severity = "info" }) => {
    state.db.auditLogs.unshift({ id: uid("LOG"), at: nowISO(), actor, action, target, severity });
  };

  const approveBooking = (bookingId) => {
    const b = bookingById(bookingId);
    if (!b) return;
    b.status = "approved";
    const inv = state.db.invoices.find((i) => i.bookingId === bookingId);
    if (inv) inv.status = "unpaid";
    upsertAudit({ actor: state.session.user?.name || "Admin", action: "Approved booking", target: bookingId });
    save();
    toast("Booking approved", `${bookingId} is now approved. Invoice updated.`);
    render();
  };

  const rejectBooking = (bookingId) => {
    const b = bookingById(bookingId);
    if (!b) return;
    b.status = "rejected";
    const inv = state.db.invoices.find((i) => i.bookingId === bookingId);
    if (inv) inv.status = "void";
    upsertAudit({ actor: state.session.user?.name || "Admin", action: "Rejected booking", target: bookingId, severity: "warning" });
    save();
    toast("Booking rejected", `${bookingId} marked as rejected.`);
    render();
  };

  const recordPayment = ({ invoiceId, method, amount, txn }) => {
    const inv = invoiceById(invoiceId);
    if (!inv) return;
    const pay = { id: uid("PAY"), invoiceId, method, amount, status: "verified", txn, paidAt: nowISO() };
    state.db.payments.unshift(pay);
    inv.status = "paid";
    state.db.ledger.unshift({ id: uid("LED"), date: inv.createdAt.slice(0, 10), ref: txn, type: "Credit", amount, account: "Sales", note: `Payment for ${invoiceId}` });
    upsertAudit({ actor: state.session.user?.name || "Accountant", action: "Verified payment", target: invoiceId });
    state.db.smsLogs.unshift({ id: uid("SMS"), to: customerById(inv.customerId)?.phone || "+8801XXXXXXXXX", template: "Payment Verified", status: "sent", at: nowISO() });
    save();
    toast("Payment verified", `${invoiceId} marked as paid.`);
    render();
  };

  const viewInvoice = (invoiceId) => {
    const inv = invoiceById(invoiceId);
    if (!inv) return;
    const b = bookingById(inv.bookingId);
    const c = customerById(inv.customerId);
    const body = `
      <div class="split">
        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>Invoice ${escapeHtml(inv.id)}</h2>
              <p>Status: <span class="status ${inv.status === "paid" ? "status--success" : inv.status === "void" ? "status--danger" : "status--warning"}"><span class="dot"></span>${escapeHtml(inv.status)}</span></p>
            </div>
            <div class="pill">VAT ${(inv.vatRate * 100).toFixed(0)}%</div>
          </div>
          <div class="card__body">
            <div class="chipRow">
              <div class="chip"><strong>Customer</strong> ${escapeHtml(c?.name || "-")}</div>
              <div class="chip"><strong>Booking</strong> ${escapeHtml(inv.bookingId)}</div>
              <div class="chip"><strong>Type</strong> ${escapeHtml(b?.type || "-")}</div>
            </div>
            <div class="divider"></div>
            <div class="grid grid--2">
              <div class="kpi">
                <div class="kpi__label">Subtotal</div>
                <div class="kpi__value">${fmtBDT.format(inv.subtotal)}</div>
                <div class="kpi__delta">Before VAT</div>
              </div>
              <div class="kpi">
                <div class="kpi__label">VAT</div>
                <div class="kpi__value">${fmtBDT.format(inv.vat)}</div>
              <div class="kpi__delta">Bangladesh VAT</div>
              </div>
            </div>
            <div class="divider"></div>
            <div class="kpi">
              <div class="kpi__label">Total</div>
              <div class="kpi__value">${fmtBDT.format(inv.total)}</div>
              <div class="kpi__delta">Payable amount</div>
            </div>
            <div class="divider"></div>
            <div class="helper">Payment gateways can be configured in Settings (bKash / Nagad / SSLCommerz).</div>
          </div>
        </div>
        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>Quick Actions</h2>
              <p>Simulate verification & notifications</p>
            </div>
          </div>
          <div class="card__body">
            <div class="form">
              <div class="field">
                <label>Payment Method</label>
                <select class="input" id="payMethod">
                  <option>bKash</option>
                  <option>Nagad</option>
                  <option>Rocket</option>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div class="field">
                <label>Transaction ID</label>
                <input class="input" id="payTxn" placeholder="e.g., BKASH-ABC123" value="${escapeHtml(`TXN-${Math.random().toString(16).slice(2, 8).toUpperCase()}`)}" />
              </div>
              <div class="field">
                <label>Amount</label>
                <input class="input" id="payAmt" type="number" value="${inv.total}" />
              </div>
              <button class="btn btn--primary" id="btnVerifyPay" ${inv.status === "paid" || inv.status === "void" ? "disabled" : ""}>
                ${ICONS.bolt} Verify Payment
              </button>
              <button class="btn" id="btnSendReminder" ${inv.status === "paid" || inv.status === "void" ? "disabled" : ""}>
                ${ICONS.bell} Send Reminder SMS
              </button>
              <div class="mini">Also updates Accounting ledger and Audit logs.</div>
            </div>
          </div>
        </div>
      </div>
    `;
    const m = openModal({ title: `Invoice ${inv.id}`, bodyHtml: body });
    const btnVerify = el("#btnVerifyPay", document);
    btnVerify?.addEventListener("click", () => {
      const method = el("#payMethod")?.value || "bKash";
      const txn = el("#payTxn")?.value || uid("TXN");
      const amount = Number(el("#payAmt")?.value || inv.total);
      recordPayment({ invoiceId: inv.id, method, amount, txn });
      m.close();
    });
    el("#btnSendReminder")?.addEventListener("click", () => {
      state.db.smsLogs.unshift({ id: uid("SMS"), to: c?.phone || "+8801XXXXXXXXX", template: "Payment Reminder", status: "sent", at: nowISO() });
      upsertAudit({ actor: state.session.user?.name || "Staff", action: "Sent payment reminder", target: inv.id });
      save();
      toast("SMS queued", `Reminder sent to ${c?.phone || "customer"}.`);
      m.close();
      render();
    });
  };

  const pageTitle = (page) => {
    const map = {
      login: "Sign in",
      dashboard: "Dashboard",
      bookings: "Bookings",
      packages: "Tour Packages",
      hotels: "Hotel Reservations",
      cars: "Car Reservations",
      customers: "Customers",
      payments: "Payments & Invoices",
      accounting: "Accounting",
      reports: "Reports",
      vendors: "Vendors",
      inquiries: "Inquiries",
      sms: "SMS & Notifications",
      logs: "Logs & Audit",
      users: "Users & Roles",
      settings: "Settings",
    };
    return map[page] || "Home";
  };

  const pageSubtitle = (page) => {
    const map = {
      dashboard: "Operational overview, pending work, and quick actions.",
      bookings: "Tour, hotel, and car booking requests. Approve or reject.",
      packages: "Create and manage tour packages, pricing, and availability.",
      hotels: "Manage hotels, room types, and reservation coordination.",
      cars: "Manage vehicles, driver options, and reservation schedules.",
      customers: "Customer profiles, CRM notes, and booking history.",
      payments: "Invoices, transactions, refunds, and payment verification.",
      accounting: "Ledger entries, expenses, and financial snapshots.",
      reports: "Booking, revenue, customer, and vendor reporting.",
      vendors: "Hotel/transport vendors, contracts, and coordination.",
      inquiries: "Leads, follow-ups, and inquiry communication pipeline.",
      sms: "SMS templates, send queue, and delivery logs.",
      logs: "Audit trail and security log visibility.",
      users: "User accounts, roles, and permissions.",
      settings: "Agency profile, VAT/currency, and integrations.",
    };
    return map[page] || "Travel Agency Management System (Bangladesh Perspective).";
  };

  const renderUsers = ({ params }) => {
    const tab = params.tab || "users";
    const tabs = [
      { id: "users", label: "Users" },
      { id: "roles", label: "Roles & Permissions" },
    ];
    const users = state.db.users.slice().sort((a, b) => (a.id > b.id ? 1 : -1));
    const roles = state.db.roles;

    const usersView = `
      <div class="card">
        <div class="card__head">
          <div class="card__title">
            <h2>User accounts</h2>
            <p>Create, edit, disable and assign roles</p>
          </div>
          <div class="actions">
            <button class="btn btn--small btn--primary" data-action="addUser">${ICONS.plus} Add user</button>
          </div>
        </div>
        <div class="card__body">
          <div class="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Last login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${users
                  .map(
                    (u) => `
                  <tr>
                    <td><span class="pill">${escapeHtml(u.id)}</span></td>
                    <td>${escapeHtml(u.name)}</td>
                    <td>${escapeHtml(u.email)}</td>
                    <td>${escapeHtml(roleLabel(u.role))}</td>
                    <td><span class="status ${u.status === "active" ? "status--success" : "status--danger"}"><span class="dot"></span>${escapeHtml(u.status)}</span></td>
                    <td>${escapeHtml(new Date(u.lastLogin).toLocaleString())}</td>
                    <td>
                      <button class="btn btn--small" data-edit-user="${escapeHtml(u.id)}">Edit</button>
                      <button class="btn btn--small" data-toggle-user="${escapeHtml(u.id)}">${u.status === "active" ? "Disable" : "Enable"}</button>
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    const rolesView = `
      <div class="grid grid--2">
        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>Roles</h2>
              <p>Based on SRS roles and permissions table</p>
            </div>
          </div>
          <div class="card__body">
            ${roles
              .map(
                (r) => `
              <div class="card" style="margin-bottom:12px">
                <div class="card__head">
                  <div class="card__title">
                    <h2>${escapeHtml(r.label)}</h2>
                    <p>${escapeHtml(r.id)}</p>
                  </div>
                </div>
                <div class="card__body">
                  <div class="chipRow">
                    ${r.permissions.map((p) => `<div class="chip">${escapeHtml(p)}</div>`).join("")}
                  </div>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>

        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>Permissions matrix</h2>
              <p>Quick reference for module access</p>
            </div>
          </div>
          <div class="card__body">
            <div class="tableWrap">
              <table style="min-width:660px">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Super Admin</th>
                    <th>Admin</th>
                    <th>Staff</th>
                    <th>Accountant</th>
                    <th>Vendor</th>
                  </tr>
                </thead>
                <tbody>
                  ${[
                    ["Dashboard", "Full", "Full", "Partial", "Partial", "Limited"],
                    ["Tour Packages", "Full", "Full", "Partial", "No", "Limited"],
                    ["Hotel Reservations", "Full", "Full", "Partial", "No", "Limited"],
                    ["Car Reservations", "Full", "Full", "Partial", "No", "Limited"],
                    ["Customers", "Full", "Full", "Partial", "View", "No"],
                    ["Payments", "Full", "Full", "Partial", "Full", "Limited"],
                    ["Accounting", "Full", "Limited", "No", "Full", "No"],
                    ["Reports", "Full", "Full", "Partial", "Full", "Limited"],
                    ["Vendors", "Full", "Full", "Partial", "Partial", "Self"],
                    ["Logs", "Full", "View", "No", "No", "No"],
                  ]
                    .map(
                      (row) => `
                    <tr>
                      <td>${escapeHtml(row[0])}</td>
                      ${row.slice(1).map((c) => `<td>${escapeHtml(c)}</td>`).join("")}
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;

    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Users & Roles</h1>
            <p>User management, role assignment, and permission overview.</p>
          </div>
        </div>
        <div class="subnav" role="tablist" aria-label="Users and roles tabs">
          ${tabs
            .map(
              (t) => `
            <button class="tab" role="tab" aria-selected="${t.id === tab ? "true" : "false"}" data-users-tab="${escapeHtml(t.id)}">${escapeHtml(t.label)}</button>
          `,
            )
            .join("")}
        </div>
        ${tab === "roles" ? rolesView : usersView}
      </div>
    `;
  };

  const openAddUser = (existingId) => {
    const existing = existingId ? state.db.users.find((u) => u.id === existingId) : null;
    const roleOpts = ROLES.filter((r) => r.id !== "customer")
      .map((r) => `<option value="${r.id}" ${existing?.role === r.id ? "selected" : ""}>${escapeHtml(r.label)}</option>`)
      .join("");
    const body = `
      <form class="form" id="userForm">
        <div class="formRow">
          <div class="field">
            <label>Name</label>
            <input class="input" name="name" value="${escapeHtml(existing?.name || "")}" required />
          </div>
          <div class="field">
            <label>Status</label>
            <select class="input" name="status">
              <option ${existing?.status === "active" ? "selected" : ""}>active</option>
              <option ${existing?.status === "disabled" ? "selected" : ""}>disabled</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label>Email</label>
          <input class="input" name="email" type="email" value="${escapeHtml(existing?.email || "")}" required />
        </div>
        <div class="field">
          <label>Role</label>
          <select class="input" name="role">${roleOpts}</select>
        </div>
        <button class="btn btn--primary" type="submit">${ICONS.bolt} Save user</button>
        <div class="mini">Password, OTP, and recovery options are available based on your organization policy.</div>
      </form>
    `;
    const m = openModal({ title: existing ? `Edit ${existing.id}` : "Add User", bodyHtml: body });
    const form = el("#userForm");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const u = {
        id: existing?.id || `USR-${String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0")}`,
        name: String(fd.get("name")),
        email: String(fd.get("email")),
        role: String(fd.get("role")),
        status: String(fd.get("status")),
        lastLogin: existing?.lastLogin || nowISO(),
      };
      const idx = state.db.users.findIndex((x) => x.id === u.id);
      if (idx >= 0) state.db.users[idx] = u;
      else state.db.users.unshift(u);
      upsertAudit({ actor: state.session.user?.name || "Admin", action: idx >= 0 ? "Updated user" : "Created user", target: u.id });
      save();
      toast("Saved", `${u.id} saved.`);
      m.close();
      render();
    });
  };

  const toggleUserStatus = (id) => {
    const u = state.db.users.find((x) => x.id === id);
    if (!u) return;
    u.status = u.status === "active" ? "disabled" : "active";
    upsertAudit({ actor: state.session.user?.name || "Admin", action: "Changed user status", target: u.id, severity: "warning" });
    save();
    toast("Updated", `${u.id} is now ${u.status}.`);
    render();
  };

  const renderLogin = () => {
    const roleOptions = ROLES.filter((r) => r.id !== "customer").map((r) => `<option value="${r.id}">${escapeHtml(r.label)}</option>`).join("");
    const ag = state.session.agency;
    const tel = `tel:${ag.phone}`;
    const mail = `mailto:${ag.email}`;
    const qrTel = window.QR?.toSvg(tel, { ecc: "L", scale: 4, border: 2 }) || "";
    const qrPortal = window.QR?.toSvg(ag.portalUrl, { ecc: "L", scale: 4, border: 2 }) || "";
    return `
      <div class="auth">
        <div class="authCard">
          <div class="authHero">
            <div class="brand__mark">
              <div class="brand__logo" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M4 18c6-2 10-6 14-12" stroke="rgba(255,255,255,.95)" stroke-width="2" stroke-linecap="round"/>
                  <path d="M7 20c2-6 6-10 12-14" stroke="rgba(255,255,255,.65)" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="brand__title">
                <div class="brand__name">${escapeHtml(state.session.agency.name)}</div>
                <div class="brand__subtitle">Management System</div>
              </div>
            </div>
            <div class="callout">
              <div class="qrGrid">
                <div class="qrCard">
                  <div class="qrCard__top">
                    <div>
                      <div style="font-weight:800; font-size:13px;">${escapeHtml(ag.hotlineLabel)}</div>
                      <div class="qrCard__label">${escapeHtml(ag.phone)}</div>
                    </div>
                    <div class="qrBox" aria-label="QR code for hotline call">${qrTel}</div>
                  </div>
                  <div class="actions">
                    <a class="btn btn--small btn--primary" href="${escapeHtml(tel)}">Call hotline</a>
                    <a class="btn btn--small" href="${escapeHtml(mail)}">Email support</a>
                  </div>
                  <div class="qrHint">Scan the QR to call from a mobile device.</div>
                </div>

                <div class="qrCard">
                  <div class="qrCard__top">
                    <div>
                      <div style="font-weight:800; font-size:13px;">Login Portal</div>
                      <div class="qrCard__label">${escapeHtml(ag.portalUrl)}</div>
                    </div>
                    <div class="qrBox" aria-label="QR code for login portal">${qrPortal}</div>
                  </div>
                  <div class="actions">
                    <a class="btn btn--small btn--primary" href="${escapeHtml(ag.portalUrl)}" target="_blank" rel="noreferrer">Open portal</a>
                    <button class="btn btn--small" type="button" id="btnCopyPortal">Copy link</button>
                  </div>
                  <div class="qrHint">Scan the QR to open the login portal.</div>
                </div>
              </div>
            </div>
            <div class="chipRow">
              <div class="chip"><strong>Currency</strong> BDT</div>
              <div class="chip"><strong>Payments</strong> bKash / Nagad / Rocket</div>
              <div class="chip"><strong>SMS</strong> Gateway-ready</div>
            </div>
            <p class="mini">Securely manage bookings, payments, vendors, and customer service.</p>
          </div>
          <div class="authBody">
            <h2>Sign in</h2>
            <div class="helper">Use any email and any password. Choose a role to preview permissions.</div>
            <div class="divider"></div>
            <form class="form" id="loginForm">
              <div class="field">
                <label>Email</label>
                <input class="input" name="email" type="email" placeholder="admin@agency.com" value="admin@agency.com" autocomplete="username" required />
              </div>
              <div class="field">
                <label>Password</label>
                <input class="input" name="password" type="password" placeholder="••••••••" value="admin" autocomplete="current-password" required />
              </div>
              <div class="formRow">
                <div class="field">
                  <label>Role</label>
                  <select class="input" name="role">${roleOptions}</select>
                </div>
                <div class="field">
                  <label>Remember me</label>
                  <select class="input" name="remember">
                    <option value="yes" selected>Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <button class="btn btn--primary" type="submit">${ICONS.bolt} Sign in</button>
            </form>
            <div class="authFoot">
              <span>Need help signing in? Contact your administrator.</span>
              <span>Support: support@agency.com</span>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderShell = ({ page }) => {
    const user = state.session.user;
    const title = pageTitle(page);
    const subtitle = pageSubtitle(page);
    const groups = [];
    let currentGroup = { label: "Navigation", items: [] };
    for (const n of NAV) {
      if (n.type === "section") {
        if (currentGroup.items.length) groups.push(currentGroup);
        currentGroup = { label: n.label, items: [] };
        continue;
      }
      if (!hasAccess(n.id)) continue;
      currentGroup.items.push(n);
    }
    if (currentGroup.items.length) groups.push(currentGroup);

    const navHtml = groups
      .map((g) => {
        const items = g.items
          .map((n) => {
            const active = n.id === page;
            const badge = typeof n.badge === "function" ? n.badge() : null;
            return `
              <a class="nav__item" href="#/${encodeURIComponent(n.id)}" ${active ? 'aria-current="page"' : ""}>
                ${ICONS[n.icon] || ""}
                <span>${escapeHtml(n.label)}</span>
                <span class="nav__meta">
                  ${badge ? `<span class="badge ${n.id === "bookings" || n.id === "inquiries" ? "badge--danger" : ""}">${badge}</span>` : ""}
                </span>
              </a>
            `;
          })
          .join("");
        return `<div class="nav__sectionLabel">${escapeHtml(g.label)}</div>${items}`;
      })
      .join("");

    return `
      <div class="shell" data-sidebar-open="${state.session.sidebarOpen ? "true" : "false"}">
        <aside class="sidebar" aria-label="Sidebar navigation">
          <div class="brand">
            <div class="brand__top">
              <div class="brand__mark">
                <div class="brand__logo" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M4 18c6-2 10-6 14-12" stroke="rgba(255,255,255,.95)" stroke-width="2" stroke-linecap="round"/>
                    <path d="M7 20c2-6 6-10 12-14" stroke="rgba(255,255,255,.65)" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <div class="brand__title">
                  <div class="brand__name">${escapeHtml(state.session.agency.name)}</div>
                  <div class="brand__subtitle">Travel Agency Management</div>
                </div>
              </div>
              <div class="pill">BD</div>
            </div>
            <div class="sidebar__hint">Role-based UI: ${escapeHtml(roleLabel(user.role))}</div>
          </div>

          <nav class="nav">${navHtml}</nav>

          <div class="sidebar__footer">
            <div class="sidebar__footerRow">
              <div class="mini">Quick create</div>
              <button class="btn btn--small" id="btnQuickCreate">${ICONS.plus} New</button>
            </div>
            <div class="sidebar__footerRow">
              <div class="sidebar__hint">All changes saved</div>
              <button class="btn btn--small" id="btnSignOut">Sign out</button>
            </div>
          </div>
        </aside>

        <div class="content">
          <header class="topbar" aria-label="Top bar">
            <div class="topbar__left">
              <button class="hamburger" id="btnHamburger" aria-label="Open sidebar">≡</button>
              <div class="crumbs">
                <div class="crumbs__title">${escapeHtml(title)}</div>
                <div class="crumbs__subtitle">${escapeHtml(subtitle)}</div>
              </div>
            </div>
            <div class="topbar__center">
              <div class="search" role="search">
                ${ICONS.search}
                <input id="globalSearch" placeholder="Search bookings, customers, invoices…" />
              </div>
            </div>
            <div class="topbar__right">
              <button class="iconBtn" id="btnNotifications" aria-label="Notifications">${ICONS.bell}</button>
              <button class="iconBtn" id="btnTheme" aria-label="Theme">${ICONS.settings}</button>
              <button class="userChip" id="btnUserMenu" aria-label="User menu">
                <span class="avatar" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z" stroke="currentColor" stroke-width="1.6"/>
                    <path d="M4 20c1.8-4 14.2-4 16 0" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
                  </svg>
                </span>
                <span class="userChip__meta">
                  <span class="userChip__name">${escapeHtml(user.name)}</span>
                  <span class="userChip__role">${escapeHtml(roleLabel(user.role))}</span>
                </span>
              </button>
            </div>
          </header>

          <main class="main" id="main"></main>
          <footer class="footer" aria-label="Footer">
            <div>© ${new Date().getFullYear()} ${escapeHtml(state.session.agency.name)} • All rights reserved</div>
            <div>
              <a href="#/settings">Settings</a>
              &nbsp;•&nbsp;
              <a href="#/logs">Audit</a>
              &nbsp;•&nbsp;
              <a href="#/reports">Reports</a>
            </div>
          </footer>
        </div>
      </div>
    `;
  };

  const renderDashboard = () => {
    const totalRevenue = state.db.invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.total, 0);
    const pendingBookings = state.db.bookings.filter((b) => b.status === "pending");
    const pendingInquiries = state.db.inquiries.filter((i) => i.status !== "closed");
    const recentTx = state.db.payments.slice(0, 4);
    const featured = state.db.packages.filter((p) => p.status === "active").slice(0, 3);
    const upcoming = state.db.packages
      .filter((p) => p.status === "active")
      .slice()
      .sort((a, b) => (a.nextDate > b.nextDate ? 1 : -1))
      .slice(0, 4);
    const today = new Date();
    const weekday = today.toLocaleDateString(undefined, { weekday: "long" });
    const dateStr = today.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });

    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Admin Dashboard</h1>
            <p>${escapeHtml(weekday)}, ${escapeHtml(dateStr)} • Operational snapshot and tourist highlights.</p>
          </div>
          <div class="actions">
            <button class="btn btn--primary" data-action="createBooking">${ICONS.plus} Create booking</button>
            <button class="btn" data-action="sendSms">${ICONS.bell} Send SMS</button>
            <button class="btn" data-action="generateReport">${ICONS.bolt} Generate report</button>
          </div>
        </div>

        <div class="kpis">
          <div class="kpi">
            <div class="kpi__label">Total bookings</div>
            <div class="kpi__value">${state.db.bookings.length}</div>
            <div class="kpi__delta"><strong>${pendingBookings.length}</strong> pending approvals</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">Revenue (paid)</div>
            <div class="kpi__value">${fmtBDT.format(totalRevenue)}</div>
            <div class="kpi__delta">VAT-inclusive total</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">Pending inquiries</div>
            <div class="kpi__value">${pendingInquiries.length}</div>
            <div class="kpi__delta">Follow-ups in pipeline</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">Active customers</div>
            <div class="kpi__value">${state.db.customers.filter((c) => c.status === "active").length}</div>
            <div class="kpi__delta">CRM-ready profiles</div>
          </div>
        </div>

        <div class="grid grid--2">
          <div class="card">
            <div class="card__head">
              <div class="card__title">
                <h2>Pending bookings</h2>
                <p>Approve or reject booking requests</p>
              </div>
              <a class="btn btn--small" href="#/bookings">View all</a>
            </div>
            <div class="card__body">
              ${pendingBookings.length ? `
              <div class="tableWrap">
                <table>
                  <thead>
                    <tr>
                      <th>Booking</th>
                      <th>Type</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${pendingBookings.slice(0, 6).map((b) => {
                      const c = customerById(b.customerId);
                      return `
                        <tr>
                          <td><span class="pill">${escapeHtml(b.id)}</span></td>
                          <td>${escapeHtml(b.type)}</td>
                          <td>${escapeHtml(c?.name || "-")}</td>
                          <td>${fmtBDT.format(b.amount)}</td>
                          <td><span class="status status--warning"><span class="dot"></span>pending</span></td>
                          <td>
                            <button class="btn btn--small btn--primary" data-approve="${escapeHtml(b.id)}">Approve</button>
                            <button class="btn btn--small" data-reject="${escapeHtml(b.id)}">Reject</button>
                          </td>
                        </tr>
                      `;
                    }).join("")}
                  </tbody>
                </table>
              </div>` : `<div class="empty">No pending bookings right now.</div>`}
            </div>
          </div>

          <div class="card">
            <div class="card__head">
              <div class="card__title">
                <h2>Recent transactions</h2>
                <p>Latest verified payments</p>
              </div>
              <a class="btn btn--small" href="#/payments">Payments</a>
            </div>
            <div class="card__body">
              ${recentTx.length ? `
                <div class="tableWrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Txn</th>
                        <th>Invoice</th>
                        <th>Method</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${recentTx.map((p) => `
                        <tr>
                          <td><span class="pill">${escapeHtml(p.txn)}</span></td>
                          <td>${escapeHtml(p.invoiceId)}</td>
                          <td>${escapeHtml(p.method)}</td>
                          <td>${fmtBDT.format(p.amount)}</td>
                          <td><span class="status status--success"><span class="dot"></span>verified</span></td>
                        </tr>
                      `).join("")}
                    </tbody>
                  </table>
                </div>
              ` : `<div class="empty">No transactions yet.</div>`}
            </div>
          </div>
        </div>

        <div class="grid grid--3">
          <div class="card">
            <div class="card__head">
              <div class="card__title">
                <h2>Featured tours</h2>
                <p>Popular packages to recommend to travelers</p>
              </div>
              <a class="btn btn--small" href="#/packages">Manage</a>
            </div>
            <div class="card__body">
              ${featured.length ? `
                <div class="chipRow">
                  ${featured
                    .map(
                      (p) => `
                    <div class="chip">
                      <strong>${escapeHtml(p.title)}</strong>
                      ${fmtBDT.format(p.basePrice)} • Next ${escapeHtml(p.nextDate)}
                      <button class="btn btn--small btn--primary" style="margin-left:8px" data-create-booking-from="${escapeHtml(p.id)}">${ICONS.plus} Book</button>
                    </div>
                  `,
                    )
                    .join("")}
                </div>
              ` : `<div class="empty">No featured tours available.</div>`}
              <div class="divider"></div>
              <div class="mini">Tip: use “Create booking” to log phone/Facebook inquiries quickly.</div>
            </div>
          </div>

          <div class="card">
            <div class="card__head">
              <div class="card__title">
                <h2>Bangladesh destinations</h2>
                <p>Quick inspiration for tourists</p>
              </div>
            </div>
            <div class="card__body">
              <div class="chipRow">
                <div class="chip"><strong>Cox’s Bazar</strong> Beach & seafood</div>
                <div class="chip"><strong>Sajek</strong> Hills & sunrise</div>
                <div class="chip"><strong>Sylhet</strong> Tea gardens</div>
                <div class="chip"><strong>Bandarban</strong> Trekking</div>
                <div class="chip"><strong>Sundarban</strong> Mangrove safari</div>
              </div>
              <div class="divider"></div>
              <div class="mini">Curate seasonal deals and group discounts from Packages.</div>
            </div>
          </div>

          <div class="card">
            <div class="card__head">
              <div class="card__title">
                <h2>Upcoming departures</h2>
                <p>Next scheduled package dates</p>
              </div>
            </div>
            <div class="card__body">
              ${upcoming.length ? `
                <div class="tableWrap">
                  <table style="min-width:520px">
                    <thead>
                      <tr>
                        <th>Package</th>
                        <th>Date</th>
                        <th>Capacity</th>
                        <th>Base price</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${upcoming
                        .map(
                          (p) => `
                        <tr>
                          <td>${escapeHtml(p.title)}</td>
                          <td><span class="pill">${escapeHtml(p.nextDate)}</span></td>
                          <td>${p.capacity}</td>
                          <td>${fmtBDT.format(p.basePrice)}</td>
                        </tr>
                      `,
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>
              ` : `<div class="empty">No departures configured.</div>`}
              <div class="divider"></div>
              <div class="mini">Use SMS to send reminders and confirmations.</div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderBookings = ({ params }) => {
    const type = params.tab || "all";
    const tabs = [
      { id: "all", label: "All" },
      { id: "Tour", label: "Tour" },
      { id: "Hotel", label: "Hotel" },
      { id: "Car", label: "Car" },
      { id: "pending", label: "Pending" },
    ];
    const list = state.db.bookings
      .filter((b) => (type === "all" ? true : type === "pending" ? b.status === "pending" : b.type === type))
      .sort((a, b) => (a.id < b.id ? 1 : -1));

    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Bookings</h1>
            <p>Workflow: request → verify availability → approve → pay → invoice → notify.</p>
          </div>
          <div class="actions">
            <button class="btn btn--primary" data-action="createBooking">${ICONS.plus} New booking</button>
          </div>
        </div>

        <div class="subnav" role="tablist" aria-label="Booking filters">
          ${tabs.map((t) => `
            <button class="tab" role="tab" aria-selected="${t.id === type ? "true" : "false"}" data-tab="${escapeHtml(t.id)}">${escapeHtml(t.label)}</button>
          `).join("")}
        </div>

        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>Booking list</h2>
              <p>${list.length} records</p>
            </div>
            <div class="actions">
              <button class="btn btn--small" data-action="exportBookings">${ICONS.bolt} Export CSV</button>
            </div>
          </div>
          <div class="card__body">
            ${list.length ? `
            <div class="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Type</th>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Dates</th>
                    <th>PAX</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Invoice</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${list.map((b) => {
                    const c = customerById(b.customerId);
                    const inv = state.db.invoices.find((i) => i.bookingId === b.id);
                    const statusClass = b.status === "approved" ? "status--success" : b.status === "pending" ? "status--warning" : "status--danger";
                    return `
                      <tr>
                        <td><span class="pill">${escapeHtml(b.id)}</span></td>
                        <td>${escapeHtml(b.type)}</td>
                        <td>${escapeHtml(b.refId)}</td>
                        <td>${escapeHtml(c?.name || "-")}</td>
                        <td>${escapeHtml(b.dateFrom)} → ${escapeHtml(b.dateTo)}</td>
                        <td>${b.pax}</td>
                        <td>${fmtBDT.format(b.amount)}</td>
                        <td><span class="status ${statusClass}"><span class="dot"></span>${escapeHtml(b.status)}</span></td>
                        <td>${inv ? `<button class="btn btn--small" data-view-inv="${escapeHtml(inv.id)}">${escapeHtml(inv.id)}</button>` : "-"}</td>
                        <td>
                          ${b.status === "pending" ? `
                            <button class="btn btn--small btn--primary" data-approve="${escapeHtml(b.id)}">Approve</button>
                            <button class="btn btn--small" data-reject="${escapeHtml(b.id)}">Reject</button>
                          ` : `<span class="mini">—</span>`}
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
            ` : `<div class="empty">No bookings found.</div>`}
          </div>
        </div>
      </div>
    `;
  };

  const renderPackages = () => {
    const list = state.db.packages.slice().sort((a, b) => (a.id > b.id ? 1 : -1));
    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Tour Packages</h1>
            <p>Create packages, set pricing, and manage availability.</p>
          </div>
          <div class="actions">
            <button class="btn btn--primary" data-action="createPackage">${ICONS.plus} Add package</button>
          </div>
        </div>

        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>Packages</h2>
              <p>${list.length} packages</p>
            </div>
          </div>
          <div class="card__body">
            <div class="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Package ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Base price</th>
                    <th>Capacity</th>
                    <th>Next date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${list.map((p) => `
                    <tr>
                      <td><span class="pill">${escapeHtml(p.id)}</span></td>
                      <td>${escapeHtml(p.title)}</td>
                      <td>${escapeHtml(p.category)}</td>
                      <td>${fmtBDT.format(p.basePrice)}</td>
                      <td>${p.capacity}</td>
                      <td>${escapeHtml(p.nextDate)}</td>
                      <td>
                        <span class="status ${p.status === "active" ? "status--success" : "status--warning"}">
                          <span class="dot"></span>${escapeHtml(p.status)}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn--small" data-edit-pkg="${escapeHtml(p.id)}">Edit</button>
                        <button class="btn btn--small btn--primary" data-create-booking-from="${escapeHtml(p.id)}">${ICONS.plus} Booking</button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderHotels = () => {
    const list = state.db.hotels;
    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Hotels</h1>
            <p>Hotel + room management and reservation coordination.</p>
          </div>
          <div class="actions">
            <button class="btn btn--primary" data-action="addHotel">${ICONS.plus} Add hotel</button>
          </div>
        </div>

        <div class="grid grid--2">
          ${list.map((h) => `
            <div class="card">
              <div class="card__head">
                <div class="card__title">
                  <h2>${escapeHtml(h.name)}</h2>
                  <p>${escapeHtml(h.city)} • Rating ${h.rating.toFixed(1)} • Vendor ${escapeHtml(h.vendor)}</p>
                </div>
                <span class="pill">${escapeHtml(h.id)}</span>
              </div>
              <div class="card__body">
                <div class="chipRow">
                  ${h.rooms.map((r) => `<div class="chip"><strong>${escapeHtml(r.type)}</strong> ${fmtBDT.format(r.price)} • Stock ${r.stock}</div>`).join("")}
                </div>
                <div class="divider"></div>
                <div class="actions">
                  <button class="btn btn--small" data-manage-hotel="${escapeHtml(h.id)}">Manage</button>
                  <button class="btn btn--small btn--primary" data-create-hotel-booking="${escapeHtml(h.id)}">${ICONS.plus} Reservation</button>
                </div>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  };

  const renderCars = () => {
    const list = state.db.cars;
    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Cars</h1>
            <p>Vehicle inventory, driver options, reservation schedule, and status.</p>
          </div>
          <div class="actions">
            <button class="btn btn--primary" data-action="addCar">${ICONS.plus} Add vehicle</button>
          </div>
        </div>

        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>Vehicle list</h2>
              <p>${list.length} vehicles</p>
            </div>
          </div>
          <div class="card__body">
            <div class="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Vehicle</th>
                    <th>Daily rate</th>
                    <th>Driver</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${list.map((c) => `
                    <tr>
                      <td><span class="pill">${escapeHtml(c.id)}</span></td>
                      <td>${escapeHtml(c.type)}</td>
                      <td>${escapeHtml(`${c.brand} ${c.model}`)}</td>
                      <td>${fmtBDT.format(c.dailyRate)}</td>
                      <td>${c.driver ? "Included" : "Optional"}</td>
                      <td>
                        <span class="status ${c.status === "available" ? "status--success" : c.status === "maintenance" ? "status--danger" : "status--warning"}">
                          <span class="dot"></span>${escapeHtml(c.status)}
                        </span>
                      </td>
                      <td>
                        <button class="btn btn--small" data-edit-car="${escapeHtml(c.id)}">Edit</button>
                        <button class="btn btn--small btn--primary" data-create-car-booking="${escapeHtml(c.id)}">${ICONS.plus} Reservation</button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderCustomers = () => {
    const list = state.db.customers;
    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Customers</h1>
            <p>Profiles, booking history, and CRM notes.</p>
          </div>
          <div class="actions">
            <button class="btn btn--primary" data-action="addCustomer">${ICONS.plus} Add customer</button>
          </div>
        </div>

        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>Customer list</h2>
              <p>${list.length} customers</p>
            </div>
          </div>
          <div class="card__body">
            <div class="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Status</th>
                    <th>Lifetime value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${list.map((c) => `
                    <tr>
                      <td><span class="pill">${escapeHtml(c.id)}</span></td>
                      <td>${escapeHtml(c.name)}</td>
                      <td>${escapeHtml(c.phone)}</td>
                      <td>${escapeHtml(c.email)}</td>
                      <td>${escapeHtml(c.city)}</td>
                      <td><span class="status ${c.status === "active" ? "status--success" : "status--warning"}"><span class="dot"></span>${escapeHtml(c.status)}</span></td>
                      <td>${fmtBDT.format(c.lifetimeValue)}</td>
                      <td>
                        <button class="btn btn--small" data-view-customer="${escapeHtml(c.id)}">View</button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderPayments = () => {
    const invoices = state.db.invoices.slice().sort((a, b) => (a.id < b.id ? 1 : -1));
    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Payments & Invoices</h1>
            <p>Invoice management, refunds, and transaction verification.</p>
          </div>
          <div class="actions">
            <button class="btn" data-action="exportInvoices">${ICONS.bolt} Export CSV</button>
          </div>
        </div>

        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>Invoices</h2>
              <p>${invoices.length} invoices</p>
            </div>
          </div>
          <div class="card__body">
            <div class="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Invoice</th>
                    <th>Booking</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoices.map((inv) => {
                    const c = customerById(inv.customerId);
                    const cls = inv.status === "paid" ? "status--success" : inv.status === "void" ? "status--danger" : "status--warning";
                    return `
                      <tr>
                        <td><span class="pill">${escapeHtml(inv.id)}</span></td>
                        <td>${escapeHtml(inv.bookingId)}</td>
                        <td>${escapeHtml(c?.name || "-")}</td>
                        <td>${fmtBDT.format(inv.total)}</td>
                        <td><span class="status ${cls}"><span class="dot"></span>${escapeHtml(inv.status)}</span></td>
                        <td>
                          <button class="btn btn--small btn--primary" data-view-inv="${escapeHtml(inv.id)}">View</button>
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderAccounting = () => {
    const rows = state.db.ledger.slice(0, 40);
    const credits = state.db.ledger.filter((r) => r.type === "Credit").reduce((s, r) => s + r.amount, 0);
    const debits = state.db.ledger.filter((r) => r.type === "Debit").reduce((s, r) => s + r.amount, 0);
    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Accounting</h1>
            <p>Ledger entries, expenses, and financial summary.</p>
          </div>
          <div class="actions">
            <button class="btn btn--primary" data-action="addLedger">${ICONS.plus} Add entry</button>
          </div>
        </div>

        <div class="kpis">
          <div class="kpi">
            <div class="kpi__label">Credits</div>
            <div class="kpi__value">${fmtBDT.format(credits)}</div>
            <div class="kpi__delta">Sales & income</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">Debits</div>
            <div class="kpi__value">${fmtBDT.format(debits)}</div>
            <div class="kpi__delta">Expenses & payouts</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">Net</div>
            <div class="kpi__value">${fmtBDT.format(credits - debits)}</div>
            <div class="kpi__delta">Profit snapshot</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">VAT rate</div>
            <div class="kpi__value">${(state.session.agency.vatRate * 100).toFixed(0)}%</div>
            <div class="kpi__delta">Configurable in Settings</div>
          </div>
        </div>

        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>Ledger</h2>
              <p>${rows.length} recent entries</p>
            </div>
          </div>
          <div class="card__body">
            <div class="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Ref</th>
                    <th>Type</th>
                    <th>Account</th>
                    <th>Amount</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  ${rows.map((r) => `
                    <tr>
                      <td>${escapeHtml(r.date)}</td>
                      <td><span class="pill">${escapeHtml(r.ref)}</span></td>
                      <td>${escapeHtml(r.type)}</td>
                      <td>${escapeHtml(r.account)}</td>
                      <td>${fmtBDT.format(r.amount)}</td>
                      <td>${escapeHtml(r.note || "")}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderReports = () => {
    const paid = state.db.invoices.filter((i) => i.status === "paid");
    const unpaid = state.db.invoices.filter((i) => i.status === "unpaid");
    const totals = {
      paid: paid.reduce((s, i) => s + i.total, 0),
      unpaid: unpaid.reduce((s, i) => s + i.total, 0),
      bookings: state.db.bookings.length,
      customers: state.db.customers.length,
    };
    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Reports</h1>
            <p>Booking report, revenue report, and customer report.</p>
          </div>
          <div class="actions">
            <button class="btn btn--primary" data-action="generateReport">${ICONS.bolt} Generate</button>
          </div>
        </div>

        <div class="grid grid--3">
          <div class="card">
            <div class="card__head">
              <div class="card__title">
                <h2>Revenue Summary</h2>
                <p>Paid vs unpaid totals</p>
              </div>
            </div>
            <div class="card__body">
              <div class="kpi">
                <div class="kpi__label">Paid</div>
                <div class="kpi__value">${fmtBDT.format(totals.paid)}</div>
                <div class="kpi__delta">Verified transactions</div>
              </div>
              <div class="divider"></div>
              <div class="kpi">
                <div class="kpi__label">Unpaid</div>
                <div class="kpi__value">${fmtBDT.format(totals.unpaid)}</div>
                <div class="kpi__delta">Needs follow-up</div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card__head">
              <div class="card__title">
                <h2>Booking Mix</h2>
                <p>Tour vs Hotel vs Car</p>
              </div>
            </div>
            <div class="card__body">
              ${["Tour", "Hotel", "Car"].map((t) => {
                const count = state.db.bookings.filter((b) => b.type === t).length;
                const pct = state.db.bookings.length ? Math.round((count / state.db.bookings.length) * 100) : 0;
                return `<div class="chip"><strong>${escapeHtml(t)}</strong> ${count} • ${pct}%</div>`;
              }).join("")}
              <div class="divider"></div>
              <div class="mini">Replace with charts in a real build (e.g., Chart.js).</div>
            </div>
          </div>

          <div class="card">
            <div class="card__head">
              <div class="card__title">
                <h2>Customer Snapshot</h2>
                <p>Active and new customers</p>
              </div>
            </div>
            <div class="card__body">
              <div class="chipRow">
                <div class="chip"><strong>Customers</strong> ${totals.customers}</div>
                <div class="chip"><strong>Active</strong> ${state.db.customers.filter((c) => c.status === "active").length}</div>
                <div class="chip"><strong>New</strong> ${state.db.customers.filter((c) => c.status === "new").length}</div>
              </div>
              <div class="divider"></div>
              <button class="btn btn--small" data-action="exportCustomers">${ICONS.bolt} Export CSV</button>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderVendors = () => {
    const list = state.db.vendors;
    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Vendors</h1>
            <p>Agent/vendor management for hotels and transport providers.</p>
          </div>
          <div class="actions">
            <button class="btn btn--primary" data-action="addVendor">${ICONS.plus} Add vendor</button>
          </div>
        </div>

        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>Vendor directory</h2>
              <p>${list.length} vendors</p>
            </div>
          </div>
          <div class="card__body">
            <div class="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>City</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${list.map((v) => `
                    <tr>
                      <td><span class="pill">${escapeHtml(v.id)}</span></td>
                      <td>${escapeHtml(v.name)}</td>
                      <td>${escapeHtml(v.type)}</td>
                      <td>${escapeHtml(v.city)}</td>
                      <td>${escapeHtml(v.phone)}</td>
                      <td><span class="status ${v.status === "active" ? "status--success" : "status--warning"}"><span class="dot"></span>${escapeHtml(v.status)}</span></td>
                      <td><button class="btn btn--small" data-view-vendor="${escapeHtml(v.id)}">View</button></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderInquiries = () => {
    const list = state.db.inquiries.slice().sort((a, b) => (a.id < b.id ? 1 : -1));
    const columns = [
      { id: "open", label: "Open" },
      { id: "pending_reply", label: "Pending reply" },
      { id: "closed", label: "Closed" },
    ];
    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Inquiries</h1>
            <p>Inquiry workflow: submit → assign → respond → follow-up → status update.</p>
          </div>
          <div class="actions">
            <button class="btn btn--primary" data-action="addInquiry">${ICONS.plus} New inquiry</button>
          </div>
        </div>

        <div class="grid grid--3">
          ${columns.map((col) => `
            <div class="card">
              <div class="card__head">
                <div class="card__title">
                  <h2>${escapeHtml(col.label)}</h2>
                  <p>${list.filter((i) => i.status === col.id).length} items</p>
                </div>
              </div>
              <div class="card__body">
                ${list.filter((i) => i.status === col.id).map((i) => `
                  <div class="card" style="margin-bottom:12px">
                    <div class="card__head">
                      <div class="card__title">
                        <h2>${escapeHtml(i.topic)}</h2>
                        <p>${escapeHtml(i.channel)} • ${escapeHtml(i.name)} • ${escapeHtml(i.phone)}</p>
                      </div>
                    </div>
                    <div class="card__body">
                      <div class="chipRow">
                        <div class="chip"><strong>Owner</strong> ${escapeHtml(i.owner)}</div>
                        <div class="chip"><strong>ID</strong> ${escapeHtml(i.id)}</div>
                      </div>
                      <div class="divider"></div>
                      <div class="actions">
                        <button class="btn btn--small" data-reply-inq="${escapeHtml(i.id)}">Reply</button>
                        <button class="btn btn--small btn--primary" data-move-inq="${escapeHtml(i.id)}">Move</button>
                      </div>
                    </div>
                  </div>
                `).join("") || `<div class="empty">No inquiries in this stage.</div>`}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  };

  const renderSms = () => {
    const logs = state.db.smsLogs.slice(0, 30);
    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>SMS & Notifications</h1>
            <p>Templates, settings and notification logs.</p>
          </div>
          <div class="actions">
            <button class="btn btn--primary" data-action="sendSms">${ICONS.bell} Send SMS</button>
          </div>
        </div>

        <div class="grid grid--2">
          <div class="card">
            <div class="card__head">
              <div class="card__title">
                <h2>Templates</h2>
                <p>Common alerts from the SRS</p>
              </div>
            </div>
            <div class="card__body">
              <div class="chipRow">
                <div class="chip"><strong>Booking Confirmed</strong> Thank you. Booking confirmed.</div>
                <div class="chip"><strong>Payment Reminder</strong> Your invoice is pending.</div>
                <div class="chip"><strong>Payment Verified</strong> Payment received. Receipt ready.</div>
                <div class="chip"><strong>Inquiry Update</strong> Our team will contact you shortly.</div>
              </div>
              <div class="divider"></div>
              <div class="mini">SMS gateway configuration: SSL Wireless / BulkSMSBD.</div>
            </div>
          </div>

          <div class="card">
            <div class="card__head">
              <div class="card__title">
                <h2>Delivery log</h2>
                <p>${logs.length} recent messages</p>
              </div>
            </div>
            <div class="card__body">
              ${logs.length ? `
              <div class="tableWrap">
                <table style="min-width: 560px">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>To</th>
                      <th>Template</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${logs.map((s) => `
                      <tr>
                        <td>${escapeHtml(new Date(s.at).toLocaleString())}</td>
                        <td>${escapeHtml(s.to)}</td>
                        <td>${escapeHtml(s.template)}</td>
                        <td><span class="status ${s.status === "sent" ? "status--success" : "status--warning"}"><span class="dot"></span>${escapeHtml(s.status)}</span></td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>` : `<div class="empty">No SMS logs yet.</div>`}
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderLogs = () => {
    const logs = state.db.auditLogs.slice(0, 50);
    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Logs & Audit</h1>
            <p>Track key actions for compliance and troubleshooting.</p>
          </div>
          <div class="actions">
            <button class="btn" data-action="exportLogs">${ICONS.bolt} Export CSV</button>
          </div>
        </div>

        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>Audit trail</h2>
              <p>${logs.length} recent events</p>
            </div>
          </div>
          <div class="card__body">
            <div class="tableWrap">
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Target</th>
                    <th>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  ${logs.map((l) => {
                    const cls = l.severity === "warning" ? "status--warning" : l.severity === "error" ? "status--danger" : "status--success";
                    return `
                      <tr>
                        <td>${escapeHtml(new Date(l.at).toLocaleString())}</td>
                        <td>${escapeHtml(l.actor)}</td>
                        <td>${escapeHtml(l.action)}</td>
                        <td><span class="pill">${escapeHtml(l.target)}</span></td>
                        <td><span class="status ${cls}"><span class="dot"></span>${escapeHtml(l.severity)}</span></td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderSettings = () => {
    const ag = state.session.agency;
    return `
      <div class="page">
        <div class="page__header">
          <div class="page__title">
            <h1>Settings</h1>
            <p>Agency info, currency, VAT, and integration placeholders.</p>
          </div>
        </div>

        <div class="grid grid--2">
          <div class="card">
            <div class="card__head">
              <div class="card__title">
                <h2>Agency</h2>
                <p>Core profile details</p>
              </div>
            </div>
            <div class="card__body">
              <form class="form" id="settingsAgency">
                <div class="field">
                  <label>Agency name</label>
                  <input class="input" name="name" value="${escapeHtml(ag.name)}" />
                </div>
                <div class="formRow">
                  <div class="field">
                    <label>Currency</label>
                    <select class="input" name="currency" disabled>
                      <option selected>BDT</option>
                    </select>
                  </div>
                  <div class="field">
                    <label>VAT rate</label>
                    <input class="input" name="vatRate" type="number" step="0.01" min="0" max="0.3" value="${ag.vatRate}" />
                  </div>
                </div>
                <button class="btn btn--primary" type="submit">${ICONS.bolt} Save settings</button>
                <div class="mini">VAT and tax settings can be adjusted based on policy.</div>
              </form>
            </div>
          </div>

          <div class="card">
            <div class="card__head">
              <div class="card__title">
                <h2>Integrations</h2>
                <p>Gateway placeholders (no real keys stored)</p>
              </div>
            </div>
            <div class="card__body">
              <div class="chipRow">
                <div class="chip"><strong>Payment</strong> bKash / Nagad / SSLCommerz</div>
                <div class="chip"><strong>SMS</strong> SSL Wireless / BulkSMSBD</div>
                <div class="chip"><strong>Email</strong> SMTP templates</div>
              </div>
              <div class="divider"></div>
              <div class="mini">Configure gateways and notification providers for your environment.</div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const renderNotFound = () => `
    <div class="page">
      <div class="page__header">
        <div class="page__title">
          <h1>Not found</h1>
          <p>The requested page is not available.</p>
        </div>
      </div>
      <div class="empty">Try using the sidebar navigation.</div>
    </div>
  `;

  const exportCsv = (rows, filename) => {
    const esc = (v) => `"${String(v ?? "").replaceAll('"', '""')}"`;
    const header = Object.keys(rows[0] || {});
    const csv = [header.map(esc).join(","), ...rows.map((r) => header.map((k) => esc(r[k])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const openQuickCreate = () => {
    const body = `
      <div class="grid grid--2">
        <div class="card">
          <div class="card__head"><div class="card__title"><h2>Booking</h2><p>Create a new booking request</p></div></div>
          <div class="card__body">
            <button class="btn btn--primary" data-qc="booking">${ICONS.plus} Create booking</button>
          </div>
        </div>
        <div class="card">
          <div class="card__head"><div class="card__title"><h2>Tour Package</h2><p>Add a new package</p></div></div>
          <div class="card__body">
            <button class="btn btn--primary" data-qc="package">${ICONS.plus} Add package</button>
          </div>
        </div>
        <div class="card">
          <div class="card__head"><div class="card__title"><h2>Customer</h2><p>Add a customer profile</p></div></div>
          <div class="card__body">
            <button class="btn btn--primary" data-qc="customer">${ICONS.plus} Add customer</button>
          </div>
        </div>
        <div class="card">
          <div class="card__head"><div class="card__title"><h2>Inquiry</h2><p>Log a new inquiry</p></div></div>
          <div class="card__body">
            <button class="btn btn--primary" data-qc="inquiry">${ICONS.plus} Add inquiry</button>
          </div>
        </div>
      </div>
    `;
    const m = openModal({ title: "Quick Create", bodyHtml: body });
    overlayEventsForQC(m);
  };

  const overlayEventsForQC = (m) => {
    els("[data-qc]").forEach((b) =>
      b.addEventListener("click", () => {
        const t = b.getAttribute("data-qc");
        m.close();
        if (t === "booking") openCreateBooking();
        if (t === "package") openCreatePackage();
        if (t === "customer") openCreateCustomer();
        if (t === "inquiry") openCreateInquiry();
      }),
    );
  };

  const openCreateBooking = (preset = {}) => {
    const pkgOptions = state.db.packages.map((p) => `<option value="${escapeHtml(p.id)}">${escapeHtml(p.title)}</option>`).join("");
    const hotelOptions = state.db.hotels.map((h) => `<option value="${escapeHtml(h.id)}">${escapeHtml(h.name)} (${escapeHtml(h.city)})</option>`).join("");
    const carOptions = state.db.cars.map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(`${c.brand} ${c.model}`)} • ${escapeHtml(c.type)}</option>`).join("");
    const custOptions = state.db.customers.map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)} (${escapeHtml(c.phone)})</option>`).join("");
    const body = `
      <form class="form" id="createBookingForm">
        <div class="formRow">
          <div class="field">
            <label>Type</label>
            <select class="input" name="type">
              <option ${preset.type === "Tour" ? "selected" : ""}>Tour</option>
              <option ${preset.type === "Hotel" ? "selected" : ""}>Hotel</option>
              <option ${preset.type === "Car" ? "selected" : ""}>Car</option>
            </select>
          </div>
          <div class="field">
            <label>Customer</label>
            <select class="input" name="customerId">${custOptions}</select>
          </div>
        </div>
        <div class="field">
          <label>Reference (package/hotel/car)</label>
          <select class="input" name="refId">
            <optgroup label="Tour Packages">${pkgOptions}</optgroup>
            <optgroup label="Hotels">${hotelOptions}</optgroup>
            <optgroup label="Cars">${carOptions}</optgroup>
          </select>
        </div>
        <div class="formRow">
          <div class="field">
            <label>Date from</label>
            <input class="input" type="date" name="dateFrom" required />
          </div>
          <div class="field">
            <label>Date to</label>
            <input class="input" type="date" name="dateTo" required />
          </div>
        </div>
        <div class="formRow">
          <div class="field">
            <label>Travelers (PAX)</label>
            <input class="input" type="number" name="pax" min="1" value="2" required />
          </div>
          <div class="field">
            <label>Estimated amount (BDT)</label>
            <input class="input" type="number" name="amount" min="0" value="${preset.amount ?? 12000}" required />
          </div>
        </div>
        <button class="btn btn--primary" type="submit">${ICONS.plus} Create request</button>
        <div class="mini">Creates a <strong>pending</strong> booking and generates an invoice.</div>
      </form>
    `;
    const m = openModal({ title: "Create Booking", bodyHtml: body });
    const form = el("#createBookingForm");
    const dateFrom = form?.querySelector('[name="dateFrom"]');
    const dateTo = form?.querySelector('[name="dateTo"]');
    const today = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const d1 = new Date(today);
    d1.setDate(d1.getDate() + 7);
    const d2 = new Date(today);
    d2.setDate(d2.getDate() + 9);
    if (dateFrom) dateFrom.value = iso(d1);
    if (dateTo) dateTo.value = iso(d2);

    if (preset.refId && form) form.querySelector('[name="refId"]').value = preset.refId;
    if (preset.type && form) form.querySelector('[name="type"]').value = preset.type;
    if (preset.pax && form) form.querySelector('[name="pax"]').value = preset.pax;

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const type = String(fd.get("type"));
      const booking = {
        id: `BKG-${Math.floor(10000 + Math.random() * 90000)}`,
        type,
        refId: String(fd.get("refId")),
        customerId: String(fd.get("customerId")),
        dateFrom: String(fd.get("dateFrom")),
        dateTo: String(fd.get("dateTo")),
        pax: Number(fd.get("pax")),
        amount: Number(fd.get("amount")),
        status: "pending",
        createdAt: nowISO(),
      };
      state.db.bookings.unshift(booking);
      const vatRate = state.session.agency.vatRate;
      const vat = Math.round(booking.amount * vatRate);
      state.db.invoices.unshift({
        id: `INV-${Math.floor(9000 + Math.random() * 900)}`,
        bookingId: booking.id,
        customerId: booking.customerId,
        subtotal: booking.amount,
        vatRate,
        vat,
        total: booking.amount + vat,
        status: "unpaid",
        createdAt: nowISO(),
      });
      upsertAudit({ actor: state.session.user?.name || "Staff", action: "Created booking request", target: booking.id });
      save();
      toast("Booking created", `${booking.id} added as pending.`);
      m.close();
      setRoute("bookings", { tab: type });
      render();
    });
  };

  const openCreatePackage = (existingId) => {
    const existing = existingId ? packageById(existingId) : null;
    const body = `
      <form class="form" id="pkgForm">
        <div class="formRow">
          <div class="field">
            <label>Package ID</label>
            <input class="input" name="id" value="${escapeHtml(existing?.id || `PKG-${Math.random().toString(16).slice(2, 6).toUpperCase()}`)}" ${existing ? "readonly" : ""} />
          </div>
          <div class="field">
            <label>Status</label>
            <select class="input" name="status">
              <option ${existing?.status === "active" ? "selected" : ""}>active</option>
              <option ${existing?.status === "draft" ? "selected" : ""}>draft</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label>Title</label>
          <input class="input" name="title" value="${escapeHtml(existing?.title || "")}" placeholder="e.g., Sundarban Adventure (3D/2N)" required />
        </div>
        <div class="formRow">
          <div class="field">
            <label>Category</label>
            <select class="input" name="category">
              <option ${existing?.category === "Local Tour" ? "selected" : ""}>Local Tour</option>
              <option ${existing?.category === "International Tour" ? "selected" : ""}>International Tour</option>
              <option ${existing?.category === "Umrah" ? "selected" : ""}>Umrah</option>
            </select>
          </div>
          <div class="field">
            <label>Base price (BDT)</label>
            <input class="input" name="basePrice" type="number" min="0" value="${existing?.basePrice ?? 12000}" required />
          </div>
        </div>
        <div class="formRow">
          <div class="field">
            <label>Capacity</label>
            <input class="input" name="capacity" type="number" min="1" value="${existing?.capacity ?? 20}" required />
          </div>
          <div class="field">
            <label>Next available date</label>
            <input class="input" name="nextDate" type="date" value="${escapeHtml(existing?.nextDate || "")}" required />
          </div>
        </div>
        <button class="btn btn--primary" type="submit">${ICONS.bolt} Save package</button>
        <div class="mini">You can attach itinerary details and media in the package record.</div>
      </form>
    `;
    const m = openModal({ title: existing ? `Edit Package ${existing.id}` : "Add Tour Package", bodyHtml: body });
    const form = el("#pkgForm");
    if (form && !existing) {
      const d = new Date();
      d.setDate(d.getDate() + 21);
      const pad = (n) => String(n).padStart(2, "0");
      form.querySelector('[name="nextDate"]').value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    }
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const pkg = {
        id: String(fd.get("id")),
        title: String(fd.get("title")),
        category: String(fd.get("category")),
        basePrice: Number(fd.get("basePrice")),
        capacity: Number(fd.get("capacity")),
        nextDate: String(fd.get("nextDate")),
        status: String(fd.get("status")),
      };
      const idx = state.db.packages.findIndex((p) => p.id === pkg.id);
      if (idx >= 0) state.db.packages[idx] = pkg;
      else state.db.packages.unshift(pkg);
      upsertAudit({ actor: state.session.user?.name || "Admin", action: idx >= 0 ? "Updated package" : "Created package", target: pkg.id });
      save();
      toast("Saved", `${pkg.id} saved.`);
      m.close();
      render();
    });
  };

  const openCreateCustomer = () => {
    const body = `
      <form class="form" id="custForm">
        <div class="field">
          <label>Full name</label>
          <input class="input" name="name" placeholder="Customer name" required />
        </div>
        <div class="formRow">
          <div class="field">
            <label>Phone</label>
            <input class="input" name="phone" placeholder="+8801XXXXXXXXX" required />
          </div>
          <div class="field">
            <label>Email</label>
            <input class="input" name="email" type="email" placeholder="name@example.com" />
          </div>
        </div>
        <div class="formRow">
          <div class="field">
            <label>City</label>
            <input class="input" name="city" placeholder="Dhaka" />
          </div>
          <div class="field">
            <label>Status</label>
            <select class="input" name="status">
              <option selected>active</option>
              <option>new</option>
              <option>inactive</option>
            </select>
          </div>
        </div>
        <button class="btn btn--primary" type="submit">${ICONS.plus} Add customer</button>
      </form>
    `;
    const m = openModal({ title: "Add Customer", bodyHtml: body });
    const form = el("#custForm");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const customer = {
        id: `CUST-${String(Math.floor(1 + Math.random() * 9999)).padStart(4, "0")}`,
        name: String(fd.get("name")),
        phone: String(fd.get("phone")),
        email: String(fd.get("email") || ""),
        city: String(fd.get("city") || ""),
        status: String(fd.get("status")),
        lifetimeValue: 0,
      };
      state.db.customers.unshift(customer);
      upsertAudit({ actor: state.session.user?.name || "Staff", action: "Created customer", target: customer.id });
      save();
      toast("Customer added", `${customer.name} created.`);
      m.close();
      render();
    });
  };

  const openCreateInquiry = () => {
    const body = `
      <form class="form" id="inqForm">
        <div class="formRow">
          <div class="field">
            <label>Channel</label>
            <select class="input" name="channel">
              <option>Website</option>
              <option>Facebook</option>
              <option>WhatsApp</option>
              <option>Phone</option>
            </select>
          </div>
          <div class="field">
            <label>Owner</label>
            <select class="input" name="owner">
              <option>Staff A</option>
              <option>Staff B</option>
              <option>Staff C</option>
            </select>
          </div>
        </div>
        <div class="formRow">
          <div class="field">
            <label>Name</label>
            <input class="input" name="name" required />
          </div>
          <div class="field">
            <label>Phone</label>
            <input class="input" name="phone" required />
          </div>
        </div>
        <div class="field">
          <label>Topic</label>
          <input class="input" name="topic" placeholder="What does the customer need?" required />
        </div>
        <button class="btn btn--primary" type="submit">${ICONS.plus} Create inquiry</button>
      </form>
    `;
    const m = openModal({ title: "New Inquiry", bodyHtml: body });
    const form = el("#inqForm");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const inq = {
        id: `INQ-${Math.floor(200 + Math.random() * 800)}`,
        channel: String(fd.get("channel")),
        name: String(fd.get("name")),
        phone: String(fd.get("phone")),
        topic: String(fd.get("topic")),
        status: "open",
        owner: String(fd.get("owner")),
        createdAt: nowISO(),
      };
      state.db.inquiries.unshift(inq);
      upsertAudit({ actor: state.session.user?.name || "Staff", action: "Created inquiry", target: inq.id });
      save();
      toast("Inquiry created", `${inq.id} added.`);
      m.close();
      render();
    });
  };

  const openSendSms = () => {
    const custOptions = state.db.customers.map((c) => `<option value="${escapeHtml(c.phone)}">${escapeHtml(c.name)} (${escapeHtml(c.phone)})</option>`).join("");
    const body = `
      <form class="form" id="smsForm">
        <div class="field">
          <label>Recipient</label>
          <select class="input" name="to">${custOptions}</select>
        </div>
        <div class="field">
          <label>Template</label>
          <select class="input" name="template">
            <option>Booking Confirmed</option>
            <option>Payment Reminder</option>
            <option>Payment Verified</option>
            <option>Inquiry Update</option>
          </select>
        </div>
        <div class="field">
          <label>Message (optional)</label>
          <textarea name="msg" placeholder="Custom message…"></textarea>
        </div>
        <button class="btn btn--primary" type="submit">${ICONS.bell} Send</button>
        <div class="mini">Adds an entry to Notification Logs. Real SMS gateway not connected.</div>
      </form>
    `;
    const m = openModal({ title: "Send SMS", bodyHtml: body });
    const form = el("#smsForm");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const entry = { id: uid("SMS"), to: String(fd.get("to")), template: String(fd.get("template")), status: "sent", at: nowISO() };
      state.db.smsLogs.unshift(entry);
      upsertAudit({ actor: state.session.user?.name || "Staff", action: "Sent SMS", target: entry.to });
      save();
      toast("SMS sent", `${entry.template} → ${entry.to}`);
      m.close();
      render();
    });
  };

  const openAddLedger = () => {
    const body = `
      <form class="form" id="ledgerForm">
        <div class="formRow">
          <div class="field">
            <label>Date</label>
            <input class="input" name="date" type="date" required />
          </div>
          <div class="field">
            <label>Type</label>
            <select class="input" name="type">
              <option>Credit</option>
              <option>Debit</option>
            </select>
          </div>
        </div>
        <div class="formRow">
          <div class="field">
            <label>Account</label>
            <select class="input" name="account">
              <option>Cash</option>
              <option>Sales</option>
              <option>Expense</option>
              <option>Vendor Payable</option>
            </select>
          </div>
          <div class="field">
            <label>Amount</label>
            <input class="input" name="amount" type="number" min="0" required />
          </div>
        </div>
        <div class="field">
          <label>Reference</label>
          <input class="input" name="ref" placeholder="e.g., INV-9001, Office Rent" required />
        </div>
        <div class="field">
          <label>Note</label>
          <textarea name="note" placeholder="Optional note…"></textarea>
        </div>
        <button class="btn btn--primary" type="submit">${ICONS.plus} Add entry</button>
      </form>
    `;
    const m = openModal({ title: "Add Ledger Entry", bodyHtml: body });
    const form = el("#ledgerForm");
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    if (form) form.querySelector('[name="date"]').value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      state.db.ledger.unshift({
        id: uid("LED"),
        date: String(fd.get("date")),
        ref: String(fd.get("ref")),
        type: String(fd.get("type")),
        amount: Number(fd.get("amount")),
        account: String(fd.get("account")),
        note: String(fd.get("note") || ""),
      });
      upsertAudit({ actor: state.session.user?.name || "Accountant", action: "Added ledger entry", target: String(fd.get("ref")) });
      save();
      toast("Ledger updated", "Entry added.");
      m.close();
      render();
    });
  };

  const viewCustomer = (id) => {
    const c = customerById(id);
    if (!c) return;
    const bookings = state.db.bookings.filter((b) => b.customerId === id);
    const body = `
      <div class="grid grid--2">
        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>${escapeHtml(c.name)}</h2>
              <p>${escapeHtml(c.phone)} • ${escapeHtml(c.email || "No email")}</p>
            </div>
            <span class="pill">${escapeHtml(c.id)}</span>
          </div>
          <div class="card__body">
            <div class="chipRow">
              <div class="chip"><strong>City</strong> ${escapeHtml(c.city || "-")}</div>
              <div class="chip"><strong>Status</strong> ${escapeHtml(c.status)}</div>
              <div class="chip"><strong>Lifetime Value</strong> ${fmtBDT.format(c.lifetimeValue)}</div>
            </div>
            <div class="divider"></div>
            <div class="helper">CRM features (loyalty points, campaigns) are future scope in SRS; here we show basic profile + history.</div>
          </div>
        </div>
        <div class="card">
          <div class="card__head">
            <div class="card__title">
              <h2>Booking history</h2>
              <p>${bookings.length} bookings</p>
            </div>
          </div>
          <div class="card__body">
            ${bookings.length ? `
              <div class="tableWrap">
                <table style="min-width:540px">
                  <thead>
                    <tr><th>Booking</th><th>Type</th><th>Status</th><th>Amount</th></tr>
                  </thead>
                  <tbody>
                    ${bookings.map((b) => `
                      <tr>
                        <td><span class="pill">${escapeHtml(b.id)}</span></td>
                        <td>${escapeHtml(b.type)}</td>
                        <td>${escapeHtml(b.status)}</td>
                        <td>${fmtBDT.format(b.amount)}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            ` : `<div class="empty">No bookings yet.</div>`}
          </div>
        </div>
      </div>
    `;
    openModal({ title: `Customer ${c.id}`, bodyHtml: body });
  };

  const replyInquiry = (inqId) => {
    const inq = state.db.inquiries.find((i) => i.id === inqId);
    if (!inq) return;
    const body = `
      <form class="form" id="replyForm">
        <div class="callout">
          <div><strong>${escapeHtml(inq.topic)}</strong></div>
          <div class="mini">${escapeHtml(inq.name)} • ${escapeHtml(inq.phone)} • ${escapeHtml(inq.channel)}</div>
        </div>
        <div class="field">
          <label>Reply note</label>
          <textarea name="note" required placeholder="Write your reply / follow-up plan…"></textarea>
        </div>
        <div class="formRow">
          <div class="field">
            <label>Update status</label>
            <select class="input" name="status">
              <option>open</option>
              <option selected>pending_reply</option>
              <option>closed</option>
            </select>
          </div>
          <div class="field">
            <label>Send SMS?</label>
            <select class="input" name="sms">
              <option selected>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
        <button class="btn btn--primary" type="submit">${ICONS.bolt} Save reply</button>
      </form>
    `;
    const m = openModal({ title: `Reply to ${inq.id}`, bodyHtml: body });
    const form = el("#replyForm");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      inq.status = String(fd.get("status"));
      upsertAudit({ actor: state.session.user?.name || "Staff", action: "Replied to inquiry", target: inq.id });
      if (String(fd.get("sms")) === "Yes") {
        state.db.smsLogs.unshift({ id: uid("SMS"), to: inq.phone, template: "Inquiry Update", status: "sent", at: nowISO() });
      }
      save();
      toast("Inquiry updated", `${inq.id} → ${inq.status}`);
      m.close();
      render();
    });
  };

  const moveInquiry = (inqId) => {
    const inq = state.db.inquiries.find((i) => i.id === inqId);
    if (!inq) return;
    const body = `
      <form class="form" id="moveForm">
        <div class="helper">Move this inquiry to a new stage.</div>
        <div class="field">
          <label>Status</label>
          <select class="input" name="status">
            <option ${inq.status === "open" ? "selected" : ""}>open</option>
            <option ${inq.status === "pending_reply" ? "selected" : ""}>pending_reply</option>
            <option ${inq.status === "closed" ? "selected" : ""}>closed</option>
          </select>
        </div>
        <button class="btn btn--primary" type="submit">${ICONS.bolt} Move</button>
      </form>
    `;
    const m = openModal({ title: `Move ${inq.id}`, bodyHtml: body });
    const form = el("#moveForm");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      inq.status = String(fd.get("status"));
      upsertAudit({ actor: state.session.user?.name || "Staff", action: "Moved inquiry", target: inq.id });
      save();
      toast("Moved", `${inq.id} → ${inq.status}`);
      m.close();
      render();
    });
  };

  const exportBookings = () => exportCsv(state.db.bookings, "bookings.csv");
  const exportInvoices = () => exportCsv(state.db.invoices, "invoices.csv");
  const exportCustomers = () => exportCsv(state.db.customers, "customers.csv");
  const exportLogs = () => exportCsv(state.db.auditLogs, "audit_logs.csv");

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  };

  const wireShellEvents = () => {
    // Avoid accumulating global handlers across re-renders.
    if (!wireShellEvents._delegatesWired) {
      wireShellEvents._delegatesWired = true;
      document.addEventListener("click", (e) => {
        const a = e.target.closest("[data-approve]");
        if (a) approveBooking(a.getAttribute("data-approve"));
        const r = e.target.closest("[data-reject]");
        if (r) rejectBooking(r.getAttribute("data-reject"));
        const inv = e.target.closest("[data-view-inv]");
        if (inv) viewInvoice(inv.getAttribute("data-view-inv"));
        const tab = e.target.closest("[data-tab]");
        if (tab) setRoute("bookings", { tab: tab.getAttribute("data-tab") });
        const editPkg = e.target.closest("[data-edit-pkg]");
        if (editPkg) openCreatePackage(editPkg.getAttribute("data-edit-pkg"));
        const createFromPkg = e.target.closest("[data-create-booking-from]");
        if (createFromPkg) {
          const pkgId = createFromPkg.getAttribute("data-create-booking-from");
          const pkg = packageById(pkgId);
          openCreateBooking({ type: "Tour", refId: pkgId, pax: 2, amount: pkg ? pkg.basePrice * 2 : 12000 });
        }
        const hBook = e.target.closest("[data-create-hotel-booking]");
        if (hBook) openCreateBooking({ type: "Hotel", refId: hBook.getAttribute("data-create-hotel-booking"), pax: 2, amount: 14000 });
        const cBook = e.target.closest("[data-create-car-booking]");
        if (cBook) openCreateBooking({ type: "Car", refId: cBook.getAttribute("data-create-car-booking"), pax: 1, amount: 5000 });
        const viewCust = e.target.closest("[data-view-customer]");
        if (viewCust) viewCustomer(viewCust.getAttribute("data-view-customer"));
        const reply = e.target.closest("[data-reply-inq]");
        if (reply) replyInquiry(reply.getAttribute("data-reply-inq"));
        const move = e.target.closest("[data-move-inq]");
        if (move) moveInquiry(move.getAttribute("data-move-inq"));
        const editUser = e.target.closest("[data-edit-user]");
        if (editUser) openAddUser(editUser.getAttribute("data-edit-user"));
        const toggleUser = e.target.closest("[data-toggle-user]");
        if (toggleUser) toggleUserStatus(toggleUser.getAttribute("data-toggle-user"));
        const userTab = e.target.closest("[data-users-tab]");
        if (userTab) setRoute("users", { tab: userTab.getAttribute("data-users-tab") });
      });
    }

    el("#btnSignOut")?.addEventListener("click", logout);
    el("#btnQuickCreate")?.addEventListener("click", openQuickCreate);
    el("#btnHamburger")?.addEventListener("click", () => {
      state.session.sidebarOpen = !state.session.sidebarOpen;
      save();
      render();
    });

    els("[data-action]").forEach((b) =>
      b.addEventListener("click", () => {
        const act = b.getAttribute("data-action");
        if (act === "createBooking") openCreateBooking();
        if (act === "createPackage") openCreatePackage();
        if (act === "addCustomer") openCreateCustomer();
        if (act === "sendSms") openSendSms();
        if (act === "addLedger") openAddLedger();
        if (act === "addUser") openAddUser();
        if (act === "generateReport") toast("Report generated", "Use exports in each module or view summaries in Reports.");
        if (act === "exportBookings") exportBookings();
        if (act === "exportInvoices") exportInvoices();
        if (act === "exportCustomers") exportCustomers();
        if (act === "exportLogs") exportLogs();
      }),
    );

    el("#btnNotifications")?.addEventListener("click", () => {
      openModal({
        title: "Notifications",
        bodyHtml: `
          <div class="chipRow">
            <div class="chip"><strong>Pending bookings</strong> ${pendingBookingsCount()}</div>
            <div class="chip"><strong>Open inquiries</strong> ${openInquiriesCount()}</div>
          </div>
          <div class="divider"></div>
          <div class="mini">In a real system this would be real-time (WebSocket) + persisted.</div>
        `,
      });
    });

    el("#btnUserMenu")?.addEventListener("click", () => {
      const current = state.session.user?.role || "admin";
      const options = ROLES.filter((r) => r.id !== "customer")
        .map((r) => `<option value="${r.id}" ${r.id === current ? "selected" : ""}>${escapeHtml(r.label)}</option>`)
        .join("");
      const m = openModal({
        title: "User",
        bodyHtml: `
          <div class="form">
            <div class="field">
              <label>Switch role</label>
              <select class="input" id="roleSwitch">${options}</select>
            </div>
            <button class="btn" id="btnDoLogout">Sign out</button>
            <div class="mini">Role permissions are approximated using the SRS roles/permissions table.</div>
          </div>
        `,
      });
      el("#roleSwitch")?.addEventListener("change", (e) => {
        state.session.user.role = e.target.value;
        save();
        toast("Role switched", `Now viewing as ${roleLabel(state.session.user.role)}.`);
        m.close();
        setRoute("dashboard");
      });
      el("#btnDoLogout")?.addEventListener("click", () => {
        m.close();
        logout();
      });
    });

    el("#btnTheme")?.addEventListener("click", () => {
      toast("Theme", "Theme options can be configured by your administrator.");
    });

    el("#globalSearch")?.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const q = String(e.target.value || "").trim().toLowerCase();
      if (!q) return;
      const b = state.db.bookings.find((x) => x.id.toLowerCase().includes(q) || x.refId.toLowerCase().includes(q));
      const inv = state.db.invoices.find((x) => x.id.toLowerCase().includes(q) || x.bookingId.toLowerCase().includes(q));
      const c = state.db.customers.find((x) => x.name.toLowerCase().includes(q) || x.phone.toLowerCase().includes(q));
      if (inv) {
        viewInvoice(inv.id);
        return;
      }
      if (b) {
        toast("Found booking", b.id);
        setRoute("bookings");
        return;
      }
      if (c) {
        viewCustomer(c.id);
        return;
      }
      toast("No results", "Try an invoice (INV-…), booking (BKG-…), or customer name.");
    });
  };

  wireShellEvents._delegatesWired = false;

  const wireLoginEvents = () => {
    el("#loginForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      login({
        email: String(fd.get("email")),
        password: String(fd.get("password")),
        role: String(fd.get("role") || "admin"),
      });
    });
    el("#btnCopyPortal")?.addEventListener("click", async () => {
      const url = state.session.agency.portalUrl;
      try {
        await navigator.clipboard.writeText(url);
        toast("Copied", "Login portal link copied to clipboard.");
      } catch {
        toast("Copy failed", url);
      }
    });
  };

  const wireSettingsEvents = () => {
    el("#settingsAgency")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      state.session.agency.name = String(fd.get("name") || state.session.agency.name);
      const vat = Number(fd.get("vatRate"));
      state.session.agency.vatRate = Number.isFinite(vat) ? Math.min(0.3, Math.max(0, vat)) : state.session.agency.vatRate;
      upsertAudit({ actor: state.session.user?.name || "Admin", action: "Updated settings", target: "Agency Settings" });
      save();
      toast("Saved", "Settings updated.");
      render();
    });
  };

  const renderMain = (route) => {
    const page = route.page;
    if (page === "login") return renderLogin();
    if (!guard(page)) return "";

    const shell = renderShell({ page });
    const view = (() => {
      if (page === "dashboard") return renderDashboard();
      if (page === "bookings") return renderBookings({ params: route.params });
      if (page === "packages") return renderPackages();
      if (page === "hotels") return renderHotels();
      if (page === "cars") return renderCars();
      if (page === "customers") return renderCustomers();
      if (page === "payments") return renderPayments();
      if (page === "accounting") return renderAccounting();
      if (page === "reports") return renderReports();
      if (page === "vendors") return renderVendors();
      if (page === "inquiries") return renderInquiries();
      if (page === "sms") return renderSms();
      if (page === "logs") return renderLogs();
      if (page === "users") return renderUsers({ params: route.params });
      if (page === "settings") return renderSettings();
      return renderNotFound();
    })();

    return { shell, view, page };
  };

  const render = () => {
    state.session.route = parseRoute();
    const route = state.session.route;
    const app = el("#app");
    app.dataset.appLoading = "false";

    const r = renderMain(route);
    if (typeof r === "string") {
      app.innerHTML = r;
      wireLoginEvents();
      return;
    }
    app.innerHTML = r.shell;
    const main = el("#main");
    if (main) main.innerHTML = r.view;
    wireShellEvents();
    if (r.page === "settings") wireSettingsEvents();

    // Close sidebar on route change (mobile).
    if (state.session.sidebarOpen && window.innerWidth <= 880) {
      state.session.sidebarOpen = false;
      save();
      const shell = el(".shell");
      if (shell) shell.dataset.sidebarOpen = "false";
    }
  };

  window.addEventListener("hashchange", render);

  // Boot
  if (!location.hash) location.hash = "#/login";
  render();
})();
