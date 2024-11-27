(function() {
  // создаем пустой массив
  let listArray = []
  let listName = ''

  // создаем и возвращаем заголовок приложения
  function createAppTitle (title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания (поле ввода, кнопка "добавить")
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');
    // добавляем классы, стилизуем
    form.classList.add('input-group', 'mb-3'); //bootstrap
    input.classList.add('form-control'); //bootstrap
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append'); //bootstrap
    button.classList.add('btn', 'btn-primary'); //bootstrap
    button.textContent = 'Добавить дело';
    button.disabled = true;

    // объединяем DOM элементы в единую структуру
    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    // <form class="input-group mb-3">
    //    <input class="form-control" placeholder="Введите название нового дела">
    //    <div class="input-group-append">
    //        <button class="btn btn-primary">Добавить дело</button>
    //    </div>
    //  </form>

    // деактивируем кнопку "добавить дело", если инпут пустой и наоборот
    input.addEventListener('input', function() {
      if(input.value !== '') {
        button.disabled = false
      } else {
        button.disabled = true
      }
    });

    // возвращаем объект, в котором хранятся наши элементы
    // при нажатии на кнопку создается новый элемент в списке и заби рает значение из инпута
    return {
      form,
      input,
      button,
    };
  }

  //создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');// bootstrap
    return list;
  }
  // создаем элемент для списка дел
  function createTodoItem(obj) {
    let item = document.createElement('li');
    // кнопки помещаем в элемент, который покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center'); //bootstrap
    item.textContent = obj.name;

    // добавляем параметры кнопкам
    buttonGroup.classList.add('btn-group', 'btn-group-sm'); //bootstrap
    doneButton.classList.add('btn', 'btn-success') //bootstrap
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger'); //bootstrap
    deleteButton.textContent = 'Удалить';

    if (obj.done === true) item.classList.add('list-group-item-success');

    // добавляем обработчики событий на соответствующие кнопки
    doneButton.addEventListener('click', function() {
      // с помощью функции 'toggle' добавляем или убираем класс
      item.classList.toggle('list-group-item-success'); //bootstrap (красит элемент в зеленый)

      // проходимся по всем объектам массива
      for (const listItem of listArray) {
        // можем изменить статус объекта
        if (listItem.id === obj.id) listItem.done = !listItem.done
      };
      saveList(listArray, listName);

    });
    deleteButton.addEventListener('click', function() {
      // функция 'confirm' вернет true если пользователь нажмет "да
      if (confirm('Вы уверены?')) {
        // после этого удаляем элемент
        item.remove();

        // проходимся по всем объектам массива
        for (let i = 0; i < listArray.length; i++) {
          if (listArray[i].id === obj.id) listArray.splice(i, 1) // удаляем элемент из массива
        };
        saveList(listArray, listName);
      }
    });

    // вкладываем кнопки в группу кнопок, группу кнопок вкладываем в список
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    // приложению нужен доступ к самому элементу и кнопкам, чтобы навешать обработчики событий 'click'
    // снова возвращаем объект
    return {
      item,
      doneButton,
      deleteButton,
    };
  }
  // получаем уникальный id для всех элементов списка
  function getNewId(arr) {
    let max = 0;
    for (const item of arr) {
      if(item.id >max) max  = item.id
    };
    return max + 1;
  }

  // создаем отдельную функцию для сохранения массива
  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arr)); // записываем в локальное хранилище массив в виде строки
  }
  // все содержимое обработчика 'DOMContentLoaded' вынесем в отдельную функцию
  function createTodoApp(container, title = 'Список дел', keyName) {
    // вызываем поочередно функции, которые создали до этого
    // createAppTitle и createTodoList вернут сам DOM-элемент todoList

    let todoAppTitle = createAppTitle(title);// функция, которая возвращает заголовок 'h3'
    let todoItemForm = createTodoItemForm();// функция, которая возвращает объект
    let todoList = createTodoList();

    listName = keyName; // в listName помещаем название списка, чтобы сделать имя глобальным

    // их результат размещаем внутри контейнера
    container.append(todoAppTitle);
    container.append(todoItemForm.form); // createTodoItemForf возвращает объект, в котором есть '.form'
    container.append(todoList);

    // при запуске необходимо расшифровать приложение
    let localData = localStorage.getItem(listName);
    // при первом запуске в localStorage пусто, делаем проверку на наличие данных
    if (localData !== null && localData !== '') listArray = JSON.parse(localData); // строку переводим в массив

    // проходим по массиву
    for (const itemList of listArray) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    }

    // регистрируем обработчик событий 'submit' у формы по нажатию на кнопку "добавить дело" или на Enter
    todoItemForm.form.addEventListener('submit', function(e) {
      // предотвращает перезагрузку страницы при отправке формы
      e.preventDefault();
      // игнорирует создание пустого элемента, если в инпуте нет значения
      if (!todoItemForm.input.value) {
        // просто возвращаемся
        return;
      }

      // при добавлении новое дело добавится в массив
      let newItem = {
        id: getNewId(listArray),// получаем постоянно новое значение
        name: todoItemForm.input.value,
        done: false
      };

      // в переменную помещаем результат выполнения функции
      let todoItem = createTodoItem(newItem);

      // добавляем запись в массив
      listArray.push(newItem);
      // запускаем функцию, передаем массив в виде строки
      saveList(listArray, listName);

      // создаем и добавляем в список новое дело с названием из инпута
      todoList.append(todoItem.item);
      // деактивируем кнопку "добавить дело" когда в списке есть элементы
      todoItemForm.button.disabled = true;
      // обнуляем значение в инпуте, чтобы не стирать вручную
      todoItemForm.input.value = '';
    });
  }
  // регистрируем функцию в глобальном объекте 'window'
  window.createTodoApp = createTodoApp;
})();
