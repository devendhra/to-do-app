class ColorfulTodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('colorful-tasks')) || [];
        this.confettiTriggered = false;
        this.quotes = [
            "Push yourself, because no one else is going to do it for you.",
            "Your limitation—it’s only your imagination.",
            "Great things never come from comfort zones.",
            "Dream it. Wish it. Do it.",
            "Success doesn’t just find you. You have to go out and get it.",
            "Don’t stop when you’re tired. Stop when you’re done.",
            "Wake up with determination. Go to bed with satisfaction.",
            "Discipline is the bridge between goals and accomplishment.",
            "Make today count — not someday.",
            "You don’t have to be great to start, but you have to start to be great."
        ];
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
        this.showRandomQuote();
        this.setupVoiceInput();
    }

    bindEvents() {
        const addBtn = document.getElementById('addTaskBtn');
        const taskInput = document.getElementById('newTask');

        addBtn.addEventListener('click', () => this.addTask());
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
    }

    addTask() {
        const input = document.getElementById('newTask');
        const priority = document.getElementById('taskPriority').value;
        const text = input.value.trim();

        if (!text) {
            this.shakeInput();
            return;
        }

        const task = {
            id: Date.now(),
            text: text,
            completed: false,
            priority: priority,
            createdAt: new Date().toLocaleString()
        };

        this.tasks.unshift(task);
        input.value = '';

        this.saveToStorage();
        this.render();
        this.updateStats();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveToStorage();
            this.render();
            this.updateStats();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveToStorage();
        this.render();
        this.updateStats();
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const newText = prompt('✏️ Edit your task:', task.text);
        if (newText && newText.trim()) {
            task.text = newText.trim();
            this.saveToStorage();
            this.render();
        }
    }

    render() {
        const container = document.getElementById('tasksGrid');
        const emptyState = document.getElementById('emptyState');

        if (this.tasks.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        container.innerHTML = this.tasks.map(task => `
                    <div class="task-card bounce-in ${task.completed ? 'completed-task' : ''} rounded-3xl p-6 shadow-xl">
                        <div class="flex justify-between items-start mb-4">
                            <button 
                                onclick="app.toggleTask(${task.id})"
                                class="w-8 h-8 rounded-full ${task.completed ? 'bg-green-500' : 'bg-white/50'} border-2 border-white flex items-center justify-center text-white font-bold text-lg transition-all hover:scale-110"
                            >
                                ${task.completed ? '✓' : ''}
                            </button>
                            <div class="flex gap-2">
                                <button 
                                    onclick="app.editTask(${task.id})"
                                    class="w-8 h-8 bg-white/30 hover:bg-white/50 rounded-full flex items-center justify-center transition-all"
                                >
                                    ✏️
                                </button>
                                <button 
                                    onclick="app.deleteTask(${task.id})"
                                    class="w-8 h-8 bg-white/30 hover:bg-red-400 rounded-full flex items-center justify-center transition-all"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                        <h3 class="text-white font-bold text-xl mb-3  break-words  leading-relaxed ${task.completed ? 'line-through' : ''}">
                            ${task.text}
                        </h3>
                        <div class="my-2 text-sm font-semibold inline-block px-3 py-1 rounded-full
                            ${task.priority === 'high' ? 'bg-red-500 text-white' :
                task.priority === 'medium' ? 'bg-yellow-200 text-gray-900' :
                    'bg-green-400 text-white'}">
                           ${task.priority === 'high' ? '🔥 URGENT' :
                task.priority === 'medium' ? '⚡ Focus' :
                    '🧘 Stay Cool'} 
                        </div>
                        <div class="text-white text-sm bg-white/30 rounded-full px-3 py-1 inline-block">
                            📅 ${task.createdAt}
                        </div>
                    </div>
                `).join('');
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const todo = total - completed;

        document.getElementById('totalCount').textContent = total;
        document.getElementById('doneCount').textContent = completed;
        const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
        const progressBar = document.getElementById('progressBar');
        if (progressBar) progressBar.style.width = `${progressPercent}%`;
        document.getElementById('todoCount').textContent = todo;

        if (total > 0 && completed === total && !this.confettiTriggered) {
            this.triggerConfetti();
            this.confettiTriggered = true;
        }

        if (completed < total) {
            this.confettiTriggered = false;
        }
    }

    shakeInput() {
        const input = document.getElementById('newTask');
        input.style.animation = 'none';
        input.style.transform = 'translateX(10px)';
        setTimeout(() => {
            input.style.transform = 'translateX(-10px)';
            setTimeout(() => {
                input.style.transform = 'translateX(0)';
                input.focus();
            }, 100);
        }, 100);
    }

    saveToStorage() {
        localStorage.setItem('colorful-tasks', JSON.stringify(this.tasks));
    }

    showRandomQuote() {
        const quoteBox = document.getElementById('quoteBox');
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        quoteBox.textContent = `${this.quotes[randomIndex]}`;
    }

    setupVoiceInput() {
        const voiceBtn = document.getElementById('voiceBtn');
        const input = document.getElementById('newTask');

        if (!('webkitSpeechRecognition' in window)) {
            voiceBtn.disabled = true;
            voiceBtn.textContent = "🎤 Not Supported";
            return;
        }

        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        voiceBtn.addEventListener('click', () => {
            voiceBtn.textContent = "🎙️";
            recognition.start();
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            input.value = transcript;
            this.addTask();
            voiceBtn.textContent = "🎤";
        };

        recognition.onerror = (event) => {
            console.error("Voice recognition error:", event.error);
            voiceBtn.textContent = "🎤";
        };

        recognition.onend = () => {
            voiceBtn.textContent = "🎤";
        };
    }


    triggerConfetti() {
        var defaults = {
            spread: 360,
            ticks: 50,
            gravity: 0,
            decay: 0.94,
            startVelocity: 30,
            colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
        };

        function shoot() {
            confetti({
                ...defaults,
                particleCount: 40,
                scalar: 1.2,
                shapes: ['star']
            });

            confetti({
                ...defaults,
                particleCount: 10,
                scalar: 0.75,
                shapes: ['circle']
            });
        }

        setTimeout(shoot, 0);
        setTimeout(shoot, 100);
        setTimeout(shoot, 200);
    }

    

}

// Initialize the app
const app = new ColorfulTodoApp();


// === AI Chat Assistant UI and Logic ===
const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatMessages = document.getElementById('chatMessages');

// Show/hide chat box
chatToggleBtn.addEventListener('click', () => {
    chatBox.classList.toggle('hidden');
});

chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendBtn.click();
});

// Handle chat send
sendBtn.addEventListener('click', async () => {
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;

    chatMessages.innerHTML += `<div class="text-right text-purple-700 mb-1">🙋‍♂️ ${userMsg}</div>`;
    chatInput.value = '';
    chatMessages.innerHTML += `<div class="text-gray-500 mb-1">🤖 Thinking...</div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
        const res = await fetch('/.netlify/functions/askai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userMsg })
        });

        const data = await res.json();

        chatMessages.innerHTML = chatMessages.innerHTML.replace("🤖 Thinking...", '');
        chatMessages.innerHTML += `<div class="text-left text-gray-800 mb-2">🤖 ${data.answer}</div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
        console.error(error);
        chatMessages.innerHTML += `<div class="text-left text-red-600 mb-2">❌ Error talking to AI</div>`;
    }
});
