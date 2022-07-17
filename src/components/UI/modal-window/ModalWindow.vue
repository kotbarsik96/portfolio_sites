<template>
  <div class="modal-window" ref="modalWindow">
    <div class="modal-window__body-text" v-if="bodyContent.bodyType === 'text'">
      <h4 class="modal-window__title" ref="wTitle">
        {{ appendHTML(bodyContent.title, "wTitle") }}
      </h4>
      <div class="modal-window__text">
        <p
          class="modal-window__paragraph"
          v-for="(paragraph, i) in bodyContent.paragraphs"
          :key="i"
          :ref="`paragraph${i}`"
        >
          {{ appendHTML(paragraph, `paragraph${i}`) }}
        </p>
        <p
          class="modal-window__paragraph"
          v-if="bodyContent.paragraph"
          ref="paragraph"
        >
          {{ appendHTML(bodyContent.paragraph, "paragraph") }}
        </p>
        <ol class="modal-window__list" v-if="bodyContent.ol">
          <li
            class="modal-window__list-item"
            v-for="(item, i) in bodyContent.ol"
            :key="i"
            :ref="`olItem${i}`"
          >
            {{ appendHTML(item, `olItem${i}`) }}
          </li>
        </ol>
        <ul class="modal-window__list" v-if="bodyContent.ul">
          <li
            class="modal-window__list-item"
            v-for="(item, i) in bodyContent.ul"
            :key="i"
            :ref="`ulItem${i}`"
          >
            {{ appendHTML(item, `ulItem${i}`) }}
          </li>
        </ul>
      </div>
    </div>
    <div
      class="modal-window__body-media"
      v-if="bodyContent.bodyType === 'media' && bodyContent.src"
    >
      <video-container
        v-if="/.(mp4|webm|avi|mkv)$/.test(bodyContent.src)"
        :src="bodyContent.src"
      ></video-container>
      <image-container
        v-if="/.(png|jpe?g|gif|webp|svg)$/.test(bodyContent.src)"
        :src="bodyContent.src"
      ></image-container>
    </div>
    <div
      class="modal-window__body-media"
      v-if="
        bodyContent.bodyType === 'media' && bodyContent.node && !bodyContent.src
      "
      ref="mediaParent"
    ></div>
  </div>
</template>

<script>
import { nextTick } from "vue";
import { mapGetters } from "vuex";

export default {
  name: "modal-window",
  props: {
    bodyContent: {
      type: Object,
      // примеры возможных bodyContent
      default: {
        bodyType: "media",
        src: "./*.mp4" || "./*.png",
      } || {
          bodyType: "media",
          node: HTMLElement,
          oldParent:
            "video-container.parentNode" || "image-container.parentNode",
        } || {
          bodyType: "text",
          title: "Заголовок",
          paragraphs: ["Абзац 1", "Абзац 2", "Абзац 3"],
          ol: ["Пункт 1", "Пункт 2", "Пункт 3"],
          ul: ["Пункт 1", "Пункт 2", "Пункт 3"],
        } || {
          bodyType: "text",
          title: "Заголовок",
          paragraph: "Какой-то абзац",
          ol: ["Пункт 1", "Пункт 2", "Пункт 3"],
          ul: ["Пункт 1", "Пункт 2", "Пункт 3"],
        },
    },
  },
  methods: {
    async appendMediaNode() {
      await nextTick();
      const mediaParent = this.$refs.mediaParent;
      if (mediaParent) mediaParent.append(this.bodyContent.node);
    },
    appendMediaBack() {
      const oldParent = this.bodyContent.oldParent;
      const node = this.bodyContent.node;
      if (oldParent) oldParent.append(node);
    },
    appendHTML(node, parentRef) {
      nextTick().then(() => {
        const parent = this.$refs[parentRef];
        parent.length
          ? parent[0].insertAdjacentHTML("afterbegin", node)
          : parent.insertAdjacentHTML("afterbegin", node);
      });
    },
  },
  computed: {
    ...mapGetters(["modalWindows"])
  },
  mounted() {
    this.appendMediaNode();
  },
  beforeUnmount() {
    this.appendMediaBack();
  },
};
</script>

<style>

</style>