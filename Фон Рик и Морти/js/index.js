
let smokeColor = 'rgba(128, 128, 128, 1)'; // Изначальный цвет дыма, который потом меняется
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const PI2 = Math.PI * 2;

const mouse = { x: 0, y: 0, angle: 0 };
const gravity = 0.1;
const friction = 0.95;


const radius = 20;
let squid;
let squidRadius = 20;
let squidWidthFactor = 15;
let squidHeightFactor = 12;
let distanceThreshold = 50; // какая-то  дистанциия 


// вывод окна настроек
document.getElementById('settings-button').addEventListener('click', () => {
    const controls = document.getElementById('controls');
    if (controls.style.display === 'none') {
        controls.style.display = 'flex'; // Показываем настройки
    } else {
        controls.style.display = 'none'; // Скрываем настройки
    }
});

const distanceBetween = (p1, p2) => Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
const angleBetween = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1);
const randomBetween = (min, max) => ~~((Math.random() * (max - min + 1)) + min);

let w;
let wH;
let h;
let hH;


// какие-то настройки для canvas
const onResize = () => {
    w = window.innerWidth;
    h = window.innerHeight;

    wH = w >> 1;
    hH = h >> 1;

    canvas.width = w;
    canvas.height = h;
};

// обновление канваса и мыши
const updateStage = () => {
    onResize();

    mouse.x = wH;
    mouse.y = hH;

    squid = { x: mouse.x, y: mouse.y, radius, bodyWidth: radius * 2, bodyHeight: 30, angle: 0, velocity: 0 };
};





// Инициализация previousSquidPosition при старте
let lastPosition = { x: wH, y: hH }; // Начальные координаты НЛО

// Функция обновления НЛО
const updateSquid = () => {
    let targetAngle = angleBetween(squid.x, squid.y, mouse.x, mouse.y);

    const maxTilt = Math.PI / 6; // Максимальный угол наклона
    const distance = distanceBetween(squid, mouse); // Расстояние до курсора

    // Если НЛО находится близко к курсору, сбрасываем угол
    if (distance < squidDistanceThreshold) {
        targetAngle = 0;
    } else {
        if (mouse.x < squid.x && mouse.y > squid.y) {
            targetAngle = -Math.abs(targetAngle);
        } else if (mouse.x > squid.x && mouse.y > squid.y) {
            targetAngle = Math.abs(targetAngle);
        } else if (mouse.x < squid.x && mouse.y < squid.y) {
            targetAngle = -Math.abs(targetAngle);
        } else if (mouse.x > squid.x && mouse.y < squid.y) {
            targetAngle = Math.abs(targetAngle);
        }
    }

    // Ограничиваем наклон
    targetAngle = Math.max(-maxTilt, Math.min(maxTilt, targetAngle));

    // Проверяем, стоит ли НЛО на месте
    const isStationary = Math.abs(mouse.x - squid.x) < 1 && Math.abs(mouse.y - squid.y) < 1;

    if (isStationary) {
        // Плавное возвращение угла к 0, если НЛО не движется
const distanceToZero = Math.abs(squid.angle); // Расстояние от текущего угла до 0
const angleStep = Math.sign(0 - squid.angle) * Math.min(distanceToZero, Math.PI / 720); // Меньше шаг
squid.angle += angleStep;
    } else {
        // Плавное изменение угла к целевому, если НЛО движется
        const angleStep = Math.sign(targetAngle - squid.angle) * Math.min(Math.abs(targetAngle - squid.angle), Math.PI / 360);
        squid.angle += angleStep;
    }

    // Плавное движение к курсору
   if (squidSpeedFactor === null || squidSpeedFactor === undefined || squidSpeedFactor <= 0 || squidSpeedFactor ===NaN) {
    squidSpeedFactor = 1; // Присваиваем дефолтное значение
}
    const newX = squid.x + (mouse.x - squid.x) / squidSpeedFactor;
    const newY = squid.y + (mouse.y - squid.y) / squidSpeedFactor;

    // Проверка на движение НЛО
    if (Math.abs(newX - squid.x) > 0.1 || Math.abs(newY - squid.y) > 0.1) {
        generateSmoke(); // Генерация дыма при движении
    }

    // Обновление позиции НЛО
    squid.x = newX;
    squid.y = newY;

    // Обновление последней позиции
    lastPosition = { x: squid.x, y: squid.y };
};








const drawSquid = () => {
    ctx.save();
    ctx.translate(squid.x, squid.y);
    ctx.rotate(squid.angle);

    const squidWidth = squid.radius * squidWidthFactor; // Учитываем фактор ширины
    const squidHeight = squid.radius * squidHeightFactor; // Учитываем фактор высоты

    ctx.drawImage(
        squidImage,
        -squidWidth / 2, // Центрируем изображение
        -squidHeight / 2, // Центрируем изображение
        squidWidth, // Ширина
        squidHeight // Высота
    );

    ctx.restore();
};


// Loading squid image
const squidImage = new Image();
squidImage.src = './images/parallax/spaceman/jetpack.png'; // specify the path to your PNG image

// Drawing squid with image



let smokeParticles = [];

const createSmokeParticle = (x, y) => {
    smokeParticles.push({
        x,
        y,
        life: 1, // Увеличенная продолжительность жизни
        radius: smokeSize, // Больше начальный радиус
        velocityX: (Math.random() - 0.5) * smokeSpread, // Уменьшили разброс
        velocityY: Math.random() * -1, // Уменьшили вертикальное движение
        opacity: 1,
        color: `rgba(${randomBetween(150, 200)}, ${randomBetween(150, 200)}, ${randomBetween(150, 200)}, 1)`
    });
};







let smokeSize = 15; // размер дыма
let smokeFrequency = 5;
let smokeFade = 0.005; //скорость умирания
let smokeSpread = 0.5; // разброс

const frequencyInput = document.getElementById('smoke-frequency');
const frequencyValue = document.getElementById('frequency-value');

frequencyInput.addEventListener('input', (e) => {
    smokeFrequency = parseInt(e.target.value, 10); // Обновляем глобальную переменную
    frequencyValue.textContent = smokeFrequency; // Обновляем текстовое значение на экране
});

const initControls = () => {
    const squidRadiusInput = document.getElementById('squid-radius');
    const squidWidthFactorInput = document.getElementById('squid-width-factor');
    const squidHeightFactorInput = document.getElementById('squid-height-factor');
    const squidDistanceInput = document.getElementById('squid-distance');
    const squidSpeedInput = document.getElementById('squidSpeed');
    const smokeSizeInput = document.getElementById('smoke-size');
    const smokeFrequencyInput = document.getElementById('smoke-frequency');
    const smokeFadeInput = document.getElementById('smoke-fade');
    const smokeSpreadInput = document.getElementById('smoke-spread');
    const smokeColorInput = document.getElementById('smoke-color'); // Новый элемент для выбора цвета

    // Обработчики для обновления переменных
    squidRadiusInput.addEventListener('input', (e) => {
        squid.radius = parseFloat(e.target.value);
    });

    squidWidthFactorInput.addEventListener('input', (e) => {
        squidWidthFactor = parseFloat(e.target.value);
    });

    squidHeightFactorInput.addEventListener('input', (e) => {
        squidHeightFactor = parseFloat(e.target.value);
    });

    squidDistanceInput.addEventListener('input', (e) => {
        squid.distanceThreshold = parseFloat(e.target.value);
    });

    squidSpeedInput.addEventListener('input', (e) => {
        squidSpeedFactor = parseFloat(e.target.value);
    });

    smokeSizeInput.addEventListener('input', (e) => {
        smokeSize = parseFloat(e.target.value);
    });

    smokeFrequencyInput.addEventListener('input', (e) => {
        smokeFrequency = parseFloat(e.target.value);
    });

    smokeFadeInput.addEventListener('input', (e) => {
        smokeFade = parseFloat(e.target.value);
    });

    smokeSpreadInput.addEventListener('input', (e) => {
        smokeSpread = parseFloat(e.target.value);
    });

    smokeColorInput.addEventListener('input', (e) => {
        const selectedColor = e.target.value;
        updateSmokeColor(selectedColor); // Функция для изменения цвета дыма
    });
};

// Функция для обновления цвета дыма

let cursorDistanceThreshold = 200; // Минимальная дистанция до курсора
let squidDistanceThreshold = 800; // Порог дистанции НЛО

// Обработчик для минимальной дистанции до курсора
document.getElementById('distance-threshold').addEventListener('input', (event) => {
    cursorDistanceThreshold = parseInt(event.target.value, 10);
    console.log('Минимальная дистанция до курсора:', cursorDistanceThreshold);
});

// Обработчик для порога дистанции НЛО
document.getElementById('squid-distance').addEventListener('input', (event) => {
    squidDistanceThreshold = parseInt(event.target.value, 10);
    console.log('Порог дистанции НЛО:', squidDistanceThreshold);
});
// Функция обновления сцены


// Инициализация
initControls();

const distanceThresholdInput = document.getElementById('distance-threshold');
const distanceThresholdValue = document.getElementById('distance-threshold-value');

distanceThresholdInput.addEventListener('input', (e) => {
    distanceThreshold = parseInt(e.target.value, 10);
    distanceThresholdValue.textContent = distanceThreshold;
});


const generateSmoke = () => {
    const distanceToCursor = distanceBetween(squid, mouse);

    if (distanceToCursor < cursorDistanceThreshold) {
        // Если НЛО близко к курсору, дым не генерируется
        return;
    }

    const angle = squid.angle;

    // Смещения начальных позиций для дыма
    const leftOffsetX = randomBetween(-smokeSpread, smokeSpread);
    const leftOffsetY = randomBetween(-smokeSpread, smokeSpread);
    const rightOffsetX = randomBetween(-smokeSpread, smokeSpread);
    const rightOffsetY = randomBetween(-smokeSpread, smokeSpread);

    const yOffset = 15; // Смещение по оси Y

    // Для левого дыма
    const leftX = squid.x - Math.cos(angle) * squid.radius * 5.5 + leftOffsetX;
    const leftY = squid.y - Math.sin(angle) * squid.radius * 5.5 + leftOffsetY + yOffset;

    // Для правого дыма
    const rightX = squid.x + Math.cos(angle) * squid.radius * 5 + rightOffsetX;
    const rightY = squid.y + Math.sin(angle) * squid.radius * 5 + rightOffsetY + yOffset;

    // Генерация частиц дыма для левого и правого источников
    for (let i = 0; i < smokeFrequency; i++) {
        createSmokeParticle(leftX, leftY); // Левая сторона
        createSmokeParticle(rightX, rightY); // Правая сторона
    }
};

const updateSmokeColor = (color) => {
    // Преобразуем цвет из HEX в RGBA
    const hexToRgba = (hex, opacity = 1) => {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    // Обновляем цвет
    smokeColor = hexToRgba(color);
};

const updateAndDrawSmoke = () => {
    smokeParticles.forEach((p, index) => {
        // Обновление позиции и состояния частиц
        p.x += p.velocityX;
        p.y += p.velocityY;
        p.life -= smokeFade;
        p.opacity = Math.max(p.life, 0); // Прозрачность с уменьшением жизни
        p.radius = Math.max(smokeSize * p.life, 1); // Уменьшение размера с течением времени

        // Преобразуем smokeColor для использования с текущей прозрачностью
        const rgbaColor = smokeColor.replace(/rgba\((\d+), (\d+), (\d+), \d+(\.\d+)?\)/, (match, r, g, b) => {
            return `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        });

        // Рисование частиц
        ctx.beginPath();
        ctx.fillStyle = rgbaColor; // Используем выбранный цвет
        ctx.arc(p.x, p.y, p.radius, 0, PI2);
        ctx.fill();
        ctx.closePath();

        // Удаление "мертвых" частиц
        if (p.life <= 0) {
            smokeParticles.splice(index, 1);
        }
    });
};


const smokeColorInput = document.getElementById('smoke-color');

smokeColorInput.addEventListener('input', (e) => {
    updateSmokeColor(e.target.value); // Обновление цвета дыма
});























// Clear canvas
const clear = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};


let squidSpeedFactor = 100;



// Добавляем обработчики событий


// Начальное обновление параметров















const loop = () => {
    clear(); // Очистка холста
     // Генерация частиц дыма с двух источников
    updateAndDrawSmoke(); // Отображение частиц дыма
    updateSquid(); // Обновление положения НЛО
    drawSquid(); // Рисование НЛО
    

    requestAnimationFrame(loop); // Следующий кадр
};




// Сохранение значений в localStorage
const saveSettings = () => {
    const settings = {
        squidRadius: document.getElementById('squid-radius').value,
        squidWidthFactor: document.getElementById('squid-width-factor').value,
        squidHeightFactor: document.getElementById('squid-height-factor').value,
        squidDistance: document.getElementById('squid-distance').value,
        squidSpeed: document.getElementById('squidSpeed').value,
        smokeSize: document.getElementById('smoke-size').value,
        smokeFrequency: document.getElementById('smoke-frequency').value,
        smokeFade: document.getElementById('smoke-fade').value,
        smokeSpread: document.getElementById('smoke-spread').value,
        smokeColor: document.getElementById('smoke-color').value
    };
    localStorage.setItem('settings', JSON.stringify(settings)); // Сохраняем объект как строку
};

// Загрузка значений из localStorage
const loadSettings = () => {
    const savedSettings = localStorage.getItem('settings'); // Получаем строку из localStorage
    if (savedSettings) {
        const settings = JSON.parse(savedSettings); // Преобразуем строку обратно в объект
        document.getElementById('squid-radius').value = settings.squidRadius;
        document.getElementById('squid-width-factor').value = settings.squidWidthFactor;
        document.getElementById('squid-height-factor').value = settings.squidHeightFactor;
        document.getElementById('squid-distance').value = settings.squidDistance;
        document.getElementById('squidSpeed').value = settings.squidSpeed;
        document.getElementById('smoke-size').value = settings.smokeSize;
        document.getElementById('smoke-frequency').value = settings.smokeFrequency;
        document.getElementById('smoke-fade').value = settings.smokeFade;
        document.getElementById('smoke-spread').value = settings.smokeSpread;
        document.getElementById('smoke-color').value = settings.smokeColor;

        // Применяем сохранённые настройки
        squidRadius = parseFloat(settings.squidRadius);
        squidWidthFactor = parseFloat(settings.squidWidthFactor);
        squidHeightFactor = parseFloat(settings.squidHeightFactor);
        squidDistanceThreshold = parseFloat(settings.squidDistance);
        squidSpeedFactor = parseFloat(settings.squidSpeed);
        smokeSize = parseFloat(settings.smokeSize);
        smokeFrequency = parseFloat(settings.smokeFrequency);
        smokeFade = parseFloat(settings.smokeFade);
        smokeSpread = parseFloat(settings.smokeSpread);
        updateSmokeColor(settings.smokeColor); // Применяем цвет дыма
    }
};

// Восстановление настроек при загрузке страницы
window.onload = () => {
    loadSettings(); // Загружаем сохраненные настройки
    const controls = document.querySelectorAll('input');
    controls.forEach(control => {
        control.addEventListener('input', saveSettings); // Сохраняем настройки при изменении значения инпута
    });

   
};

// Обработчик кнопки сброса настроек
const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
    // Сброс значений по умолчанию
    document.getElementById('squid-radius').value = 20;
    document.getElementById('squid-width-factor').value = 15;
    document.getElementById('squid-height-factor').value = 12;
    document.getElementById('squid-distance').value = 50;
    document.getElementById('squidSpeed').value = 100;
    document.getElementById('smoke-size').value = 20;
    document.getElementById('smoke-frequency').value = 1;
    document.getElementById('smoke-fade').value = 0.01;
    document.getElementById('smoke-spread').value = 1;
    document.getElementById('smoke-color').value = '#ffffff';
    document.getElementById('distance-threshold').value = 100;

    // Сброс значений переменных
    cursorDistanceThreshold = 200;
    squidDistanceThreshold = 100;
    squidRadius = 20;
    squidWidthFactor = 15;
    squidHeightFactor = 12;
    squidSpeedFactor = 100;
    smokeSize = 20;
    smokeFrequency = 1;
    smokeFade = 0.01;
    smokeSpread = 1;
    updateSmokeColor('#ffffff'); // Обновляем цвет дыма на белый

    // Применяем изменения
    updateStage();
    saveSettings(); // Сохраняем настройки в localStorage
});








// Запуск игры
window.addEventListener('resize', onResize);
updateStage();
loop();















loadSettings();

window.addEventListener('resize', onResize);
updateStage();
loop();


const onPointerMove = (e) => {
    const target = (e.touches && e.touches.length) ? e.touches[0] : e;
    const { clientX: x, clientY: y } = target;

    mouse.x = x;
    mouse.y = y;
    mouse.angle = angleBetween(squid.x, squid.y, mouse.x, mouse.y); // Update the angle on mouse move
};

canvas.addEventListener('mousemove', onPointerMove);
canvas.addEventListener('touchmove', onPointerMove);



