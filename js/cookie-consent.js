/**
 * Скрипт для отображения уведомления о cookie-файлах с поддержкой немецкого и английского языков
 */

// Флаг для отслеживания, было ли уже создано уведомление
let cookieNoticeInitialized = false;

document.addEventListener('DOMContentLoaded', function() {
    // Удаляем все существующие уведомления о cookie при загрузке страницы
    const existingNotices = document.querySelectorAll('#cookie-notice');
    existingNotices.forEach(notice => {
        notice.parentNode.removeChild(notice);
    });
    
    // Задержка перед показом уведомления, чтобы дать время загрузиться скрипту перевода
    setTimeout(function() {
        // Проверяем, принял ли пользователь cookie-соглашение
        if (!localStorage.getItem('cookieConsent') && !cookieNoticeInitialized) {
            // Создаем элемент уведомления о cookie
            cookieNoticeInitialized = true;
            createCookieNotice();
        }
    }, 500); // Задержка 500 мс, чтобы дать время загрузиться скрипту перевода
});

/**
 * Создает элемент уведомления о cookie
 */
function createCookieNotice() {
    // Проверяем, что уведомление еще не создано
    if (document.getElementById('cookie-notice')) {
        // Уведомление уже существует, обновляем его содержимое
        updateCookieNotice();
        return;
    }
    
    // Определяем текущий язык
    const currentLang = getCurrentLanguage();
    
    // Создаем элемент уведомления
    const cookieNotice = document.createElement('div');
    cookieNotice.id = 'cookie-notice';
    cookieNotice.className = 'cookie-notice';
    
    // Устанавливаем содержимое в зависимости от языка
    cookieNotice.innerHTML = getCookieNoticeContent(currentLang);
    
    // Добавляем уведомление на страницу
    document.body.appendChild(cookieNotice);
    
    // Добавляем обработчик события для кнопки принятия
    document.getElementById('accept-cookies').addEventListener('click', function() {
        acceptCookies();
    });
}

/**
 * Обновляет содержимое уведомления о cookie
 */
function updateCookieNoticeContent() {
    // Определяем текущий язык
    const currentLang = getCurrentLanguage();
    
    // Обновляем содержимое уведомления
    const cookieNotice = document.getElementById('cookie-notice');
    if (cookieNotice) {
        cookieNotice.innerHTML = getCookieNoticeContent(currentLang);
        
        // Повторно добавляем обработчик события для кнопки принятия
        const acceptButton = document.getElementById('accept-cookies');
        if (acceptButton) {
            // Удаляем все существующие обработчики событий, чтобы избежать дублирования
            const newAcceptButton = acceptButton.cloneNode(true);
            acceptButton.parentNode.replaceChild(newAcceptButton, acceptButton);
            
            // Добавляем новый обработчик
            newAcceptButton.addEventListener('click', acceptCookies);
        }
    }
}

/**
 * Возвращает содержимое уведомления о cookie на выбранном языке
 * @param {string} lang - Код языка ('ru' или 'et')
 * @returns {string} HTML-содержимое уведомления
 */
function getCookieNoticeContent(lang) {
    // Используем переводы из файла translations.js
    if (typeof translations === 'undefined') {
        // Если переводы недоступны, используем заглушки
        const content = {
            'ru': {
                message: 'Мы используем cookie-файлы для улучшения работы сайта и анализа трафика. Продолжая использовать сайт, вы соглашаетесь с нашей',
                policy: 'политикой конфиденциальности',
                accept: 'Принять'
            },
            'et': {
                message: 'Kasutame küpsiseid veebisaidi töö parandamiseks ja liikluse analüüsimiseks. Jätkates veebisaidi kasutamist, nõustute meie',
                policy: 'privaatsuspoliitikaga',
                accept: 'Nõustun'
            }
        };
        
        return `
            <div class="cookie-notice-content">
                <p>${content[lang].message} <a href="privacy-policy.html">${content[lang].policy}</a>.</p>
                <button id="accept-cookies" class="cookie-btn">${content[lang].accept}</button>
            </div>
        `;
    }
    
    // Используем переводы из файла translations.js
    return `
        <div class="cookie-notice-content">
            <p>${translations[lang]['cookie.message']} <a href="privacy-policy.html">${translations[lang]['cookie.policy']}</a>.</p>
            <button id="accept-cookies" class="cookie-btn">${translations[lang]['cookie.accept']}</button>
        </div>
    `;
}

/**
 * Обработчик принятия cookie
 */
function acceptCookies() {
    // Сохраняем выбор пользователя
    localStorage.setItem('cookieConsent', 'accepted');
    
    // Скрываем уведомление
    const cookieNotice = document.getElementById('cookie-notice');
    if (cookieNotice) {
        cookieNotice.style.display = 'none';
    }
    
    // Создаем событие, чтобы уведомить другие скрипты о принятии cookie
    const event = new CustomEvent('cookieConsentAccepted');
    document.dispatchEvent(event);
    
    // Плавно удаляем элемент
    setTimeout(function() {
        cookieNotice.remove();
    }, 300);
}

/**
 * Определяет текущий язык страницы
 * @returns {string} Код языка ('de' или 'en')
 */
function getCurrentLanguage() {
    // Проверяем наличие глобальной переменной текущего языка
    if (typeof currentLanguage !== 'undefined' && (currentLanguage === 'de' || currentLanguage === 'en')) {
        return currentLanguage;
    }
    
    // Проверяем наличие сохраненного языка в localStorage
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang === 'de' || savedLang === 'en') {
        return savedLang;
    }
    
    // Проверяем наличие активной кнопки языка
    const activeLangBtn = document.querySelector('.lang-btn.active');
    if (activeLangBtn && activeLangBtn.getAttribute('data-lang')) {
        return activeLangBtn.getAttribute('data-lang');
    }
    
    // Проверяем язык браузера
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang.startsWith('de')) {
        return 'de';
    }
    
    // Проверяем наличие параметра языка в URL
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam === 'de' || langParam === 'en') {
        return langParam;
    }
    
    // Проверяем наличие немецких слов в заголовке и на странице
    let germanTextCount = 0;
    let englishTextCount = 0;
    
    // Проверяем все текстовые элементы на странице
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, p, a, span, button, li');
    
    textElements.forEach(element => {
        if (!element.innerText) return;
        
        const text = element.innerText.toLowerCase();
        
        // Немецкие слова и фразы
        const germanWords = ['leistungen', 'startseite', 'warum wir', 'galerie', 'kontakt', 'referenzen', 'renovierung', 'wohnungen', 'häuser', 'badezimmer', 'küchen', 'bodenbelag', 'berlin', 'deutschland', 'qualität', 'akzeptieren', 'datenschutzrichtlinie'];
        
        // Английские слова и фразы
        const englishWords = ['services', 'home', 'why us', 'gallery', 'contact', 'reviews', 'renovation', 'apartments', 'houses', 'bathrooms', 'kitchens', 'flooring', 'berlin', 'germany', 'quality', 'accept', 'privacy policy'];
        
        // Проверяем наличие немецких слов
        for (const word of germanWords) {
            if (text.includes(word)) {
                germanTextCount++;
                break; // Достаточно одного совпадения для элемента
            }
        }
        
        // Проверяем наличие английских слов
        for (const word of englishWords) {
            if (text.includes(word)) {
                englishTextCount++;
                break; // Достаточно одного совпадения для элемента
            }
        }
    });
    
    // Если немецких слов больше или равно, то страница на немецком
    if (germanTextCount >= englishTextCount && germanTextCount > 0) {
        return 'de';
    }
    
    // По умолчанию возвращаем английский
    return 'en';
}

/**
 * Настраивает обработчики событий для переключения языка
 */
function setupLanguageSwitcher() {
    // Находим все кнопки переключения языка
    const langButtons = document.querySelectorAll('.lang-btn');
    
    // Добавляем обработчики событий
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            
            // Сохраняем выбор языка
            localStorage.setItem('siteLang', lang);
            
            // Обновляем уведомление о cookie, если оно отображается
            const cookieNotice = document.getElementById('cookie-notice');
            if (cookieNotice) {
                cookieNotice.innerHTML = getCookieNoticeContent(lang);
                
                // Повторно добавляем обработчик события для кнопки принятия
                document.getElementById('accept-cookies').addEventListener('click', function() {
                    acceptCookies();
                });
            }
        });
    });
}

// Добавляем стили для уведомления о cookie
const style = document.createElement('style');
style.textContent = `
    .cookie-notice {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(30, 39, 46, 0.95);
        color: #fff;
        padding: 15px;
        z-index: 9999;
        box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
    }
    
    .cookie-notice-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    
    .cookie-notice-content p {
        margin: 0;
        padding: 10px 0;
        flex: 1;
        min-width: 200px;
    }
    
    .cookie-notice-content a {
        color: #ff5e14;
        text-decoration: underline;
    }
    
    .cookie-btn {
        background: linear-gradient(45deg, #ff5e14, #ff8e14);
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 50px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        margin-left: 20px;
    }
    
    .cookie-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(255, 94, 20, 0.3);
    }
    
    @media (max-width: 767px) {
        .cookie-notice-content {
            flex-direction: column;
            text-align: center;
        }
        
        .cookie-btn {
            margin: 15px 0 0;
            width: 100%;
        }
    }
`;

document.head.appendChild(style);
