/**
 * Скрипт для устранения зеленого пробела в мобильной версии
 */
document.addEventListener('DOMContentLoaded', function() {
    // Функция для проверки, является ли устройство мобильным
    function isMobile() {
        return window.innerWidth <= 767;
    }
    
    // Функция для исправления зеленого пробела
    function fixGreenGap() {
        if (isMobile()) {
            // Находим зеленый элемент между шапкой и слайдером
            const greenElement = document.querySelector('div[style*="background-color: green"], div[style*="background: green"]');
            if (greenElement) {
                greenElement.style.display = 'none';
            }
            
            // Убираем отступы у слайдера
            const slider = document.querySelector('.slider, #rev_slider_1_1_wrapper');
            if (slider) {
                slider.style.marginTop = '0';
                slider.style.paddingTop = '0';
            }
        } else {
            // Возвращаем оригинальные стили для десктопной версии
            const elements = document.querySelectorAll('.slider, #rev_slider_1_1_wrapper');
            elements.forEach(function(element) {
                element.style.removeProperty('margin-top');
                element.style.removeProperty('padding-top');
            });
            
            // Возвращаем видимость зеленого элемента для десктопа
            const greenElement = document.querySelector('div[style*="background-color: green"], div[style*="background: green"]');
            if (greenElement) {
                greenElement.style.removeProperty('display');
            }
        }
    }
    
    // Запускаем функцию при загрузке страницы
    fixGreenGap();
    
    // Запускаем функцию при изменении размера окна
    window.addEventListener('resize', fixGreenGap);
});
