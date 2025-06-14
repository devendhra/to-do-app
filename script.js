class ColorfulTodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('colorful-tasks')) || [];
        this.colors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6'];
        this.currentColorIndex = 0;
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
            color: this.colors[this.currentColorIndex],
            priority: priority,
            createdAt: new Date().toLocaleString()
        };

        this.currentColorIndex = (this.currentColorIndex + 1) % this.colors.length;
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
                    <div class="task-card bounce-in ${task.color} ${task.completed ? 'completed-task' : ''} rounded-3xl p-6 shadow-xl">
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