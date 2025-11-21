// حالة الإعدادات
let fullscreenEnabled = false;
let musicEnabled = false;
let setupCompleted = false;

// كشف اتجاه الشاشة
function checkOrientation() {
  if (window.innerHeight > window.innerWidth) {
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
  
  // تم إزالة الشرط لتفعيل زر البدء - يمكن للمستخدم الضغط عليه بدون تفعيل Full Screen والموسيقى
  startButton.disabled = false;
  errorMessage.style.display = 'none';
}

// التحقق عند التحميل وعند تغيير حجم النافذة
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', checkOrientation);

// زر وضع الشاشة الكاملة
document.getElementById('fullscreen-btn').addEventListener('click', function() {
  toggleFullscreen();
});

// زر تشغيل الموسيقى
document.getElementById('music-btn').addEventListener('click', function() {
  toggleMusic();
});

// بدء التجربة
document.getElementById('start-experience').addEventListener('click', function() {
  setupCompleted = true;
  document.getElementById('setup-screen').style.display = 'none';
  document.getElementById('wrapper').style.display = 'block';
  // إظهار أزرار التحكم بعد بدء التجربة
  document.getElementById('settings-controls').style.display = 'flex';
  
  // بدء الرسوم المتحركة فوراً
  startAnimations();
});

// أزرار التحكم الجديدة
document.getElementById('fullscreen-control').addEventListener('click', function() {
  toggleFullscreen();
});

// زر التحكم في الصوت (Mute/Unmute)
document.getElementById('music-volume-control').addEventListener('click', function() {
  toggleVolume();
});

// وظيفة تبديل وضع الشاشة الكاملة
function toggleFullscreen() {
  const element = document.documentElement;
  const fullscreenControl = document.getElementById('fullscreen-control');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  
  if (!document.fullscreenElement) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestfullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
    fullscreenControl.classList.add('active');
    if (fullscreenBtn) {
      fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Full Screen Enabled';
      fullscreenBtn.style.backgroundColor = '#4CAF50';
    }
    fullscreenEnabled = true;
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
    fullscreenControl.classList.remove('active');
    if (fullscreenBtn) {
      fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Enable Full Screen';
      fullscreenBtn.style.backgroundColor = '';
    }
    fullscreenEnabled = false;
  }
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
      }).catch(error => {
        console.error('Music playback failed:', error);
        alert('Music file not found or cannot be played. You need to enable music to continue.');
      });
    }
  } else {
    music.pause();
    if (musicBtn) {
      musicBtn.innerHTML = '<i class="fas fa-music"></i> Play Music';
      musicBtn.style.backgroundColor = '';
    }
    musicEnabled = false;
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
}

// بدء الرسوم المتحركة
function startAnimations() {
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
  setTimeout(function(){
    timeDatetxt = setInterval(function(){
      if(currentIndex < charArrDate.length){
        date__of__birth.textContent += charArrDate[currentIndex];
        currentIndex++;
      } else {
        let i = document.createElement("i");
        i.className = "fa-solid fa-star";
        document.querySelector(".date__of__birth").prepend(i);
        document.querySelector(".date__of__birth").appendChild(i.cloneNode(true));
        clearInterval(timeDatetxt);
      }
    },50)
  },2000);

  // إضافة الزخارف الرومانسية بعد اكتمال العنوان
  setTimeout(function() {
    addRomanticDecorations();
  }, 1500);

  var intervalContent;
  var intervalTitle;
  $("#btn__letter").on("click", function(){
    $(".box__letter").slideDown();
    setTimeout(function(){
      $(".letter__border").slideDown();
    },1000);
    setTimeout(function(){
      intervalTitle = setInterval(function(){
        if(currentIndexTitle < charArrTitle.length){
          document.querySelector(".title__letter").textContent += charArrTitle[currentIndexTitle];
          let i = document.createElement("i");
          i.className = "fa-solid fa-heart";
          document.querySelector(".title__letter").appendChild(i);
          currentIndexTitle++;
        } else {
          clearInterval(intervalTitle);
        }
      },100);
    },2000);
    setTimeout(function(){
      document.querySelector("#heart__letter").classList.add("animationOp");
      document.querySelector("#mewmew").classList.add("animationOp");
    },2800);
    setTimeout(function(){
      document.querySelectorAll(".heart").forEach((item)=>{
        item.classList.add("animation");
      })
    },3500);
    setTimeout(function(){
      intervalContent = setInterval(function(){
        if(currentIndexLetter < charArrDateLetter.length){
          text__letter.textContent += charArrDateLetter[currentIndexLetter];
          currentIndexLetter++;
        } else {
          clearInterval(intervalContent);
        }
      },30);
    },4000);
  });

  $(".close").on("click", function(){
    clearInterval(intervalContent);
    document.querySelector(".title__letter").textContent = "";
    text__letter.textContent = "";
    currentIndexLetter = 0;
    currentIndexTitle = 0;
    document.querySelector("#heart__letter").classList.remove("animationOp");
    document.querySelector("#mewmew").classList.remove("animationOp");
    document.querySelectorAll(".heart").forEach((item)=>{
      item.classList.remove("animation");
    });
    $(".box__letter").slideUp();
    $(".letter__border").slideUp();
  });
}

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
            positions.push({x, y});
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
document.addEventListener('click', function(e) {
  createFloatingHeart(e.clientX, e.clientY);
});

// تأثير القبلة عند النقر على الكعكة
document.getElementById('cake').addEventListener('click', function(e) {
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