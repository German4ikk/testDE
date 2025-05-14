// Скрипт для отправки данных формы в Telegram
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submit');
    
    // Токен бота и ID чата
    const botToken = '7722443246:AAGjqsYRNG8dRZMxti0e89VRF46ebUEgGRU';
    
    // Обработчик отправки формы
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Блокируем кнопку отправки и меняем текст
        submitButton.disabled = true;
        const originalText = submitButton.value;
        submitButton.value = 'Wird gesendet...';
        
        // Собираем данные формы
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Формируем текст сообщения
        const text = `🔔 Новая заявка с сайта!\n\n👤 Имя: ${name}\n📞 Телефон: ${phone}\n📧 Email: ${email}\n\n💬 Сообщение:\n${message}`;
        
        // Отправляем сообщение в Telegram
        sendToTelegram(text)
            .then(response => {
                if (response.ok) {
                    // Показываем сообщение об успешной отправке
                    showMessage('success');
                    // Очищаем форму
                    contactForm.reset();
                } else {
                    // Показываем сообщение об ошибке
                    showMessage('error');
                    console.error('Fehler beim Senden an Telegram.', response.statusText);
                }
            })
            .catch(error => {
                // Показываем сообщение об ошибке
                showMessage('error');
                console.error('Fehler beim Senden an Telegram.', error);
            })
            .finally(() => {
                // Разблокируем кнопку отправки и возвращаем исходный текст
                submitButton.disabled = false;
                submitButton.value = originalText;
            });
    });
    
    // Функция для отправки сообщения в Telegram
    function sendToTelegram(text) {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: '2009147280', // ID вашего чата или личный ID
                text: text,
                parse_mode: 'HTML'
            })
        });
    }
    
    // Функция для показа сообщения об успехе или ошибке
    function showMessage(type) {
        // Удаляем предыдущее сообщение, если оно есть
        const oldMessage = document.querySelector('.form-message');
        if (oldMessage) oldMessage.remove();

        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        
        if (type === 'success') {
            // Получаем текст из переводов
            const successText = document.querySelector('[data-i18n="contacts.success"]') 
                ? document.querySelector('[data-i18n="contacts.success"]').textContent 
                : 'Vielen Dank für Ihre Anfrage! Wir werden uns in Kürze bei Ihnen melden.';
            
            messageElement.textContent = successText;
        } else {
            // Получаем текст из переводов
            const errorText = document.querySelector('[data-i18n="contacts.error"]')
                ? document.querySelector('[data-i18n="contacts.error"]').textContent
                : 'Beim Senden der Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.';
            
            messageElement.textContent = errorText;
        }
        
        // Добавляем сообщение после формы
        contactForm.parentNode.insertBefore(messageElement, contactForm.nextSibling);
        
        // Удаляем сообщение через 5 секунд
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
});
