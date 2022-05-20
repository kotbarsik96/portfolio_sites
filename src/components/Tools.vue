<template>
  <section id="tools-block" class="page-block tools-block">
    <div class="container">
      <scroll-anim :animType="'typeWriter'">
        <h2 class="page-block__title anim__object-text">Чем я пользуюсь?</h2>
      </scroll-anim>
      <div class="page-block__content tools-block__content">
        <ul class="tools-list">
          <li class="tools-list__item">
            <div class="tools-list__item-image __icon-web-development"></div>
            <h3 class="tools-list__item-title">Основные инструменты</h3>
            <p class="tools-list__item-description">
              Языки, препроцессоры, сборщик
            </p>
            <ul class="tools-list__item-list">
              <li class="tools-list__item-item">
                <scroll-anim :animType="'translate'" :queue="true" :duration="325">HTML;</scroll-anim>
              </li>
              <li class="tools-list__item-item">
                <scroll-anim :animType="'translate'" :queue="true" :duration="325">CSS;</scroll-anim>
              </li>
              <li class="tools-list__item-item">
                <scroll-anim :animType="'translate'" :queue="true" :duration="325">SCSS;</scroll-anim>
              </li>
              <li class="tools-list__item-item">
                <scroll-anim :animType="'translate'" :queue="true" :duration="325">JS;</scroll-anim>
              </li>
              <li
                class="tools-list__item-item"
                title="Таск-менеджер (сборщик), содержащий плагины для объединения файлов, оптимизации изображений и выполнения других задач по автоматизации процессов"
              >
                <scroll-anim :animType="'translate'" :queue="true" :duration="325">Gulp</scroll-anim>
              </li>
            </ul>
          </li>
          <li class="tools-list__item">
            <div class="tools-list__item-image __icon-plugin"></div>
            <h3 class="tools-list__item-title">Плагины</h3>
            <p class="tools-list__item-description">
              Готовые решения от сторонних разработчиков, которые можно
              модифицировать под поставленные задачи
            </p>
            <ul class="tools-list__item-list">
              <li class="tools-list__item-item">
                <scroll-anim :animType="'translate'" :queue="true" :duration="325">
                  Slider Swiper
                </scroll-anim>
              </li>
            </ul>
            <a href="#features-block" class="tools-list__button button">
              Посмотреть
            </a>
          </li>
          <li class="tools-list__item">
            <div class="tools-list__item-image __icon-programming"></div>
            <h3 class="tools-list__item-title">Собственные наработки</h3>
            <p class="tools-list__item-description">
              Готовые решения, созданные мной в ходе работы над другими
              проектами. По необходимости их можно преобразовать под конкретные
              цели
            </p>
            <ul class="tools-list__item-list">
              <li class="tools-list__item-item">
                <scroll-anim :animType="'translate'" :queue="true" :duration="325">Анимация при прокрутке;</scroll-anim>
              </li>
              <li class="tools-list__item-item">
                <scroll-anim :animType="'translate'" :queue="true" :duration="325">Спойлеры;</scroll-anim>
              </li>
              <li class="tools-list__item-item">
                <scroll-anim :animType="'translate'" :queue="true" :duration="325">Ползунок;</scroll-anim>
              </li>
              <li class="tools-list__item-item">...</li>
            </ul>
            <a href="#features-block" class="tools-list__button button">
              Посмотреть все
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "tools-block",
};
</script>

<style>
</style>