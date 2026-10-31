// --- TAILWIND CONFIGURATION ---
tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    900: '#312e81',
                },
                emerald: {
                    500: '#10b981',
                    600: '#059669',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            }
        }
    }
};

// --- ACCESSIBLE CLASSROOM PRESENTATION AND TYPOGRAPHY ---
let classroomFontScale = 1;
function applyClassroomFontScale() {
    document.documentElement.style.fontSize = `${classroomFontScale * 100}%`;
    const status = document.getElementById('classroomFontStatus');
    if (status) status.textContent = `Text size ${Math.round(classroomFontScale * 100)} percent`;
}
function adjustClassroomFont(direction) {
    classroomFontScale = Math.max(0.85, Math.min(1.4, classroomFontScale + (direction * 0.1)));
    applyClassroomFontScale();
}
function resetClassroomFont() { classroomFontScale = 1; applyClassroomFontScale(); }

// --- 1. DARK MODE TOGGLE ---
function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('themeIcon').className = isDark ? 'fa-solid fa-sun text-base' : 'fa-solid fa-moon text-base';
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
}

// ACCESS CODES REQUESTED BY THE MODULE OWNER. These are client-side gates, not secure authentication.
const ASSESSMENT_ACCESS_CODE = 'access1234';
const ANSWER_SHEET_ACCESS_CODE = 'GAS@2026';
function unlockAssessment() {
    const field = document.getElementById('assessmentAccessCode');
    const status = document.getElementById('assessmentAccessStatus');
    if (field.value === ASSESSMENT_ACCESS_CODE) {
        const section = document.getElementById('assessment');
        section.classList.remove('hidden');
        section.setAttribute('aria-hidden', 'false');
        status.textContent = 'Access granted. The assessment is now visible below.';
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        recordStudentActivity('Assessment unlocked', 'The student opened the 15-item assessment.');
        saveProgressNow();
    } else {
        status.textContent = 'Incorrect access code. Please check the code provided by your teacher.';
        field.focus();
    }
}
function unlockAnswerSheet() {
    const field = document.getElementById('answerSheetAccessCode');
    const status = document.getElementById('answerSheetAccessStatus');
    if (field.value === ANSWER_SHEET_ACCESS_CODE) {
        const content = document.getElementById('answerSheetContent');
        content.classList.remove('hidden');
        content.setAttribute('aria-hidden', 'false');
        renderAnswerSheet();
        status.textContent = 'Access granted. The answer key and explanations are displayed.';
        content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        status.textContent = 'Incorrect answer-sheet code.';
        field.focus();
    }
}
function printAnswerSheet() {
    document.body.classList.add('print-answer-sheet');
    window.print();
    setTimeout(() => document.body.classList.remove('print-answer-sheet'), 500);
}
function renderAnswerSheet() {
    const container = document.getElementById('answerSheetRows');
    if (!container || container.dataset.rendered === 'true') return;
    container.innerHTML = '';
    quizQuestions.forEach((question, index) => {
        const card = document.createElement('article');
        card.className = 'rounded-xl border border-slate-200 dark:border-slate-700 p-4';
        const title = document.createElement('h4');
        title.className = 'font-bold text-slate-900 dark:text-white';
        title.textContent = question.q;
        const answer = document.createElement('p');
        answer.className = 'mt-2 font-bold text-emerald-700 dark:text-emerald-300';
        answer.textContent = `Correct answer: ${question.options[question.correct]}`;
        const explanation = document.createElement('p');
        explanation.className = 'mt-1 text-sm text-slate-600 dark:text-slate-300';
        explanation.textContent = `Explanation: ${question.exp}`;
        card.append(title, answer, explanation);
        container.appendChild(card);
    });
    container.dataset.rendered = 'true';
}

// --- 2. LIVE BREAK-EVEN CALCULATOR ---
function calculateBreakEven() {
    const fixedInput = document.getElementById('calcFixed').value.trim();
    const priceInput = document.getElementById('calcPrice').value.trim();
    const variableInput = document.getElementById('calcVariable').value.trim();
    const fixed = fixedInput === '' ? 0 : Number(fixedInput);
    const price = priceInput === '' ? 0 : Number(priceInput);
    const variable = variableInput === '' ? 0 : Number(variableInput);

    const margin = price - variable;
    const resultDisplay = document.getElementById('calcResult');
    const marginDisplay = document.getElementById('calcMarginInfo');
    const validAmounts = [fixed, price, variable].every(value => Number.isFinite(value) && value >= 0);

    if (!validAmounts) {
        resultDisplay.innerText = "N/A";
        marginDisplay.innerText = "Error: Enter valid non-negative amounts for all costs and prices.";
        marginDisplay.className = "text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-950 text-rose-400 border border-rose-800";
    } else if (margin <= 0) {
        resultDisplay.innerText = "N/A";
        marginDisplay.innerText = "Error: Price must exceed variable cost!";
        marginDisplay.className = "text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-950 text-rose-400 border border-rose-800";
    } else {
        const breakEvenUnits = Math.ceil(fixed / margin);
        resultDisplay.innerText = Number.isSafeInteger(breakEvenUnits) ? breakEvenUnits.toLocaleString() : "N/A";
        marginDisplay.innerText = Number.isSafeInteger(breakEvenUnits)
            ? `Contribution Margin: $${margin.toFixed(2)} / unit`
            : "Error: The calculated break-even quantity is outside the supported range.";
        marginDisplay.className = Number.isSafeInteger(breakEvenUnits)
            ? "text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800"
            : "text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-950 text-rose-400 border border-rose-800";
    }
}

// --- 3. WARM-UP PITCH GENERATOR & TIMER ---
const sampleIdeas = [
    "Custom Pet Bowties & Accessories",
    "On-Demand Desk Coffee Delivery Cart",
    "Local Bicycle Tuning & Quick Repair Service",
    "Eco-friendly Upcycled Tote Bags",
    "Custom Hand-Painted Phone Cases",
    "Dorm-to-Dorm Laundry Pick-up Service"
];

function generateRandomIdea() {
    const idea = sampleIdeas[Math.floor(Math.random() * sampleIdeas.length)];
    document.getElementById('ideaDisplay').innerText = idea;
    completionEvents.ideaGenerated = true;
    if (completionEvents.timerCompleted) setSectionActivity('s3', true);
    saveProgressNow();
}

let timerInterval = null;
let timerSeconds = 60;

function togglePitchTimer() {
    const btn = document.getElementById('timerBtn');
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        btn.innerText = "Start";
        btn.className = "px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition";
    } else {
        timerInterval = setInterval(() => {
            if (timerSeconds > 0) {
                timerSeconds--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                timerInterval = null;
                alert("Time's up! Wrap up your 60-second pitch!");
                btn.innerText = "Start";
                completionEvents.timerCompleted = true;
                if (completionEvents.ideaGenerated) setSectionActivity('s3', true);
                saveProgressNow();
            }
        }, 1000);
        btn.innerText = "Pause";
        btn.className = "px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition";
    }
}

function resetPitchTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = 60;
    updateTimerDisplay();
    const btn = document.getElementById('timerBtn');
    btn.innerText = "Start";
    btn.className = "px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition";
}

function updateTimerDisplay() {
    const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
    const secs = (timerSeconds % 60).toString().padStart(2, '0');
    document.getElementById('pitchTimerDisplay').innerText = `${mins}:${secs}`;
}

// --- 4. BOARD MAPPER TOOL ---
function addMapEntry() {
    const provided = document.getElementById('mapProvided').value.trim();
    const cost = document.getElementById('mapCost').value.trim();
    const earned = document.getElementById('mapEarned').value.trim();

    if (!provided || !cost || !earned) {
        alert("Please fill in all three fields to map your experience!");
        return;
    }

    const tableBody = document.getElementById('mapTableBody');
    
    const safeRows = [
        { label: 'Provided:', value: provided, pillar: 'Value Proposition', concept: 'Product / Service Offering' },
        { label: 'Cost:', value: cost, pillar: 'Cost Structure', concept: 'Fixed & Variable Cost Inputs' },
        { label: 'Earned:', value: earned, pillar: 'Revenue & Profit', concept: 'Gross Margin & Cash Flow' }
    ];
    safeRows.reverse().forEach(entry => {
        const row = document.createElement('tr');
        const first = document.createElement('td'); first.className = 'p-3';
        const strong = document.createElement('b'); strong.className = 'text-slate-900 dark:text-white'; strong.textContent = entry.label + ' ';
        first.append(strong, document.createTextNode(entry.value));
        const second = document.createElement('td'); second.className = 'p-3';
        const tag = document.createElement('span'); tag.className = 'px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold'; tag.textContent = entry.pillar;
        second.appendChild(tag);
        const third = document.createElement('td'); third.className = 'p-3'; third.textContent = entry.concept;
        row.append(first,second,third); tableBody.prepend(row);
    });

    document.getElementById('mapProvided').value = '';
    document.getElementById('mapCost').value = '';
    document.getElementById('mapEarned').value = '';
    setSectionActivity('s4', true);
    saveProgressNow();
}

// --- 5. ACCORDION TOGGLE ---
function toggleAccordion(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById(`${id}-icon`);
    content.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
    if (!content.classList.contains('hidden')) {
        if (id === 'acc1') completionEvents.accordion1 = true;
        if (id === 'acc2') completionEvents.accordion2 = true;
        if (completionEvents.accordion1 && completionEvents.accordion2) setSectionActivity('s5', true);
        saveProgressNow();
    }
}

// --- 6. GROUP WORK TABS & FINANCIAL LEDGER TOOL ---
function switchGroupTab(groupId) {
    document.querySelectorAll('.group-tab').forEach(tab => {
        tab.className = 'group-tab px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition';
    });
    document.querySelectorAll('.group-content').forEach(c => c.classList.add('hidden'));

    document.getElementById(`tab-${groupId}`).className = 'group-tab px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap bg-indigo-600 text-white shadow-md transition';
    document.getElementById(`content-${groupId}`).classList.remove('hidden');
}

function addLedgerRow() {
    const desc = document.getElementById('ledgerDesc').value.trim();
    const budgetRaw = document.getElementById('ledgerBudget').value.trim();
    const actualRaw = document.getElementById('ledgerActual').value.trim();
    const budget = budgetRaw === '' ? NaN : Number(budgetRaw);
    const actual = actualRaw === '' ? NaN : Number(actualRaw);

    if (!desc) {
        alert("Please enter an item description.");
        return;
    }
    if (!Number.isFinite(budget) || !Number.isFinite(actual) || budget < 0 || actual < 0) {
        alert("Please enter valid non-negative amounts for both Budget and Actual Cost.");
        return;
    }

    const diff = budget - actual;
    const varianceText = diff >= 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`;
    const varianceClass = diff >= 0 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold';

    const tbody = document.getElementById('ledgerTableBody');
    const tr = document.createElement('tr');
    const cells = [desc, `$${budget.toFixed(2)}`, `$${actual.toFixed(2)}`, varianceText, diff >= 0 ? 'Under budget' : 'Over budget - adjust'];
    cells.forEach((value, index) => {
        const td = document.createElement('td');
        td.className = index === 0 ? 'p-2 font-medium' : index === 3 ? `p-2 ${varianceClass}` : index === 4 ? 'p-2 text-slate-500' : 'p-2';
        td.textContent = value;
        tr.appendChild(td);
    });
    tbody.appendChild(tr);
    saveProgressNow();

    document.getElementById('ledgerDesc').value = '';
    document.getElementById('ledgerBudget').value = '';
    document.getElementById('ledgerActual').value = '';
}

// --- 7. 15-ITEM QUIZ DATA & LOGIC ---
const quizQuestions = [
    {
        q: "1. What primary operational metric is calculated using the formula: Fixed Costs ÷ (Price per Unit - Variable Cost per Unit)?",
        options: ["A) Customer Acquisition Cost (CAC)", "B) Customer Lifetime Value (LTV)", "C) Break-Even Point", "D) Gross Margin Revenue"],
        correct: 2,
        exp: "Break-Even Point computes the exact sales volume where total revenues equal total expenses."
    },
    {
        q: "2. An entrepreneur wants to test market demand for custom mug printing with minimal financial risk. Which approach represents a Minimum Viable Product (MVP)?",
        options: ["A) Ordering 2,000 custom mugs in advance and storing them", "B) Building a simple 1-page website displaying mockups to collect pre-orders", "C) Signing a 3-year store lease before taking orders", "D) Purchasing expensive industrial ceramic printers right away"],
        correct: 1,
        exp: "An MVP gathers maximum validated learning with minimal financial investment."
    },
    {
        q: "3. Which legal business structure separates personal assets from business liabilities while retaining pass-through taxation for owners?",
        options: ["A) Sole Proprietorship", "B) General Partnership", "C) Limited Liability Company (LLC)", "D) Informal Joint Venture"],
        correct: 2,
        exp: "An LLC provides corporate liability protection combined with pass-through partnership tax benefits."
    },
    {
        q: "4. A business founder receives a $500 payment from a client and immediately uses it to pay their personal residential utility bill from the business account. What principle is violated?",
        options: ["A) Maintaining proper legal and financial separation", "B) Optimizing Customer Acquisition Cost", "C) Calculating gross profit margins", "D) Establishing a direct sales pipeline"],
        correct: 0,
        exp: "Mixing personal and business funds risks 'piercing the corporate veil' and forfeiting legal protection."
    },
    {
        q: "5. Why is managing cash flow crucial during the early execution phase of a business?",
        options: ["A) It guarantees that total expenses will remain strictly fixed.", "B) It prevents cash crunches caused by timing gaps between payables and receivables.", "C) It eliminates the need for local business permits.", "D) It automatically lowers variable raw material costs."],
        correct: 1,
        exp: "Cash flow management ensures the business remains solvent while waiting for client payments."
    },
    {
        q: "6. Which software tool category is specifically designed to manage lead pipelines, store client details, and track communication history?",
        options: ["A) Point-of-Sale (POS) System", "B) Customer Relationship Management (CRM)", "C) Enterprise Resource Planning (ERP)", "D) Merchant Gateway Processor"],
        correct: 1,
        exp: "CRM software organizes leads, tracks buyer interactions, and manages customer relationships."
    },
    {
        q: "7. You are setting up a landing page for a cleaning service. Which element functions as the primary Call-to-Action (CTA)?",
        options: ["A) A detailed paragraph on the history of soap", "B) A prominent, clickable button labeled 'Book Your First Clean'", "C) Abstract stock photos without pricing", "D) A long terms-of-service agreement at the top"],
        correct: 1,
        exp: "A clear Call-To-Action (CTA) guides site visitors toward converting into paying clients."
    },
    {
        q: "8. What is the main operational purpose of integrating an automated payment gateway (e.g., Stripe, PayPal)?",
        options: ["A) To design marketing logos automatically", "B) To write SEO-optimized blog posts", "C) To securely process online transactions and transfer funds to the business account", "D) To file tax exemption certificates"],
        correct: 2,
        exp: "Payment gateways process digital credit/debit card payments safely."
    },
    {
        q: "9. An online seller tracks startup expenses in a ledger. They planned to spend $100 on shipping supplies but spent $130. What is the most responsible action?",
        options: ["A) Ignore the difference and spend $100 on decor", "B) Record the -$30 variance and reduce non-essential spending elsewhere to compensate", "C) Stop recording shipping expenses altogether", "D) Increase prices by 200% immediately without testing"],
        correct: 1,
        exp: "Fiscal responsibility requires tracking negative variances and reallocating funds to stay on budget."
    },
    {
        q: "10. A business owner consistently records every minor expense—from receipt fees to bank charges—in a weekly spreadsheet. What attitude does this demonstrate?",
        options: ["A) Speculative investing", "B) Financial literacy and fiscal responsibility", "C) Market diversification", "D) Passive revenue generation"],
        correct: 1,
        exp: "Active, meticulous record-keeping is the hallmark of financial literacy."
    },
    {
        q: "11. A customer receives a damaged product. In alignment with Maka-tao (concern for others), how should customer support handle this?",
        options: ["A) Refuse to answer messages and block the customer", "B) Charge a restocking fee before agreeing to review the issue", "C) Apologize empathetically and send an immediate replacement or full refund", "D) Blame the shipping courier publicly and leave the issue unresolved"],
        correct: 2,
        exp: "Maka-tao values prioritize human dignity, empathy, and customer satisfaction over immediate profit."
    },
    {
        q: "12. A coffee cart owner notices local customers have non-dairy preferences. Demonstrating Maka-tao values, what operational change should they make?",
        options: ["A) Charge double for non-dairy options to maximize profit", "B) Refuse to offer non-dairy options", "C) Offer alternative milk options at fair, accessible pricing", "D) Hide ingredient lists"],
        correct: 2,
        exp: "Respecting diverse customer health needs at fair prices reflects inclusive customer care."
    },
    {
        q: "13. Which metric directly helps an entrepreneur evaluate how efficiently marketing spending converts leads into paying clients?",
        options: ["A) Break-Even Volume", "B) Customer Acquisition Cost (CAC)", "C) Fixed Overhead Rate", "D) Gross Revenue Capacity"],
        correct: 1,
        exp: "Customer Acquisition Cost (CAC) tracks total marketing investment per acquired customer."
    },
    {
        q: "14. A bakery tracks $1,200 in weekly sales, $400 in ingredient costs, and $300 in rent. What is the gross profit before rent?",
        options: ["A) $800", "B) $500", "C) $1,600", "D) $900"],
        correct: 0,
        exp: "Gross Profit = Revenue ($1,200) - Direct Variable Costs ($400) = $800."
    },
    {
        q: "15. What makes direct outreach (cold messaging, local networking) an effective Go-To-Market (GTM) strategy for new service businesses?",
        options: ["A) It eliminates the need to deliver high quality", "B) It allows owners to secure initial clients quickly with minimal upfront capital", "C) It guarantees a 100% conversion rate across all leads", "D) It replaces the need for business registration"],
        correct: 1,
        exp: "Direct outreach provides a fast, zero-cost pipeline to initial revenue."
    }
];

let activeQuizQuestions = [];
let lastQuizResult = null;
let quizSession = { questions: [], answers: {}, submitted: false };

function shuffleArray(items) {
    const shuffled = items.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function prepareRandomizedQuiz() {
    activeQuizQuestions = shuffleArray(quizQuestions).map((question) => {
        const randomizedOptions = shuffleArray(question.options.map((option, originalIndex) => ({
            text: String(option).replace(/^[A-D]\)\s*/i, ''),
            isCorrect: originalIndex === question.correct
        })));
        return {
            q: question.q,
            options: randomizedOptions.map(option => option.text),
            correct: randomizedOptions.findIndex(option => option.isCorrect),
            exp: question.exp
        };
    });
    quizSession = { questions: activeQuizQuestions, answers: {}, submitted: false };
    lastQuizResult = null;
}

function renderQuiz() {
    const container = document.getElementById('quizForm');
    container.innerHTML = '';
    if (!Array.isArray(activeQuizQuestions) || activeQuizQuestions.length !== quizQuestions.length) {
        if (Array.isArray(quizSession.questions) && quizSession.questions.length === quizQuestions.length) {
            activeQuizQuestions = quizSession.questions;
        } else {
            prepareRandomizedQuiz();
        }
    }

    activeQuizQuestions.forEach((item, index) => {
        const qDiv = document.createElement('div');
        qDiv.className = 'p-5 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-3';

        const questionHeading = document.createElement('h4');
        questionHeading.className = 'font-bold text-slate-900 dark:text-white text-sm';
        questionHeading.textContent = `${index + 1}. ${item.q.replace(/^\d+\.\s*/, '')}`;
        qDiv.appendChild(questionHeading);

        const optionsGrid = document.createElement('div');
        optionsGrid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-2';
        item.options.forEach((option, optionIndex) => {
            const label = document.createElement('label');
            label.className = 'flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700/50 cursor-pointer text-xs font-medium text-slate-800 dark:text-slate-200 transition';
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `q${index}`;
            radio.value = String(optionIndex);
            radio.className = 'text-indigo-600 focus:ring-indigo-500';
            radio.checked = String(quizSession.answers && quizSession.answers[index]) === String(optionIndex);
            radio.disabled = !!quizSession.submitted;
            radio.addEventListener('change', () => {
                quizSession.answers[index] = String(optionIndex);
                saveProgressNow();
            });
            const optionText = document.createElement('span');
            optionText.textContent = `${String.fromCharCode(65 + optionIndex)}. ${String(option).replace(/^[A-D]\)\s*/i, '')}`;
            label.append(radio, optionText);
            optionsGrid.appendChild(label);
        });
        qDiv.appendChild(optionsGrid);

        const explanation = document.createElement('div');
        explanation.id = `quizExp${index}`;
        explanation.className = 'hidden p-3 rounded-xl bg-indigo-50 dark:bg-slate-800 text-xs text-indigo-900 dark:text-indigo-200 border border-indigo-200 dark:border-slate-700';
        const explanationLabel = document.createElement('b');
        explanationLabel.textContent = 'Explanation: ';
        explanation.append(explanationLabel, document.createTextNode(item.exp));
        qDiv.appendChild(explanation);
        container.appendChild(qDiv);
    });
}

function renderAttemptHistory() {
    const history = learningState.quizAttempts || [];
    const target = document.getElementById('quizAttemptSummary');
    if (!history.length) {
        target.textContent = 'Attempt history: No attempts yet.';
        return;
    }
    const best = Math.max(...history.map(attempt => attempt.score));
    target.textContent = `Attempts: ${history.length} | Latest: ${history[history.length - 1].score}/15 | Best: ${best}/15 | Passing score: 12/15`;
    const historyContainer = document.getElementById('quizAttemptHistory');
    historyContainer.innerHTML = '';
    history.slice().reverse().forEach(attempt => {
        const row = document.createElement('p');
        row.className = 'border-b border-slate-200 dark:border-slate-700 py-1';
        const dateText = attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : 'Date unavailable';
        row.textContent = `Attempt ${attempt.attemptNumber}: ${attempt.score}/15 • ${attempt.passed ? 'PASSED' : 'Not yet passed'} • ${dateText}`;
        historyContainer.appendChild(row);
    });
}

function gradeQuiz() {
    if (!getStudentIdentity(true)) return;
    if (lastQuizResult && document.getElementById('quizResultCard').classList.contains('hidden') === false) {
        alert('This attempt has already been submitted. Select Reset All Answers to start a new randomized attempt.');
        return;
    }
    let score = 0;
    let unanswered = 0;
    const selectedAnswers = {};
    activeQuizQuestions.forEach((item, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (!selected) unanswered++;
        else selectedAnswers[index] = String(selected.value);
        if (selected && parseInt(selected.value, 10) === item.correct) score++;
    });
    if (unanswered) {
        if (!confirm(`You left ${unanswered} question(s) unanswered. Submit this attempt anyway? Unanswered questions will be scored as incorrect.`)) return;
    }
    quizSession.answers = selectedAnswers;
    quizSession.submitted = true;
    activeQuizQuestions.forEach((item, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const expDiv = document.getElementById(`quizExp${index}`);
        expDiv.classList.remove('hidden');
        if (selected && parseInt(selected.value, 10) === item.correct) {
            expDiv.className = 'p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800';
        } else {
            expDiv.className = 'p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-xs text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800';
        }
        document.querySelectorAll(`input[name="q${index}"]`).forEach(input => input.disabled = true);
    });

    const resultCard = document.getElementById('quizResultCard');
    const scoreBadge = document.getElementById('scoreBadge');
    const scoreTitle = document.getElementById('scoreTitle');
    resultCard.classList.remove('hidden');
    scoreBadge.innerText = `${score}/15`;
    const passed = score >= 12;
    if (score >= 12) {
        scoreTitle.innerText = 'Outstanding Performance!';
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else if (score >= 8) {
        scoreTitle.innerText = 'Good Job! Review missed items.';
    } else {
        scoreTitle.innerText = 'Keep practicing! Re-read the module pillars.';
    }
    const attempt = {
        attemptNumber: (learningState.quizAttempts || []).length + 1,
        score: score,
        total: 15,
        passed: passed,
        submittedAt: new Date().toISOString(),
        studentName: document.getElementById('studentFullName').value.trim(),
        gradeSection: document.getElementById('studentGradeSection').value.trim()
    };
    learningState.quizAttempts.push(attempt);
    learningState.latestQuiz = attempt;
    recordStudentActivity('Assessment submitted', `Score: ${score}/15; ${passed ? 'Passed' : 'Did not pass'}.`);
    lastQuizResult = attempt;
    if (passed) learningState.activities.s7 = true;
    saveProgressNow();
    renderAttemptHistory();
    updateCompletionTracker();
    document.getElementById('scoreMessage').textContent = passed
        ? 'You passed the required 12/15 score. Keep completing the remaining learning activities and assignment.'
        : 'This attempt is recorded. A score of at least 12/15 is required for certificate eligibility. Review the explanations and try again.';
}

function resetQuiz() {
    if (lastQuizResult && !confirm('Start a new randomized quiz attempt? Your previous score will remain in the attempt history.')) return;
    lastQuizResult = null;
    document.getElementById('quizResultCard').classList.add('hidden');
    prepareRandomizedQuiz();
    renderQuiz();
    saveProgressNow();
}

// --- 8. ASSIGNMENT LIVE PREVIEW ---
function updateBlueprintPreview() {
    const name = document.getElementById('asgnName').value || '[Student Name]';
    const business = document.getElementById('asgnBusiness').value || '[Business Venture Name]';
    const value = document.getElementById('asgnValue').value || '"Value proposition will appear here..."';
    const price = document.getElementById('asgnPrice').value || '$0.00';
    const cost = document.getElementById('asgnCost').value || '$0.00';
    const action = document.getElementById('asgnAction').value || 'Action step...';
    const makatao = document.getElementById('asgnMakatao').value || '"Customer care promise..."';

    document.getElementById('prevName').innerText = name;
    document.getElementById('prevBusiness').innerText = business;
    document.getElementById('prevValue').innerText = `"${value}"`;
    document.getElementById('prevPriceCost').innerText = `${price} / ${cost}`;
    document.getElementById('prevAction').innerText = action;
    document.getElementById('prevMakatao').innerText = `"${makatao}"`;

    const complete = getBlueprintCompletion();
    learningState.activities.s8 = complete;
    document.getElementById('blueprintCompletionHint').textContent = complete
        ? 'All required blueprint fields are complete. Your assignment requirement is satisfied.'
        : 'Complete all seven required fields: student name, business name, value proposition, price, cost, first customer acquisition action and Maka-tao commitment.';
    saveProgressNow();
    updateCompletionTracker();
}

function getBlueprintCompletion() {
    return ['asgnName', 'asgnBusiness', 'asgnValue', 'asgnPrice', 'asgnCost', 'asgnAction', 'asgnMakatao']
        .every(id => document.getElementById(id).value.trim().length > 0);
}

// --- 9. WRAP-UP FOUNDER CERTIFICATE ---
function invalidateCertificate() {
    if (!learningState.certificate) return;
    learningState.certificate = null;
    learningState.activities.s9 = false;
    document.getElementById('certificateDisplay').classList.add('hidden');
    document.getElementById('printCertificateButton').disabled = true;
    saveProgressNow();
}

function generateCertificate() {
    const identity = getStudentIdentity(true);
    if (!identity) return;
    const name = document.getElementById('asgnName').value.trim();
    if (name.toLowerCase() !== identity.name.toLowerCase()) {
        alert('For accurate student records, the Student Name in the Business Blueprint must match the Full Name in Student Learning Record.');
        return;
    }
    const word = document.getElementById('founderWord').value.trim();
    const statement = document.getElementById('founderStatement').value.trim();
    if (!getBlueprintCompletion()) {
        alert('Complete all seven required Business Blueprint fields before claiming the certificate.');
        return;
    }
    if (!word || !statement) {
        alert('Please complete both your one-word anchor and closing statement!');
        return;
    }
    if (!isCertificateEligible()) {
        alert('Certificate eligibility is not yet met. Complete all 10 learning sections and pass the quiz with at least 12/15.');
        return;
    }

    document.getElementById('certName').innerText = name;
    document.getElementById('certWord').innerText = `"${word.toUpperCase()}"`;
    document.getElementById('certificateDisplay').classList.remove('hidden');
    learningState.activities.s9 = true;
    learningState.certificate = { name, word, statement, issuedAt: new Date().toISOString() };
    document.getElementById('printCertificateButton').disabled = false;
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    saveProgressNow();
    updateCompletionTracker();
}

function isCertificateEligible() {
    const allSectionsComplete = Object.values(learningState.activities).filter(Boolean).length >= 9;
    const otherSectionsComplete = ['s1','s2','s3','s4','s5','s6','s7','s8','s10'].every(key => learningState.activities[key] === true);
    const hasPassingAttempt = (learningState.quizAttempts || []).some(attempt => attempt.score >= 12);
    return allSectionsComplete && otherSectionsComplete && hasPassingAttempt && getBlueprintCompletion();
}

function printBusinessBlueprint() {
    if (!getBlueprintCompletion()) {
        alert('Please complete all required Business Blueprint fields before printing.');
        return;
    }
    const values = {
        name: document.getElementById('asgnName').value.trim(),
        business: document.getElementById('asgnBusiness').value.trim(),
        value: document.getElementById('asgnValue').value.trim(),
        price: document.getElementById('asgnPrice').value.trim(),
        cost: document.getElementById('asgnCost').value.trim(),
        action: document.getElementById('asgnAction').value.trim(),
        makatao: document.getElementById('asgnMakatao').value.trim(),
        section: document.getElementById('studentGradeSection').value.trim()
    };
    const sheet = document.getElementById('blueprintPrintSheet');
    sheet.innerHTML = '';
    const frame = document.createElement('div');
    frame.className = 'print-frame';
    frame.innerHTML = '<div style="text-align:center;border-bottom:2px solid #1e3a8a;padding-bottom:8mm;margin-bottom:10mm"><p style="font-size:10pt;letter-spacing:2px;color:#475569;font-weight:bold">GRADE 12 • ENTREPRENEURSHIP</p><h1 style="font-size:24pt;font-weight:800;margin:3mm 0">MY FIRST BUSINESS BLUEPRINT</h1><p style="font-size:10pt;color:#475569">Business Launch Sheet</p></div>';
    const studentLine = document.createElement('p');
    studentLine.style.cssText = 'font-size:11pt;margin-bottom:8mm';
    studentLine.textContent = `Student: ${values.name}${values.section ? '  |  ' + values.section : ''}`;
    frame.appendChild(studentLine);
    const title = document.createElement('h2');
    title.style.cssText = 'font-size:18pt;font-weight:800;margin-bottom:7mm';
    title.textContent = values.business;
    frame.appendChild(title);
    const addBlock = (heading, value) => {
        const block = document.createElement('div');
        block.style.cssText = 'margin:0 0 7mm 0;break-inside:avoid';
        const h = document.createElement('h3');
        h.style.cssText = 'font-size:10pt;text-transform:uppercase;letter-spacing:1px;color:#1e40af;margin-bottom:2mm';
        h.textContent = heading;
        const p = document.createElement('p');
        p.className = 'print-value';
        p.style.cssText = 'font-size:11pt;line-height:1.55;margin:0';
        p.textContent = value;
        block.append(h,p);
        frame.appendChild(block);
    };
    addBlock('Value Proposition', values.value);
    const grid = document.createElement('div');
    grid.className = 'print-grid';
    [['Selling Price', values.price], ['Estimated Unit Cost', values.cost]].forEach(([label, value]) => {
        const cell = document.createElement('div');
        cell.className = 'print-cell';
        const h = document.createElement('h3');
        h.style.cssText = 'font-size:9pt;color:#1e40af;text-transform:uppercase;margin-bottom:3mm';
        h.textContent = label;
        const p = document.style ? document.createElement('p') : document.createElement('p');
        p.style.cssText = 'font-size:13pt;font-weight:bold;margin:0';
        p.textContent = value;
        cell.append(h,p);
        grid.appendChild(cell);
    });
    frame.appendChild(grid);
    addBlock('First Customer Acquisition Action', values.action);
    addBlock('Maka-tao Customer Commitment', values.makatao);
    const footer = document.createElement('p');
    footer.style.cssText = 'border-top:1px solid #cbd5e1;padding-top:5mm;margin-top:12mm;font-size:9pt;color:#64748b;text-align:center';
    footer.textContent = `Prepared as a learning output • ${new Date().toLocaleDateString()}`;
    frame.appendChild(footer);
    sheet.appendChild(frame);
    document.body.classList.add('print-blueprint');
    window.print();
    setTimeout(() => document.body.classList.remove('print-blueprint'), 500);
}

function printFounderCertificate() {
    if (!learningState.certificate || !isCertificateEligible()) {
        alert('Generate the certificate after meeting all completion requirements.');
        return;
    }
    const cert = learningState.certificate;
    const sheet = document.getElementById('certificatePrintSheet');
    sheet.innerHTML = '';
    const frame = document.createElement('div');
    frame.className = 'print-frame';
    const eyebrow = document.createElement('p');
    eyebrow.style.cssText = 'font-size:11pt;letter-spacing:3px;color:#475569;font-weight:bold';
    eyebrow.textContent = 'GRADE 12 SENIOR HIGH SCHOOL ENTREPRENEURSHIP';
    const title = document.createElement('h1');
    title.style.cssText = 'font-size:28pt;font-weight:900;margin:15mm 0 8mm';
    title.textContent = 'CERTIFICATE OF COMPLETION';
    const intro = document.createElement('p');
    intro.style.cssText = 'font-size:14pt;margin:10mm 0 5mm';
    intro.textContent = 'This certificate is proudly presented to';
    const name = document.createElement('h2');
    name.style.cssText = 'font-size:24pt;font-weight:800;border-bottom:1px solid #94a3b8;padding:5mm 0;margin:0 auto 8mm;max-width:150mm';
    name.textContent = cert.name;
    const statement = document.createElement('p');
    statement.style.cssText = 'font-size:12pt;line-height:1.7;max-width:150mm;margin:0 auto';
    statement.textContent = 'For successfully completing the Implementing a Simple Business learning module, including the required learning activities, the Business Blueprint assignment, and the passing assessment.';
    const word = document.createElement('div');
    word.className = 'certificate-word';
    word.textContent = `ANCHOR VALUE: ${cert.word.toUpperCase()}`;
    const closing = document.createElement('p');
    closing.style.cssText = 'font-size:11pt;font-style:italic;line-height:1.6;margin:8mm auto;max-width:145mm';
    closing.textContent = `“${cert.statement}”`;
    const date = document.createElement('p');
    date.style.cssText = 'font-size:10pt;color:#475569;margin-top:15mm';
    date.textContent = `Date completed: ${new Date(cert.issuedAt).toLocaleDateString()}`;
    frame.append(eyebrow,title,intro,name,statement,word,closing,date);
    sheet.appendChild(frame);
    document.body.classList.add('print-certificate');
    window.print();
    setTimeout(() => document.body.classList.remove('print-certificate'), 500);
}

// --- 10. REAL SECTION-BY-SECTION COMPLETION TRACKER ---
const STORAGE_KEY = 'businessImplementationModule_v2';
const SECTION_LABELS = {
    s1: '1. Operational Pillars & Calculator', s2: '2. Learning Objectives',
    s3: '3. Warm-Up Pitch', s4: '4. Prior Learning Map',
    s5: '5. Analysis & Questions', s6: '6. Group Application',
    s7: '7. Passing Quiz', s8: '8. Business Blueprint',
    s9: '9. Founder Reflection', s10: '10. References'
};
let learningState = {
    version: 2,
    activities: { s1:false, s2:false, s3:false, s4:false, s5:false, s6:false, s7:false, s8:false, s9:false, s10:false },
    quizAttempts: [], latestQuiz: null, certificate: null, activityLog: []
};
let completionEvents = { ideaGenerated:false, timerCompleted:false, accordion1:false, accordion2:false };

function recordStudentActivity(activity, detail = '') {
    if (!Array.isArray(learningState.activityLog)) learningState.activityLog = [];
    learningState.activityLog.push({ activity, detail, occurredAt: new Date().toISOString() });
    if (learningState.activityLog.length > 300) learningState.activityLog = learningState.activityLog.slice(-300);
}

function setSectionActivity(sectionKey, completed) {
    const nextValue = !!completed;
    const previousValue = !!learningState.activities[sectionKey];
    learningState.activities[sectionKey] = nextValue;
    if (nextValue !== previousValue) recordStudentActivity(nextValue ? 'Section completed' : 'Section completion reset', SECTION_LABELS[sectionKey] || sectionKey);
    saveProgressNow();
    updateCompletionTracker();
}

function getStudentIdentity(showAlert) {
    const name = document.getElementById('studentFullName').value.trim();
    const section = document.getElementById('studentGradeSection').value.trim();
    if (!name || !section) {
        if (showAlert) alert('Please enter your Full Name and Grade & Section in the Student Learning Record before submitting the quiz or claiming a certificate.');
        if (showAlert) document.getElementById(!name ? 'studentFullName' : 'studentGradeSection').focus();
        return null;
    }
    return { name, section, email: document.getElementById('studentEmail').value.trim(), teacher: document.getElementById('studentTeacher').value.trim() };
}

function updateCompletionTracker() {
    const keys = Object.keys(SECTION_LABELS);
    const completed = keys.filter(key => learningState.activities[key]).length;
    const percent = Math.round((completed / keys.length) * 100);
    document.getElementById('moduleProgressBar').style.width = `${percent}%`;
    document.getElementById('moduleProgressPercent').innerText = `${percent}%`;
    document.getElementById('moduleProgressBarReal').style.width = `${percent}%`;
    document.getElementById('completionCount').textContent = `${completed} of ${keys.length} sections completed (${percent}%)`;
    const checklist = document.getElementById('completionChecklist');
    checklist.innerHTML = '';
    keys.forEach(key => {
        const item = document.createElement('div');
        item.className = 'flex items-start gap-2 rounded-lg bg-white dark:bg-slate-800 p-2 border border-slate-200 dark:border-slate-700';
        const icon = document.createElement('span');
        icon.className = learningState.activities[key] ? 'text-emerald-600 font-black' : 'text-slate-400 font-black';
        icon.textContent = learningState.activities[key] ? '✓' : '○';
        const label = document.createElement('span');
        label.className = learningState.activities[key] ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300';
        label.textContent = SECTION_LABELS[key];
        item.append(icon,label);
        checklist.appendChild(item);
    });
    const eligible = isCertificateEligible();
    document.getElementById('certificateEligibilityStatus').textContent = eligible
        ? 'Certificate eligibility: all required learning activities are complete and the quiz passing score has been achieved. Complete the Founder Reflection to generate the certificate.'
        : `Certificate eligibility: ${completed}/10 sections complete; quiz ${(learningState.quizAttempts || []).some(attempt => attempt.score >= 12) ? 'passing attempt recorded' : (learningState.latestQuiz ? learningState.latestQuiz.score + '/15' : 'not yet submitted')} (minimum 12/15); blueprint ${getBlueprintCompletion() ? 'complete' : 'incomplete'}.`;
    document.getElementById('printCertificateButton').disabled = !(learningState.certificate && eligible);
}

let activeProgressStorage = null;

function getAvailableStorage() {
    if (activeProgressStorage) return activeProgressStorage;
    try {
        const testKey = '__businessModuleStorageTest__';
        window.localStorage.setItem(testKey, '1');
        window.localStorage.removeItem(testKey);
        activeProgressStorage = window.localStorage;
        return activeProgressStorage;
    } catch (localError) {
        try {
            const testKey = '__businessModuleStorageTest__';
            window.sessionStorage.setItem(testKey, '1');
            window.sessionStorage.removeItem(testKey);
            activeProgressStorage = window.sessionStorage;
            return activeProgressStorage;
        } catch (sessionError) {
            return null;
        }
    }
}

function readSavedProgress() {
    const stores = [];
    try { stores.push(window.localStorage); } catch (error) {}
    try { stores.push(window.sessionStorage); } catch (error) {}
    for (const storage of stores) {
        try {
            const raw = storage.getItem(STORAGE_KEY);
            if (raw) {
                activeProgressStorage = storage;
                return JSON.parse(raw);
            }
        } catch (error) {
            console.warn('A saved module copy could not be read from one storage area:', error);
        }
    }
    return null;
}

function collectQuizAnswersFromForm() {
    if (!Array.isArray(activeQuizQuestions) || !activeQuizQuestions.length) return;
    const answers = { ...(quizSession.answers || {}) };
    activeQuizQuestions.forEach((item, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected) answers[index] = String(selected.value);
    });
    quizSession.answers = answers;
    quizSession.questions = activeQuizQuestions;
}

function saveProgressNow(options = {}) {
    const formIds = ['studentFullName','studentGradeSection','studentEmail','studentTeacher','calcFixed','calcPrice','calcVariable','mapProvided','mapCost','mapEarned','ledgerDesc','ledgerBudget','ledgerActual','asgnName','asgnBusiness','asgnValue','asgnPrice','asgnCost','asgnAction','asgnMakatao','founderWord','founderStatement','sheetsWebAppUrl','sheetsAutoSync'];
    const fields = {};
    formIds.forEach(id => { const el = document.getElementById(id); if (el) fields[id] = el.type === 'checkbox' ? el.checked : el.value; });
    ['objectivesAcknowledged','groupTaskCompleted','referencesAcknowledged'].forEach(id => { const el = document.getElementById(id); if (el) fields[id] = el.checked; });
    collectQuizAnswersFromForm();
    const payload = {
        ...learningState,
        activityLog: Array.isArray(learningState.activityLog) ? learningState.activityLog : [],
        fields,
        activities: learningState.activities,
        events: completionEvents,
        quizSession: {
            questions: activeQuizQuestions,
            answers: quizSession.answers || {},
            submitted: !!quizSession.submitted
        },
        lastQuizResult: lastQuizResult,
        mapRows: document.getElementById('mapTableBody').innerHTML,
        ledgerRows: document.getElementById('ledgerTableBody').innerHTML,
        savedAt: new Date().toISOString()
    };
    let saved = false;
    try {
        const storage = getAvailableStorage();
        if (!storage) throw new Error('Both localStorage and sessionStorage are unavailable.');
        storage.setItem(STORAGE_KEY, JSON.stringify(payload));
        saved = true;
        const status = document.getElementById('saveStatus');
        if (status) status.textContent = `Saved on this device • ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        try {
            const fallbackStorage = window.sessionStorage;
            fallbackStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            activeProgressStorage = fallbackStorage;
            saved = true;
            const status = document.getElementById('saveStatus');
            if (status) status.textContent = `Saved for this browser session only • ${new Date().toLocaleTimeString()}. Download a backup for permanent safekeeping.`;
        } catch (fallbackError) {
            const status = document.getElementById('saveStatus');
            if (status) status.textContent = 'Unable to save: persistent and session storage are full or disabled. Download a JSON backup if a saved copy is available.';
            console.error('Local progress save failed:', error, fallbackError);
        }
    }
    if (saved) localDataRevision++;
    updateCompletionTracker();
    if (!options.skipAutoSync) scheduleGoogleSheetsAutoSync();
}

function restoreProgress() {
    const saved = readSavedProgress();
    if (!saved) return;
    learningState.activities = { ...learningState.activities, ...(saved.activities || {}) };
    learningState.quizAttempts = Array.isArray(saved.quizAttempts) ? saved.quizAttempts : [];
    learningState.activityLog = Array.isArray(saved.activityLog) ? saved.activityLog : [];
    learningState.latestQuiz = saved.latestQuiz || null;
    if (learningState.quizAttempts.some(attempt => Number(attempt.score) >= 12)) learningState.activities.s7 = true;
    learningState.certificate = saved.certificate || null;
    completionEvents = { ...completionEvents, ...(saved.events || {}) };
    Object.entries(saved.fields || {}).forEach(([id,value]) => {
        const element = document.getElementById(id);
        if (!element) return;
        if (element.type === 'checkbox') element.checked = !!value;
        else element.value = value == null ? '' : String(value);
    });
    if (saved.mapRows) document.getElementById('mapTableBody').innerHTML = saved.mapRows;
    if (saved.ledgerRows) document.getElementById('ledgerTableBody').innerHTML = saved.ledgerRows;
    if (saved.quizSession && Array.isArray(saved.quizSession.questions) && saved.quizSession.questions.length === quizQuestions.length) {
        quizSession = {
            questions: saved.quizSession.questions,
            answers: saved.quizSession.answers && typeof saved.quizSession.answers === 'object' ? saved.quizSession.answers : {},
            submitted: !!saved.quizSession.submitted
        };
        activeQuizQuestions = quizSession.questions;
        lastQuizResult = saved.lastQuizResult || (quizSession.submitted ? learningState.latestQuiz : null);
    } else {
        prepareRandomizedQuiz();
    }
    if (learningState.certificate) {
        document.getElementById('certName').textContent = learningState.certificate.name;
        document.getElementById('certWord').textContent = `"${learningState.certificate.word}"`;
        document.getElementById('certificateDisplay').classList.remove('hidden');
    }
    updateBlueprintPreview();
    renderAttemptHistory();
}

function downloadMyProgressJSON() {
    saveProgressNow();
    const savedCopy = readSavedProgress();
    const data = savedCopy ? JSON.stringify(savedCopy, null, 2) : '{}';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'business-module-progress-backup.json';
    link.click();
    URL.revokeObjectURL(url);
}

// --- GOOGLE SHEETS COMPLETE DATASET SYNCHRONIZATION ---
const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxLAIF9q3TmVIf0WuIod1L2SrIuUQ83EJ-3T7J_FwCm-YdD5LQsHf7Piv5CL0qibMetEQ/exec';
let googleSheetsSyncTimer = null;
let googleSheetsSyncInProgress = false;
let googleSheetsSyncPending = false;
let localDataRevision = 0;

function buildCompleteSyncPayload() {
    let completeDataset = {};
    try {
        completeDataset = readSavedProgress() || {};
        if (completeDataset.fields) {
            delete completeDataset.fields.sheetsWebAppUrl;
            delete completeDataset.fields.sheetsAutoSync;
        }
    } catch (error) {
        console.warn('Could not read the complete saved dataset for synchronization:', error);
    }
    const identity = getStudentIdentity(false);
    const completedKeys = Object.keys(SECTION_LABELS).filter(key => learningState.activities[key]);
    return {
        recordType: 'businessImplementationModuleCompleteDataset',
        schemaVersion: 2,
        student: identity,
        activityLog: Array.isArray(learningState.activityLog) ? learningState.activityLog : [],
        activities: { ...learningState.activities },
        completionPercent: Math.round(completedKeys.length / Object.keys(SECTION_LABELS).length * 100),
        completedSections: completedKeys.map(key => SECTION_LABELS[key]),
        quizAttempts: Array.isArray(learningState.quizAttempts) ? learningState.quizAttempts : [],
        latestQuiz: learningState.latestQuiz || null,
        certificate: learningState.certificate || null,
        completeDataset: completeDataset,
        syncedAt: new Date().toISOString()
    };
}

function scheduleGoogleSheetsAutoSync() {
    const autoSync = document.getElementById('sheetsAutoSync');
    if (!autoSync || !autoSync.checked) return;
    if (googleSheetsSyncInProgress) {
        googleSheetsSyncPending = true;
        return;
    }
    if (!GOOGLE_SHEETS_WEB_APP_URL || !getStudentIdentity(false)) return;
    if (googleSheetsSyncTimer) clearTimeout(googleSheetsSyncTimer);
    const status = document.getElementById('sheetsSyncStatus');
    if (status) status.textContent = 'Automatic synchronization queued. The complete dataset will be sent after the current edits pause.';
    googleSheetsSyncTimer = setTimeout(() => {
        googleSheetsSyncTimer = null;
        syncToGoogleSheets({ automatic: true });
    }, 2500);
}

async function syncToGoogleSheets(options = {}) {
    const url = GOOGLE_SHEETS_WEB_APP_URL;
    const status = document.getElementById('sheetsSyncStatus');
    const identity = getStudentIdentity(!options.automatic);
    if (!identity) {
        if (options.automatic && status) status.textContent = 'Automatic sync is waiting for Full Name and Grade & Section.';
        return;
    }
    if (!url || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec(?:[?#].*)?$/.test(url)) {
        if (!options.automatic) alert('The built-in Google Apps Script endpoint is not configured correctly.');
        if (status) status.textContent = 'The built-in Google Apps Script endpoint is not configured correctly.';
        return;
    }
    if (googleSheetsSyncInProgress) {
        googleSheetsSyncPending = true;
        if (status) status.textContent = 'A synchronization is already running. The latest saved changes are queued for the next synchronization.';
        return;
    }
    if (googleSheetsSyncTimer) {
        clearTimeout(googleSheetsSyncTimer);
        googleSheetsSyncTimer = null;
    }
    googleSheetsSyncInProgress = true;
    saveProgressNow({ skipAutoSync: true });
    if (googleSheetsSyncTimer) {
        clearTimeout(googleSheetsSyncTimer);
        googleSheetsSyncTimer = null;
    }
    const sentRevision = localDataRevision;
    const payload = buildCompleteSyncPayload();
    if (!payload.student) { googleSheetsSyncInProgress = false; return; }
    if (status) status.textContent = options.automatic ? 'Automatically sending the complete dataset to Google Sheets…' : 'Sending the complete dataset to Google Sheets…';
    try {
        await fetch(url, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
        });
        const time = new Date().toLocaleString();
        if (status) status.textContent = `Synchronization request submitted at ${time}. Open the StudentProgress tab and verify the new row; browser confirmation is unavailable in no-cors mode.`;
        const saveStatus = document.getElementById('saveStatus');
        if (saveStatus) saveStatus.textContent = `Saved on this device • Sheets request submitted ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        if (status) status.textContent = `Synchronization failed: ${error.message}. Your complete device copy remains saved; try again when online.`;
    } finally {
        googleSheetsSyncInProgress = false;
        const autoSync = document.getElementById('sheetsAutoSync');
        const hasNewerChanges = localDataRevision !== sentRevision;
        if (googleSheetsSyncPending || (hasNewerChanges && autoSync && autoSync.checked)) {
            googleSheetsSyncPending = false;
            if (autoSync && autoSync.checked) scheduleGoogleSheetsAutoSync();
            else if (status) status.textContent += ' Newer local edits remain saved on this device; enable automatic sync or press Synchronize Complete Dataset Now.';
        }
    }
}

// --- CENTRALIZED TEACHER DASHBOARD (JSONP READ FROM APPS SCRIPT) ---
let centralTeacherProfiles = [];
let centralTeacherDashboardData = null;

function loadCentralStudentDashboard() {
    const token = document.getElementById('teacherAdminToken').value.trim();
    const url = GOOGLE_SHEETS_WEB_APP_URL;
    const status = document.getElementById('teacherDashboardStatus');
    if (!token) { status.textContent = 'Enter the administrator token configured in Apps Script.'; return; }
    if (!url || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec(?:[?#].*)?$/.test(url)) { status.textContent = 'The built-in Google Apps Script endpoint is not configured correctly.'; return; }
    status.textContent = 'Requesting the latest student profiles from Google Sheets…';
    const callbackName = `studentDashboardCallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const script = document.createElement('script');
    const separator = url.includes('?') ? '&' : '?';
    let finished = false;
    const cleanup = () => { finished = true; try { delete window[callbackName]; } catch (error) { window[callbackName] = undefined; } script.remove(); };
    window[callbackName] = data => {
        if (finished) return;
        cleanup();
        if (!data || !data.success) { status.textContent = (data && data.message) || 'The server could not return student records. Check the token and Apps Script deployment.'; return; }
        centralTeacherDashboardData = data;
        centralTeacherProfiles = Array.isArray(data.profiles) ? data.profiles : [];
        renderCentralStudentDashboard(data);
        status.textContent = `Loaded ${centralTeacherProfiles.length} latest student profile(s) from ${data.totalSubmissions} saved submission snapshot(s).`;
    };
    script.onerror = () => { if (!finished) { cleanup(); status.textContent = 'Could not connect to the dashboard endpoint. Check the Web App deployment and Apps Script doGet code.'; } };
    script.src = `${url}${separator}action=list&token=${encodeURIComponent(token)}&callback=${encodeURIComponent(callbackName)}&t=${Date.now()}`;
    document.head.appendChild(script);
}

function renderTeacherDatasetSearchTable(profiles) {
    const results = document.getElementById('teacherDatasetSearchResults');
    results.innerHTML = '';

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700';

    const table = document.createElement('table');
    table.className = 'w-full min-w-[900px] text-left text-xs';

    const thead = document.createElement('thead');
    thead.className = 'bg-slate-100 dark:bg-slate-900';
    const headerRow = document.createElement('tr');

    [
        'Student Profile',
        'Completion',
        'Latest Quiz',
        'Business Blueprint',
        'Activity / Submissions',
        'Last Sync'
    ].forEach(label => {
        const th = document.createElement('th');
        th.className = 'p-3';
        th.textContent = label;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    if (!profiles.length) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 6;
        emptyCell.className = 'p-4 text-center text-slate-500';
        emptyCell.textContent = 'No matching student records were found.';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
    } else {
        profiles.forEach(profile => {
            const tr = document.createElement('tr');
            tr.className = 'border-t border-slate-200 dark:border-slate-700 align-top';

            const name = document.createElement('td');
            name.className = 'p-3';
            name.textContent = `${profile.name || 'Unnamed'}\n${profile.section || ''}${profile.teacher ? ` • ${profile.teacher}` : ''}`;

            const completion = document.createElement('td');
            completion.className = 'p-3';
            completion.textContent = `${Number(profile.completionPercent || 0)}%`;

            const quiz = document.createElement('td');
            quiz.className = 'p-3';
            quiz.textContent = profile.latestQuiz
                ? `${profile.latestQuiz.score}/${profile.latestQuiz.total || 15}`
                : 'No quiz yet';

            const blueprint = document.createElement('td');
            blueprint.className = 'p-3';
            const bp = profile.blueprint || {};
            blueprint.textContent = bp.businessName || bp.name || 'Not submitted';

            const activity = document.createElement('td');
            activity.className = 'p-3';
            activity.textContent = `${(profile.activityLog || []).length} activity events • ${profile.submissions || 1} snapshots`;

            const synced = document.createElement('td');
            synced.className = 'p-3';
            synced.textContent = profile.syncedAt
                ? new Date(profile.syncedAt).toLocaleString()
                : 'Unknown';

            tr.append(name, completion, quiz, blueprint, activity, synced);
            tbody.appendChild(tr);
        });
    }

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    results.appendChild(tableWrapper);
}

function searchTeacherStudentDataset() {
    const input = document.getElementById('teacherStudentNameSearch');
    const query = input ? input.value.trim().toLocaleLowerCase() : '';
    const status = document.getElementById('teacherDatasetSearchStatus');

    if (!centralTeacherDashboardData) {
        status.textContent = 'Load Central Student Records before searching.';
        document.getElementById('teacherDatasetSearchResults').innerHTML = '';
        return;
    }
    if (!query) {
        status.textContent = 'Enter a student name to search.';
        document.getElementById('teacherDatasetSearchResults').innerHTML = '';
        return;
    }

    const matches = centralTeacherProfiles.filter(profile =>
        String(profile.name || '').toLocaleLowerCase().includes(query)
    );

    if (!matches.length) {
        status.textContent = `No student name matching "${input.value.trim()}" was found.`;
        renderTeacherDatasetSearchTable([]);
        return;
    }

    status.textContent = `Found ${matches.length} matching student profile(s).`;
    renderTeacherDatasetSearchTable(matches);
}

function searchTeacherSectionDataset() {
    const input = document.getElementById('teacherSectionSearch');
    const query = input ? input.value.trim().toLocaleLowerCase() : '';
    const status = document.getElementById('teacherDatasetSearchStatus');

    if (!centralTeacherDashboardData) {
        status.textContent = 'Load Central Student Records before searching.';
        document.getElementById('teacherDatasetSearchResults').innerHTML = '';
        return;
    }
    if (!query) {
        status.textContent = 'Enter a grade and section to view the class dataset.';
        document.getElementById('teacherDatasetSearchResults').innerHTML = '';
        return;
    }

    const matches = centralTeacherProfiles.filter(profile =>
        String(profile.section || '').toLocaleLowerCase().includes(query)
    );

    if (!matches.length) {
        status.textContent = `No class section matching "${input.value.trim()}" was found.`;
        renderTeacherDatasetSearchTable([]);
        return;
    }

    status.textContent = `Found ${matches.length} student profile(s) in the matching section(s).`;
    renderTeacherDatasetSearchTable(matches);
}

function clearTeacherDatasetSearch() {
    const studentInput = document.getElementById('teacherStudentNameSearch');
    const sectionInput = document.getElementById('teacherSectionSearch');
    const status = document.getElementById('teacherDatasetSearchStatus');
    const results = document.getElementById('teacherDatasetSearchResults');
    if (studentInput) studentInput.value = '';
    if (sectionInput) sectionInput.value = '';
    if (status) status.textContent = centralTeacherDashboardData ? 'Search cleared. The loaded student records are ready.' : 'No search has been performed.';
    if (results) results.innerHTML = '';
}

function renderCentralStudentDashboard(data) {
    const profiles = Array.isArray(data.profiles) ? data.profiles : [];
    const summary = document.getElementById('teacherDashboardSummary');
    const rows = document.getElementById('teacherDashboardRows');
    const average = profiles.length ? Math.round(profiles.reduce((sum, item) => sum + Number(item.completionPercent || 0), 0) / profiles.length) : 0;
    const passed = profiles.filter(item => item.latestQuiz && Number(item.latestQuiz.score) >= 12).length;
    const cards = [ ['Student profiles', profiles.length], ['Average completion', `${average}%`], ['Passing latest quiz', passed], ['Submission snapshots', Number(data.totalSubmissions || 0)] ];
    summary.innerHTML = '';
    cards.forEach(([label, value]) => {
        const card = document.createElement('div'); card.className = 'rounded-xl bg-indigo-50 dark:bg-slate-900 p-3';
        const strong = document.createElement('div'); strong.className = 'text-2xl font-black text-indigo-700 dark:text-indigo-300'; strong.textContent = value;
        const caption = document.createElement('div'); caption.className = 'text-xs text-slate-600 dark:text-slate-300'; caption.textContent = label;
        card.append(strong, caption); summary.appendChild(card);
    });
    rows.innerHTML = '';
    if (!profiles.length) { rows.innerHTML = '<tr><td colspan="6" class="p-4 text-center">No student submissions were found.</td></tr>'; return; }
    profiles.forEach(profile => {
        const tr = document.createElement('tr'); tr.className = 'border-t border-slate-200 dark:border-slate-700 align-top';
        const name = document.createElement('td'); name.className = 'p-3'; name.textContent = `${profile.name || 'Unnamed'}\n${profile.section || ''}${profile.teacher ? ` • ${profile.teacher}` : ''}`;
        const completion = document.createElement('td'); completion.className = 'p-3'; completion.textContent = `${Number(profile.completionPercent || 0)}%`;
        const quiz = document.createElement('td'); quiz.className = 'p-3'; quiz.textContent = profile.latestQuiz ? `${profile.latestQuiz.score}/${profile.latestQuiz.total || 15}` : 'No quiz yet';
        const blueprint = document.createElement('td'); blueprint.className = 'p-3'; const bp = profile.blueprint || {}; blueprint.textContent = bp.businessName || bp.name || 'Not submitted';
        const activity = document.createElement('td'); activity.className = 'p-3'; activity.textContent = `${(profile.activityLog || []).length} activity events • ${profile.submissions || 1} snapshots`;
        const synced = document.createElement('td'); synced.className = 'p-3'; synced.textContent = profile.syncedAt ? new Date(profile.syncedAt).toLocaleString() : 'Unknown';
        tr.append(name, completion, quiz, blueprint, activity, synced); rows.appendChild(tr);
    });
}

// TEACHER MONITORING ACCESS GATE
function unlockTeacherMonitoringPanel() {
    const accessInput = document.getElementById('teacherMonitoringAccessCode');
    const accessStatus = document.getElementById('teacherMonitoringAccessStatus');
    const accessGate = document.getElementById('teacherMonitoringAccessGate');
    const protectedContent = document.getElementById('teacherMonitoringProtectedContent');
    const teacherMonitoringAccessCode = 'GAS@2026';

    if (!accessInput || !accessStatus || !accessGate || !protectedContent) return;

    if (accessInput.value === teacherMonitoringAccessCode) {
        protectedContent.hidden = false;
        accessGate.hidden = true;
        accessInput.value = '';
        accessStatus.textContent = 'Access granted. The teacher monitoring dashboard is now available.';
    } else {
        accessStatus.textContent = 'Access denied. The teacher access code is incorrect. The dashboard remains hidden.';
        accessInput.value = '';
        accessInput.setAttribute('aria-invalid', 'true');
        accessInput.focus();
    }
}

// DEVELOPER ACCESS GATE & LOCAL STORAGE CLEARING
function unlockGoogleSheetsGuidance() {
    const accessInput = document.getElementById('googleSheetsGuidanceAccessCode');
    const accessStatus = document.getElementById('googleSheetsGuidanceAccessStatus');
    const accessGate = document.getElementById('googleSheetsGuidanceAccessGate');
    const guidanceDetails = document.getElementById('googleSheetsGuidanceDetails');
    const developerAccessCode = 'P@55w0rd';

    if (!accessInput || !accessStatus || !accessGate || !guidanceDetails) return;

    if (accessInput.value === developerAccessCode) {
        guidanceDetails.hidden = false;
        guidanceDetails.open = true;
        accessGate.hidden = true;
        accessInput.value = '';
        accessStatus.textContent = 'Access granted. Google Sheets synchronization guidance is now visible.';
    } else {
        accessStatus.textContent = 'Access denied. The developer access code is incorrect. The guidance remains hidden.';
        accessInput.value = '';
        accessInput.setAttribute('aria-invalid', 'true');
        accessInput.focus();
    }
}

function openGcashDonationDeveloperGuide() {
    const guide = document.getElementById('gcashDonationDeveloperGuideDetails');
    const button = document.getElementById('openGcashDonationDeveloperGuideButton');
    if (!guide || !button) return;
    guide.open = true;
    button.setAttribute('aria-expanded', 'true');
    guide.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function clearLocalModuleStorage() {
    const status = document.getElementById('clearLocalModuleStorageStatus');
    const confirmed = window.confirm(
        "Clear saved progress for this learning module on this device?\n\n" +
        'Any progress not yet synchronized to Google Sheets or downloaded as a backup may be permanently lost.\n\n' +
        'This action affects only this module on this browser and cannot be undone. Continue?'
    );

    if (!confirmed) {
        if (status) status.textContent = 'No changes made. Your locally saved module progress was kept.';
        return;
    }

    const storageErrors = [];
    let removedFromAnyStorage = false;

    try {
        window.localStorage.removeItem(STORAGE_KEY);
        removedFromAnyStorage = true;
    } catch (error) {
        storageErrors.push('localStorage could not be accessed');
    }

    try {
        window.sessionStorage.removeItem(STORAGE_KEY);
        removedFromAnyStorage = true;
    } catch (error) {
        storageErrors.push('sessionStorage could not be accessed');
    }

    activeProgressStorage = null;

    if (storageErrors.length) {
        if (status) status.textContent = 'Storage clearing was incomplete: ' + storageErrors.join(' and ') + '. Check browser storage permissions and try again.';
        console.warn('Local module storage clearing was incomplete:', storageErrors);
        return;
    }

    if (status) status.textContent = removedFromAnyStorage
        ? "Saved local progress for this module has been cleared from this device. Reloading the page now."
        : "The local storage entry for this module has been cleared. Reloading the page now.";

    window.setTimeout(function () {
        window.location.reload();
    }, 900);
}

// --- GCash DONATION FEATURE SCRIPT ---
const GCASH_DONATION_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwa7PURy-pOOsxWuYtM7M4PtDh7Ka1wPI5f6UcecUaagR2LUQj9tTR2AhdSk_BJu9Wwww/exec';
const GCASH_DONATION_NUMBER = '0968-7042-059';
let gcashPreviousFocus = null;

function openGcashDonationModal() {
    const modal = document.getElementById('gcashDonationModal');
    if (!modal) return;
    gcashPreviousFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const nameInput = document.getElementById('gcashDonorName');
    if (nameInput) nameInput.focus();
}

function closeGcashDonationModal() {
    const modal = document.getElementById('gcashDonationModal');
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (gcashPreviousFocus && typeof gcashPreviousFocus.focus === 'function') gcashPreviousFocus.focus();
}

async function copyGcashDonationNumber() {
    const status = document.getElementById('gcashCopyStatus');
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(GCASH_DONATION_NUMBER);
        } else {
            const helper = document.createElement('textarea');
            helper.value = GCASH_DONATION_NUMBER;
            helper.style.position = 'fixed'; helper.style.opacity = '0';
            document.body.appendChild(helper); helper.select();
            const copied = document.execCommand('copy'); helper.remove();
            if (!copied) throw new Error('Copy command was not available.');
        }
        if (status) status.textContent = 'GCash number copied. Open your GCash app and verify the recipient before sending.';
    } catch (error) {
        if (status) status.textContent = 'Unable to copy automatically. Please select and copy the number shown above.';
    }
}

function copyGcashDonationScript() {
    const code = document.getElementById('gcashDonationAppsScriptCode');
    if (!code) return;
    code.focus(); code.select();
    try {
        const copied = document.execCommand('copy');
        const status = document.getElementById('gcashDonationStatus');
        if (status) status.textContent = copied ? 'Donation Apps Script code copied. Paste it into the separate donation spreadsheet Apps Script project.' : 'Select the code box and copy the code manually.';
    } catch (error) {
        const status = document.getElementById('gcashDonationStatus');
        if (status) status.textContent = 'Select the code box and copy the code manually.';
    }
}

async function submitGcashDonation(event) {
    event.preventDefault();
    const form = document.getElementById('gcashDonationForm');
    const nameField = document.getElementById('gcashDonorName');
    const amountField = document.getElementById('gcashDonationAmount');
    const countryField = document.getElementById('gcashDonorCountry');
    const confirmedField = document.getElementById('gcashPaymentConfirmed');
    const button = document.getElementById('gcashDonationSubmit');
    const status = document.getElementById('gcashDonationStatus');
    if (!form || !nameField || !amountField || !countryField || !confirmedField || !button || !status) return;

    const donorName = nameField.value.trim();
    const country = countryField.value.trim();
    const amount = Number(amountField.value);
    if (!donorName || donorName.length > 100) {
        status.className = 'gcash-status text-sm font-semibold text-red-600';
        status.textContent = 'Please enter your name (up to 100 characters).'; nameField.focus(); return;
    }
    if (!country || country.length > 100) {
        status.className = 'gcash-status text-sm font-semibold text-red-600';
        status.textContent = 'Please enter your country (up to 100 characters).'; countryField.focus(); return;
    }
    if (!Number.isFinite(amount) || amount < 1 || amount > 1000000 || !/^\d+(\.\d{1,2})?$/.test(amountField.value.trim())) {
        status.className = 'gcash-status text-sm font-semibold text-red-600';
        status.textContent = 'Please enter a valid amount from ₱1.00 to ₱1,000,000.00, with up to two decimal places.'; amountField.focus(); return;
    }
    if (!confirmedField.checked) {
        status.className = 'gcash-status text-sm font-semibold text-red-600';
        status.textContent = 'Please confirm that you have already sent the GCash transfer.'; confirmedField.focus(); return;
    }
    if (!GCASH_DONATION_WEB_APP_URL || GCASH_DONATION_WEB_APP_URL === 'PASTE_DONATION_WEB_APP_URL_HERE' || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec(?:[?#].*)?$/.test(GCASH_DONATION_WEB_APP_URL)) {
        status.className = 'gcash-status text-sm font-semibold text-red-600';
        status.textContent = 'Donation records are not connected yet. Please contact the website administrator or follow the Developer Guide to configure the separate donation Google Sheet.'; return;
    }

    button.disabled = true;
    button.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Submitting…';
    status.className = 'gcash-status text-sm font-semibold text-blue-700 dark:text-blue-300';
    status.textContent = 'Sending your donation record to the separate Database…';
    const payload = new URLSearchParams({
        donorName: donorName,
        donorType: 'Individual',
        donorOrganization: '',
        country: country,
        amount: (Math.round(amount * 100) / 100).toFixed(2),
        source: 'Entrep-Implementing a Simple Business'
    });
    try {
        await fetch(GCASH_DONATION_WEB_APP_URL, {
            method: 'POST', mode: 'no-cors',
            body: payload
        });
        status.className = 'gcash-status text-sm font-semibold text-emerald-700 dark:text-emerald-300';
        status.textContent = 'Your donor record submission was sent. Thank you for your support! The administrator must verify that the record appears in the Donor Records. This is not a payment receipt.';
        form.reset();
    } catch (error) {
        status.className = 'gcash-status text-sm font-semibold text-red-600';
        status.textContent = 'The submission could not be sent. Please check your internet connection and try again. If you already submitted once, check with the administrator before retrying to avoid duplicate records.';
    } finally {
        button.disabled = false;
        button.innerHTML = '<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Submit Donation Record';
    }
}

// --- DOM CONTENT LOADED EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', function () {
    const studentInput = document.getElementById('teacherStudentNameSearch');
    const sectionInput = document.getElementById('teacherSectionSearch');
    if (studentInput) studentInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchTeacherStudentDataset();
        }
    });
    if (sectionInput) sectionInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchTeacherSectionDataset();
        }
    });

    const teacherAccessInput = document.getElementById('teacherMonitoringAccessCode');
    if (teacherAccessInput) {
        teacherAccessInput.addEventListener('input', function () {
            teacherAccessInput.removeAttribute('aria-invalid');
        });
        teacherAccessInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                unlockTeacherMonitoringPanel();
            }
        });
    }

    const endpointDisplay = document.getElementById('sheetsWebAppUrl');
    if (endpointDisplay) endpointDisplay.value = GOOGLE_SHEETS_WEB_APP_URL;
    const developerAccessInput = document.getElementById('googleSheetsGuidanceAccessCode');
    if (developerAccessInput) {
        developerAccessInput.addEventListener('input', function () {
            developerAccessInput.removeAttribute('aria-invalid');
        });
        developerAccessInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                unlockGoogleSheetsGuidance();
            }
        });
    }
});

document.addEventListener('keydown', function(event) {
    const modal = document.getElementById('gcashDonationModal');
    if (event.key === 'Escape' && modal && !modal.hidden) closeGcashDonationModal();
});
document.addEventListener('click', function(event) {
    const modal = document.getElementById('gcashDonationModal');
    if (modal && event.target === modal) closeGcashDonationModal();
});

// --- PAGE LOAD INITIALIZATION ---
window.onload = function() {
    applyClassroomFontScale();
    restoreProgress();
    calculateBreakEven();
    renderQuiz();
    if (quizSession.submitted) {
        document.getElementById('quizResultCard').classList.remove('hidden');
        const result = lastQuizResult || learningState.latestQuiz;
        if (result) {
            document.getElementById('scoreBadge').textContent = `${result.score}/15`;
            document.getElementById('scoreTitle').textContent = result.passed ? 'Outstanding Performance!' : (result.score >= 8 ? 'Good Job! Review missed items.' : 'Keep practicing! Re-read the module pillars.');
            document.getElementById('scoreMessage').textContent = 'This submitted attempt is saved. Select Reset All Answers to begin a new randomized attempt.';
            activeQuizQuestions.forEach((item, index) => {
                const selectedValue = quizSession.answers[index];
                const expDiv = document.getElementById(`quizExp${index}`);
                expDiv.classList.remove('hidden');
                expDiv.className = selectedValue !== undefined && Number(selectedValue) === item.correct
                    ? 'p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-xs text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                    : 'p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-xs text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800';
            });
        }
    }
    renderAttemptHistory();
    updateCompletionTracker();
    document.querySelectorAll('#studentWorkspace input, #assignment input, #assignment textarea, #wrapup input').forEach(element => {
        element.addEventListener('input', () => {
            if (learningState.certificate && (element.id.startsWith('asgn') || element.id === 'founderWord' || element.id === 'founderStatement' || element.id === 'studentFullName' || element.id === 'studentGradeSection')) invalidateCertificate();
            if (element.id.startsWith('asgn')) updateBlueprintPreview();
            else saveProgressNow();
        });
        element.addEventListener('change', () => {
            if (element.id.startsWith('asgn')) recordStudentActivity('Business Blueprint updated', `${element.id} was updated.`);
            else if (element.id === 'founderWord' || element.id === 'founderStatement') recordStudentActivity('Founder Reflection updated', `${element.id} was updated.`);
            saveProgressNow();
        });
    });
    ['calcFixed','calcPrice','calcVariable'].forEach(id => document.getElementById(id).addEventListener('input', () => {
        const margin = Number(document.getElementById('calcPrice').value) - Number(document.getElementById('calcVariable').value);
        if (margin > 0) setSectionActivity('s1', true);
        calculateBreakEven();
    }));
    const autoSyncToggle = document.getElementById('sheetsAutoSync');
    if (autoSyncToggle) autoSyncToggle.addEventListener('change', () => {
        saveProgressNow();
        if (autoSyncToggle.checked) scheduleGoogleSheetsAutoSync();
        else if (googleSheetsSyncTimer) { clearTimeout(googleSheetsSyncTimer); googleSheetsSyncTimer = null; }
    });
    updateBlueprintPreview();
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            document.querySelectorAll('.nav-link').forEach(link => {
                const active = link.getAttribute('href') === `#${entry.target.id}`;
                link.classList.toggle('bg-indigo-100', active);
                link.classList.toggle('dark:bg-indigo-950', active);
                link.setAttribute('aria-current', active ? 'location' : 'false');
            });
        });
    }, { rootMargin: '-20% 0px -65% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
};