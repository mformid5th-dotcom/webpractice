document.addEventListener("DOMContentLoaded", () => {
    const topbar = document.querySelector(".topbar");
    const navItems = Array.from(document.querySelectorAll(".nav-menu a[data-target]"));
    const mainNavMenu = document.getElementById("mainNavMenu");
    const getStartedBtn = document.querySelector(".grad-btn");

    const uniqueSectionIds = [...new Set(navItems.map((item) => item.dataset.target).filter(Boolean))];
    const sections = uniqueSectionIds
        .map((id) => document.getElementById(id))
        .filter((section) => section !== null);

    const sectionToNavItem = new Map();
    navItems.forEach((item) => {
        const targetId = item.dataset.target;
        if (targetId && !sectionToNavItem.has(targetId)) {
            sectionToNavItem.set(targetId, item);
        }
    });

    function getTopbarHeight() {
        return topbar ? topbar.offsetHeight : 0;
    }

    function setActiveNav(targetId) {
        navItems.forEach((item) => {
            item.classList.toggle("is-active", item.dataset.target === targetId);
        });
    }

    function closeMobileMenu() {
        if (window.innerWidth >= 768 || !mainNavMenu || !mainNavMenu.classList.contains("show")) {
            return;
        }

        if (window.bootstrap && window.bootstrap.Collapse) {
            const collapse = window.bootstrap.Collapse.getOrCreateInstance(mainNavMenu, { toggle: false });
            collapse.hide();
        }
    }

    function scrollToTarget(targetId) {
        const section = document.getElementById(targetId);
        if (!section) {
            return;
        }

        const offset = getTopbarHeight() + 8;
        const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
            top: Math.max(0, top),
            behavior: "smooth"
        });
    }

    navItems.forEach((item) => {
        const triggerScroll = () => {
            const targetId = item.dataset.target;
            if (!targetId) {
                return;
            }

            setActiveNav(targetId);
            scrollToTarget(targetId);
            closeMobileMenu();
        };

        item.addEventListener("click", (event) => {
            event.preventDefault();
            triggerScroll();
        });
    });

    if (sections.length && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        if (sectionToNavItem.has(id)) {
                            setActiveNav(id);
                        }
                    }
                });
            },
            {
                root: null,
                rootMargin: `-${getTopbarHeight() + 20}px 0px -55% 0px`,
                threshold: 0.15
            }
        );

        sections.forEach((section) => observer.observe(section));
    }

    if (getStartedBtn) {
        const updateButtonLabel = () => {
            getStartedBtn.textContent = window.scrollY > 420 ? "Back to top" : "Get Started";
        };

        getStartedBtn.addEventListener("click", () => {
            if (window.scrollY > 420) {
                window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
                scrollToTarget("aboutSection");
            }
        });

        window.addEventListener("scroll", updateButtonLabel, { passive: true });
        updateButtonLabel();
    }

});
