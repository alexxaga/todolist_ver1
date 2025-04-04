document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        dateClick: function (info) {
            currentDay = info.dateStr;  // Сохраняем выбранный день
            loadTasks();
        }
    });

    calendar.render();

    let currentDay = new Date().toISOString().split('T')[0];

    document.getElementById('deadlineCheckbox').addEventListener('change', function () {
        document.getElementById('deadlineContainer').style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('addTask').addEventListener('click', function () {
        const taskInput = document.getElementById('taskInput').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const taskCategory = document.getElementById('taskCategory').value;
        const deadline = document.getElementById('deadlineCheckbox').checked ? document.getElementById('taskDeadline').value : null;

        if (!taskInput) {
            alert("Введите задачу!");
            return; // Сначала проверяем, была ли введена задача
        }

        const task = {
            input: taskInput,
            description: taskDescription,
            category: taskCategory,
            deadline: deadline,
            completed: false,
            date: currentDay
        };

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        document.getElementById('taskInput').value = "";
        document.getElementById('taskDescription').value = "";
        document.getElementById('taskDeadline').value = "";
        document.getElementById('deadlineCheckbox').checked = false;
        document.getElementById('deadlineContainer').style.display = "none";

        loadTasks();
    });

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const tasksContainer = document.getElementById('tasksContainer');
        tasksContainer.innerHTML = '';

        const filteredTasks = tasks.filter(task => task.date === currentDay);
        filteredTasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = `task ${task.completed ? 'completed' : ''}`;
            taskDiv.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleCompletion('${task.input}', '${currentDay}')">
                <span>${task.input} - ${task.description} - ${task.category}</span>
                <span onclick="deleteTask('${task.input}', '${currentDay}')" class="delete">❌</span>
            `;
            tasksContainer.appendChild(taskDiv);
        });

        document.getElementById('taskCount').innerText = filteredTasks.length;
    }

    window.toggleCompletion = function (taskInput, date) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const task = tasks.find(t => t.input === taskInput && t.date === date);
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }

    window.deleteTask = function (taskInput, date) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.input !== taskInput || task.date !== date);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }

    loadTasks();
});