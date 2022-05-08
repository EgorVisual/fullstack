window.onload = function () {
    function fetchTasks(filter) {
        const host = "http://localhost:8000";
        $.ajax({
            url: host + '/api/task/',
            method: 'GET',
            data: {},
            success: function (tasks, status) {
                renderTasks(tasks, filter);
                printCountTasks(counterField, todoItemCheckbox);
            },
            error: function (response, status) {
                console.log(response);
                console.log(status);
            }
        });
    }

    function filterTasks(tasks, status) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].is_active == status) {
                const todoItem = new TodoItem(tasks[i].title, tasks[i].is_active, tasks[i].id,inputField);
                todoBody.append(todoItem.getHtmlElement());
            }
            if (status == 'nothing') {
                const todoItem = new TodoItem(tasks[i].title, tasks[i].is_active, tasks[i].id,inputField);
                todoBody.append(todoItem.getHtmlElement());
            }
        }
    }

    function renderTasks(tasks, filter) {
        switch (filter) {
            case 'completed':
                filterTasks(tasks, true);
                break;
            case 'active':
                filterTasks(tasks, false);
                break;
            case 'all':
                filterTasks(tasks, 'nothing');
                break;
        }
    }

    function countTasks(todoItemCheckboxes) {
        let activeTasksCount = 0;
        let allTasksCount = 0;
        activeTasksCount = Object.values(todoItemCheckboxes).filter(todoItemCheckbox => todoItemCheckbox.checked == false).length;
        allTasksCount = todoItemCheckboxes.length;
        return [activeTasksCount, allTasksCount]
    }

    function printCountTasks(counterField, todoItemCheckbox) {
        [activeTasks, allTasks] = countTasks(todoItemCheckbox);
        counterField.innerText = 'Active tasks: ' + activeTasks + '/' + allTasks;
    }

    function cleanAllTasks() {
        while (todoBody.children.length) {
            todoBody.removeChild(todoBody.children[0])
        }
    }

    function switchActiveStatus(FilterButton) {
        allFilterButton.classList.remove("active");
        activeFilterButton.classList.remove("active");
        completedFilterButton.classList.remove("active");
        FilterButton.classList.add("active");
        cleanAllTasks();
    }

    const status = 'Ready to work!'
    const addButton = document.getElementsByClassName("search__button")[0];
    const inputField = document.getElementsByClassName("search__input")[0];
    const todoBody = document.getElementsByClassName('todo__body')[0];
    const todoItemCheckbox = document.getElementsByClassName('todo-item__checkbox');
    const counterField = document.getElementsByClassName("menu__counter")[0];
    const allFilterButton = document.getElementsByClassName('filter-all')[0];
    const activeFilterButton = document.getElementsByClassName('filter-active')[0];
    const completedFilterButton = document.getElementsByClassName('filter-completed')[0];
    const statusField = document.getElementsByClassName('menu__status')[0];

    fetchTasks('all');
    statusField.innerText = status;

    addButton.onclick = () => {
        if (inputField.value != '') {
            const todo = new TodoItem(inputField.value, true, undefined, inputField)
            todo.createTodoItem(todoBody);
            // todoBody.append(todo.getHtmlElement());
            printCountTasks(counterField, todoItemCheckbox);
        }
    }

    todoBody.onchange = () => {
        printCountTasks(counterField, todoItemCheckbox);
    }

    allFilterButton.onclick = () => {
        switchActiveStatus(allFilterButton);
        fetchTasks('all');
        printCountTasks(counterField, todoItemCheckbox);
    }
    activeFilterButton.onclick = () => {
        switchActiveStatus(activeFilterButton);
        fetchTasks('active');
        printCountTasks(counterField, todoItemCheckbox);
    }
    completedFilterButton.onclick = () => {
        switchActiveStatus(completedFilterButton);
        fetchTasks('completed');
        printCountTasks(counterField, todoItemCheckbox);
    }
}