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

  // تشغيل الموسيقى إذا كانت مفعلة
  if (musicEnabled) {
    const music = document.getElementById('birthday-music');
    if (music) {
      music.play().catch(e => console.log("Music play failed", e));
    }
  }
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
// وظيفة تبديل الموسيقى (تفعيل/تعطيل فقط في شاشة الإعدادات)
function toggleMusic() {
  const musicBtn = document.getElementById('music-btn');

  if (!musicEnabled) {
    // تفعيل الموسيقى (بدون تشغيل)
    musicEnabled = true;
    if (musicBtn) {
      musicBtn.innerHTML = '<i class="fas fa-check"></i> Music Enabled';
      musicBtn.style.backgroundColor = '#4CAF50';
    }
    updateStartButton();
  } else {
    // تعطيل الموسيقى
    musicEnabled = false;
    if (musicBtn) {
      musicBtn.innerHTML = '<i class="fas fa-music"></i> Play Music';
      musicBtn.style.backgroundColor = '';
    }
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
  let datetxt = "30 novembre 2025";
  let datatxtletter = "You are a very special girl, I wish you all the best, lots of health, and lots of joy.  I always hope we will celebrate many more birthdays like this together. Happy birthday to you Tinaaa.💕";
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

  // الترتيب: العنوان (0s) -> التاريخ (2s) -> الزر (4.5s) -> الشموع (6s) -> التوهج (7.5s)
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
        clearInterval(timeDatetxt);
      }
    }, 50)
  }, 2000); // يبدأ بعد 2 ثانية من العنوان

  // تشغيل الشموع والتوهج بعد 6 ثوانٍ
  setTimeout(function () {
    triggerCakeReveal();
  }, 6000);

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

  // إعدادات الهوامش (يمكن تعديلها من هنا)
  const margins = {
    top: 12,    // هامش علوي
    bottom: 12, // هامش سفلي
    left: 2,    // هامش أيسر (صغير جداً كما طلبت)
    right: 2    // هامش أيمن (صغير جداً كما طلبت)
  };

  // إنشاء توزيع متوازن باستخدام خوارزمية تحسين التوزيع
  createBalancedDistribution(wrapper, '✦', 35, 'star', margins);
  createBalancedDistribution(wrapper, '✿', 25, 'flower', margins);
}

// خوارزمية Best Candidate لتوزيع العناصر بشكل متناسق وذكي
function createBalancedDistribution(container, symbol, count, className, margins) {
  const positions = [];
  // استخدام الهوامش الممررة أو القيم الافتراضية
  const mTop = margins?.top ?? 12;
  const mBottom = margins?.bottom ?? 12;
  const mLeft = margins?.left ?? 12;
  const mRight = margins?.right ?? 12;

  const numCandidates = 15; // عدد المحاولات لكل عنصر (لضمان التباعد الأفضل)

  for (let i = 0; i < count; i++) {
    let bestCandidate = null;
    let maxDistance = -1;

    // تجربة عدة نقاط واختيار الأفضل (الأبعد عن النقاط الموجودة)
    for (let j = 0; j < numCandidates; j++) {
      // حساب الإحداثيات بناءً على الهوامش المحددة لكل جانب
      const x = mLeft + Math.random() * (100 - mLeft - mRight);
      const y = mTop + Math.random() * (100 - mTop - mBottom);

      let minDistance = Number.MAX_VALUE;

      if (positions.length === 0) {
        minDistance = Number.MAX_VALUE;
      } else {
        // حساب المسافة لأقرب جار
        for (const pos of positions) {
          const d = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
          if (d < minDistance) minDistance = d;
        }
      }

      // إذا كانت هذه النقطة هي الأبعد عن جيرانها حتى الآن، احفظها
      if (minDistance > maxDistance) {
        maxDistance = minDistance;
        bestCandidate = { x, y };
      }
    }

    if (bestCandidate) {
      positions.push(bestCandidate);
      createDecorElement(container, symbol, bestCandidate.x, bestCandidate.y, className, i);
    }
  }
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



function triggerCakeReveal() {
  if (cakeRevealed) return;
  const cakeContainer = document.querySelector('.cake-container');
  if (!cakeContainer) return;

  cakeRevealed = true;

  // التوهج يظهر بعد الشموع بـ 1.5 ثانية
  const glow = document.querySelector('.image-glow');
  if (glow) {
    setTimeout(() => {
      glow.classList.add('glow-visible');
      // بدء النبض بعد انتهاء الـ fade in (1.5 ثانية)
      setTimeout(() => {
        glow.classList.add('glow-pulsing');
      }, 1500);
    }, 1500);
  }

  // تهيئة الحالة الأولية
  cakeContainer.style.display = 'none';
  cakeContainer.style.opacity = '0';
  cakeContainer.classList.remove('cake-visible');

  const candlesAnimation = document.getElementById('candles-animation');

  // متغير لمنع التداخل في الأنميشن
  let isAnimating = false;

  if (candlesAnimation) {
    // إظهار الشموع مع تأثير Fade In
    candlesAnimation.style.display = 'block';
    candlesAnimation.style.opacity = '0';

    // تفعيل الانتقال بعد وقت قصير جداً لضمان تطبيق الـ opacity: 0 أولاً
    setTimeout(() => {
      candlesAnimation.style.transition = 'opacity 2s ease-in-out';
      candlesAnimation.style.opacity = '1';
    }, 50);

    // التعامل مع النقر على الشموع (إظهار الكعكة)
    candlesAnimation.onclick = function () {
      if (isAnimating) return; // منع النقر المتكرر
      isAnimating = true;

      // إخفاء الشموع
      candlesAnimation.style.transition = 'opacity 1.5s ease-in-out';
      candlesAnimation.style.opacity = '0';

      setTimeout(() => {
        candlesAnimation.style.display = 'none';

        // إظهار الكعكة
        if (cakeContainer) {
          // إعادة تعيين SVG
          const cakeSvg = cakeContainer.querySelector('#cake');
          if (cakeSvg) {
            const newSvg = cakeSvg.cloneNode(true);
            cakeSvg.replaceWith(newSvg);
          }

          cakeContainer.style.display = 'block';
          // Force reflow
          void cakeContainer.offsetWidth;

          cakeContainer.style.opacity = '1';
          cakeContainer.classList.add('cake-visible');

          // إعادة تعيين الشمعة
          const candle = document.querySelector('.cake-candle');
          if (candle) {
            candle.classList.remove('candle-drop');
            candle.style.display = 'block';
            candle.style.opacity = '0';

            void candle.offsetWidth;

            setTimeout(() => {
              candle.style.transition = 'opacity 0.5s ease-in-out';
              candle.style.opacity = '1';
              candle.classList.add('candle-drop');
              isAnimating = false; // السماح بالتفاعل مرة أخرى
            }, 7000); // تأخير ظهور الشمعة حتى تكتمل الكعكة
          } else {
            isAnimating = false;
          }
        } else {
          isAnimating = false;
        }
      }, 1500);
    };
  }

  // التعامل مع النقر على الكعكة (العودة للشموع)
  if (cakeContainer) {
    cakeContainer.style.cursor = 'pointer';
    cakeContainer.onclick = function () {
      if (isAnimating) return;
      isAnimating = true;

      // إخفاء الكعكة
      cakeContainer.style.transition = 'opacity 1.5s ease-in-out';
      cakeContainer.style.opacity = '0';
      cakeContainer.classList.remove('cake-visible');

      // إخفاء الشمعة
      const candle = document.querySelector('.cake-candle');
      if (candle) {
        candle.style.transition = 'opacity 0.5s ease-in-out';
        candle.style.opacity = '0';
      }

      setTimeout(() => {
        cakeContainer.style.display = 'none';
        if (candle) candle.style.display = 'none';

        // إظهار الشموع
        if (candlesAnimation) {
          candlesAnimation.style.display = 'block';
          void candlesAnimation.offsetWidth;
          candlesAnimation.style.transition = 'opacity 1.5s ease-in-out';
          candlesAnimation.style.opacity = '1';

          setTimeout(() => {
            isAnimating = false;
          }, 1500);
        } else {
          isAnimating = false;
        }
      }, 1500);
    };
  }
}

// Secret Message Logic
$(document).ready(function () {
  let titleClickCount = 0;
  const secretCode = "1234";
  let currentInput = "";

  // Open Modal on Title Click
  $('.title h1').click(function () {
    titleClickCount++;
    if (titleClickCount === 5) {
      openModal();
      titleClickCount = 0;
    }
  });

  function openModal() {
    const modal = $('#secret-modal');
    modal.css('display', 'flex');
    // Trigger reflow
    void modal[0].offsetWidth;
    modal.addClass('show');

    // Fade out birthday music and start heartbeat
    fadeOutMusic();
    resetInput();
  }

  function closeModal() {
    const modal = $('#secret-modal');
    modal.removeClass('show');

    setTimeout(() => {
      modal.hide();
      resetInput();
      // Reset views
      $('#secret-login').show();
      $('#secret-message').hide();
    }, 300); // Wait for transition

    // Fade in birthday music and stop heartbeat
    fadeInMusic();
  }

  // Close buttons
  $('.close-modal').click(closeModal);
  $(window).click(function (event) {
    if (event.target.id === 'secret-modal') {
      closeModal();
    }
  });

  // Keypad Input Handling
  $('.key-btn').click(function () {
    const key = $(this).data('key');
    const action = $(this).attr('id');

    if (key !== undefined) {
      handleInput(key.toString());
    } else if (action === 'key-clear') {
      resetInput();
    } else if (action === 'key-backspace') {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
    }
  });

  // Keyboard Support
  $(document).keydown(function (e) {
    if (!$('#secret-modal').hasClass('show')) return;

    if (e.key >= '0' && e.key <= '9') {
      handleInput(e.key);
    } else if (e.key === 'Backspace') {
      currentInput = currentInput.slice(0, -1);
      updateDisplay();
    } else if (e.key === 'Escape') {
      closeModal();
    }
  });

  function handleInput(char) {
    if (currentInput.length < 4) {
      currentInput += char;
      updateDisplay();

      if (currentInput.length === 4) {
        setTimeout(checkCode, 300); // Small delay before checking
      }
    }
  }

  function updateDisplay() {
    const slots = $('.code-slot');
    slots.removeClass('filled error success');
    slots.text('');

    for (let i = 0; i < 4; i++) {
      if (i < currentInput.length) {
        // slots.eq(i).text(currentInput[i]); // User requested NO text on error, but usually we show dots or numbers. 
        // User said "Visual state changes: empty/filled/success/error (without any text)".
        // Assuming "filled" means visual indicator, not necessarily the number.
        // But for usability, showing the number is better. 
        // Re-reading: "أربع خانات للرمز (divs فقط) تتغير حالتها بصريًا: فارغة/ممتلئة/نجاح/خطأ (بدون أي نص)."
        // "Without any text" might mean "no error text message".
        // But "divs only... change state visually... empty/filled" implies maybe just color/dot?
        // Let's show the number for now as it's standard, but if user meant "dots", I can change.
        // Actually, "بدون أي نص" in the context of "عند الخطأ لا يظهر أي نص" means no error message.
        // I will show the number in the slot.
        slots.eq(i).text(currentInput[i]);
        slots.eq(i).addClass('filled');
      }
    }
  }

  function resetInput() {
    currentInput = "";
    updateDisplay();
  }

  function checkCode() {
    if (currentInput === secretCode) {
      // Success
      $('.code-slot').addClass('success');

      setTimeout(() => {
        $('#secret-login').fadeOut(300, function () {
          $('#secret-message').fadeIn();
        });
      }, 500);

    } else {
      // Error
      $('.code-slot').addClass('error');

      setTimeout(() => {
        $('.code-slot').removeClass('error');
        resetInput();
      }, 600);
    }
  }

  // Helper to reset modal state if needed externally
  window.resetSecretModal = function () {
    resetInput();
    $('#secret-login').show();
    $('#secret-message').hide();
  }

  // ====== Music Fade Configuration ======
  let fadeInterval;
  const music = document.getElementById('birthday-music');
  const heartbeatMusic = document.getElementById('heartbeat-music');

  // ⚙️ Configuration for fade duration and speed
  const FADE_STEP_DURATION = 50; // مدة بين كل خطوة (بالميلي ثانية) - قلل للسرعة
  const FADE_VOLUME_STEP = 0.02; // حجم التغيير في كل خطوة - زد للسرعة

  // مدة الانخفاض الكلية ≈ (1 / FADE_VOLUME_STEP) * FADE_STEP_DURATION
  // مثال: (1 / 0.02) * 50 = 2500ms = 2.5 ثانية

  function fadeOutMusic() {
    if (!music || music.paused) return;
    clearInterval(fadeInterval);
    let volume = music.volume;

    fadeInterval = setInterval(() => {
      if (volume > FADE_VOLUME_STEP) {
        volume -= FADE_VOLUME_STEP;
        music.volume = Math.max(0, volume);
      } else {
        music.volume = 0;
        music.pause();
        clearInterval(fadeInterval);

        // تشغيل موسيقى Heartbeat
        if (heartbeatMusic) {
          heartbeatMusic.volume = 1;
          heartbeatMusic.currentTime = 0;
          heartbeatMusic.play().catch(e => console.log("Heartbeat play failed", e));
        }
      }
    }, FADE_STEP_DURATION);
  }

  function fadeInMusic() {
    if (!music) return;

    // إيقاف موسيقى Heartbeat
    if (heartbeatMusic) {
      heartbeatMusic.pause();
      heartbeatMusic.currentTime = 0;
    }

    if (music.paused) {
      music.volume = 0;
      music.play().catch(e => console.log("Music play failed", e));
    }

    clearInterval(fadeInterval);
    let volume = music.volume;

    fadeInterval = setInterval(() => {
      if (volume < (1 - FADE_VOLUME_STEP)) {
        volume += FADE_VOLUME_STEP;
        music.volume = Math.min(1, volume);
      } else {
        music.volume = 1;
        clearInterval(fadeInterval);
      }
    }, FADE_STEP_DURATION);
  }
});