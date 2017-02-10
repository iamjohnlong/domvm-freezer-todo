
var store = localStorage.getItem('todos') ? JSON.parse(localStorage.getItem('todos')) : [];
var State = new Freezer({
  todos: store.map(function(todo) {
    todo.editing = false;
    return todo;
  }),
  todoInput: '',
  status: 'ready',
  filter: 'all',
  remaining: store.filter(function(todo) {
    return !todo.completed;
  }).length
});

var uuid = function () {
  var i, random;
  var uuid = '';
  for (i = 0; i < 32; i++) {
    random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
  }
  return uuid;
};

var ENTER_KEY = 13;

var el = domvm.defineElement;
var diff = function(vm, state) {
  return [state.model];
};
var config = {
  diff: diff,
  // trigger: State.trigger ???
};
var vw = function(viewFn, model, key, opts) {
  return domvm.defineView(viewFn, model, key == null ? false : key, config);
};

/**
 * Views
 */
function Header(vm, state) {
  function oninput(e) {
    state.trigger('todo:todoInput', e.target.value);
  };
  function createTodo(e) {
    if (event.keyCode !== ENTER_KEY) return;
    state.trigger('todo:create', e.target.value);
  };
  return function(vm, state) {
    return el('header.header', [
      el('h1', 'todos'),
      el('input.new-todo', {
        placeholder: 'What needs to be done?',
        autofocus: '',
        oninput: oninput,
        onkeydown: createTodo,
        value: state.model.todoInput
      })
    ]);
  };
};

function Item(vm, state) {
  vm.hook({
    didRedraw: function() {
      if (vm.node.el.classList.contains('editing')) {
        vm.refs.editInput.el.focus()
      }
    }
  });
  return function(vm, state) {
    return el('li', {
      class: (state.model.completed ? 'completed' : '') + ' ' + (state.model.editing ? 'editing' : '')
    }, [
      el('.view', [
        el('input.toggle', {
          type: 'checkbox',
          checked: state.model.completed,
          onchange: [state.trigger, 'todo:toggleCompleted', state.model]
        }),
        el('label', {
          ondblclick: [state.trigger, 'todo:edit', state.model, vm]
        }, state.model.title),
        el('button.destroy', {onclick: [state.trigger, 'todo:delete', state.model]})
      ]),
      el('input.edit', {
        _ref: 'editInput',
        value: state.model.title,
        onkeypress: [state.trigger, 'todo:save', state.model],
        onblur: [state.trigger, 'todo:save', state.model]
      })
    ])
  }
}

function List(vm, state) {
  function filter(todos) {
    return todos.filter(function(todo) {
      switch (state.model.filter) {
        case "all": return true;
        case "active": return !todo.completed;
        case "completed": return todo.completed;
      };
    });
  };
  return function(vm, state) {
    return el('section.main', [
      el('input.toggle-all', {
        type: 'checkbox',
        checked: state.model.remaining === 0,
        onchange: [state.trigger, 'todo:toggleAll', state.model.todos]
      }),
      el('label', {for: 'toggle-all'}, 'Mark all as complete'),
      el('ul.todo-list',
        filter(state.model.todos).map(function(todo) {
          return vw(Item, {trigger: state.trigger, model: todo}, todo.id)
        })
      )
    ]);
  };
};

function Footer(vm, state) {
  function clearCompleted() {
    state.trigger('todo:clearCompleted')
  };
  function pluralize(w, c) {
    if (c === 1) return w;
    return w + 's';
  };
  return function(vm, state) {
    return el('footer.footer', [
      el('span.todo-count', [
        el('strong', state.model.remaining), ' ',
        pluralize('item', state.model.remaining), ' left'
      ]),
      el('ul.filters', [
        el('li.', [
          el('a', {
            href:'/#/',
            class: state.model.filter === 'all' ? 'selected' : ''
          }, 'All')
        ]),
        el('li.', [
          el('a', {
            href:'/#/active',
            class: state.model.filter === 'active' ? 'selected' : ''
          }, 'Active')
        ]),
        el('li.', [
          el('a', {
            href:'/#/completed',
            class: state.model.filter === 'completed' ? 'selected' : ''
          }, 'Completed')
        ])
      ]),
      el('button.clear-completed', {
        onclick: clearCompleted
      }, 'Clear completed')
    ]);
  };
};

function Main(vm, state) {
  return function(vm, state) {
    return el('section.todoapp', [
      vw(Header, state),
      vw(List, state, state.model.filter),
      state.model.todos.length ? vw(Footer, state) : ''
    ]);
  };
};

/**
 * Reactions
 */
State.on('todo:todoInput', function(value) {
  State.get().set({ todoInput: value }).now();
});

State.on('todo:toggleCompleted', function(todo, e) {
  todo.set({ completed: e.currentTarget.checked });
});

State.on('todo:toggleAll', function(todos, e) {
  todos.forEach(function(todo) { todo.set('completed', e.currentTarget.checked) });
});

State.on('todo:delete', function(todo) {
  var state = State.get();
  var idx = state.todos.indexOf(todo);
  if (idx !== -1) state.set('todos', state.todos.splice(idx, 1));
});

State.on('todo:clearCompleted', function() {
  var state = State.get();
  var filteredTodos = state.todos.filter(function(todo) {
    return !todo.completed;
  });
  state.set('todos', filteredTodos);
});

State.on('todo:create', function(value) {
  State.get().pivot()
    .set({ todoInput: '' })
    .todos.push({
      title: value,
      id: uuid(),
      completed: false,
      editing: false
    });
});

State.on('todo:save', function(todo, e) {
  if (e.keyCode === ENTER_KEY || e.type === 'blur') 
    todo.pivot().set({title: e.currentTarget.value, editing: false});
});

State.on('todo:edit', function(todo, vm, e, node) {
  todo.set('editing', true);
});

State.get().todos.getListener().on('update', function(currentState) {
  var len = currentState.filter(function(todo) {
    return !todo.completed;
  }).length;
  State.get().set({ remaining: len });
});

/**
 * Router/Application Init
 */
function boot() {
  var didMount = false;
  var rootVm = null;
  var router = createRouter({
    prefix: "#",
    willEnter: function(r) {
      if (didMount) return;
      didMount = true;
      State.get().set({filter: r.route.name});
      State.on('update', function(currentState, prevState) {
        localStorage.setItem('todos', JSON.stringify(currentState.todos.toJS()));
        rootVm.update({model:currentState, trigger: State.trigger});
      });
      rootVm = domvm.createView(Main, {
        model: State.get(), 
        trigger: State.trigger
      }, false, config).mount(document.body);
    },
    routes: [
      {
        name: "all",
        path: "/",
        onenter: function() {
          State.get().set({filter: 'all'})
        }
      },
      {
        name: "completed",
        path: "/completed",
        onenter: function() {
          State.get().set({filter: 'completed'});
        }
      },
      {
        name: "active",
        path: "/active",
        onenter: function() {
          State.get().set({filter: 'active'});
        }
      }
    ]
  });
  router.boot(true);
}
boot();