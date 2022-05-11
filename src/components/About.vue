<template>
  <section id="about-block" class="page-block about-block">
    <div class="container">
      <h1 class="page-block__title anim__object-text">
        Портфолио
      </h1>
      <div class="page-block__content">
        <div class="page-block__message about-block__message">
          <ul class="about-list">
            <li class="about-list__item __icon-person">
              Имя:
              <span id="about__name" class="anim__object-text"
                >Лёша Никифоров</span
              >
            </li>
            <li class="about-list__item __icon-activity">
              Деятельность:
              <span id="about__activity" class="anim__object-text"
                >верстальщик сайтов со знанием Vue.JS 3</span
              >
            </li>
            <li class="about-list__item __icon-date">
              Возраст:
              <span id="about__age" class="anim__object-text">19 лет</span>
            </li>
            <li class="about-list__item __icon-date">
              Занимаюсь версткой уже
              <span id="about__layout-date" class="anim__object-text"
                >более, чем 1.5 года</span
              >
            </li>
            <li class="about-list__item __icon-portfolio">
              Работ в портфолио:
              <span id="about__works-amount" class="anim__object-text">{{ works.length }}</span>
            </li>
            <li class="about-list__item __icon-skills">
              Навыки:
              <span id="about__js-features" class="anim__object-text"> {{ pagedFeatures.pageCounter }} </span>
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
import { mapGetters } from 'vuex';

export default {
  name: 'about-block',
  computed: {
    ...mapGetters(["pagedFeatures", "works"])
  }
};
</script>

<style>
</style>