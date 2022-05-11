<template>
  <div>
    <div class="video-container" ref="vContainer">
      <video
        loop
        preload="metadata"
        :src="src"
        ref="video"
        @loadedmetadata="onLoadedmetadata"
        @timeupdate="onTimeupdate"
      ></video>
      <div
        class="video-container__controls"
        @click="onClick"
        @mouseover="showControls"
        @mouseleave="hideControls(true)"
      >
        <div class="video-container__play-btn __icon-play-video"></div>
        <div class="video-container__timestamp" @click.stop>
          {{ currentTime }} / {{ durationTime }}
        </div>
        <div
          class="video-container__expand-btn __icon-expand"
          @click.stop="expand"
          ref="expandBtn"
        ></div>
        <div
          class="video-container__videotrack"
          ref="videotrack"
          @click.stop
          @pointerdown.prevent="onTrackPointerdown"
        >
          <div class="video-container__timeline" ref="timeline">
            <div class="video-container__slider" ref="slider"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCoords, formatToMinutes } from "@/assets/js/scripts.js";
import { mapMutations } from "vuex";

export default {
  name: "video-container",
  props: {
    src: String,
  },
  data() {
    return {
      hideControlsClass: "__hide-controls",
      vContainer: "",
      video: "",
      currentTime: "00:00",
      durationTime: "00:00",
      showModal: false,
      dbClick: false,
    };
  },
  methods: {
    ...mapMutations(["addModalBodyContent", "removeLastModalBodyContent"]),
    formatToMinutes,
    showControls() {
      const addClass = () =>
        this.vContainer.classList.remove(this.hideControlsClass);
      addClass();
    },
    hideControls(considerState = false) {
      const removeClass = () =>
        this.vContainer.classList.add(this.hideControlsClass);
      if (considerState) {
        if (this.vContainer.classList.contains("__playing")) removeClass();
        return;
      }
      removeClass();
    },
    play(pointerType) {
      this.video.play();
      this.vContainer.classList.add("__playing");
      console.log(pointerType);
      if(pointerType === "touch") this.hideControls();
    },
    pause() {
      this.video.pause();
      this.vContainer.classList.remove("__playing");
      this.showControls();
    },
    togglePlaying(event) {
      this.video.paused ? this.play(event.pointerType) : this.pause();
    },
    onClick(event) {
      if (!this.dbClick) {
        this.togglePlaying(event);
        this.dbClick = true;
        setTimeout(() => this.dbClick = false, 250);
        return;
      }

      this.expand();
    },
    onLoadedmetadata() {
      this.durationTime = formatToMinutes(this.video.duration);
    },
    onTimeupdate() {
      this.currentTime = formatToMinutes(this.video.currentTime);
      this.setTimelineWidth();
    },
    onTrackPointerdown(event) {
      this.pause();

      const track = this.$refs.videotrack;
      const trackWidth = track.offsetWidth;
      const trackX = getCoords(track).left;
      const timeline = this.$refs.timeline;
      const inTrackBorders = (value) => value > 0 && value < trackWidth;

      // вызывается при передвижении курсора. Выставляет ширину timeline
      const moveAt = (coord) => {
        // положение курсора относительно начала videotrack
        const value = coord - trackX;

        if (inTrackBorders(value)) {
          // если курсор в границах videotrack
          const percents = value / (trackWidth / 100);
          timeline.style.width = `${percents}%`;
          this.video.currentTime = (this.video.duration / 100) * percents;
        } else {
          // если курсор вышел за границы videotrack: слева
          if (value < 0) {
            timeline.style.width = 0;
            this.video.currentTime = 0;
          }
          // если курсор вышел за границы videotrack: справа
          else if (value > trackWidth) {
            timeline.style.width = "100%";
            this.video.currentTime = this.video.duration;
          }
        }
      };

      track.ondragstart = () => false;
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);

      function onMove(event) {
        moveAt(event.clientX);
      }
      function onUp() {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      }
    },
    setTimelineWidth() {
      const timeline = this.$refs.timeline;
      const duration = this.video.duration;
      const currentTime = this.video.currentTime;
      const unit = duration / 100;
      const value = currentTime / unit;

      timeline.style.width = `${value}%`;
    },
    expand() {
      const vContainer = this.vContainer;
      const vContainerParent = vContainer.parentNode;

      if (vContainer.closest(".modal-window")) {
        this.$store.commit("removeLastModalBodyContent");
        return;
      }

      const expandBtn = this.$refs.expandBtn;

      const bodyContent = {
        bodyType: "media",
        node: vContainer,
        oldParent: vContainerParent,
      };
      this.$store.commit("addModalBodyContent", bodyContent);
    },
  },
  mounted() {
    this.vContainer = this.$refs.vContainer;
    this.video = this.$refs.video;
  },
};
</script>