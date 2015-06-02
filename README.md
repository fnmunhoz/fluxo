#Fluxo [![Build Status](https://travis-ci.org/samuelsimoes/fluxo.svg?branch=master)](https://travis-ci.org/samuelsimoes/fluxo)

Fluxo is a simple, lightweight (~300LOC) and dependency free data infrastructure lib based
on [Facebook Flux](https://facebook.github.io/flux) and [Backbone.js](http://backbonejs.org). It's compatible with [React.js](https://facebook.github.io/react), but you can use
with whatever you want to the view/component layer.

:warning: **This project is under development and experimental phase and because
of this many things may change.**

:ballot_box_with_check: Read the **[Getting started](https://github.com/samuelsimoes/fluxo/wiki/Getting-Started)**.

:ballot_box_with_check: Check the **[TodoMVC implementation](https://github.com/samuelsimoes/todomvc-fluxo)** with Fluxo.

##How to use

:warning: Before I highly recomend you to read about the [React.js](https://facebook.github.io/react) and [Facebook Flux](https://facebook.github.io/flux) to a better understanding.

###Installation

Install with bower and include on your page or use some module loader.
```
$ bower install --save-dev fluxo
```

##Actions

Everything on Fluxo starts on action handlers, this action handlers are
javascript objects registered upon a name using the method `Fluxo#registerActionHandler`.

The params are:

1. Action handler identifier.
2. Action handler prototype, where you put your actions.
3. (optional) Args that are passed to `initialize` action when your handler is registered.

```javascript
Fluxo.registerActionHandler("Comment",  {
  initialize: function (options) {
    this.myOption = options.myOption;
  }
}, { myOptions: "Some content here" });
```

To call an action you need use the method `Fluxo#callAction`.

The params are:

1. Action handler identifier that you want call.
2. The action name.
3. The arguments that are passed the action.

```javascript
Fluxo.callAction("Comment", "create", { content: "This is my comment" });
```

## Stores

You hold the state of your Fluxo app on the store, the stores should emit an event
to the component/view layer when something change and then your view layer renders the
changes.

On Fluxo, the store is a convenient wrapper to your literal javascript objects or
array with literal objects.

You can create stores like this:

```javascript
// Create a Comment Store class extending the Fluxo.Store class
var Comment = Fluxo.Store.extend({
  myStoreMethod: function() {
    // ...
  }
});

// Instantiate a new Comment Store with some initial data on the constructor
var comment = new Comment({ content: "This is my comment" });
```

If you need update your data, use the `Fluxo.Store#set` method.

```javascript
comment.set({ content: "This is my edited comment" });
```

All your data lives on your store's `data` property.

```javascript
comment.data.content // => "This is my comment"
```

##CollectionStore

Fluxo.CollectionStore is a wrapper to your array of objects. When you create
a CollectionStore, each item of your array is wrapped on a instance of Fluxo.Store,
which you can change extending the Fluxo.CollectionStore and specifying your
store class.

Note: Fluxo.CollectionStore has the same methods of the Fluxo.Store, so you
can use methods like `set` of Fluxo.Store.

```javascript
var MyComments = Fluxo.CollectionStore.extend({
  store: MyComment
});
```

When a child store of a collection emits a signal of change, this signal is propagated
to the collection that also emits a change signal.

All your stores instances lives on the `stores` property.

##Using with React.js

If you choose React.js as you view layer, Fluxo already have a React.js Mixin to make your component
presents a store data and rerender when it have some change.

To specify what store you are "binding" on your component you need declare on the `listenProps` property
an array with what props of your components are Fluxo Stores instances.

Your attached store's data is placed on component's state upon the same prop key name.

```jsx
// A new instance of Fluxo.Store
var comment = new Fluxo.Store({ content: "My comment" });

var MyComponent = React.createClass({
  mixins: [Fluxo.WatchComponent],

  // Declare that comment prop is a Fluxo.Store to bind
  listenProps: ["comment"],

  render: function() {
    // Present my store using the object on "this.state.comment"
    return <p>{this.state.comment.content}</p>;
  }
});

// Render my component passing the comment instance as comment prop
React.render(
  <MyComponent comment={comment} />,
  document.getElementById("app")
);
```

###And more...

* [Store's Computed Properties](https://github.com/samuelsimoes/fluxo/wiki/Store's-Computed-Properties)
* [Store's Events](https://github.com/samuelsimoes/fluxo/wiki/Store's-Events)
* [Store's Mixins](https://github.com/samuelsimoes/fluxo/wiki/Store's-Mixins)

-----------------------------------------

**Samuel Simões ~ [@samuelsimoes](https://twitter.com/samuelsimoes) ~ [samuelsimoes.com](http://samuelsimoes.com)**
