// حالة الإعدادات
let fullscreenEnabled = false;
let musicEnabled = false;
let setupCompleted = false;
let letterEventsBound = false;
let cakeRevealed = false;

// كشف اتجاه الشاشة
function checkOrientation() {
  // استخدام matchMedia للتحقق من الاتجاه بشكل أدق
  const isPortrait = window.matchMedia("(orientation: portrait)").matches;

  // التحقق الإضافي باستخدام الأبعاد كاحتياط
  const isPortraitDimensions = window.innerHeight > window.innerWidth;

  if (isPortrait && isPortraitDimensions) {
    // الوضع العمودي
    document.getElementById('orientation-message').style.display = 'flex';
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('wrapper').style.display = 'none';
  } else {
    // الوضع الأفقي
    document.getElementById('orientation-message').style.display = 'none';

    // إذا لم تكتمل الإعدادات بعد، اعرض شاشة الإعدادات
    if (!setupCompleted) {
      document.getElementById('setup-screen').style.display = 'flex';
      document.getElementById('wrapper').style.display = 'none';
    } else {
      document.getElementById('setup-screen').style.display = 'none';
      document.getElementById('wrapper').style.display = 'block';
      // إظهار أزرار التحكم بعد بدء التجربة
      document.getElementById('settings-controls').style.display = 'flex';
    }
  }
}

// تحديث حالة زر البدء
function updateStartButton() {
  const startButton = document.getElementById('start-experience');
  const errorMessage = document.getElementById('setup-error');
  if (!startButton || !errorMessage) return;

  // يتطلب كلاً من الشاشة الكاملة والموسيقى
  const requirementsMet = fullscreenEnabled && musicEnabled;

  // تحديث النص بناءً على ما ينقص
  if (!requirementsMet) {
    if (!fullscreenEnabled && !musicEnabled) {
      errorMessage.innerHTML = '<i class="fas fa-exclamation-triangle warning-icon"></i> Please enable both Full Screen and Music to continue';
    } else if (!fullscreenEnabled) {
      errorMessage.innerHTML = '<i class="fas fa-exclamation-triangle warning-icon"></i> Please enable Full Screen to continue';
    } else {
      errorMessage.innerHTML = '<i class="fas fa-exclamation-triangle warning-icon"></i> Please enable Music to continue';
    }
  }

  startButton.disabled = !requirementsMet;
  errorMessage.style.display = requirementsMet ? 'none' : 'flex';
}

// التحقق عند التحميل وعند تغيير حجم النافذة
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

// زر وضع الشاشة الكاملة
document.getElementById('fullscreen-btn').addEventListener('click', function () {
  toggleFullscreen();
});

// زر تشغيل الموسيقى
document.getElementById('music-btn').addEventListener('click', function () {
  toggleMusic();
});

// بدء التجربة
document.getElementById('start-experience').addEventListener('click', function () {
  if (this.disabled) {
    // منع البدء في حال لم تتحقق الشروط
    updateStartButton();
    return;
  }

  setupCompleted = true;
  document.getElementById('setup-screen').style.display = 'none';
  document.getElementById('wrapper').style.display = 'block';
  // إظهار أزرار التحكم بعد بدء التجربة
  document.getElementById('settings-controls').style.display = 'flex';

  // بدء الرسوم المتحركة فوراً
  startAnimations();
});

// أزرار التحكم الجديدة
document.getElementById('fullscreen-control').addEventListener('click', function () {
  toggleFullscreen();
});

// زر التحكم في الصوت (Mute/Unmute)
document.getElementById('music-volume-control').addEventListener('click', function () {
  toggleVolume();
});

// وظيفة تبديل وضع الشاشة الكاملة
function toggleFullscreen() {
  const element = document.documentElement;
  const fullscreenControl = document.getElementById('fullscreen-control');
  const fullscreenBtn = document.getElementById('fullscreen-btn');

  if (!document.fullscreenElement) {
    let requestMethod = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen;

    if (requestMethod) {
      requestMethod.call(element).catch(err => {
        console.log("Fullscreen request failed", err);
        // في حال الفشل، نعتبر أنه تم التفعيل لتجنب حظر المستخدم
        fullscreenEnabled = true;
        updateStartButton();
      });
    } else {
      // المتصفح لا يدعم وضع الشاشة الكاملة (مثل iPhone Safari)
      // نعتبر أنه تم التفعيل لتجنب حظر المستخدم
      fullscreenEnabled = true;
      if (fullscreenBtn) {
        fullscreenBtn.innerHTML = '<i class="fas fa-check"></i> Full Screen (Not Supported)';
        fullscreenBtn.style.backgroundColor = '#888';
        fullscreenBtn.disabled = true;
      }
      updateStartButton();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  // سيقوم handleFullscreenChange بتحديث الواجهة فور تغير الوضع
  setTimeout(updateStartButton, 0);
}

// وظيفة تبديل الموسيقى
function toggleMusic() {
  const music = document.getElementById('birthday-music');
  const musicBtn = document.getElementById('music-btn');

  if (music.paused) {
    const playPromise = music.play();

    if (playPromise !== undefined) {
      playPromise.then(() => {
        // نجح تشغيل الموسيقى
        if (musicBtn) {
          musicBtn.innerHTML = '<i class="fas fa-pause"></i> Music Enabled';
          musicBtn.style.backgroundColor = '#4CAF50';
        }
        musicEnabled = true;
        updateStartButton();
      }).catch(error => {
        console.error('Music playback failed:', error);
        alert('Music file not found or cannot be played. You need to enable music to continue.');
        musicEnabled = false;
        updateStartButton();
      });
    } else {
      musicEnabled = true;
      if (musicBtn) {
        musicBtn.innerHTML = '<i class="fas fa-pause"></i> Music Enabled';
        musicBtn.style.backgroundColor = '#4CAF50';
      }
      updateStartButton();
    }
  } else {
    music.pause();
    if (musicBtn) {
      musicBtn.innerHTML = '<i class="fas fa-music"></i> Play Music';
      musicBtn.style.backgroundColor = '';
    }
    musicEnabled = false;
    updateStartButton();
  }
}

// وظيفة تبديل الصوت (Mute/Unmute)
function toggleVolume() {
  const music = document.getElementById('birthday-music');
  const volumeControl = document.getElementById('music-volume-control');
  const icon = volumeControl.querySelector('i');

  if (music.muted) {
    music.muted = false;
    volumeControl.classList.remove('active');
    icon.className = 'fas fa-volume-up';
  } else {
    music.muted = true;
    volumeControl.classList.add('active');
    icon.className = 'fas fa-volume-mute';
  }
}

// التعامل مع الخروج من وضع الشاشة الكاملة
document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('MSFullscreenChange', handleFullscreenChange);

function handleFullscreenChange() {
  const fullscreenControl = document.getElementById('fullscreen-control');
  const fullscreenBtn = document.getElementById('fullscreen-btn');

  if (!document.fullscreenElement) {
    fullscreenControl.classList.remove('active');
    if (fullscreenBtn) {
      fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Enable Full Screen';
      fullscreenBtn.style.backgroundColor = '';
    }
    fullscreenEnabled = false;
  } else {
    fullscreenControl.classList.add('active');
    if (fullscreenBtn) {
      fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Full Screen Enabled';
      fullscreenBtn.style.backgroundColor = '#4CAF50';
    }
    fullscreenEnabled = true;
  }

  updateStartButton();
}

// بدء الرسوم المتحركة
function startAnimations() {
  cakeRevealed = false;
  const cakeContainer = document.querySelector('.cake-container');
  if (cakeContainer) {
    cakeContainer.classList.remove('cake-visible');
  }
  const candle = document.querySelector('.cake-candle');
  if (candle) {
    candle.classList.remove('candle-drop');
  }
  const glow = document.querySelector('.image-glow');
  if (glow) {
    glow.classList.remove('glow-visible');
  }
  // النص المحدث
  let datetxt = "8 novembre 2025";
  let datatxtletter = "You are a very special girl. Today, I wish you all the best, lots of health, and lots of joy.  I always hope we will celebrate many more birthdays like this together. Happy birthday to you.💕";
  let titleLetter = "To you";
  let charArrDate = datetxt.split('');
  let charArrDateLetter = datatxtletter.split('');
  let charArrTitle = titleLetter.split('');
  let currentIndex = 0;
  let currentIndexLetter = 0;
  let currentIndexTitle = 0;
  let date__of__birth = document.querySelector(".date__of__birth span");
  let text__letter = document.querySelector(".text__letter p");

  // تحسين ظهور تاريخ الميلاد لجعله أكثر سلاسة
  let timeDatetxt;

  setTimeout(function () {
    timeDatetxt = setInterval(function () {
      if (currentIndex < charArrDate.length) {
        date__of__birth.textContent += charArrDate[currentIndex];
        currentIndex++;
      } else {
        let i = document.createElement("i");
        i.className = "fa-solid fa-star";
        document.querySelector(".date__of__birth").prepend(i);
        document.querySelector(".date__of__birth").appendChild(i.cloneNode(true));
        triggerCakeReveal();
        clearInterval(timeDatetxt);
      }
    }, 50)
  }, 2000);

  // إضافة الزخارف الرومانسية بعد اكتمال العنوان
  setTimeout(function () {
    addRomanticDecorations();
  }, 100);

  let intervalContent;
  let intervalTitle;

  if (!letterEventsBound) {
    $("#btn__letter").on("click", function () {
      $(".box__letter").slideDown();
      setTimeout(function () {
        $(".letter__border").slideDown();
      }, 1000);
      setTimeout(function () {
        intervalTitle = setInterval(function () {
          if (currentIndexTitle < charArrTitle.length) {
            document.querySelector(".title__letter").textContent += charArrTitle[currentIndexTitle];
            let i = document.createElement("i");
            i.className = "fa-solid fa-heart";
            document.querySelector(".title__letter").appendChild(i);
            currentIndexTitle++;
          } else {
            clearInterval(intervalTitle);
          }
        }, 100);
      }, 2000);
      setTimeout(function () {
        document.querySelector("#heart__letter").classList.add("animationOp");
        document.querySelector("#mewmew").classList.add("animationOp");
      }, 2800);
      setTimeout(function () {
        document.querySelectorAll(".heart").forEach((item) => {
          item.classList.add("animation");
        })
      }, 3500);
      setTimeout(function () {
        intervalContent = setInterval(function () {
          if (currentIndexLetter < charArrDateLetter.length) {
            text__letter.textContent += charArrDateLetter[currentIndexLetter];
            currentIndexLetter++;
          } else {
            clearInterval(intervalContent);
          }
        }, 30);
      }, 4000);
    });

    $(".close").on("click", function () {
      clearInterval(intervalContent);
      document.querySelector(".title__letter").textContent = "";
      text__letter.textContent = "";
      currentIndexLetter = 0;
      currentIndexTitle = 0;
      document.querySelector("#heart__letter").classList.remove("animationOp");
      document.querySelector("#mewmew").classList.remove("animationOp");
      document.querySelectorAll(".heart").forEach((item) => {
        item.classList.remove("animation");
      });
      $(".box__letter").slideUp();
      $(".letter__border").slideUp();
    });

    letterEventsBound = true;
  }
}

// تعطيل زر البدء افتراضياً حتى تتحقق الشروط
updateStartButton();

// إضافة الزخارف الرومانسية مع توزيع متوازن
function addRomanticDecorations() {
  const wrapper = document.getElementById('wrapper');

  // إزالة العناصر القديمة إن وجدت
  document.querySelectorAll('.star, .flower').forEach(el => el.remove());

  // إنشاء توزيع متوازن باستخدام خوارزمية تحسين التوزيع
  createBalancedDistribution(wrapper, '✦', 35, 'star');
  createBalancedDistribution(wrapper, '✿', 25, 'flower');
}

// خوارزمية تحسين التوزيع لمنع التكتل
function createBalancedDistribution(container, symbol, count, className) {
  const positions = [];
  const margin = 5; // هامش 5% من الحواف

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let validPosition = false;
    let x, y;

    // البحث عن موقع مناسب بعيداً عن العناصر الأخرى
    while (!validPosition && attempts < 50) {
      x = margin + Math.random() * (100 - 2 * margin);
      y = margin + Math.random() * (100 - 2 * margin);

      validPosition = isPositionValid(x, y, positions, 8); // مسافة دنيا 8% بين العناصر

      attempts++;
    }

    if (validPosition) {
      positions.push({ x, y });
      createDecorElement(container, symbol, x, y, className, i);
    }
  }
}

// التحقق من أن الموقع مناسب وغير متكتل
function isPositionValid(x, y, existingPositions, minDistance) {
  if (existingPositions.length === 0) return true;

  for (const pos of existingPositions) {
    const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
    if (distance < minDistance) {
      return false;
    }
  }
  return true;
}

// إنشاء عنصر زخرفي مع خصائص عشوائية
function createDecorElement(container, symbol, x, y, className, index) {
  const element = document.createElement('div');
  element.className = className;

  // استخدام الرمز المحدد
  element.innerHTML = symbol;

  // موضع عشوائي
  element.style.top = `${y}%`;
  element.style.left = `${x}%`;

  // حجم عشوائي (0.6 - 1.4)
  const randomScale = 0.6 + Math.random() * 0.8;
  element.style.setProperty('--scale', randomScale);
  element.style.transform = `scale(${randomScale})`;

  // تدوير عشوائي
  const randomRotation = Math.random() * 360;
  element.style.transform += ` rotate(${randomRotation}deg)`;

  // شفافية عشوائية (0.3 - 0.9)
  const randomOpacity = 0.3 + Math.random() * 0.6;
  element.style.opacity = randomOpacity;

  // تأخير عشوائي للظهور
  const randomDelay = 0.5 + Math.random() * 1.5;
  element.style.setProperty('--decorations-delay', `${randomDelay}s`);

  // تأثيرات حركية خفيفة
  if (className === 'star') {
    element.style.animation += `, gentleFloat ${8 + Math.random() * 10}s infinite ease-in-out`;
  } else {
    element.style.animation += `, gentleSway ${12 + Math.random() * 15}s infinite ease-in-out`;
  }

  container.appendChild(element);
}

// تأثير القلوب الطافية عند النقر
document.addEventListener('click', function (e) {
  createFloatingHeart(e.clientX, e.clientY);
});

// تأثير القبلة عند النقر على الكعكة
document.getElementById('cake').addEventListener('click', function (e) {
  createKissEffect(e.clientX, e.clientY);
});

// إنشاء قلب طافي
function createFloatingHeart(x, y) {
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.innerHTML = '💗';
  heart.style.left = (x - 10) + 'px';
  heart.style.top = (y - 10) + 'px';
  document.body.appendChild(heart);

  // إزالة القلب بعد انتهاء الأنيميشن
  setTimeout(() => {
    heart.remove();
  }, 2000);
}

// إنشاء تأثير قبلة
function createKissEffect(x, y) {
  const kiss = document.createElement('div');
  kiss.className = 'kiss-effect';
  kiss.innerHTML = '💋';
  kiss.style.left = (x - 20) + 'px';
  kiss.style.top = (y - 20) + 'px';
  document.body.appendChild(kiss);

  // إزالة تأثير القبلة بعد انتهاء الأنيميشن
  setTimeout(() => {
    kiss.remove();
  }, 1500);
}

function triggerCakeReveal() {
  if (cakeRevealed) return;
  const cakeContainer = document.querySelector('.cake-container');
  if (!cakeContainer) return;

  cakeRevealed = true;

  const glow = document.querySelector('.image-glow');
  if (glow) {
    setTimeout(() => {
      glow.classList.add('glow-visible');
    }, 800);
  }

  // تهيئة الحالة الأولية: إخفاء الكعكة وإظهار الشموع
  if (cakeContainer) {
    cakeContainer.style.display = 'none';
    cakeContainer.style.opacity = '0';
  }

  const candlesAnimation = document.getElementById('candles-animation');
  if (candlesAnimation) {
    candlesAnimation.style.display = 'block';
    candlesAnimation.style.opacity = '1';

    // إضافة مستمع حدث للنقر على الشموع
    candlesAnimation.addEventListener('click', function () {
      // إخفاء الشموع
      candlesAnimation.style.transition = 'opacity 1s';
      candlesAnimation.style.opacity = '0';

      setTimeout(() => {
        candlesAnimation.style.display = 'none';

        // إظهار الكعكة
        if (cakeContainer) {
          // استنساخ SVG لإعادة تشغيل الأنميشن
          const cakeSvg = cakeContainer.querySelector('#cake');
          if (cakeSvg) {
            const newSvg = cakeSvg.cloneNode(true);
            cakeSvg.replaceWith(newSvg);
          }

          cakeContainer.style.display = 'block';
          cakeContainer.classList.add('cake-visible');

          // Trigger reflow
          void cakeContainer.offsetWidth;
          cakeContainer.style.opacity = '1';

          // إظهار الشمعة مع الأنميشن
          const candle = document.querySelector('.cake-candle');
          if (candle) {
            candle.classList.remove('candle-drop');
            candle.style.display = 'block';
            candle.style.opacity = '0'; // إخفاء الشمعة في البداية

            // Trigger reflow
            void candle.offsetWidth;

            setTimeout(() => {
              candle.style.opacity = '1'; // إظهار الشمعة تدريجياً
              candle.classList.add('candle-drop');
            }, 4500);
          }
        }
      }, 1000);
    });
  }

  // إضافة مستمع حدث للنقر على الكعكة (للعودة للشموع)
  if (cakeContainer) {
    cakeContainer.style.cursor = 'pointer';
    cakeContainer.addEventListener('click', function () {
      // إزالة animation class وتعيين opacity بشكل صريح
      cakeContainer.classList.remove('cake-visible');
      cakeContainer.style.opacity = '1';
      cakeContainer.style.transform = 'translate(-50%, calc(-50% + var(--cake-center-shift))) scale(1)';

      // Force reflow to ensure the style is applied
      void cakeContainer.offsetWidth;

      // الآن إضافة fade-out class
      cakeContainer.classList.add('cake-fade-out');

      // إخفاء الشمعة
      const candle = document.querySelector('.cake-candle');
      if (candle) {
        candle.style.transition = 'opacity 2s';
        candle.style.opacity = '0';
      }

      setTimeout(() => {
        cakeContainer.style.display = 'none';
        cakeContainer.classList.remove('cake-fade-out');
        cakeContainer.style.opacity = '';
        cakeContainer.style.transform = '';
        if (candle) candle.style.display = 'none';

        // إظهار أنميشن الشموع
        if (candlesAnimation) {
          candlesAnimation.style.display = 'block';
          // Trigger reflow
          void candlesAnimation.offsetWidth;
          candlesAnimation.style.opacity = '1';
        }
      }, 2000);
    });
  }
}

// Secret Message Logic
$(document).ready(function () {
  let titleClickCount = 0;
  const secretCode = "1234";

  // Trigger on clicking "Happy Birthday" title
  $('.title h1').click(function () {
    titleClickCount++;
    if (titleClickCount === 5) {
      $('#secret-modal').fadeIn();
      titleClickCount = 0; // Reset counter
    }
  });

  // Close modal
  $('.close-modal').click(function () {
    $('#secret-modal').fadeOut();
    resetSecretModal();
  });

  // Close on clicking outside
  $(window).click(function (event) {
    if (event.target.id === 'secret-modal') {
      $('#secret-modal').fadeOut();
      resetSecretModal();
    }
  });

  // Submit code
  $('#secret-submit').click(function () {
    checkSecretCode();
  });

  // Submit on Enter key
  $('#secret-input').keypress(function (e) {
    if (e.which === 13) {
      checkSecretCode();
    }
  });

  function checkSecretCode() {
    const inputCode = $('#secret-input').val();
    if (inputCode === secretCode) {
      $('#secret-login').hide();
      $('#secret-message').fadeIn();
      $('#secret-error').hide();
    } else {
      $('#secret-error').show().addClass('shake');
      setTimeout(() => {
        $('#secret-error').removeClass('shake');
      }, 500);
    }
  }

  function resetSecretModal() {
    setTimeout(() => {
      $('#secret-login').show();
      $('#secret-message').hide();
      $('#secret-input').val('');
      $('#secret-error').hide();
    }, 500);
  }
});