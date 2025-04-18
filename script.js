document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.querySelector("#taskInput");
    const categorySelect = document.querySelector("#categorySelect");
    const customCategoryInput = document.querySelector("#customCategoryInput");
    const deadlineInput = document.querySelector("#deadlineInput");
    const addTaskBtn = document.querySelector("#addTaskBtn");
    const taskList = document.querySelector("#taskList");
    const toggleTheme = document.querySelector("#toggleTheme");
    
    // Хранение задач и категорий
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let categories = JSON.parse(localStorage.getItem("categories")) || ["Работа", "Личное", "ЗОЖ"];

    // Заполнение списка категорий при загрузке
    function populateCategories() {
        categorySelect.innerHTML = '';
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
        const customOption = document.createElement("option");
        customOption.value = "Свой";
        customOption.textContent = "Создать свою";
        categorySelect.appendChild(customOption);
    }

    function renderTasks() {
        taskList.innerHTML = "";

        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}" />
                <span class="${task.completed ? "completed" : ""} ${new Date(task.deadline) < new Date() && !task.completed ? "overdue" : ""}">
                    ${task.text} - ${task.category} ${task.deadline ? `(${new Date(task.deadline).toLocaleString()})` : '' }
                </span>
                <button data-index="${index}">Удалить</button>
            `;
            taskList.appendChild(li);
        });
    }

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Добавляем слушатель на изменение выбора категории
    categorySelect.addEventListener("change", (e) => {
        if (e.target.value === "Свой") {
            customCategoryInput.style.display = "block";
            customCategoryInput.focus();
        } else {
            customCategoryInput.style.display = "none";
        }
    });

    // Добавляем задачу
    addTaskBtn.onclick = () => {
        const taskText = taskInput.value.trim();
        const category = categorySelect.value === "Свой" ? customCategoryInput.value.trim() : categorySelect.value;
        const deadline = deadlineInput.value;

        if (!taskText) {
            alert("Введите задачу!");
            return;
        }
        
        if (category === "" && categorySelect.value === "Свой") {
            alert("Введите имя категории!");
            return;
        }

        if (categorySelect.value === "Свой" && customCategoryInput.value) {
            // Добавляем новую категорию в список, если её нет
            if (!categories.includes(customCategoryInput.value)) {
                categories.push(customCategoryInput.value);
                localStorage.setItem("categories", JSON.stringify(categories));
                populateCategories(); // Обновляем категории в селекте
            }
        }

        tasks.push({
            text: taskText,
            category: category,
            completed: false,
            deadline: deadline ? new Date(deadline).toISOString() : null
        });

        taskInput.value = "";
        customCategoryInput.value = ""; // Очищаем поле ввода новой категории
        deadlineInput.value = "";
        saveTasks();
        renderTasks();
    };

    taskList.onclick = (e) => {
        if (e.target.tagName === "BUTTON") {
            const index = e.target.dataset.index;
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }

        if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
            const index = e.target.dataset.index;
            tasks[index].completed = e.target.checked;
            saveTasks();
            renderTasks();
        }
    };

    toggleTheme.onclick = () => {
        document.body.classList.toggle("light-mode");
        const isLightMode = document.body.classList.contains("light-mode");
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark'); // Save to local storage
        toggleTheme.textContent = isLightMode ? "🌙" : "☀️";
    };

    // Инициализация
    populateCategories();
    renderTasks();
});