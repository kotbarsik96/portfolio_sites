<template>
  <section id="about-block" class="page-block about-block">
    <div class="container">
      <h1 class="page-block__title anim__object-text">
        <scroll-anim :animType="'typeWriter'" :queue="true">Портфолио</scroll-anim>
      </h1>
      <div class="page-block__content">
        <div class="page-block__message about-block__message">
          <ul class="about-list">
            <li class="about-list__item __icon-person">
              Имя:
              <scroll-anim :animType="'typeWriter'" :queue="true" :speed="60">
                <span id="about__name">Лёша Никифоров</span>
              </scroll-anim>
            </li>
            <li class="about-list__item __icon-activity">
              Деятельность:
              <scroll-anim :animType="'typeWriter'" :queue="true" :speed="60">
                <span id="about__activity"
                  >верстальщик сайтов со знанием Vue.JS 3</span
                >
              </scroll-anim>
            </li>
            <li class="about-list__item __icon-date">
              Возраст:
              <scroll-anim :animType="'typeWriter'" :queue="true" :speed="60">
                <span id="about__age">19 лет</span>
              </scroll-anim>
            </li>
            <li class="about-list__item __icon-date">
              Занимаюсь версткой уже
              <scroll-anim :animType="'typeWriter'" :queue="true" :speed="60">
                <span id="about__layout-date">более, чем 1.5 года</span>
              </scroll-anim>
            </li>
            <li class="about-list__item __icon-portfolio">
              Работ в портфолио:
              <scroll-anim :animType="'typeWriter'" :queue="true" :speed="60">
                <span id="about__works-amount">{{ works.length }}</span>
              </scroll-anim>
            </li>
            <li class="about-list__item __icon-skills">
              Навыки:
              <scroll-anim :animType="'typeWriter'" :queue="true" :speed="60">
                <span id="about__js-features">
                  {{ pagedFeatures.pageCounter }}
                </span>
              </scroll-anim>
              интересных реализаций JavaScript на разных сайтах
            </li>
          </ul>
          <div class="buttons-block">
            <a href="#works-block" class="buttons-block__button button">
              Посмотреть работы
            </a>
            <a href="#tools-block" class="buttons-block__button button">
              Что я использую
            </a>
          </div>
        </div>
        <div class="page-block__images about-block__images">
          <div class="about-block__image about-block__image-html"></div>
          <div class="about-block__image about-block__image-css"></div>
          <div class="about-block__image about-block__image-js"></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "about-block",
  computed: {
    ...mapGetters(["pagedFeatures", "works"]),
  },
};
</script>

<style>
</style>