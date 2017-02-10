
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
  return [state];
};
var config = {
  diff: diff,
  trigger: State.trigger
};
var vw = function(viewFn, model, key, opts) {
  return domvm.defineView(viewFn, model, key == null ? false : key, config);
};

/**
 * Views
 */
function Header() {
  return function(vm, state) {
    return el('header.header', [
      el('h1', 'todos'),
      el('input.new-todo', {
        placeholder: 'What needs to be done?',
        autofocus: '',
        oninput: [vm.opts.trigger, 'todo:todoInput'],
        onkeydown: [vm.opts.trigger, 'todo:create'],
        value: state.todoInput
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
      class: (state.completed ? 'completed' : '') + ' ' + (state.editing ? 'editing' : ''),
      _key: state.id
    }, [
      el('.view', [
        el('input.toggle', {
          type: 'checkbox',
          checked: state.completed,
          onchange: [vm.opts.trigger, 'todo:toggleCompleted', state]
        }),
        el('label', {
          ondblclick: [vm.opts.trigger, 'todo:edit', state]
        }, state.title),
        el('button.destroy', {onclick: [vm.opts.trigger, 'todo:delete', state]})
      ]),
      el('input.edit', {
        _ref: 'editInput',
        value: state.title,
        onkeypress: [vm.opts.trigger, 'todo:save', state],
        onblur: [vm.opts.trigger, 'todo:save', state]
      })
    ])
  }
}

function List(vm, state) {
  function filter(todos) {
    return todos.filter(function(todo) {
      switch (state.filter) {
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
        checked: state.remaining === 0,
        onchange: [vm.opts.trigger, 'todo:toggleAll', state.todos]
      }),
      el('label', {for: 'toggle-all'}, 'Mark all as complete'),
      el('ul.todo-list',
        filter(state.todos).map(function(todo) {
          // setting a key blows up 
          return vw(Item, todo, todo.id);
          // return vw(Item, todo)
        })
      )
    ]);
  };
};

function Footer(vm, state) {
  function pluralize(w, c) {
    if (c === 1) return w;
    return w + 's';
  };
  return function(vm, state) {
    return el('footer.footer', [
      el('span.todo-count', [
        el('strong', state.remaining), ' ',
        pluralize('item', state.remaining), ' left'
      ]),
      el('ul.filters', [
        el('li.', [
          el('a', {
            href:'/#/',
            class: state.filter === 'all' ? 'selected' : ''
          }, 'All')
        ]),
        el('li.', [
          el('a', {
            href:'/#/active',
            class: state.filter === 'active' ? 'selected' : ''
          }, 'Active')
        ]),
        el('li.', [
          el('a', {
            href:'/#/completed',
            class: state.filter === 'completed' ? 'selected' : ''
          }, 'Completed')
        ])
      ]),
      el('button.clear-completed', {
        onclick: [vm.opts.trigger, 'todo:clearCompleted']
      }, 'Clear completed')
    ]);
  };
};

function Main(vm, state) {
  return function(vm, state) {
    return el('section.todoapp', [
      vw(Header, state),
      vw(List, state, state.filter),
      state.todos.length ? vw(Footer, state) : ''
    ]);
  };
};

/**
 * Reactions
 */
State.on('todo:todoInput', function(e) {
  State.get().set({ todoInput: e.currentTarget.value }).now();
});

State.on('todo:toggleCompleted', function(todo, e) {
  todo.set({ completed: e.currentTarget.checked });
});

State.on('todo:toggleAll', function(todos, e) {
  todos.forEach(function(todo) { todo.set('completed', e.currentTarget.checked) });
});

State.on('todo:delete', function(todo) {
  var state = State.get();
  var todos = state.todos.filter(function(t) {
    return todo.id !== t.id
  });
  state.set('todos', todos);
});

State.on('todo:clearCompleted', function() {
  var state = State.get();
  var filteredTodos = state.todos.filter(function(todo) {
    return !todo.completed;
  });
  state.set('todos', filteredTodos);
});

State.on('todo:create', function(e) {
  if (e.keyCode !== ENTER_KEY || e.currentTarget.value.length === 0) return;
  State.get().pivot()
    .set({ todoInput: '' })
    .todos.push({
      title: e.currentTarget.value,
      id: uuid(),
      completed: false,
      editing: false
    });
});

State.on('todo:save', function(todo, e) {
  if (e.keyCode === ENTER_KEY || e.type === 'blur') 
    todo.pivot().set({title: e.currentTarget.value, editing: false});
});

State.on('todo:edit', function(todo) {
  todo.set('editing', true);
});

State.on('update', function(currentState) {
  State.get().set({remaining: currentState.todos.filter(function(todo) {
    return !todo.completed;
  }).length});
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
        rootVm.update(currentState);
      });
      rootVm = domvm.createView(Main, State.get(), false, config).mount(document.body);
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