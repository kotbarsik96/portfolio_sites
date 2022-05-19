<template>
  <component :is="animType === 'typeWriter' ? 'span' : 'div'" ref="rootComp">
    <slot></slot>
  </component>
</template>

<script>
import { getCoords, wrapToHTMLTag } from "@/assets/js/scripts";
import gsap from "gsap";

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
      default: 125,
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
  methods: {
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
      
      if(slotNode) {
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
    // animations
    animMethods() {
      return {
        translate: this.translate,
        typeWriter: this.typeWriter,
      };
    },
    translate() {},
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

      if (invisibleRepeatableNotAnimating) this.status = "no_animated";
      else if (becameVisible && this.status === "no_animated") {
        this.status = "animating";
        this.animMethods()
          [this.animType]()
          .then((resolve) => (this.status = "animated"));
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
    if (this.animType === "typeWriter") {
      this.slotNode.style.minHeight = "1.5em";
      this.slotNode.textContent = "";
    }
  },
  beforeUnmount() {
    this.removeHandlers();
  },
};
</script>