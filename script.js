// ======= EDIT THIS SECTION =======
const QUIZ = [
  {
    photo: "assets/01.jpg",
    question: "What date was this picture taken?",
    choices: ["February 11th, 2024", "February 11th, 2023", "January 1st, 2028", "July 4th, 2021"],
    correctIndex: 1,
    memory: "Our first day meeting in person."
  },
  {
    photo: "assets/02.jpg",
    question: "Why are my lips and cheeks red?",
    choices: ["Your red lipstick", "You punched me", "You were on your period", "I fell on my face"],
    correctIndex: 0,
    memory: "You didn't like to eat food at this point so you ate my lips and face."
  },
  {
    photo: "assets/03.jpg",
    question: "What number visit to your house was this on?",
    choices: ["Third", "Fifth", "First", "142nd"],
    correctIndex: 2,
    memory: "I went to your house as a 'friend'."
  },
  {
    photo: "assets/04.jpg",
    question: "What did we eat right before this?",
    choices: ["Steak", "Thai", "Milkshake", "Ramen"],
    correctIndex: 3,
    memory: "We made a spontaneous plan that day and I picked you up."
  },
  {
    photo: "assets/05.jpg",
    question: "On a scale of 1-100 how nervous was I on that day?",
    choices: ["1", "100000000", "100", "50"],
    correctIndex: 1,
    memory: "This was the first day you met my family (cousins excluded)."
  },
  {
    photo: "assets/06.jpg",
    question: "What was our average rating for this place?",
    choices: ["8.5", "5", "4", "7"],
    correctIndex: 0,
    memory: "We need to eat here again."
  },
  {
    photo: "assets/07.jpg",
    question: "Who took this picture?",
    choices: ["Nihan", "Turhan", "Ahan", "Abida"],
    correctIndex: 2,
    memory: "Why did he not zoom in???"
  },
  {
    photo: "assets/08.jpg",
    question: "How much did this cost?",
    choices: ["$100", "$5", "$1,000", "It does not matter"],
    correctIndex: 3,
    memory: "InShaaAllah I can get you more and more."
  },
  {
    photo: "assets/09.jpg",
    question: "What was this little tiger's original name?",
    choices: ["Toph", "Arrax", "Viserys", "Bhotka"],
    correctIndex: 1,
    memory: "Our first baby."
  },
  {
    photo: "assets/10.jpg",
    question: "Where should out next vacation be?",
    choices: ["Wherever the wife wants", "Mars", "The Moon", "Israel"],
    correctIndex: 0,
    memory: "I do whatever my wife says!"
  }
];


// Final (11th) question screen text
const FINAL_QUESTION =
  "Will you be my Valentine for 2026 and every Valentine here after?";
// ===== END EDIT SECTION =====


// ======= App State =======
let step = 0;          // 0..10 where 10 is final
let score = 0;
let locked = false;

// ======= Elements =======
const photoEl = document.getElementById("photo");
const photoOverlay = document.getElementById("photoOverlay");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const memoryBox = document.getElementById("memoryBox");
const memoryText = document.getElementById("memoryText");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

const stepText = document.getElementById("stepText");
const scoreText = document.getElementById("scoreText");
const progressBar = document.getElementById("progressBar");

const confettiCanvas = document.getElementById("confetti");
const ctx = confettiCanvas.getContext("2d");

// ======= Helpers =======
function setProgress() {
  const total = 11; // 10 questions + final
  stepText.textContent = `${step + 1} / ${total}`;
  scoreText.textContent = `Score: ${score}`;
  const pct = ((step) / (total - 1)) * 100; // bar reaches 100% at final step
  progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
}

function clearFeedback() {
  // Always reset these on every new question
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";

  // Memory should be hidden + blank until an answer is picked
  memoryText.textContent = "";
  memoryBox.classList.add("hidden");

  nextBtn.classList.add("hidden");
  photoEl.parentElement.classList.remove("correct", "wrong");
  photoOverlay.innerHTML = "";
}

function disableChoices(disabled) {
  [...choicesEl.querySelectorAll("button")].forEach(btn => btn.disabled = disabled);
}

function renderQuestion() {
  locked = false;
  clearFeedback();
  setProgress();

  // Final step (11th) — after 10 questions
  if (step === QUIZ.length) {
    renderFinal();
    return;
  }

  const q = QUIZ[step];
  photoEl.src = q.photo;
  photoEl.alt = `Memory ${step + 1}`;

  questionEl.textContent = q.question;

  choicesEl.innerHTML = "";
  q.choices.forEach((text, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice";
    btn.textContent = text;
    btn.addEventListener("click", () => handleAnswer(idx));
    choicesEl.appendChild(btn);
  });

  // Preload next image to feel snappier
  const next = QUIZ[step + 1];
  if (next?.photo) {
    const img = new Image();
    img.src = next.photo;
  }
}

function handleAnswer(selectedIndex) {
  if (locked) return;
  locked = true;

  const q = QUIZ[step];
  const buttons = [...choicesEl.querySelectorAll("button")];

  disableChoices(true);

  const isCorrect = selectedIndex === q.correctIndex;
  if (isCorrect) score += 1;

  // Mark buttons
  buttons.forEach((btn, idx) => {
    if (idx === q.correctIndex) btn.classList.add("correct");
    if (idx === selectedIndex && !isCorrect) btn.classList.add("wrong");
  });

  // Feedback
  feedbackEl.classList.add(isCorrect ? "good" : "bad");
  feedbackEl.textContent = isCorrect ? "✅ Correct!" : "❌ Not quite (but I love you anyway).";

  // Show memory paragraph ONLY after answer
  memoryText.textContent = q.memory;
  memoryBox.classList.remove("hidden");

  // Next
  nextBtn.classList.remove("hidden");
  nextBtn.textContent = step === QUIZ.length - 1 ? "Final Question ➜" : "Next ➜";

  // Update score display immediately
  scoreText.textContent = `Score: ${score}`;
}

function renderFinal() {
  // Show last photo as a backdrop
  photoEl.src = QUIZ[QUIZ.length - 1]?.photo || "assets/10.jpg";
  photoEl.alt = "Final memory";

  questionEl.textContent = FINAL_QUESTION;

  // Reset UI
  clearFeedback();
  choicesEl.innerHTML = "";

  const yes = document.createElement("button");
  yes.className = "choice";
  yes.innerHTML = "💖 Yes (obviously)";

  const no = document.createElement("button");
  no.className = "choice";
  no.innerHTML = "🙈 No";

  yes.addEventListener("click", () => {
    disableChoices(true);
    feedbackEl.className = "feedback good";
    feedbackEl.textContent = "AHHHHH!! 💘💘💘";
    startConfetti();
    showFinalMessage();
  });

  let noClicks = 0;
  no.addEventListener("click", () => {
    noClicks++;
    if (noClicks === 1) {
      feedbackEl.className = "feedback bad";
      feedbackEl.textContent = "Wait… are you sure? 😅";
      no.innerHTML = "😳 I’m not sure";
    } else if (noClicks === 2) {
      feedbackEl.className = "feedback bad";
      feedbackEl.textContent = "Okay okay… I’ll ask nicer: pretty please? 🥺";
      no.innerHTML = "🥺 Please ask again";
    } else {
      feedbackEl.className = "feedback";
      feedbackEl.textContent = "I’ll take that as a ‘Yes’ in slow motion 😌💖";
      disableChoices(true);
      setTimeout(() => {
        feedbackEl.className = "feedback good";
        feedbackEl.textContent = "YAYYYYY 💘";
        startConfetti();
        showFinalMessage();
      }, 600);
    }
  });

  choicesEl.appendChild(yes);
  choicesEl.appendChild(no);

  // Show restart on final
  restartBtn.classList.remove("hidden");
  restartBtn.onclick = () => restart();

  // Progress bar full
  progressBar.style.width = `100%`;
  stepText.textContent = `11 / 11`;
}

function showFinalMessage() {
  memoryText.textContent =
    `Final score: ${score} / 10.\n\n` +
    `No matter what you got “right,” you’re my favorite part of every memory. ` +
    `Thank you for being my home, my best friend, and my forever Valentine.`;

  memoryBox.querySelector("h3").textContent = "One last thing… 💌";
  memoryBox.classList.remove("hidden");

  memoryBox.animate(
    [{ transform: "translateY(10px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1 }],
    { duration: 360, easing: "ease-out" }
  );
}

function nextStep() {
  if (step < QUIZ.length) step += 1;
  renderQuestion();
}

function restart() {
  step = 0;
  score = 0;
  stopConfetti();
  // restore header of memory box
  memoryBox.querySelector("h3").textContent = "Memory 💞";
  renderQuestion();
  restartBtn.classList.add("hidden");
}

nextBtn.addEventListener("click", nextStep);

// ======= Confetti (simple canvas) =======
let confettiOn = false;
let particles = [];
let rafId = null;

function resizeCanvas() {
  confettiCanvas.width = window.innerWidth * devicePixelRatio;
  confettiCanvas.height = window.innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function makeParticles(count = 140) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: -20 - Math.random() * h * 0.3,
    r: 3 + Math.random() * 5,
    vx: -1.2 + Math.random() * 2.4,
    vy: 2.2 + Math.random() * 3.4,
    rot: Math.random() * Math.PI,
    vr: -0.12 + Math.random() * 0.24,
    alpha: 0.7 + Math.random() * 0.3
  }));
}

function drawConfetti() {
  if (!confettiOn) return;

  const w = window.innerWidth;
  const h = window.innerHeight;
  ctx.clearRect(0, 0, w, h);

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    if (p.y > h + 30) {
      p.y = -20;
      p.x = Math.random() * w;
    }

    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = `hsl(${Math.floor(Math.random() * 360)}, 90%, 70%)`;
    ctx.fillRect(-p.r, -p.r, p.r * 2.2, p.r * 1.6);
    ctx.restore();
  });

  rafId = requestAnimationFrame(drawConfetti);
}

function startConfetti() {
  confettiOn = true;
  makeParticles(170);
  if (rafId) cancelAnimationFrame(rafId);
  drawConfetti();
  setTimeout(() => stopConfetti(), 5200);
}

function stopConfetti() {
  confettiOn = false;
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
}

// ======= Boot =======
renderQuestion();
