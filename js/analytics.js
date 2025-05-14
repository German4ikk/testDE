// Google Analytics 4 интеграция
document.addEventListener('DOMContentLoaded', function() {
    // Функция для загрузки Google Analytics
    function loadGoogleAnalytics() {
        // Замените 'G-XXXXXXXXXX' на ваш реальный ID Google Analytics
        const gaId = 'G-XXXXXXXXXX';
        
        // Создаем скрипт Google Analytics
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(gaScript);
        
        // Инициализируем Google Analytics
        window.dataLayer = window.dataLayer || [];
        function gtag() {
            dataLayer.push(arguments);
        }
        gtag('js', new Date());
        gtag('config', gaId, {
            'anonymize_ip': true,
            'cookie_expires': 365 * 24 * 60 * 60, // 1 год в секундах
            'page_title': document.title,
            'page_location': window.location.href
        });
        
        // Отслеживание событий
        setupEventTracking();
    }
    
    // Функция для отслеживания событий на сайте
    function setupEventTracking() {
        // Отслеживание кликов по телефону
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        phoneLinks.forEach(link => {
            link.addEventListener('click', function() {
                gtag('event', 'phone_call', {
                    'event_category': 'Contact',
                    'event_label': this.href.replace('tel:', '')
                });
            });
        });
        
        // Отслеживание отправки формы
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', function() {
                gtag('event', 'form_submit', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form'
                });
            });
        }
        
        // Отслеживание кликов по кнопкам заказа
        const ctaButtons = document.querySelectorAll('.themesflat-button');
        ctaButtons.forEach(button => {
            button.addEventListener('click', function() {
                gtag('event', 'cta_click', {
                    'event_category': 'Engagement',
                    'event_label': this.textContent.trim()
                });
            });
        });
        
        // Отслеживание просмотра галереи
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (galleryItems.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const galleryCaption = entry.target.querySelector('.gallery-caption');
                        const galleryName = galleryCaption ? galleryCaption.textContent.trim() : 'Галерея';
                        
                        gtag('event', 'view_gallery_item', {
                            'event_category': 'Engagement',
                            'event_label': galleryName
                        });
                        
                        // Отслеживаем только один раз
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.7 });
            
            galleryItems.forEach(item => {
                observer.observe(item);
            });
        }
    }
    
    // Загружаем Google Analytics с учетом согласия на использование cookie
    // Проверяем, дал ли пользователь согласие на использование cookie
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (cookieConsent === 'accepted') {
        // Если согласие уже получено, загружаем Google Analytics
        loadGoogleAnalytics();
    }
    
    // Прослушиваем событие принятия cookie от нового скрипта cookie-consent.js
    document.addEventListener('cookieConsentAccepted', function() {
        // Когда пользователь принимает cookie через наш новый баннер
        loadGoogleAnalytics();
    });
    
    // Дополнительная проверка на случай, если событие не сработает
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'accept-cookies') {
            // Когда пользователь принимает cookie через наш новый баннер
            setTimeout(function() {
                if (localStorage.getItem('cookieConsent') === 'accepted') {
                    loadGoogleAnalytics();
                }
            }, 500);
        }
    });
});
