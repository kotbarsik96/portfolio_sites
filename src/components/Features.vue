<template>
  <section id="features-block" class="page-block features-block">
    <div class="container">
      <scroll-anim :animType="'typeWriter'">
        <h2 class="page-block__title">Что именно я умею?</h2>
      </scroll-anim>
      <div class="page-block__text-block text-block">
        <p class="text-block__paragraph">
          В этом разделе я собрал динамический контент, реализованный с помощью
          JavaScript.
        </p>
        <p class="text-block__paragraph">
          Клик на название позволит просмотреть пример в оригинальном виде на
          сайте!
        </p>
      </div>
      <div class="features-block__body">
        <div class="features-block__book-pages">
          Страницы {{ currentPages }} из {{ pagesTotal }}
        </div>
        <swiper
          :modules="modules"
          :effect="'flip'"
          class="features-book"
          v-if="!isSinglePage"
          @swiper="setCurrentPages"
          @slideChange="onSlideChange"
          @touchStart="onTouchStart"
        >
          <swiper-slide
            class="features-book__slide"
            v-for="slide in twoPagesArray.video"
            :key="slide[0].id"
          >
            <two-pages
              @createModalWindow="createModalWindow"
              :slide="slide"
              :presentsBy="'video'"
              :srcType="srcType"
              ref="twoPagesVContainer"
            ></two-pages>
          </swiper-slide>
          <swiper-slide
            class="features-book__slide"
            v-for="slide in twoPagesArray.img"
            :key="slide[0].id"
          >
            <two-pages
              @createModalWindow="createModalWindow"
              :slide="slide"
              :presentsBy="'img'"
              :srcType="srcType"
            ></two-pages>
          </swiper-slide>
        </swiper>
        <swiper
          :modules="modules"
          :effect="'flip'"
          class="features-book"
          v-if="isSinglePage"
          @swiper="setCurrentPages"
          @slideChange="onSlideChange"
          @touchStart="onTouchStart"
        >
          <swiper-slide
            class="features-book__slide"
            v-for="page in singlePageArray.video"
            :key="page.id"
          >
            <single-page
              @createModalWindow="createModalWindow"
              :page="page"
              :presentsBy="'video'"
              :srcType="srcType"
              ref="singlePageVContainer"
            ></single-page>
          </swiper-slide>
          <swiper-slide
            class="features-book__slide"
            v-for="page in singlePageArray.img"
            :key="page.id"
          >
            <single-page
              @createModalWindow="createModalWindow"
              :page="page"
              :presentsBy="'img'"
              :srcType="srcType"
            ></single-page>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { capitalLetter } from "@/assets/js/scripts";
import TwoPages from "@/components/BookSlider/TwoPages";
import SinglePage from "@/components/BookSlider/SinglePage";
import { Swiper, SwiperSlide } from "swiper/vue";
import { EffectFlip } from "swiper";
import "swiper/css/bundle";

export default {
  name: "features-block",
  components: {
    TwoPages,
    SinglePage,
    Swiper,
    SwiperSlide,
  },
  setup() {
    const onTouchStart = (swiper, event) => {
      event.target.className.includes("page-title") ||
      event.target.closest(".image-container") ||
      event.target.closest(".video-container")
        ? (swiper.allowTouchMove = false)
        : (swiper.allowTouchMove = true);
    };

    return {
      modules: [EffectFlip],
      onTouchStart,
    };
  },
  // [!ВАЖНО!], чтобы переменная isSinglePage работала корректно, нужно совпадение переменной singlePageMedia с media-запросом в стилях, при котором одна страница книги занимает весь экран
  data() {
    return {
      singlePageMedia: 749,
      isSinglePage: false,
      currentPages: "",
      srcType: "src" || "src-vertical",
    };
  },
  methods: {
    ...mapMutations["addModalBodyContent"],
    changeMediaHandler() {
      const query = window.matchMedia(`(max-width: ${this.singlePageMedia}px)`);
      const onChange = () => {
        query.matches
          ? (this.isSinglePage = true)
          : (this.isSinglePage = false);
      };

      onChange();
      query.addEventListener("change", onChange);
    },
    setCurrentPages(swiper) {
      const index = swiper.activeIndex;
      const activeSlide = swiper.slides[index];
      const pageElems = Array.from(
        activeSlide.querySelectorAll("[data-page-number]")
      );
      if (pageElems.length === 1)
        this.currentPages = pageElems[0].dataset.pageNumber.toString();
      if (pageElems.length === 2) {
        const num_1 = pageElems[0].dataset.pageNumber.toString();
        const num_2 = pageElems[1].dataset.pageNumber.toString();
        this.currentPages = `${num_1}-${num_2}`;
      }
    },
    setSrcType() {
      const onResize = () => {
        const w = document.documentElement.clientWidth || window.innerWidth;
        const h = document.documentElement.clientHeight || window.innerHeight;
        if (w > h && this.srcType !== "src") this.srcType = "src";
        if (w < h && this.srcType !== "src-vertical")
          this.srcType = "src-vertical";
      };

      onResize();
      window.addEventListener("resize", onResize);
    },
    createModalWindow(ftr) {
      console.log(ftr);
      const ftrTitle = `<span class="__selected">${capitalLetter(
        ftr.title
      )}</span>`;

      const bodyContent =
        ftr.examples.length < 2 ? createParagraph() : createList();
      this.$store.commit("addModalBodyContent", bodyContent);

      function createParagraph() {
        const wTitle = `${ftrTitle} можно посмотреть на следующем сайте:`;
        const item = ftr.examples[0];
        const paragraph = `<a href="${item.url}">${item.text}</a>`;
        const content = {
          bodyType: "text",
          title: wTitle,
          paragraph,
        };
        return content;
      }
      function createList() {
        const wTitle = `${ftrTitle} можно посмотреть на следующих сайтах:`;
        const links = [];
        ftr.examples.forEach((item) =>
          links.push(`<a href="${item.url}">${item.text}</a>`)
        );
        const content = {
          bodyType: "text",
          title: wTitle,
          ol: links,
        };
        return content;
      }
    },
    pauseVideos() {
      const singlePageArray = this.$refs.singlePageVContainer;
      const twoPagesArray = this.$refs.twoPagesVContainer;

      if (singlePageArray) {
        singlePageArray.forEach((component) => {
          const video = component.vContainer;
          video.pause();
        });
      }
      if (twoPagesArray) {
        twoPagesArray.forEach((component) => {
          const containers = component.vContainerList;
          containers.forEach((video) => video.pause());
        });
      }
    },
    onSlideChange(swiper) {
      this.setCurrentPages(swiper);
      this.pauseVideos();
    },
  },
  computed: {
    ...mapGetters(["pagesTotal", "twoPagesArray", "singlePageArray"]),
  },
  mounted() {
    this.changeMediaHandler();
    this.setSrcType();
  },
};
</script>

<style>
</style>