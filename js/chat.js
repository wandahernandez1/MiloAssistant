// chat.js

document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessagesContainer = document.getElementById('chat-messages');
    const weatherCard = document.getElementById('weather-card');
    const tasksCard = document.getElementById('tasks-card');
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
        messageElement.classList.add(sender); // 

        if (isHtml) {
            messageElement.innerHTML = message;
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
            displayMessage('milo', 'Ups! Para consultar el clima, necesito tu clave API de OpenWeatherMap. Por favor, configúrala en el archivo chat.js.');
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
                const currentTemp = currentWeatherData.main.temp.toFixed(0); // Redondeado
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


    // Procesa la entrada del usuario y determina la intención.
    async function processUserInput(input) {

        activateChat();

        const lowerInput = input.toLowerCase();

        // Lógica para "Anotar Nota" 
        const annotationPhrases = ['anotar una nota:', 'anotar una nota', 'guarda esto como nota:', 'guarda esto como nota', 'crea una nota con:', 'crea una nota con'];
        let matchedPhrase = annotationPhrases.find(phrase => lowerInput.includes(phrase));

        if (matchedPhrase) {
            let noteContent = input.substring(input.toLowerCase().indexOf(matchedPhrase) + matchedPhrase.length).trim();

            if (noteContent.length > 0) {
                let noteTitle = noteContent.split('.')[0].substring(0, 50).trim();
                if (noteTitle.length === 0) {
                    noteTitle = `Nota del chat - ${new Date().toLocaleDateString('es-ES')}`;
                } else {
                    noteTitle = `Nota: ${noteTitle.charAt(0).toUpperCase() + noteTitle.slice(1)}`; // Capitaliza la primera letra
                }
                saveNoteFromChat(noteTitle, noteContent);
                return;
            } else {
                displayMessage('milo', 'Entendido, ¿qué quieres que anote? Por favor, dime el contenido de la nota después de "anotar una nota:".');
                return;
            }
        }



        // Lógica de conversación 
        if (lowerInput.includes('hola') || lowerInput.includes('buenos días') || lowerInput.includes('buenas tardes') || lowerInput.includes('buenas noches')) {
            displayMessage('milo', '¡Hola! Me alegra que estés aquí. ¿En qué te puedo ayudar hoy?');
            return;
        }
        if (lowerInput.includes('cómo estás') || lowerInput.includes('que tal')) {
            displayMessage('milo', '¡Estoy genial, listo para ayudarte! ¿Y tú? ¿Hay algo que necesites de mí?');
            return;
        }
        if (lowerInput.includes('quién eres') || lowerInput.includes('que eres') || lowerInput.includes('eres milo')) {
            displayMessage('milo', '¡Soy Milo, tu asistente personal! Estoy aquí para hacer tu día a día más fácil, ayudándote con el clima, tus tareas y mucho más. 😊');
            return;
        }
        if (lowerInput.includes('qué puedes hacer') || lowerInput.includes('que haces')) {
            displayMessage('milo', 'Puedo ayudarte a consultar el clima actual y el pronóstico, y también a organizar tus tareas en la sección de notas. ¡Pregúntame lo que necesites!');
            return;
        }
        if (lowerInput.includes('gracias') || lowerInput.includes('muchas gracias')) {
            displayMessage('milo', 'De nada. ¡Para eso estoy! Si necesitas algo más, no dudes en preguntar. 😉');
            return;
        }
        if (lowerInput.includes('adiós') || lowerInput.includes('chao') || lowerInput.includes('hasta luego')) {
            displayMessage('milo', '¡Hasta pronto! Que tengas un excelente día. Estoy aquí si me necesitas. 👋');
            return;
        }


        if (lowerInput.includes('clima') || lowerInput.includes('tiempo')) {
            try {
                displayMessage('milo', '¡Claro! Con gusto te ayudo a consultar el clima. ');
                const location = await getUserLocation();
                getWeather(location.lat, location.lon);
            } catch (error) {
                displayMessage('milo', `Lo siento, no pude obtener tu ubicación para consultar el clima. Error: ${error.message}`);
            }
        } else if (lowerInput.includes('tarea') || lowerInput.includes('organizar') || lowerInput.includes('notas')) {
            displayMessage('milo', '¡Perfecto! Veo que quieres organizar tus ideas. Puedes hacerlo fácilmente en la sección de notas. ¿Quieres que te dirija allí? <button id="goToNotesBtn" class="chat-action-button">Ir a Notas</button>', true);
        } else {

            displayMessage('milo', 'Mmm, no estoy seguro de cómo ayudarte con eso. ¿Quizás quieres saber el clima o organizar tus tareas? Estoy aprendiendo a cada momento. 😊');
        }
    }


    chatInput.addEventListener('focus', () => {
        activateChat();
    });


    sendButton.addEventListener('click', () => {
        const message = chatInput.value.trim();
        if (message) {
            displayMessage('user', message);
            processUserInput(message);
            chatInput.value = '';
        }
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });


    chatMessagesContainer.addEventListener('click', (e) => {
        if (e.target.id === 'goToNotesBtn') {
            window.location.href = 'notes.html';
        }
    });


    if (minimizeChatBtn) {
        minimizeChatBtn.addEventListener('click', () => {
            deactivateChat();
        });
    }



    if (weatherCard) {
        weatherCard.addEventListener('click', () => {
            activateChat();
            chatInput.value = 'Quiero saber el clima';
            sendButton.click();
        });
    }

    if (tasksCard) {
        tasksCard.addEventListener('click', () => {
            activateChat();
            chatInput.value = 'Quiero organizar mis tareas';
            sendButton.click();
        });
    }


});
