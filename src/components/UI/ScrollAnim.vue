<template>
  <slot></slot>
</template>

<script>
import { getCoords } from "@/assets/js/scripts";

export default {
  // !ВАЖНО, чтобы в slot был только один корневой блок, иначе анимация выполнится только для первого блока!
  name: "scroll-anim",
  props: {
    //   тип анимации
    animType: {
      type: String,
      // указать название функции из methods
      default: "translate" || "typeWriter" || "...",
    },
    // нужно ли отменять анимацию после ухода элемента с экрана
    repeatAnim: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: Number,
      default: 500,
    },
    speed: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      isVisible: false,
      status: "no_animated" || "animating" || "animated",
      slotNode: null,
      slotNodeTextContent: null,
      animPoint: 0,
    };
  },
  methods: {
    setAnimPoint() {
      this.animPoint =
        document.documentElement.clientHeight -
        document.documentElement.clientHeight / 4;
    },
    getSlotNode() {
      const slots = this.$slots.default;
      if (slots) {
        const slotEl = slots()[0].el;
        if (slotEl) {
          this.slotNode = slotEl;
          this.slotNodeTextContent = slotEl.textContent;
        }
      }
    },
    scrollHandler() {
      const scroll = window.pageYOffset;
      const node = this.slotNode;
      const nodeTop = getCoords(node).top;
      const visibleCondition =
        scroll >= nodeTop - this.animPoint &&
        scroll <= nodeTop + node.offsetHeight;
      visibleCondition ? (this.isVisible = true) : (this.isVisible = false);
    },
    removeHandlers() {
      window.removeEventListener("scroll", this.scrollHandler);
      window.removeEventListener("resize", this.setAnimPoint);
    },
    // animations
    animMethods() {
      return {
        translate: this.translate,
        typeWriter: this.typeWriter,
      };
    },
    translate() {},
    typeWriter() {
      this.slotNode.textContent = "";
      const text = this.slotNodeTextContent;
      const letters = text.split("").filter(str => str.match(/\s\s/) ? false : str);
      letters.forEach((lt, i) => {
        const timeout = this.speed * i;
        setTimeout(() => {
          this.slotNode.textContent += lt;
          if(i + 1 === letters.length) this.status = "animated";
        }, timeout);
      });
    },
  },
  watch: {
    isVisible(boolNew, boolOld) {
      const becameVisible = boolNew === true && boolOld === false;
      const invisibleRepeatableNotAnimating =
        !becameVisible && this.repeatAnim && this.status !== "animating";

      if (invisibleRepeatableNotAnimating) this.status = "no_animated";
      else if (becameVisible && this.status === "no_animated") {
        this.status = "animating";
        this.animMethods()[this.animType]();
      }
    },
    status(value) {
      if (value === "animated" && !this.repeatAnim) this.removeHandlers();
    },
  },
  beforeMount() {
    this.setAnimPoint();
    window.addEventListener("resize", this.setAnimPoint);
  },
  mounted() {
    this.getSlotNode();
    this.scrollHandler();
    if (this.slotNode) window.addEventListener("scroll", this.scrollHandler);
    if(this.animType === "typeWriter") {
      this.slotNode.style.minHeight = "1.5em";
      this.slotNode.textContent = "";
    }
  },
  beforeUnmount() {
    this.removeHandlers();
  },
};
</script>