// chat.js

document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessagesContainer = document.getElementById('chat-messages');
    const weatherCard = document.getElementById('weather-card');
    const tasksCard = document.getElementById('tasks-card');
    const newsCard = document.getElementById('news-card');
    const actionCardsSection = document.getElementById('actionCardsSection');
    const introSectionWrapper = document.getElementById('introSectionWrapper');
    const chatSection = document.getElementById('chatSection');
    const dashboardMainContainer = document.querySelector('.dashboard-main-container');
    const minimizeChatBtn = document.getElementById('minimizeChatBtn');

    let chatActivated = false;
    const OPENWEATHERMAP_API_KEY = '361221015a8e10e6cd9a6d4725732fe4';



    function displayMessage(sender, message, isHtml = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        messageElement.classList.add(sender);

        if (sender === 'milo') {
            if (typeof marked === 'function') {
                messageElement.innerHTML = marked.parse(message);
            } else {
                // Si la librería no carga, usamos un reemplazo simple para la negrita como respaldo.
                messageElement.innerHTML = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            }
        } else {
            messageElement.textContent = message;
        }

        chatMessagesContainer.appendChild(messageElement);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function getUserLocation() {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lon = position.coords.longitude;
                        resolve({ lat, lon });
                    },
                    (error) => {
                        console.error('Error al obtener la ubicación:', error);
                        reject(new Error('No se pudo obtener tu ubicación. Por favor, asegúrate de que los servicios de ubicación estén habilitados.'));
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
            } else {
                reject(new Error('La geolocalización no es compatible con tu navegador.'));
            }
        });
    }


    async function getCityName(lat, lon) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.address) {
                return data.address.city || data.address.town || data.address.village || 'Tu ubicación';
            }
            return 'Tu ubicación';
        } catch (error) {
            console.error('Error al obtener el nombre de la ciudad:', error);
            return 'Tu ubicación';
        }
    }


    async function getWeather(lat, lon) {
        if (!OPENWEATHERMAP_API_KEY || OPENWEATHERMAP_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
            displayMessage('milo', 'Ups! Para consultar el clima, necesito tu clave API de OpenWeatherMap..');
            return;
        }

        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=es`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=es`;

        try {
            displayMessage('milo', 'Un momento, estoy consultando el pronóstico del clima...');

            const currentWeatherResponse = await fetch(currentWeatherUrl);
            if (!currentWeatherResponse.ok) {
                const errorData = await currentWeatherResponse.json();
                throw new Error(`Error de la API de clima actual: ${currentWeatherResponse.status} - ${errorData.message || 'Desconocido'}`);
            }
            const currentWeatherData = await currentWeatherResponse.json();

            const forecastResponse = await fetch(forecastUrl);
            if (!forecastResponse.ok) {
                const errorData = await forecastResponse.json();
                throw new Error(`Error de la API de pronóstico: ${forecastResponse.status} - ${errorData.message || 'Desconocido'}`);
            }
            const forecastData = await forecastResponse.json();

            const cityName = await getCityName(lat, lon);

            let weatherMessage = `¡Claro! Aquí tienes el clima para **${cityName}**:<br><br>`;

            if (currentWeatherData.main && currentWeatherData.weather && currentWeatherData.weather.length > 0) {
                const currentTemp = currentWeatherData.main.temp.toFixed(0);
                const feelsLikeTemp = currentWeatherData.main.feels_like.toFixed(0);
                const weatherDescription = currentWeatherData.weather[0].description;
                const iconCode = currentWeatherData.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                weatherMessage += `**Ahora:** <img src="${iconUrl}" alt="${weatherDescription}" style="width:30px; height:30px; vertical-align: middle;"> ${currentTemp}°C, Sensación térmica: ${feelsLikeTemp}°C. ${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}.<br><br>`;
            } else {
                weatherMessage += 'No pude obtener los datos del clima actual con precisión.<br><br>';
            }

            weatherMessage += 'Aquí te dejo el pronóstico para los próximos días:<br>';
            if (forecastData.list && forecastData.list.length > 0) {
                const dailyForecasts = {};
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                forecastData.list.forEach(item => {
                    const itemDate = new Date(item.dt * 1000);
                    itemDate.setHours(0, 0, 0, 0);

                    if (itemDate.getTime() >= today.getTime()) {
                        const dayKey = itemDate.toLocaleDateString('es-ES', { year: 'numeric', month: 'numeric', day: 'numeric' });

                        if (!dailyForecasts[dayKey]) {
                            dailyForecasts[dayKey] = {
                                minTemp: Infinity,
                                maxTemp: -Infinity,
                                descriptions: new Set(),
                                date: itemDate
                            };
                        }
                        dailyForecasts[dayKey].minTemp = Math.min(dailyForecasts[dayKey].minTemp, item.main.temp_min);
                        dailyForecasts[dayKey].maxTemp = Math.max(dailyForecasts[dayKey].maxTemp, item.main.temp_max);
                        dailyForecasts[dayKey].descriptions.add(item.weather[0].description);
                    }
                });

                const sortedDays = Object.keys(dailyForecasts).sort((a, b) => {
                    return new Date(a) - new Date(b);
                });

                for (let i = 0; i < Math.min(sortedDays.length, 7); i++) {
                    const dayKey = sortedDays[i];
                    const daily = dailyForecasts[dayKey];
                    const dayName = (daily.date.getDate() === today.getDate() && daily.date.getMonth() === today.getMonth() && daily.date.getFullYear() === today.getFullYear()) ? 'Hoy' : daily.date.toLocaleDateString('es-ES', { weekday: 'long' });
                    const maxTemp = daily.maxTemp.toFixed(0);
                    const minTemp = daily.minTemp.toFixed(0);
                    const commonDescription = Array.from(daily.descriptions).join(', ').toLowerCase();
                    weatherMessage += `• **${dayName}**: ${minTemp}°C - ${maxTemp}°C, ${commonDescription.charAt(0).toUpperCase() + commonDescription.slice(1)}.<br>`;
                }
            } else {
                weatherMessage += 'No pude obtener el pronóstico semanal completo.<br>';
            }
            displayMessage('milo', weatherMessage, true);
        } catch (error) {
            console.error('Error al obtener el clima:', error);
            displayMessage('milo', `Lo siento, hubo un problema al intentar obtener el clima: ${error.message}. Por favor, verifica tu conexión o inténtalo de nuevo más tarde.`);
        }
    }


    async function getLocalNews() {
        console.log(" Iniciando getLocalNews.");

        const NEWS_API_KEY = '5ee6801a049547db820850d072b7cbb7';

        try {
            displayMessage('milo', 'Buscando las noticias más recientes...');
            // endpoint /everything más robusto que busca todos los artículos sobre Argentina

            const requestUrl = `https://newsapi.org/v2/everything?q=Argentina&language=es&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;

            console.log("Intentando hacer fetch a la URL:", requestUrl);

            const response = await fetch(requestUrl);

            if (!response.ok) {
                const errorBody = await response.json();
                throw new Error(errorBody.message || `Error HTTP: ${response.status}`);
            }

            const newsData = await response.json();
            console.log(" Datos JSON procesados desde /everything:", newsData);

            if (newsData.articles && newsData.articles.length > 0) {
                let newsMessage = 'Las noticias más interesantes sobre Argentina:<br><br>';
                //  5 artículos más nuevos
                newsData.articles.slice(0, 5).forEach(article => {
                    newsMessage += `
                    <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #555;">
                        <strong>${article.title}</strong><br>
                        <small>Fuente: ${article.source.name}</small><br>
                        <a href="${article.url}" target="_blank" style="color: #9b59b6; text-decoration: none;">Leer más</a>
                    </div>
                `;
                });
                displayMessage('milo', newsMessage, true);
            } else {
                displayMessage('milo', 'No encontré noticias en este momento, parece haber un problema con el proveedor.');
            }

        } catch (error) {
            console.error(" Ha ocurrido un error en el bloque try-catch:", error);
            displayMessage('milo', `Lo siento, hubo un problema técnico: ${error.message}.`);
        }
    }
    function activateChat() {
        if (!chatActivated) {
            if (introSectionWrapper) {
                introSectionWrapper.classList.add('hide-intro');
            }
            if (actionCardsSection) {
                actionCardsSection.classList.add('hide-cards');
            }
            if (dashboardMainContainer) {
                dashboardMainContainer.classList.add('chat-active');
            }

            displayMessage('milo', '¡Hola! Soy Milo, tu asistente personal. ¿En qué puedo ayudarte hoy?');
            chatActivated = true;
        }
    }

    function deactivateChat() {
        if (chatActivated) {
            if (introSectionWrapper) {
                introSectionWrapper.classList.remove('hide-intro');
            }
            if (actionCardsSection) {
                actionCardsSection.classList.remove('hide-cards');
            }
            if (dashboardMainContainer) {
                dashboardMainContainer.classList.remove('chat-active');
            }

            chatMessagesContainer.innerHTML = '';
            chatInput.value = '';
            chatActivated = false;
        }
    }

    function saveNoteFromChat(title, content) {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!loggedInUser || !loggedInUser.email) {
            displayMessage('milo', 'Lo siento, no puedo guardar la nota porque no estás logueado. Por favor, inicia sesión.');
            return;
        }
        const userNotesKey = `notes_${loggedInUser.email}`;
        let notes = JSON.parse(localStorage.getItem(userNotesKey)) || [];

        const newNote = {
            id: Date.now(),
            title: title,
            content: content
        };
        notes.push(newNote);
        localStorage.setItem(userNotesKey, JSON.stringify(notes));
        displayMessage('milo', '¡Perfecto! He guardado tu nota. Te redirijo a tus notas para que puedas verla. 😊');

        setTimeout(() => {
            window.location.href = 'notes.html';
        }, 1500);
    }

    async function processUserInput(input) {
        activateChat();
        displayMessage('user', input);

        const lowerInput = input.toLowerCase();
        const annotationPhrases = ['anotar una nota:', 'anotar una nota', 'guarda esto como nota:', 'guarda esto como nota', 'crea una nota con:', 'crea una nota con'];
        let matchedPhrase = annotationPhrases.find(phrase => lowerInput.includes(phrase));

        if (matchedPhrase) {
            let noteContent = input.substring(input.toLowerCase().indexOf(matchedPhrase) + matchedPhrase.length).trim();
            if (noteContent.length > 0) {
                let noteTitle = noteContent.split('.')[0].substring(0, 50).trim() || `Nota del chat - ${new Date().toLocaleDateString('es-ES')}`;
                saveNoteFromChat(noteTitle, noteContent);
                return;
            } else {
                displayMessage('milo', 'Entendido, ¿qué quieres que anote? Por favor, dime el contenido de la nota después de "anotar una nota:".');
                return;
            }
        }

        if (lowerInput.includes('clima') || lowerInput.includes('tiempo')) {
            try {
                displayMessage('milo', '¡Claro! Dame un momento para consultar el clima.');
                const location = await getUserLocation();
                getWeather(location.lat, location.lon);
            } catch (error) {
                displayMessage('milo', `Lo siento, no pude obtener tu ubicación para consultar el clima. Error: ${error.message}`);
            }
        } else if (lowerInput.includes('tarea') || lowerInput.includes('organizar') || lowerInput.includes('notas')) {
            displayMessage('milo', '¡Perfecto! Veo que quieres organizar tus ideas. Puedes hacerlo fácilmente en la sección de notas. ¿Quieres que te dirija allí? <button id="goToNotesBtn" class="chat-action-button">Ir a Notas</button>', true);
        } else if (lowerInput.includes('hola') || lowerInput.includes('buenos días')) {
            displayMessage('milo', '¡Hola! Me alegra que estés aquí. ¿En qué te puedo ayudar hoy?');
        } else if (lowerInput.includes('cómo estás') || lowerInput.includes('que tal')) {
            displayMessage('milo', '¡Estoy genial, listo para ayudarte! ¿Y tú?');
        } else if (lowerInput.includes('quién eres')) {
            displayMessage('milo', 'Soy Milo, tu asistente personal. Estoy aquí para hacer tu día a día más fácil. 😊');
        } else if (lowerInput.includes('qué puedes hacer') || lowerInput.includes('que haces')) {
            displayMessage('milo', 'Puedo ayudarte a consultar el clima, y a organizar tus tareas y notas. ¡Pregúntame lo que necesites!');
        } else if (lowerInput.includes('gracias')) {
            displayMessage('milo', 'De nada. ¡Para eso estoy! Si necesitas algo más, no dudes en preguntar. 😉');
        } else if (lowerInput.includes('adiós') || lowerInput.includes('chao')) {
            displayMessage('milo', '¡Hasta pronto! Que tengas un excelente día. 👋');
        } else if (lowerInput.includes('noticia') || lowerInput.includes('novedades locales')) {
            // Llamada simplificada y correcta
            getLocalNews();
        } else if (lowerInput.includes('tarea') || lowerInput.includes('notas')) {
            displayMessage('milo', '¡Perfecto! Veo que quieres organizar tus ideas. Puedes hacerlo fácilmente en la sección de notas. ¿Quieres que te dirija allí? <button id="goToNotesBtn" class="chat-action-button">Ir a Notas</button>', true);
        } else {
            displayMessage('milo', 'Mmm, no estoy seguro de cómo ayudarte con eso. ¿Quizás quieres saber el clima o las noticias locales? Estoy aprendiendo a cada momento. 😊');
        }
    }

    chatInput.addEventListener('focus', activateChat);

    const sendMessage = () => {
        const message = chatInput.value.trim();
        if (message) {
            processUserInput(message);
            chatInput.value = '';
        }
    };

    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    chatMessagesContainer.addEventListener('click', (e) => {
        if (e.target.id === 'goToNotesBtn') {
            window.location.href = 'notes.html';
        }
    });

    if (minimizeChatBtn) {
        minimizeChatBtn.addEventListener('click', deactivateChat);
    }

    if (weatherCard) {
        weatherCard.addEventListener('click', () => {
            activateChat();
            chatInput.value = 'Quiero saber el clima';
            sendMessage();
        });
    }

    if (tasksCard) {
        tasksCard.addEventListener('click', () => {
            activateChat();
            chatInput.value = 'Quiero organizar mis tareas';
            sendMessage();
        });
    }
    if (newsCard) {
        newsCard.addEventListener('click', () => {
            console.log("Tarjeta de noticias clickeada.");
            activateChat();
            getLocalNews();
        });

    }
});