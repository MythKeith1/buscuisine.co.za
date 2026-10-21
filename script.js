/* =========================================
   BUSCUISINE — INTERACTIVE FEATURES
   Vanilla JavaScript
   No booking API or external dependencies
========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------------------
     1. MOBILE NAVIGATION
  ----------------------------------------- */

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");

  function closeNav() {
    if (!menuToggle || !nav) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
  }

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute(
        "aria-expanded",
        String(!isOpen)
      );

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation" : "Close navigation"
      );

      nav.classList.toggle("is-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    document.addEventListener("click", event => {
      if (
        nav.classList.contains("is-open") &&
        !nav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeNav();
      }
    });
  }


  /* -----------------------------------------
     2. INTERACTIVE MENU CATEGORIES
  ----------------------------------------- */

  const menuData = {
    breakfast: {
      title: "A slower kind of morning",
      description:
        "A considered morning menu inspired by fresh seasonal produce and the pleasure of taking your time.",
      image:
        "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=82",
      alt:
        "Breakfast spread used as illustrative concept imagery.",
      items: [
        ["Seasonal opening course", "Sample concept"],
        ["Freshly prepared main", "Sample concept"],
        ["Something sweet to finish", "Sample concept"]
      ]
    },

    lunch: {
      title: "A fresh view at midday",
      description:
        "An illustrative lunch direction balancing vibrant ingredients, considered presentation and a relaxed pace.",
      image:
        "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=82",
      alt:
        "Fresh lunch dish used as illustrative concept imagery.",
      items: [
        ["A seasonal starter", "Sample concept"],
        ["A produce-led main", "Sample concept"],
        ["A light finish", "Sample concept"]
      ]
    },

    dinner: {
      title: "An evening to remember",
      description:
        "A sample multi-course dinner narrative designed to complement the atmosphere of a scenic evening journey.",
      image:
        "https://images.unsplash.com/photo-1515003197210-e0cd7184f8b5?auto=format&fit=crop&w=1200&q=82",
      alt:
        "Elegant dinner setting used as illustrative concept imagery.",
      items: [
        ["First course", "Sample concept"],
        ["Main course", "Sample concept"],
        ["Dessert course", "Sample concept"]
      ]
    }
  };

  const menuTabs = [
    ...document.querySelectorAll("[data-menu]")
  ];

  const menuPanel = document.querySelector("#menu-panel");
  const menuImage = document.querySelector("#menu-image");

  function setMenu(category, moveFocus = false) {
    const data = menuData[category];

    if (!data || !menuPanel) return;

    menuTabs.forEach(tab => {
      const selected = tab.dataset.menu === category;

      tab.setAttribute(
        "aria-selected",
        String(selected)
      );

      tab.tabIndex = selected ? 0 : -1;

      if (selected && moveFocus) {
        tab.focus();
      }
    });

    const activeTab = menuTabs.find(
      tab => tab.dataset.menu === category
    );

    if (activeTab) {
      menuPanel.setAttribute(
        "aria-labelledby",
        activeTab.id
      );
    }

    document.querySelector("#menu-title").textContent =
      data.title;

    document.querySelector("#menu-description").textContent =
      data.description;

    const list = document.querySelector("#menu-items");

    list.replaceChildren(
      ...data.items.map(([name, label]) => {
        const item = document.createElement("li");
        const nameElement = document.createElement("span");
        const labelElement = document.createElement("small");

        nameElement.textContent = name;
        labelElement.textContent = label;

        item.append(nameElement, labelElement);

        return item;
      })
    );

    menuImage.src = data.image;
    menuImage.alt = data.alt;
  }

  menuTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      setMenu(tab.dataset.menu);
    });

    tab.addEventListener("keydown", event => {
      if (
        ![
          "ArrowLeft",
          "ArrowRight",
          "Home",
          "End"
        ].includes(event.key)
      ) {
        return;
      }

      event.preventDefault();

      let nextIndex = index;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % menuTabs.length;
      }

      if (event.key === "ArrowLeft") {
        nextIndex =
          (index - 1 + menuTabs.length) % menuTabs.length;
      }

      if (event.key === "Home") {
        nextIndex = 0;
      }

      if (event.key === "End") {
        nextIndex = menuTabs.length - 1;
      }

      setMenu(
        menuTabs[nextIndex].dataset.menu,
        true
      );
    });
  });


  /* -----------------------------------------
     3. JOURNEY DETAILS DIALOG
  ----------------------------------------- */

  const journeyContent = {
    protea: {
      title: "Protea",
      copy:
        "Protea is a fleet name associated with the public BusCuisine reference website. Current operating status, routes, schedules and menus must be verified directly with the operator."
    },

    fynbos: {
      title: "Fynbos",
      copy:
        "Fynbos is one of the fleet names displayed on the public reference website. This concept does not assume that the service is currently operating or accepting reservations."
    },

    disa: {
      title: "Disa",
      copy:
        "Disa is another fleet name displayed on the public reference website. Check the official website for current operating status, routes and any available experiences."
    }
  };

  const journeyDialog =
    document.querySelector("#journey-dialog");

  const journeyDialogTitle =
    document.querySelector("#journey-dialog-title");

  const journeyDialogCopy =
    document.querySelector("#journey-dialog-copy");

  const journeyClose =
    journeyDialog.querySelector(".dialog-close");

  let lastJourneyTrigger = null;

  document.querySelectorAll(".journey-details").forEach(button => {
    button.addEventListener("click", () => {
      const journey = journeyContent[button.dataset.journey];

      if (!journey) return;

      lastJourneyTrigger = button;

      journeyDialogTitle.textContent = journey.title;
      journeyDialogCopy.textContent = journey.copy;

      if (typeof journeyDialog.showModal === "function") {
        journeyDialog.showModal();
      } else {
        window.alert(
          journey.title + "\n\n" + journey.copy
        );
      }
    });
  });

  journeyClose.addEventListener("click", () => {
    journeyDialog.close();
  });

  journeyDialog.addEventListener("close", () => {
    lastJourneyTrigger?.focus();
  });

  journeyDialog.addEventListener("click", event => {
    if (event.target === journeyDialog) {
      journeyDialog.close();
    }
  });


  /* -----------------------------------------
     4. ACCESSIBLE GALLERY LIGHTBOX
  ----------------------------------------- */

  const galleryItems = [
    ...document.querySelectorAll(".gallery-item")
  ];

  const galleryImages = galleryItems.map(item => {
    const image = item.querySelector("img");

    return {
      src: image.src,
      full:
        item.dataset.full ||
        image.src.replace(/w=\d+/, "w=1800"),
      alt: image.alt,
      caption:
        item.querySelector("span")?.textContent || ""
    };
  });

  const lightbox = document.querySelector("#lightbox");
  const lightboxImage =
    document.querySelector("#lightbox-image");

  const lightboxCaption =
    document.querySelector("#lightbox-caption");

  const lightboxClose =
    lightbox.querySelector(".lightbox-close");

  const lightboxPrev =
    lightbox.querySelector(".lightbox-prev");

  const lightboxNext =
    lightbox.querySelector(".lightbox-next");

  let galleryIndex = 0;
  let lastGalleryTrigger = null;

  function showGalleryImage(index) {
    galleryIndex =
      (index + galleryImages.length) % galleryImages.length;

    const image = galleryImages[galleryIndex];

    lightboxImage.src = image.full;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = image.caption;
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      lastGalleryTrigger = item;

      showGalleryImage(index);

      if (typeof lightbox.showModal === "function") {
        lightbox.showModal();
      } else {
        window.open(
          galleryImages[index].full,
          "_blank",
          "noopener,noreferrer"
        );
      }
    });
  });

  lightboxClose.addEventListener("click", () => {
    lightbox.close();
  });

  lightboxPrev.addEventListener("click", () => {
    showGalleryImage(galleryIndex - 1);
  });

  lightboxNext.addEventListener("click", () => {
    showGalleryImage(galleryIndex + 1);
  });

  lightbox.addEventListener("close", () => {
    lastGalleryTrigger?.focus();
  });

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });

  lightbox.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
      showGalleryImage(galleryIndex - 1);
    }

    if (event.key === "ArrowRight") {
      showGalleryImage(galleryIndex + 1);
    }
  });


  /* -----------------------------------------
     5. RESERVATION PLANNER PROTOTYPE
  ----------------------------------------- */

  const planForm = document.querySelector("#plan-form");
  const formMessage = document.querySelector("#form-message");
  const dateInput = document.querySelector("#preferred-date");

  // Prevent selection of dates before today.
  if (dateInput) {
    const today = new Date();

    const formattedToday = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.min = formattedToday;
  }

  planForm.addEventListener("submit", event => {
    event.preventDefault();

    const experience =
      document.querySelector("#experience-type").value;

    if (!experience) {
      formMessage.textContent =
        "Please choose an experience to continue.";

      document.querySelector("#experience-type").focus();

      return;
    }

    const date = dateInput.value;

    const party =
      document.querySelector("#party-size").value;

    const seating =
      document.querySelector("#seating").value;

    let dateText = "Date not selected";

    if (date) {
      // Use midday to avoid timezone date shifts.
      dateText = new Date(date + "T12:00:00")
        .toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric"
        });
    }

    formMessage.textContent =
      "Prototype plan only: " +
      experience + "; " +
      dateText + "; " +
      party + " guest(s); seating: " +
      seating +
      ". Nothing has been booked or sent. " +
      "Continue to the official website to verify " +
      "details and availability.";
  });


  /* -----------------------------------------
     6. DYNAMIC COPYRIGHT YEAR
  ----------------------------------------- */

  document.querySelector("#year").textContent =
    new Date().getFullYear();


  /* -----------------------------------------
     7. SCROLL-TRIGGERED REVEALS
  ----------------------------------------- */

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const revealItems =
    document.querySelectorAll(".reveal");

  if (
    "IntersectionObserver" in window &&
    !reduceMotion
  ) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    revealItems.forEach(item => {
      observer.observe(item);
    });
  } else {
    // Reveal content immediately if motion is reduced
    // or IntersectionObserver is unavailable.
    revealItems.forEach(item => {
      item.classList.add("is-visible");
    });
  }

});
