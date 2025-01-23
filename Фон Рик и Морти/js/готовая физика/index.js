const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const PI2 = Math.PI * 2;

const mouse = { x: 0, y: 0, angle: 0 };
const gravity = 0.1;
const friction = 0.95;

let w;
let wH;
let h;
let hH;

const radius = 20;
let squid;
let particles = [];

const distanceBetween = (p1, p2) => Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
const angleBetween = (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1);
const randomBetween = (min, max) => ~~((Math.random() * (max - min + 1)) + min);

const onResize = () => {
    w = window.innerWidth;
    h = window.innerHeight;

    wH = w >> 1;
    hH = h >> 1;

    canvas.width = w;
    canvas.height = h;
};

const updateStage = () => {
    onResize();

    mouse.x = wH;
    mouse.y = hH;

    squid = { x: mouse.x, y: mouse.y, radius, bodyWidth: radius * 2, bodyHeight: 30, angle: 0, velocity: 0 };
};






const updateSquid = () => {
    // Рассчитываем угол между НЛО и курсором
    let targetAngle = angleBetween(squid.x, squid.y, mouse.x, mouse.y);

    // Ожидаемый угол наклона (не более 30 градусов)
    const maxTilt = Math.PI / 6; // Максимальный угол наклона: 30 градусов

    // Вычисляем расстояние между НЛО и курсором
    const distance = distanceBetween(squid, mouse);

    // Если курсор близко, выравниваем НЛО
    if (distance < 800) {  // Чем меньше значение, тем быстрее выравнивание
        targetAngle = 0;  // Выравниваем НЛО, угол наклона становится 0
    } else {
        // Если курсор движется влево и вниз, наклоняем НЛО влево
        if (mouse.x < squid.x && mouse.y > squid.y) {
            targetAngle = -Math.abs(targetAngle);  // Наклон влево вниз
        }
        // Если курсор движется вправо и вниз, наклоняем НЛО вправо
        else if (mouse.x > squid.x && mouse.y > squid.y) {
            targetAngle = Math.abs(targetAngle);  // Наклон вправо вниз
        }
        // Если курсор движется влево и вверх, наклоняем НЛО влево
        else if (mouse.x < squid.x && mouse.y < squid.y) {
            targetAngle = -Math.abs(targetAngle);  // Наклон влево вверх
        }
        // Если курсор движется вправо и вверх, наклоняем НЛО вправо
        else if (mouse.x > squid.x && mouse.y < squid.y) {
            targetAngle = Math.abs(targetAngle);  // Наклон вправо вверх
        }
    }

    // Ограничиваем угол наклона для плавного поворота (от -30 до 30 градусов)
    targetAngle = Math.max(-maxTilt, Math.min(maxTilt, targetAngle));

    // Плавное изменение угла с меньшей скоростью
    const angleDiff = targetAngle - squid.angle;
    const angleStep = Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), Math.PI / 180); // уменьшенная скорость изменения угла

    // Обновляем угол НЛО с плавным изменением
    squid.angle += angleStep;

    // Движение НЛО к курсору
    const newX = squid.x + (mouse.x - squid.x) / 50;
    const newY = squid.y + (mouse.y - squid.y) / 50;

    squid.x = newX;
    squid.y = newY;
};






const drawSquid = () => {
    ctx.save();
    ctx.translate(squid.x, squid.y); // Перемещаем к позиции НЛО
    ctx.rotate(squid.angle); // Поворачиваем НЛО по углу

    const squidWidth = squid.radius * 15; // Ширина изображения
    const squidHeight = squid.radius * 12; // Высота изображения

    // Применяем смещение, чтобы центр картинки был в центре НЛО
    ctx.drawImage(
        squidImage,
        -squidWidth / 2, // Центр по оси X
        -squidHeight / 2, // Центр по оси Y
        squidWidth,
        squidHeight
    );

    ctx.restore();
};










// Loading squid image
const squidImage = new Image();
squidImage.src = './images/parallax/spaceman/jetpack.png'; // specify the path to your PNG image

// Drawing squid with image


// Draw smoke particles
const drawParticles = () => {
    particles.forEach((p) => {
        p.radius *= 1.025;  // Увеличиваем радиус с каждым кадром
        p.life *= 0.97;     // Уменьшаем жизнь частиц
        p.isDead = p.life <= 0.1; // Убираем частицы, чья жизнь меньше 0.1

        // Учитываем угол наклона НЛО для направления дыма
        const angleOffset = squid.angle; // Угол наклона НЛО
        p.x += Math.cos(p.angle + angleOffset) * p.velocity; // Смещаем по X с учетом угла
        p.y += Math.sin(p.angle + angleOffset) * p.velocity; // Смещаем по Y с учетом угла

        // Рисуем частицы
        ctx.beginPath();
        ctx.fillStyle = `rgba(192, 192, 192, ${p.life})`;
        ctx.arc(p.x, p.y, p.radius, 0, PI2, false);
        ctx.fill();
        ctx.closePath();
    });

    // Удаляем мертвые частицы
    particles = particles.filter(p => !p.isDead);
};

// Clear canvas
const clear = () => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

const loop = () => {
    clear();
    drawParticles();

    updateSquid();
	if (Math.abs(squid.velocity) > 2 && particles.length < 200) {
    const leftOffset = -squid.radius * 5; // Смещение для левой стороны
    const rightOffset = squid.radius * 5; // Смещение для правой стороны

    // Добавляем частицу слева от НЛО
    particles.push({
        x: squid.x + leftOffset,  // Позиция слева от НЛО
        y: squid.y,
        life: 0.75,
        radius: 9,
        isDead: false,
        velocity: randomBetween(1, 3) * 0.5,
        angle: Math.random() * PI2, // Случайный угол для движения
    });

    // Добавляем частицу справа от НЛО
    particles.push({
        x: squid.x + rightOffset,  // Позиция справа от НЛО
        y: squid.y,
        life: 0.75,
        radius: 9,
        isDead: false,
        velocity: randomBetween(1, 3) * 0.5,
        angle: Math.random() * PI2, // Случайный угол для движения
    });
}

    drawSquid();

    requestAnimationFrame(loop);
};

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
