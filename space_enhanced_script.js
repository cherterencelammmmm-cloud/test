        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // 設定畫布大小 (保持一定比例，適應螢幕)
        function resizeCanvas() {
            canvas.width = window.innerWidth > 800 ? 800 : window.innerWidth - 30;
            canvas.height = window.innerHeight > 600 ? 600 : window.innerHeight - 30;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let player = { x: canvas.width/2, y: canvas.height - 60, w: 40, h: 50, speed: 7, dx: 0 };
        let bullets = [];
        let enemies = [];
        let score = 0;
        let lives = 3;
        let gameRunning = false;
        let gamePaused = false;
        let frame = 0;
        let animationId;
        let explosions = [];
        let scorePopups = [];

        // 背景星星
        let stars = [];
        for(let i=0; i<100; i++) {
            stars.push({x: Math.random()*800, y: Math.random()*600, size: Math.random()*2, speed: Math.random()*0.5 + 0.1});
        }

        // 按鍵監聽
        document.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowLeft') player.dx = -player.speed;
            if(e.key === 'ArrowRight') player.dx = player.speed;
            if(e.key === ' ' && gameRunning && !gamePaused) shoot();
            if(e.key === 'p' || e.key === 'P') togglePause();
        });
        document.addEventListener('keyup', (e) => {
            if(e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
        });

        // 移動控制按鈕監聽
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        const fireBtn = document.getElementById('fireBtn');
        const pauseBtn = document.getElementById('pauseBtn');

        if (leftBtn) {
            leftBtn.addEventListener('touchstart', () => player.dx = -player.speed);
            leftBtn.addEventListener('touchend', () => player.dx = 0);
            leftBtn.addEventListener('mousedown', () => player.dx = -player.speed);
            leftBtn.addEventListener('mouseup', () => player.dx = 0);
            leftBtn.addEventListener('mouseleave', () => player.dx = 0);
        }
        if (rightBtn) {
            rightBtn.addEventListener('touchstart', () => player.dx = player.speed);
            rightBtn.addEventListener('touchend', () => player.dx = 0);
            rightBtn.addEventListener('mousedown', () => player.dx = player.speed);
            rightBtn.addEventListener('mouseup', () => player.dx = 0);
            rightBtn.addEventListener('mouseleave', () => player.dx = 0);
        }
        if (fireBtn) {
            fireBtn.addEventListener('touchstart', () => { if(gameRunning && !gamePaused) shoot(); });
            fireBtn.addEventListener('mousedown', () => { if(gameRunning && !gamePaused) shoot(); });
        }
        if (pauseBtn) {
            pauseBtn.addEventListener('click', togglePause);
        }

        function startGame() {
            document.getElementById('start-screen').style.display = 'none';
            gameRunning = true;
            gamePaused = false;
            score = 0;
            lives = 3;
            bullets = [];
            enemies = [];
            explosions = [];
            scorePopups = [];
            updateLivesDisplay();
            document.getElementById('score').innerText = score;
            loop();
        }

        function shoot() {
            bullets.push({ x: player.x, y: player.y - 25, w: 4, h: 15, speed: 10, color: '#00f3ff' });
        }

        function updateLivesDisplay() {
            document.getElementById('lives').innerText = lives;
        }

        function createExplosion(x, y, color) {
            explosions.push({
                x, y, color,
                radius: 0,
                maxRadius: 30,
                duration: 0,
                maxDuration: 30
            });
        }

        function createScorePopup(x, y, points) {
            scorePopups.push({
                x, y,
                text: `+${points}`,
                duration: 0,
                maxDuration: 60
            });
        }

        function togglePause() {
            if (!gameRunning) return;
            gamePaused = !gamePaused;
            pauseBtn.textContent = gamePaused ? '▶️' : '⏸️';
            pauseBtn.title = gamePaused ? '繼續' : '暫停';
        }

        // --- 繪製超酷飛船 ---
        function drawPlayer() {
            const x = player.x;
            const y = player.y;

            // 1. 引擎火焰 (動態閃爍)
            ctx.save();
            ctx.fillStyle = `rgba(255, 100, 0, ${Math.random() * 0.5 + 0.5})`;
            ctx.beginPath();
            ctx.moveTo(x - 10, y + 20);
            ctx.lineTo(x + 10, y + 20);
            ctx.lineTo(x, y + 20 + Math.random() * 20 + 10); // 隨機長度
            ctx.fill();
            ctx.restore();

            // 2. 飛船本體 (流線型)
            ctx.save();
            // 漸層色
            let grad = ctx.createLinearGradient(x, y - 30, x, y + 20);
            grad.addColorStop(0, '#e0f7fa');
            grad.addColorStop(0.5, '#00e5ff');
            grad.addColorStop(1, '#0091ea');
            
            ctx.fillStyle = grad;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#00e5ff';

            ctx.beginPath();
            // 機頭
            ctx.moveTo(x, y - 30);
            // 右翼
            ctx.bezierCurveTo(x + 25, y - 10, x + 20, y + 20, x, y + 20);
            // 左翼
            ctx.bezierCurveTo(x - 20, y + 20, x - 25, y - 10, x, y - 30);
            ctx.fill();
            ctx.restore();

            // 3. 駕駛艙
            ctx.fillStyle = '#1a237e';
            ctx.beginPath();
            ctx.ellipse(x, y - 5, 5, 10, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // --- 敵人繪製 (多種形狀) ---
        function drawEnemy(enemy) {
            ctx.save();
            ctx.fillStyle = enemy.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = enemy.color;
            
            // 根據形狀繪製
            if (enemy.shape === 'square') {
                ctx.fillRect(enemy.x - enemy.size/2, enemy.y - enemy.size/2, enemy.size, enemy.size);
                // 加上內部細節
                ctx.fillStyle = 'rgba(0,0,0,0.2)';
                ctx.fillRect(enemy.x - enemy.size/4, enemy.y - enemy.size/4, enemy.size/2, enemy.size/2);
            } 
            else if (enemy.shape === 'circle') {
                ctx.beginPath();
                ctx.arc(enemy.x, enemy.y, enemy.size/2, 0, Math.PI * 2);
                ctx.fill();
                // 核心光點
                ctx.fillStyle = 'white';
                ctx.beginPath();
                ctx.arc(enemy.x, enemy.y, enemy.size/6, 0, Math.PI * 2);
                ctx.fill();
            } 
            else if (enemy.shape === 'triangle') {
                ctx.beginPath();
                ctx.moveTo(enemy.x, enemy.y - enemy.size/2);
                ctx.lineTo(enemy.x + enemy.size/2, enemy.y + enemy.size/2);
                ctx.lineTo(enemy.x - enemy.size/2, enemy.y + enemy.size/2);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }

        function drawExplosions() {
            explosions.forEach((exp, index) => {
                exp.duration++;
                exp.radius = (exp.duration / exp.maxDuration) * exp.maxRadius;
                
                ctx.save();
                ctx.globalAlpha = 1 - (exp.duration / exp.maxDuration);
                ctx.fillStyle = exp.color;
                ctx.beginPath();
                ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
                
                if (exp.duration >= exp.maxDuration) {
                    explosions.splice(index, 1);
                }
            });
        }

        function drawScorePopups() {
            scorePopups.forEach((popup, index) => {
                popup.duration++;
                const y = popup.y - (popup.duration / popup.maxDuration) * 50;
                const alpha = 1 - (popup.duration / popup.maxDuration);
                
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.fillStyle = '#00f3ff';
                ctx.font = 'bold 24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(popup.text, popup.x, y);
                ctx.restore();
                
                if (popup.duration >= popup.maxDuration) {
                    scorePopups.splice(index, 1);
                }
            });
        }

        function update() {
            if(!gameRunning || gamePaused) return;
            
            // 清空畫布
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 繪製背景星空
            ctx.fillStyle = 'white';
            stars.forEach(star => {
                star.y += star.speed;
                if(star.y > canvas.height) star.y = 0;
                ctx.globalAlpha = Math.random() * 0.5 + 0.3;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI*2);
                ctx.fill();
            });
            ctx.globalAlpha = 1;

            // Player Logic
            player.x += player.dx;
            // 邊界限制
            if(player.x < 30) player.x = 30;
            if(player.x > canvas.width - 30) player.x = canvas.width - 30;
            drawPlayer();

            // Bullets Logic
            bullets.forEach((b, index) => {
                b.y -= b.speed;
                // 子彈發光效果
                ctx.save();
                ctx.shadowBlur = 10;
                ctx.shadowColor = b.color;
                ctx.fillStyle = b.color;
                ctx.fillRect(b.x - b.w/2, b.y, b.w, b.h);
                ctx.restore();

                if(b.y < 0) bullets.splice(index, 1);
            });

            // Enemies Spawning
            // 每 40 幀生成一個，比以前快 (以前是60)
            if(frame % 40 === 0) {
                const shapes = ['square', 'circle', 'triangle'];
                const colors = ['#ff6b6b', '#feca57', '#ff9ff3']; // 紅, 黃, 粉
                
                const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                
                // 速度更快：基礎 4，隨機加 3 (以前是 2+2)
                const randomSpeed = 4 + Math.random() * 3;

                enemies.push({ 
                    x: Math.random() * (canvas.width - 40) + 20, 
                    y: -30, 
                    size: Math.random() * 20 + 30, 
                    speed: randomSpeed, 
                    shape: randomShape,
                    color: randomColor
                });
            }

            // Enemies Logic
            enemies.forEach((e, eIndex) => {
                e.y += e.speed;
                drawEnemy(e);

                // 碰撞檢測：子彈擊中敵人
                // 簡單矩形判定，為了對圓形公平，判定範圍縮小一點
                bullets.forEach((b, bIndex) => {
                    const hitDist = Math.abs(b.x - e.x);
                    const hitY = Math.abs(b.y - e.y);
                    
                    if (hitDist < e.size/2 && hitY < e.size/2) {
                        // 擊中特效
                        createExplosion(e.x, e.y, e.color);
                        createScorePopup(e.x, e.y, 10);
                        
                        enemies.splice(eIndex, 1);
                        bullets.splice(bIndex, 1);
                        score += 10;
                        document.getElementById('score').innerText = score;
                    }
                });

                // 碰撞檢測：敵人撞到玩家
                // 玩家判定範圍約為 30px 半徑
                const playerDist = Math.sqrt(Math.pow(player.x - e.x, 2) + Math.pow(player.y - e.y, 2));
                if (playerDist < 35) {
                    // 減少生命值
                    lives--;
                    updateLivesDisplay();
                    createExplosion(e.x, e.y, '#ff4757');
                    enemies.splice(eIndex, 1);
                    
                    if (lives <= 0) {
                        gameOver();
                    }
                }

                if(e.y > canvas.height) enemies.splice(eIndex, 1);
            });

            // 繪製特效
            drawExplosions();
            drawScorePopups();

            frame++;
            animationId = requestAnimationFrame(update);
        }

        function loop() {
            update();
        }

        function gameOver() {
            gameRunning = false;
            cancelAnimationFrame(animationId);
            document.getElementById('final-score').innerText = score;
            document.getElementById('game-over-screen').style.display = 'block';
        }