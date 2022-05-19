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
              <li class="tools-list__item-item">HTML;</li>
              <li class="tools-list__item-item">CSS;</li>
              <li class="tools-list__item-item">SCSS;</li>
              <li class="tools-list__item-item">JS;</li>
              <li
                class="tools-list__item-item"
                title="Таск-менеджер (сборщик), содержащий плагины для объединения файлов, оптимизации изображений и выполнения других задач по автоматизации процессов"
              >
                Gulp
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
              <li class="tools-list__item-item">Slider Swiper</li>
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
              <li class="tools-list__item-item">Анимация при прокрутке;</li>
              <li class="tools-list__item-item">Спойлеры;</li>
              <li class="tools-list__item-item">Ползунок;</li>
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