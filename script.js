/* =========================================================
   CEE JOURNEY
   Main Application Logic
   ========================================================= */


/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "ceeJourneyData";


const DEFAULT_DATA = {

    settings: {

        examDate: "",

        targetScore: 145,

        dailyStudyTarget: 8,

        focusDuration: 50

    },

    tasks: [],

    syllabus: {},

    mocks: [],

    studySessions: [],

    reminders: [],

    lastActiveDate: "",

    streak: 0

};


let appData = loadData();


/* =========================================================
   SYLLABUS
========================================================= */

const SYLLABUS = {

    Physics: [

        "Units and Measurements",

        "Vectors",

        "Kinematics",

        "Dynamics",

        "Work, Energy and Power",

        "Circular Motion",

        "Gravitation",

        "Properties of Matter",

        "Fluid Mechanics",

        "Heat and Temperature",

        "Thermodynamics",

        "Oscillations",

        "Waves",

        "Electrostatics",

        "Current Electricity",

        "Magnetic Effect of Current",

        "Electromagnetic Induction",

        "Alternating Current",

        "Ray Optics",

        "Wave Optics",

        "Dual Nature of Matter",

        "Atoms and Nuclei",

        "Semiconductors"


    ],


    Chemistry: [

        "Basic Concepts of Chemistry",

        "Atomic Structure",

        "Periodic Classification",

        "Chemical Bonding",

        "States of Matter",

        "Thermodynamics",

        "Equilibrium",

        "Redox Reactions",

        "Hydrogen",

        "s-Block Elements",

        "p-Block Elements",

        "d- and f-Block Elements",

        "Coordination Compounds",

        "Organic Chemistry Basics",

        "Hydrocarbons",

        "Haloalkanes and Haloarenes",

        "Alcohols, Phenols and Ethers",

        "Aldehydes and Ketones",

        "Carboxylic Acids",

        "Amines",

        "Biomolecules",

        "Polymers",

        "Chemistry in Everyday Life"


    ],


    Botany: [

        "The Living World",

        "Biological Classification",

        "Plant Kingdom",

        "Morphology of Flowering Plants",

        "Anatomy of Flowering Plants",

        "Cell Structure and Function",

        "Cell Cycle and Cell Division",

        "Transport in Plants",

        "Mineral Nutrition",

        "Photosynthesis",

        "Respiration in Plants",

        "Plant Growth and Development",

        "Sexual Reproduction in Flowering Plants",

        "Principles of Inheritance",

        "Molecular Basis of Inheritance",

        "Evolution",

        "Plant Breeding",

        "Biotechnology",

        "Ecology",

        "Biodiversity"


    ],


    Zoology: [

        "Animal Kingdom",

        "Structural Organisation in Animals",

        "Digestion and Absorption",

        "Breathing and Exchange of Gases",

        "Body Fluids and Circulation",

        "Excretory Products",

        "Locomotion and Movement",

        "Neural Control",

        "Chemical Coordination",

        "Human Reproduction",

        "Reproductive Health",

        "Human Health and Disease",

        "Origin and Evolution",

        "Animal Husbandry",

        "Human Genetics",

        "Molecular Biology",

        "Biotechnology",

        "Ecology",

        "Environment"


    ],


    MAT: [

        "Series",

        "Analogy",

        "Classification",

        "Coding-Decoding",

        "Blood Relations",

        "Direction Sense",

        "Ranking and Ordering",

        "Mathematical Operations",

        "Logical Reasoning",

        "Venn Diagrams",

        "Syllogism",

        "Statement and Conclusion",

        "Data Interpretation",

        "Non-Verbal Reasoning",

        "Figure Classification",

        "Mirror Images",

        "Water Images",

        "Pattern Completion"

    ]

};


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


function initializeApp() {

    initializeSyllabus();

    setupNavigation();

    setupTaskEvents();

    setupMockEvents();

    setupGoalEvents();

    setupFocusEvents();

    setupReminderEvents();

    setupModalEvents();

    setupNotificationButton();

    setupBackup();

    setupReset();

    updateStreak();

    renderEverything();

    startBackgroundChecks();

}


/* =========================================================
   STORAGE FUNCTIONS
========================================================= */

function loadData() {

    try {

        const saved =
            localStorage.getItem(STORAGE_KEY);

        if (!saved) {

            return structuredClone(DEFAULT_DATA);

        }

        const parsed =
            JSON.parse(saved);

        return {

            ...structuredClone(DEFAULT_DATA),

            ...parsed,

            settings: {

                ...structuredClone(DEFAULT_DATA.settings),

                ...(parsed.settings || {})

            }

        };

    } catch (error) {

        console.error(
            "Could not load data:",
            error
        );

        return structuredClone(DEFAULT_DATA);

    }

}


function saveData() {

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(appData)

    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    document
        .querySelectorAll(".bottom-nav-item")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset.page;

                    showPage(page);

                }

            );

        });

}


function showPage(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active-page"
            );

        });


    const selected =
        document.getElementById(pageName);


    if (selected) {

        selected.classList.add(
            "active-page"
        );

    }


    document
        .querySelectorAll(".bottom-nav-item")
        .forEach(button => {

            button.classList.toggle(

                "active",

                button.dataset.page === pageName

            );

        });


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


window.showPage = showPage;


/* =========================================================
   SYLLABUS INITIALIZATION
========================================================= */

function initializeSyllabus() {

    if (
        !appData.syllabus ||
        typeof appData.syllabus !== "object"
    ) {

        appData.syllabus = {};

    }


    Object.keys(SYLLABUS)
        .forEach(subject => {

            if (!Array.isArray(
                appData.syllabus[subject]
            )) {

                appData.syllabus[subject] =
                    SYLLABUS[subject].map(
                        () => false
                    );

            }

        });


    saveData();

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderEverything() {

    renderCountdown();

    renderOverview();

    renderTasks();

    renderDashboardTasks();

    renderSyllabus("Physics");

    renderMocks();

    renderReminders();

    updateRealityMessage();

}


/* =========================================================
   COUNTDOWN
========================================================= */

function renderCountdown() {

    const element =
        document.getElementById(
            "daysRemaining"
        );


    const dateElement =
        document.getElementById(
            "countdownDate"
        );


    const target =
        appData.settings.examDate;


    if (!target) {

        element.textContent = "--";

        dateElement.textContent =
            "Set your CEE exam date";

        return;

    }


    const exam =
        new Date(
            target + "T00:00:00"
        );


    const now =
        new Date();


    const difference =
        exam.getTime() -
        now.getTime();


    const days =
        Math.ceil(
            difference /
            (1000 * 60 * 60 * 24)
        );


    element.textContent =
        Math.max(0, days);


    dateElement.textContent =
        formatDate(exam);


    document.getElementById(
        "targetScoreDisplay"
    ).textContent =
        `${appData.settings.targetScore}+`;


    document.getElementById(
        "mockTargetScore"
    ).textContent =
        appData.settings.targetScore;

}


/* =========================================================
   DATE HELPERS
========================================================= */

function todayKey() {

    const date =
        new Date();


    return date.toISOString()
        .split("T")[0];

}


function formatDate(date) {

    return date.toLocaleDateString(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


function formatTime(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleTimeString(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


/* =========================================================
   OVERVIEW
========================================================= */

function renderOverview() {

    const today =
        todayKey();


    const todayTasks =
        appData.tasks.filter(
            task => task.date === today
        );


    const completed =
        todayTasks.filter(
            task => task.completed
        ).length;


    document.getElementById(
        "todayCompletedTasks"
    ).textContent =
        completed;


    const completedMinutes =
        appData.studySessions
            .filter(
                session =>
                    session.date === today
            )
            .reduce(
                (
                    total,
                    session
                ) =>
                    total +
                    session.minutes,
                0
            );


    document.getElementById(
        "todayStudyTime"
    ).textContent =
        formatMinutes(
            completedMinutes
        );


    document.getElementById(
        "studyStreak"
    ).textContent =
        appData.streak || 0;


    const latest =
        appData.mocks[
            appData.mocks.length - 1
        ];


    document.getElementById(
        "latestMockScore"
    ).textContent =
        latest
            ? latest.total
            : "--";


    const dailyTargetMinutes =
        Number(
            appData.settings.dailyStudyTarget
        ) * 60;


    const percentage =
        dailyTargetMinutes > 0

            ? Math.min(
                100,
                Math.round(
                    completedMinutes /
                    dailyTargetMinutes *
                    100
                )
            )

            : 0;


    document.getElementById(
        "dailyProgressBar"
    ).style.width =
        percentage + "%";


    document.getElementById(
        "dailyProgressPercent"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "dailyStudyTargetText"
    ).textContent =

        `${formatMinutes(completedMinutes)} / ` +
        `${appData.settings.dailyStudyTarget}h`;

}


/* =========================================================
   MINUTES FORMAT
========================================================= */

function formatMinutes(minutes) {

    minutes =
        Math.max(
            0,
            Math.round(minutes)
        );


    if (minutes < 60) {

        return minutes + "m";

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    const remaining =
        minutes % 60;


    if (!remaining) {

        return hours + "h";

    }


    return `${hours}h ${remaining}m`;

}


/* =========================================================
   TASK EVENTS
========================================================= */

function setupTaskEvents() {

    document.getElementById(
        "addTaskButton"
    ).addEventListener(
        "click",
        () => openModal("taskModal")
    );


    document.getElementById(
        "taskForm"
    ).addEventListener(
        "submit",
        addTask
    );

}


function addTask(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "taskName"
        ).value.trim();


    const subject =
        document.getElementById(
            "taskSubject"
        ).value;


    const time =
        document.getElementById(
            "taskTime"
        ).value;


    const priority =
        document.getElementById(
            "taskPriority"
        ).value;


    if (!name) {

        showToast(
            "Enter a task name."
        );

        return;

    }


    appData.tasks.push({

        id: generateId(),

        name,

        subject,

        time,

        priority,

        completed: false,

        date: todayKey(),

        createdAt:
            new Date().toISOString()

    });


    saveData();

    renderEverything();

    closeModal("taskModal");

    document.getElementById(
        "taskForm"
    ).reset();


    showToast(
        "Mission added 🎯"
    );

}


/* =========================================================
   RENDER TASKS
========================================================= */

function renderTasks() {

    const container =
        document.getElementById(
            "taskList"
        );


    const today =
        todayKey();


    const tasks =
        appData.tasks.filter(
            task => task.date === today
        );


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    document.getElementById(
        "taskCompletedCount"
    ).textContent =
        completed;


    document.getElementById(
        "taskRemainingCount"
    ).textContent =
        tasks.length - completed;


    const percentage =
        tasks.length

            ? Math.round(
                completed /
                tasks.length *
                100
            )

            : 0;


    document.getElementById(
        "taskProgressBar"
    ).style.width =
        percentage + "%";


    if (!tasks.length) {

        container.innerHTML = emptyTaskHTML();

        return;

    }


    container.innerHTML =
        tasks
            .map(taskHTML)
            .join("");


    attachTaskListeners();

}


function renderDashboardTasks() {

    const container =
        document.getElementById(
            "dashboardTasks"
        );


    const today =
        todayKey();


    const tasks =
        appData.tasks
            .filter(
                task => task.date === today
            )
            .slice(0, 4);


    if (!tasks.length) {

        container.innerHTML =
            emptyDashboardHTML();

        return;

    }


    container.innerHTML =
        tasks
            .map(
                task =>
                    taskHTML(
                        task,
                        true
                    )
            )
            .join("");


    attachTaskListeners();

}


/* =========================================================
   TASK HTML
========================================================= */

function taskHTML(
    task,
    compact = false
) {

    return `

        <div
            class="task-item ${task.completed ? "completed" : ""}"
            data-task-id="${task.id}">

            <button
                class="task-checkbox"
                data-action="complete-task">

                ${task.completed ? "✓" : ""}

            </button>


            <div class="task-info">

                <strong>
                    ${escapeHTML(task.name)}
                </strong>

                <span>

                    ${escapeHTML(task.subject)}

                    ${
                        task.time
                            ? " • " + task.time
                            : ""
                    }

                </span>

            </div>


            <span
                class="task-priority priority-${task.priority}">

                ${task.priority}

            </span>


            ${
                compact
                    ? ""
                    : `

                        <button
                            class="task-delete"
                            data-action="delete-task">

                            ×

                        </button>

                    `
            }

        </div>

    `;

}


function emptyTaskHTML() {

    return `

        <div class="empty-box">

            <div>🎯</div>

            <strong>
                No tasks for today
            </strong>

            <span>
                Add your study missions.
            </span>

        </div>

    `;

}


function emptyDashboardHTML() {

    return `

        <div class="empty-box">

            <div>📋</div>

            <strong>
                No missions yet
            </strong>

            <span>
                Add your first task for today.
            </span>

        </div>

    `;

}


/* =========================================================
   TASK LISTENERS
========================================================= */

function attachTaskListeners() {

    document
        .querySelectorAll(
            "[data-action='complete-task']"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const item =
                        button.closest(
                            ".task-item"
                        );


                    const id =
                        item.dataset.taskId;


                    toggleTask(id);

                }

            );

        });


    document
        .querySelectorAll(
            "[data-action='delete-task']"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const item =
                        button.closest(
                            ".task-item"
                        );


                    const id =
                        item.dataset.taskId;


                    deleteTask(id);

                }

            );

        });

}


function toggleTask(id) {

    const task =
        appData.tasks.find(
            item =>
                item.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveData();

    renderEverything();


    if (task.completed) {

        showToast(
            "Mission complete! 🔥"
        );

    }

}


function deleteTask(id) {

    const confirmed =
        confirm(
            "Delete this task?"
        );


    if (!confirmed) return;


    appData.tasks =
        appData.tasks.filter(
            task =>
                task.id !== id
        );


    saveData();

    renderEverything();

    showToast(
        "Task deleted."
    );

}


/* =========================================================
   SYLLABUS TABS
========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                ".subject-tab"
            );


        if (!button) return;


        document
            .querySelectorAll(
                ".subject-tab"
            )
            .forEach(tab =>
                tab.classList.remove(
                    "active"
                )
            );


        button.classList.add(
            "active"
        );


        renderSyllabus(
            button.dataset.subject
        );

    }

);


/* =========================================================
   RENDER SYLLABUS
========================================================= */

function renderSyllabus(subject) {

    const container =
        document.getElementById(
            "syllabusContainer"
        );


    const chapters =
        SYLLABUS[subject] || [];


    const progress =
        appData.syllabus[subject] || [];


    const completed =
        progress.filter(Boolean).length;


    const percentage =
        chapters.length

            ? Math.round(
                completed /
                chapters.length *
                100
            )

            : 0;


    document.getElementById(
        "currentSubjectName"
    ).textContent =
        subject;


    document.getElementById(
        "subjectProgressText"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "subjectProgressBar"
    ).style.width =
        percentage + "%";


    container.innerHTML =
        chapters
            .map(
                (
                    chapter,
                    index
                ) => {

                    const done =
                        !!progress[index];


                    return `

                        <div
                            class="chapter-item ${
                                done
                                    ? "completed"
                                    : ""
                            }">

                            <div
                                class="chapter-top">

                                <button
                                    class="chapter-checkbox"
                                    data-subject="${subject}"
                                    data-index="${index}">

                                    ${
                                        done
                                            ? "✓"
                                            : ""
                                    }

                                </button>


                                <span
                                    class="chapter-name">

                                    ${escapeHTML(
                                        chapter
                                    )}

                                </span>


                                <span
                                    class="chapter-status">

                                    ${
                                        done
                                            ? "Done"
                                            : "Pending"
                                    }

                                </span>

                            </div>


                            <div
                                class="chapter-progress">

                                <div
                                    style="width:${
                                        done
                                            ? "100"
                                            : "0"
                                    }%">
                                </div>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");


    container
        .querySelectorAll(
            ".chapter-checkbox"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    toggleChapter(

                        button.dataset.subject,

                        Number(
                            button.dataset.index
                        )

                    );

                }

            );

        });

}


function toggleChapter(
    subject,
    index
) {

    appData.syllabus[subject][index] =

        !appData.syllabus[subject][index];


    saveData();

    renderSyllabus(subject);

    updateRealityMessage();

}


/* =========================================================
   MOCK EVENTS
========================================================= */

function setupMockEvents() {

    document.getElementById(
        "addMockButton"
    ).addEventListener(
        "click",
        () => openModal("mockModal")
    );


    document.getElementById(
        "mockForm"
    ).addEventListener(
        "submit",
        addMock
    );

}


function addMock(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "mockName"
        ).value.trim();


    const physics =
        numberValue("mockPhysics");


    const chemistry =
        numberValue("mockChemistry");


    const botany =
        numberValue("mockBotany");


    const zoology =
        numberValue("mockZoology");


    const mat =
        numberValue("mockMAT");


    if (
        physics > 50 ||
        chemistry > 50 ||
        botany > 40 ||
        zoology > 40 ||
        mat > 20
    ) {

        showToast(
            "Check subject marks."
        );

        return;

    }


    const total =
        physics +
        chemistry +
        botany +
        zoology +
        mat;


    appData.mocks.push({

        id: generateId(),

        name,

        physics,

        chemistry,

        botany,

        zoology,

        mat,

        total,

        date:
            new Date().toISOString()

    });


    saveData();

    renderEverything();

    closeModal("mockModal");

    document.getElementById(
        "mockForm"
    ).reset();


    showToast(
        `Mock saved: ${total}/200 📝`
    );

}


function numberValue(id) {

    const value =
        Number(
            document.getElementById(id).value
        );


    return Number.isFinite(value)
        ? value
        : 0;

}


/* =========================================================
   RENDER MOCKS
========================================================= */

function renderMocks() {

    const container =
        document.getElementById(
            "mockList"
        );


    const latest =
        appData.mocks[
            appData.mocks.length - 1
        ];


    document.getElementById(
        "mockLatestScore"
    ).textContent =
        latest
            ? latest.total
            : "--";


    if (!appData.mocks.length) {

        container.innerHTML = `

            <div class="empty-box">

                <div>📝</div>

                <strong>
                    No mock tests yet
                </strong>

                <span>
                    Record your first mock result.
                </span>

            </div>

        `;

        return;

    }


    container.innerHTML =
        [...appData.mocks]
            .reverse()
            .map(mockHTML)
            .join("");

}


function mockHTML(mock) {

    return `

        <div class="mock-item">

            <div class="mock-item-top">

                <div>

                    <div class="mock-item-name">

                        ${escapeHTML(
                            mock.name
                        )}

                    </div>

                    <div class="mock-date">

                        ${formatDate(
                            new Date(mock.date)
                        )}

                    </div>

                </div>


                <div class="mock-score">

                    ${mock.total}/200

                </div>

            </div>


            <div class="mock-breakdown">

                ${mockSubjectHTML(
                    "PHY",
                    mock.physics,
                    50
                )}

                ${mockSubjectHTML(
                    "CHE",
                    mock.chemistry,
                    50
                )}

                ${mockSubjectHTML(
                    "BOT",
                    mock.botany,
                    40
                )}

                ${mockSubjectHTML(
                    "ZOO",
                    mock.zoology,
                    40
                )}

                ${mockSubjectHTML(
                    "MAT",
                    mock.mat,
                    20
                )}

            </div>

        </div>

    `;

}


function mockSubjectHTML(
    name,
    score,
    max
) {

    return `

        <div class="mock-subject">

            <span>
                ${name}
            </span>

            <strong>
                ${score}/${max}
            </strong>

        </div>

    `;

}


/* =========================================================
   GOAL SETTINGS
========================================================= */

function setupGoalEvents() {

    document.getElementById(
        "goalSettingsButton"
    ).addEventListener(
        "click",
        () => {

            document.getElementById(
                "examDate"
            ).value =
                appData.settings.examDate;


            document.getElementById(
                "targetScore"
            ).value =
                appData.settings.targetScore;


            document.getElementById(
                "dailyStudyTarget"
            ).value =
                appData.settings.dailyStudyTarget;


            openModal("goalModal");

        }

    );


    document.getElementById(
        "goalForm"
    ).addEventListener(
        "submit",
        saveGoal
    );

}


function saveGoal(event) {

    event.preventDefault();


    const date =
        document.getElementById(
            "examDate"
        ).value;


    const score =
        Number(
            document.getElementById(
                "targetScore"
            ).value
        );


    const dailyTarget =
        Number(
            document.getElementById(
                "dailyStudyTarget"
            ).value
        );


    if (!date) {

        showToast(
            "Select your exam date."
        );

        return;

    }


    if (
        score < 1 ||
        score > 200
    ) {

        showToast(
            "Target score must be 1–200."
        );

        return;

    }


    appData.settings.examDate =
        date;


    appData.settings.targetScore =
        score;


    appData.settings.dailyStudyTarget =
        dailyTarget;


    saveData();

    renderEverything();

    closeModal("goalModal");

    showToast(
        "CEE goal updated 🎯"
    );

}


/* =========================================================
   FOCUS TIMER
========================================================= */

let focusInterval =
    null;


let focusRemaining =
    0;


let focusRunning =
    false;


let focusStartedAt =
    null;


function setupFocusEvents() {

    document.getElementById(
        "startFocusButton"
    ).addEventListener(
        "click",
        startFocus
    );


    document.getElementById(
        "pauseFocusButton"
    ).addEventListener(
        "click",
        toggleFocusPause
    );


    document.getElementById(
        "stopFocusButton"
    ).addEventListener(
        "click",
        stopFocus
    );


    document.getElementById(
        "focusSettingsButton"
    ).addEventListener(
        "click",
        changeFocusDuration
    );

}


function startFocus() {

    if (focusRunning) return;


    focusRemaining =
        appData.settings.focusDuration *
        60;


    focusStartedAt =
        Date.now();


    focusRunning =
        true;


    document.getElementById(
        "focusTaskTitle"
    ).textContent =
        "Focus Session";


    document.getElementById(
        "focusStatus"
    ).textContent =
        "One session. One goal. No distractions.";


    document.getElementById(
        "pauseFocusButton"
    ).textContent =
        "Pause";


    updateFocusDisplay();


    openModal("focusModal");


    focusInterval =
        setInterval(
            () => {

                if (!focusRunning)
                    return;


                focusRemaining--;


                updateFocusDisplay();


                if (
                    focusRemaining <= 0
                ) {

                    finishFocus();

                }

            },
            1000
        );

}


function updateFocusDisplay() {

    const minutes =
        Math.floor(
            focusRemaining / 60
        );


    const seconds =
        focusRemaining % 60;


    document.getElementById(
        "focusTimer"
    ).textContent =

        String(minutes)
            .padStart(2, "0")

        + ":" +

        String(seconds)
            .padStart(2, "0");

}


function toggleFocusPause() {

    if (!focusRunning) {

        focusRunning =
            true;

        document.getElementById(
            "pauseFocusButton"
        ).textContent =
            "Pause";

        return;

    }


    focusRunning =
        false;


    document.getElementById(
        "pauseFocusButton"
    ).textContent =
        "Resume";


    document.getElementById(
        "focusStatus"
    ).textContent =
        "Paused. Come back when you're ready.";

}


function stopFocus() {

    clearInterval(
        focusInterval
    );


    focusInterval =
        null;


    focusRunning =
        false;


    const elapsed =
        Math.floor(
            (
                appData.settings.focusDuration *
                60 -
                focusRemaining
            ) / 60
        );


    if (elapsed > 0) {

        recordStudySession(
            elapsed
        );

    }


    focusRemaining =
        appData.settings.focusDuration *
        60;


    updateFocusDisplay();

    closeModal("focusModal");

    renderEverything();

    showToast(
        elapsed
            ? `${elapsed} minutes recorded ⏱️`
            : "Focus session stopped."
    );

}


function finishFocus() {

    clearInterval(
        focusInterval
    );


    focusInterval =
        null;


    focusRunning =
        false;


    const minutes =
        appData.settings.focusDuration;


    recordStudySession(
        minutes
    );


    closeModal("focusModal");

    renderEverything();

    showToast(
        "Focus session complete! 🔥"
    );


    playAlarm();

    sendNotification(
        "Focus session complete! 🔥",
        "You completed your study session."
    );

}


function recordStudySession(minutes) {

    if (minutes <= 0)
        return;


    appData.studySessions.push({

        id: generateId(),

        date: todayKey(),

        minutes,

        createdAt:
            new Date().toISOString()

    });


    saveData();

}


/* =========================================================
   FOCUS SETTINGS
========================================================= */

function changeFocusDuration() {

    const current =
        appData.settings.focusDuration;


    const answer =
        prompt(

            `Focus duration in minutes.\n\nCurrent: ${current}`,

            current

        );


    if (answer === null)
        return;


    const value =
        Number(answer);


    if (
        !Number.isFinite(value) ||
        value < 1 ||
        value > 180
    ) {

        showToast(
            "Choose 1–180 minutes."
        );

        return;

    }


    appData.settings.focusDuration =
        Math.round(value);


    saveData();


    showToast(
        `Focus timer: ${value} minutes`
    );

}


/* =========================================================
   REMINDERS
========================================================= */

function setupReminderEvents() {

    document.getElementById(
        "notificationSettingsButton"
    ).addEventListener(
        "click",
        () => openModal("notificationModal")
    );


    document.getElementById(
        "reminderForm"
    ).addEventListener(
        "submit",
        addReminder
    );

}


function addReminder(event) {

    event.preventDefault();


    const message =
        document.getElementById(
            "reminderMessage"
        ).value.trim();


    const time =
        document.getElementById(
            "reminderTime"
        ).value;


    if (!message || !time) {

        showToast(
            "Enter message and time."
        );

        return;

    }


    appData.reminders.push({

        id: generateId(),

        message,

        time,

        active: true,

        lastTriggered: ""

    });


    saveData();

    renderReminders();

    document.getElementById(
        "reminderForm"
    ).reset();


    showToast(
        "Reminder set 🔔"
    );

}


function renderReminders() {

    const container =
        document.getElementById(
            "reminderList"
        );


    if (!appData.reminders.length) {

        container.innerHTML = `

            <div class="empty-box">

                <div>🔔</div>

                <strong>
                    No reminders
                </strong>

                <span>
                    Add a study reminder.
                </span>

            </div>

        `;

        return;

    }


    container.innerHTML =
        appData.reminders
            .map(
                reminder => `

                    <div
                        class="reminder-item">

                        <div
                            class="reminder-item-info">

                            <strong>
                                ${escapeHTML(
                                    reminder.message
                                )}
                            </strong>

                            <span>
                                Every day at
                                ${reminder.time}
                            </span>

                        </div>


                        <button
                            class="reminder-delete"
                            data-reminder-id="${reminder.id}">

                            ×

                        </button>

                    </div>

                `
            )
            .join("");


    container
        .querySelectorAll(
            ".reminder-delete"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    deleteReminder(
                        button.dataset.reminderId
                    );

                }

            );

        });

}


function deleteReminder(id) {

    appData.reminders =
        appData.reminders.filter(
            reminder =>
                reminder.id !== id
        );


    saveData();

    renderReminders();

    showToast(
        "Reminder removed."
    );

}


/* =========================================================
   BACKGROUND REMINDER CHECK
========================================================= */

function startBackgroundChecks() {

    checkReminders();

    setInterval(
        checkReminders,
        30000
    );


    setInterval(
        () => {

            renderCountdown();

            updateRealityMessage();

        },
        60000
    );

}


function checkReminders() {

    const now =
        new Date();


    const currentTime =

        String(
            now.getHours()
        ).padStart(2, "0")

        + ":" +

        String(
            now.getMinutes()
        ).padStart(2, "0");


    const today =
        todayKey();


    appData.reminders.forEach(
        reminder => {

            if (
                reminder.active &&
                reminder.time === currentTime &&
                reminder.lastTriggered !== today
            ) {

                reminder.lastTriggered =
                    today;


                saveData();


                showToast(
                    "🔔 " +
                    reminder.message
                );


                playAlarm();


                sendNotification(
                    "CEE Journey Reminder",
                    reminder.message
                );

            }

        }
    );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function setupNotificationButton() {

    document.getElementById(
        "notificationButton"
    ).addEventListener(
        "click",
        requestNotifications
    );

}


async function requestNotifications() {

    if (
        !("Notification" in window)
    ) {

        showToast(
            "Notifications aren't supported here."
        );

        return;

    }


    const permission =
        await Notification.requestPermission();


    if (
        permission === "granted"
    ) {

        showToast(
            "Notifications enabled 🔔"
        );

        sendNotification(
            "CEE Journey",
            "Notifications are now enabled."
        );

    } else {

        showToast(
            "Notification permission not granted."
        );

    }

}


function sendNotification(
    title,
    body
) {

    if (
        !("Notification" in window)
    )
        return;


    if (
        Notification.permission !==
        "granted"
    )
        return;


    try {

        new Notification(
            title,
            {
                body,
                icon: "",
                tag: "cee-journey"
            }
        );

    } catch (error) {

        console.log(
            "Notification failed:",
            error
        );

    }

}


/* =========================================================
   ALARM SOUND
========================================================= */

function playAlarm() {

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext)
            return;


        const context =
            new AudioContext();


        const oscillator =
            context.createOscillator();


        const gain =
            context.createGain();


        oscillator.type =
            "sine";


        oscillator.frequency.value =
            880;


        gain.gain.value =
            0.15;


        oscillator.connect(
            gain
        );


        gain.connect(
            context.destination
        );


        oscillator.start();


        setTimeout(
            () => {

                oscillator.stop();

                context.close();

            },
            700
        );

    } catch (error) {

        console.log(
            "Alarm sound unavailable."
        );

    }

}


/* =========================================================
   REALITY CHECK
========================================================= */

function updateRealityMessage() {

    const element =
        document.getElementById(
            "realityMessage"
        );


    if (!element)
        return;


    const today =
        todayKey();


    const tasks =
        appData.tasks.filter(
            task =>
                task.date === today
        );


    const completed =
        tasks.filter(
            task =>
                task.completed
        ).length;


    const studyMinutes =
        appData.studySessions
            .filter(
                session =>
                    session.date === today
            )
            .reduce(
                (
                    total,
                    session
                ) =>
                    total +
                    session.minutes,
                0
            );


    const targetMinutes =
        appData.settings.dailyStudyTarget *
        60;


    const hour =
        new Date()
            .getHours();


    let message;


    if (!tasks.length) {

        message =
            "You have no missions planned. Decide what you will finish today.";

    }

    else if (
        completed === tasks.length
    ) {

        message =
            "Today's missions are complete. Excellent. Protect your streak.";

    }

    else if (
        studyMinutes >= targetMinutes
    ) {

        message =
            "You hit today's study target. Don't waste the momentum.";

    }

    else if (
        hour >= 20 &&
        completed < tasks.length
    ) {

        message =
            `It's already ${hour}:00. ` +
            `${tasks.length - completed} mission(s) remain. ` +
            "Stop negotiating with yourself and start.";

    }

    else if (
        completed === 0 &&
        tasks.length >= 3
    ) {

        message =
            "You planned the work. Now prove that you can execute it.";

    }

    else {

        message =
            `${completed}/${tasks.length} missions complete. ` +
            "Keep moving.";

    }


    element.textContent =
        message;

}


/* =========================================================
   STREAK
========================================================= */

function updateStreak() {

    const today =
        todayKey();


    if (
        appData.lastActiveDate ===
        today
    ) {

        return;

    }


    const yesterdayDate =
        new Date();


    yesterdayDate.setDate(
        yesterdayDate.getDate() - 1
    );


    const yesterday =
        yesterdayDate
            .toISOString()
            .split("T")[0];


    if (
        appData.lastActiveDate ===
        yesterday
    ) {

        appData.streak =
            (appData.streak || 0) + 1;

    }

    else {

        appData.streak = 1;

    }


    appData.lastActiveDate =
        today;


    saveData();

}


/* =========================================================
   MODALS
========================================================= */

function setupModalEvents() {

    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    closeModal(
                        button.dataset.close
                    );

                }

            );

        });


    document
        .querySelectorAll(
            ".modal-overlay"
        )
        .forEach(overlay => {

            overlay.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        overlay
                    ) {

                        closeModal(
                            overlay.id
                        );

                    }

                }

            );

        });


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                document
                    .querySelectorAll(
                        ".modal-overlay.open"
                    )
                    .forEach(modal =>
                        closeModal(
                            modal.id
                        )
                    );

            }

        }

    );

}


function openModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) return;


    modal.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";

}


function closeModal(id) {

    const modal =
        document.getElementById(id);


    if (!modal) return;


    modal.classList.remove(
        "open"
    );


    if (
        !document.querySelector(
            ".modal-overlay.open"
        )
    ) {

        document.body.style.overflow =
            "";

    }

}


/* =========================================================
   BACKUP / RESTORE
========================================================= */

function setupBackup() {

    document.getElementById(
        "backupButton"
    ).addEventListener(
        "click",
        backupData
    );

}


function backupData() {

    const backup = {

        app:
            "CEE Journey",

        version:
            "1.0",

        exportedAt:
            new Date().toISOString(),

        data:
            appData

    };


    const blob =
        new Blob(

            [
                JSON.stringify(
                    backup,
                    null,
                    2
                )
            ],

            {
                type:
                    "application/json"
            }

        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "cee-journey-backup.json";


    link.click();


    URL.revokeObjectURL(
        url
    );


    showToast(
        "Backup downloaded 💾"
    );

}


/* =========================================================
   RESTORE
========================================================= */

function restoreData() {

    const input =
        document.createElement(
            "input"
        );


    input.type =
        "file";


    input.accept =
        ".json,application/json";


    input.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];


            if (!file)
                return;


            const reader =
                new FileReader();


            reader.onload =
                function () {

                    try {

                        const backup =
                            JSON.parse(
                                reader.result
                            );


                        if (
                            !backup.data
                        ) {

                            throw new Error(
                                "Invalid backup"
                            );

                        }


                        const confirmed =
                            confirm(
                                "Restore this backup? Current data will be replaced."
                            );


                        if (!confirmed)
                            return;


                        appData =
                            {

                                ...structuredClone(
                                    DEFAULT_DATA
                                ),

                                ...backup.data,

                                settings: {

                                    ...structuredClone(
                                        DEFAULT_DATA.settings
                                    ),

                                    ...(
                                        backup
                                            .data
                                            .settings ||
                                        {}
                                    )

                                }

                            };


                        initializeSyllabus();

                        saveData();

                        renderEverything();


                        showToast(
                            "Backup restored successfully."
                        );

                    }

                    catch (error) {

                        console.error(
                            error
                        );

                        showToast(
                            "Invalid backup file."
                        );

                    }

                };


            reader.readAsText(
                file
            );

        }

    );


    input.click();

}


/* =========================================================
   RESET
========================================================= */

function setupReset() {

    document.getElementById(
        "resetButton"
    ).addEventListener(
        "click",
        resetApp
    );

}


function resetApp() {

    const first =
        confirm(
            "This will delete ALL CEE Journey data."
        );


    if (!first)
        return;


    const second =
        confirm(
            "Are you absolutely sure?"
        );


    if (!second)
        return;


    localStorage.removeItem(
        STORAGE_KEY
    );


    appData =
        structuredClone(
            DEFAULT_DATA
        );


    initializeSyllabus();

    renderEverything();


    showToast(
        "App reset."
    );

}


/* =========================================================
   UTILITY
========================================================= */

function generateId() {

    return (

        Date.now().toString(36) +

        Math.random()
            .toString(36)
            .slice(2, 8)

    );

}


function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    const messageElement =
        document.getElementById(
            "toastMessage"
        );


    messageElement.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.toastTimer
    );


    window.toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   BACKUP BUTTON LONG PRESS / RESTORE
========================================================= */

/*
   Normal tap:
   Backup

   Long press:
   Restore

   This keeps the interface clean on mobile.
*/

let backupPressTimer =
    null;


const backupButton =
    document.getElementById(
        "backupButton"
    );


if (backupButton) {

    backupButton.addEventListener(
        "pointerdown",
        () => {

            backupPressTimer =
                setTimeout(
                    restoreData,
                    700
                );

        }
    );


    backupButton.addEventListener(
        "pointerup",
        () => {

            clearTimeout(
                backupPressTimer
            );

        }
    );


    backupButton.addEventListener(
        "pointerleave",
        () => {

            clearTimeout(
                backupPressTimer
            );

        }
    );

}


/* =========================================================
   INITIAL DEFAULT EXAM DATE
========================================================= */

/*
   We intentionally do NOT hard-code
   an exam date.

   You set the actual CEE date from:
   More → CEE Goal
*/


/* =========================================================
   END
========================================================= */

/* =========================================
   APP LAUNCH SCREEN
========================================= */

window.addEventListener("load", () => {

    const launchScreen =
        document.getElementById("appLaunchScreen");

    if (!launchScreen) return;

    setTimeout(() => {

        launchScreen.classList.add("hide");

        setTimeout(() => {
            launchScreen.remove();
        }, 700);

    }, 1600);

});
