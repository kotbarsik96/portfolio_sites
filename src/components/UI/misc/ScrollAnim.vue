<template>
  <component :is="animType === 'typeWriter' ? 'span' : 'div'" ref="rootComp">
    <slot></slot>
  </component>
</template>

<script>
import { getCoords } from "@/assets/js/scripts";
import { mapGetters, mapMutations } from "vuex";
import gsap from "gsap";

// для добавления новой анимации:
// 1. Придумать ей название, использующееся в animType;
// 2. Создать методы с придуманным названием animType в: methods (под animMethods()), animMethods(), setDefaultAnim();
// 3. Прописать код в созданные методы.

export default {
  // !ВАЖНО, чтобы в slot был только один корневой блок, иначе анимация выполнится только для первого блока!
  // если вместо блока HTML в <slot> находится только текст, он будет обернут в <span>
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
    // длительность анимации
    duration: {
      type: Number,
      default: 500,
    },
    // скорость анимации (работает только для typeWriter)
    speed: {
      type: Number,
      default: 100,
    },
    // добавлять ли в очередь (элементы анимируются только друг после друга в порядке очереди попадания на экран)
    queue: {
      type: Boolean,
      default: false,
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
  computed: {
    ...mapGetters(["animQueue"]),
  },
  methods: {
    ...mapMutations(["addScrollAnim", "removeScrollAnim", "startAnim"]),
    setAnimPoint() {
      this.animPoint =
        document.documentElement.clientHeight -
        document.documentElement.clientHeight / 6;
    },
    getSlotNode() {
      const rootComp = this.$refs.rootComp;
      const slotNode = rootComp.querySelector("*");
      const extractSlotNode = () => {
        const parent = rootComp.parentNode;
        const childNodes = Array.from(parent.childNodes).filter((el) =>
          el.nodeType === 3 && el.data === "" ? false : true
        );
        rootComp.remove();
        childNodes.indexOf(rootComp) < 1
          ? parent.prepend(slotNode)
          : parent.append(slotNode);
      };

      if (slotNode) {
        extractSlotNode();
        this.slotNode = slotNode;
      } else this.slotNode = rootComp;
      this.slotNodeTextContent = this.slotNode.textContent;
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
    applyAnim() {
      if (this.status !== "animating") {
        this.status = "animating";
        this.animMethods()
          [this.animType]()
          .then(() => {
            this.status = "animated";
            if (this.queue) this.removeScrollAnim(this);
          });
      }
    },
    setDefaultPosition() {
      return {
        translate: () => {
          gsap.set(this.slotNode, { y: -300 });
          this.slotNode.parentNode.style.overflow = "hidden";
        },
        typeWriter: () => {
          this.slotNode.style.minHeight = "1.5em";
          this.slotNode.textContent = "";
        },
      };
    },
    // animations
    animMethods() {
      return {
        translate: this.translate,
        typeWriter: this.typeWriter,
      };
    },
    translate() {
      return new Promise((resolve) => {
        gsap.to(this.slotNode, {
          y: 0,
          duration: this.duration / 1000,
          onComplete: () => {
            resolve();
            this.slotNode.parentNode.style.removeProperty("overflow");
          },
        });
      });
    },
    typeWriter() {
      return new Promise((resolve) => {
        this.slotNode.textContent = "";
        const text = this.slotNodeTextContent;
        const letters = text
          .split("")
          .filter((str) => (str.match(/\s\s/) ? false : str));

        letters.forEach((lt, i) => {
          const timeout = this.speed * i;
          setTimeout(() => {
            this.slotNode.textContent += lt;
            if (i + 1 === letters.length) resolve();
          }, timeout);
        });
      });
    },
  },
  watch: {
    isVisible(boolNew, boolOld) {
      const becameVisible = boolNew === true && boolOld === false;
      const invisibleRepeatableNotAnimating =
        !becameVisible && this.repeatAnim && this.status !== "animating";
      const addToQueue = () => {
        this.addScrollAnim(this);
        if (this.animQueue.length === 1) this.startAnim();
      };

      // элемент перестал быть виден. Указать, что нужно будет сделать переанимацию, если this.repeatAnim === true
      if (invisibleRepeatableNotAnimating) this.status = "no_animated";
      // применить анимацию / добавить в очередь
      else if (becameVisible && this.status === "no_animated") {
        this.queue ? addToQueue() : this.applyAnim();
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
    this.setDefaultPosition()[this.animType]();
  },
  beforeUnmount() {
    this.removeHandlers();
  },
};
</script>