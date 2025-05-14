// JavaScript для работы с вкладками в разделе цен
document.addEventListener('DOMContentLoaded', function() {
    // Находим все вкладки
    const tabs = document.querySelectorAll('.pricing-tab');
    
    // Добавляем обработчик события для каждой вкладки
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Удаляем класс active у всех вкладок
            tabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем класс active текущей вкладке
            this.classList.add('active');
            
            // Получаем id вкладки, которую нужно показать
            const tabId = this.getAttribute('data-tab');
            
            // Находим все контенты вкладок
            const contents = document.querySelectorAll('.pricing-content');
            
            // Скрываем все контенты
            contents.forEach(content => content.classList.remove('active'));
            
            // Показываем нужный контент
            document.getElementById(tabId).classList.add('active');
        });
    });
});
