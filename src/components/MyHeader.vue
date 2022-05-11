<template>
  <header class="header" ref="header">
    <div class="header__container">
      <div class="burger">
        <div class="burger__container">
          <span class="burger__line"></span>
          <span class="burger__line"></span>
          <span class="burger__line"></span>
        </div>
      </div>
      <ul class="header__menu">
        <li class="header__link __selected">
          <a class="header__link-button" href="#about-block">Обо мне</a>
        </li>
        <li class="header__link">
          <a class="header__link-button" href="#tools-block">Мои инструменты</a>
        </li>
        <li class="header__link">
          <a class="header__link-button" href="#works-block">Мои работы</a>
        </li>
        <li class="header__link">
          <a class="header__link-button" href="#features-block"
            >Демонстрация навыков</a
          >
        </li>
      </ul>
      <div class="theme-change">
        <span class="theme-change__button __icon-sun"></span>
        <span class="theme-change__delimiter">/</span>
        <span class="theme-change__button __icon-moon"></span>
      </div>
    </div>
  </header>
</template>

<script>
import { Storage, getCoords } from "@/assets/js/scripts.js";

export default {
  name: "my-header",
  data() {
    return {
      header: "",
    };
  },
  methods: {
    initHeaderMethods() {
      this.header = this.$refs.header;
      this.fix();
      this.padding();
      this.initTogglingMenu();
      this.changeTheme();
      this.initNavButtons();
    },
    fix() {
      let header = this.header;
      onScroll();
      window.addEventListener("scroll", onScroll);

      function onScroll() {
        let headerHeight = header.offsetHeight;
        window.pageYOffset > headerHeight
          ? header.classList.add("__fixed")
          : header.classList.remove("__fixed");
      }
    },
    padding() {
      let header = this.header;
      let firstSection = document.querySelector(".page-block");
      let headerHeight = header.offsetHeight;
      let paddingValue = headerHeight + 40;
      firstSection.style.paddingTop = `${paddingValue}px`;
    },
    initTogglingMenu() {
      let header = this.header;
      const toggleHandler = this.toggleMenu.bind(this);
      const burger = header.querySelector(".burger");
      burger.addEventListener("click", toggleHandler);
    },
    toggleMenu(action = null) {
      let header = this.header;
      let burger = header.querySelector(".burger");
      let menu = header.querySelector(".header__menu");

      if (!action || typeof (action === "object"))
        burger.classList.contains("__active") ? close() : open();
      if (action === "open") open();
      if (action === "close") close();

      function open() {
        burger.classList.add("__active");
        menu.classList.add("__active");
      }
      function close() {
        burger.classList.remove("__active");
        menu.classList.remove("__active");
      }
    },
    changeTheme() {
      const setTheme = (type) => {
        let lightButton = document.querySelectorAll(
          ".theme-change__button.__icon-sun"
        );
        let darkButton = document.querySelectorAll(
          ".theme-change__button.__icon-moon"
        );

        if (type == "light") {
          lightButton.forEach((btn) => {
            btn.classList.add("__selected");
          });
          darkButton.forEach((btn) => {
            btn.classList.remove("__selected");
          });
          body.classList.remove("__dark-theme");
          storage.setItem(storageKey, "light");
        }
        if (type == "dark") {
          darkButton.forEach((btn) => {
            btn.classList.add("__selected");
          });
          lightButton.forEach((btn) => {
            btn.classList.remove("__selected");
          });
          body.classList.add("__dark-theme");
          storage.setItem(storageKey, "dark");
        }

        this.changeThemeImages();
      };

      // проверка на наличие значения в localstorage
      let storage = new Storage();
      let storageKey = "an_portfolio_theme";
      let isTheme = storage.getItem(storageKey);
      if (!isTheme) {
        isTheme = "light";
        storage.setItem(storageKey, isTheme);
      }
      // выставить тему
      let controls = document.querySelectorAll(".theme-change");
      let body = document.querySelector("body");
      setTheme(isTheme);

      controls.forEach((ctrl) => {
        ctrl.addEventListener("click", onClick);

        function onClick(event) {
          if (event.target.classList.contains("__icon-sun")) setTheme("light");
          if (event.target.classList.contains("__icon-moon")) setTheme("dark");
        }
      });
    },
    changeThemeImages() {
      let images = document.querySelectorAll("[data-theme-image]");
      let body = document.querySelector("body");
      if (images.length > 0) {
        images.forEach((img) => {
          let sourceImg = img.parentNode.querySelector("source");
          let imgData = img.dataset.themeImage.split(".");
          let path = imgData[0];
          let extension = imgData[1];

          // темная тема
          if (body.classList.contains("__dark-theme")) {
            img.src = `${path}--dark.${extension}`;
            if (sourceImg) sourceImg.srcset = img.src;
          }
          // светлая тема
          else {
            img.src = img.dataset.themeImage;
            if (sourceImg) sourceImg.srcset = img.src;
          }
        });
      }
    },
    // все навигационные кнопки на сайте, не только в шапке
    initNavButtons(node = document) {
      const clickableButtons = node.querySelectorAll('[href*="#"]');
      clickableButtons.forEach((btn) => {
        btn.addEventListener("click", this.navBtnOnClick.bind(this));
      });

      if (node === document) {
        const navButtons = this.header.querySelectorAll(".header__link-button");
        let currentBlock;
        onScroll();
        window.addEventListener("scroll", onScroll);

        function onScroll() {
          navButtons.forEach((btn) => {
            const id = btn.getAttribute("href");
            const block = document.querySelector(id);
            if (currentBlock !== block) {
              const blockPosY = getCoords(block).top;
              if (
                window.pageYOffset >= blockPosY - 100 &&
                window.pageYOffset < block.offsetHeight + (blockPosY - 100)
              ) {
                inActiveAll();
                active(btn);
                currentBlock = block;
              }
            }
          });
        }
        function inActiveAll() {
          navButtons.forEach((navButton) => {
            navButton.closest(".header__link").classList.remove("__selected");
          });
        }
        function active(btn) {
          btn.closest(".header__link").classList.add("__selected");
        }
      }
    },
    navBtnOnClick(event) {
      event.preventDefault();
      const btn = event.target;
      const id = btn.getAttribute("href");
      const block = document.querySelector(id);
      block.scrollIntoView({ behavior: "smooth" });
      this.toggleMenu("close");
    },
  },
  mounted() {
    this.initHeaderMethods();
  },
};
</script>