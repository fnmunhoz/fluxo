describe("Fluxo.ObjectStore", function () {
  it("#cid", function() {
    var store1 = new Fluxo.ObjectStore(),
        store2 = new Fluxo.ObjectStore();

    expect(store1.cid).to.exist;
    expect(store2.cid).to.exist;

    expect(store1.cid).to.not.equal(store2.cid);
  });

  it("#setAttribute", function() {
    var store = new Fluxo.ObjectStore(),
        onChangeCallback = chai.spy(),
        onChangeNameCallback = chai.spy();

    store.on(["change"], onChangeCallback);
    store.on(["change:name"], onChangeNameCallback);

    store.setAttribute("name", "Samuel");

    expect(store.data).to.be.eql({ name: "Samuel" });
    expect(onChangeCallback).to.have.been.called();
    expect(onChangeNameCallback).to.have.been.called();
  });

  it("#set", function() {
    var store = new Fluxo.ObjectStore({ name: "Samuel" }),
        onChangeCallback = chai.spy(),
        onChangeNameCallback = chai.spy();

    expect(store.data).to.be.eql({ name: "Samuel" });

    store.on(["change"], onChangeCallback);
    store.on(["change:name"], onChangeNameCallback);

    store.set({ name: "Other", email: "fluxo@flux.com" });

    expect(store.data).to.be.eql({ name: "Other", email: "fluxo@flux.com" });
    expect(onChangeCallback).to.have.been.called();
    expect(onChangeNameCallback).to.have.been.called();
  });

  it("#toJSON", function() {
    var store = new Fluxo.ObjectStore({ name: "Samuel" });

    var firstJSON = store.toJSON();

    expect(firstJSON).to.be.eql({ cid: store.cid, name: "Samuel" });

    expect(store.toJSON()).to.be.equal(firstJSON);

    store.setAttribute("name", "John Doe");

    var secondJSON = store.toJSON();

    expect(secondJSON).to.be.eql({ cid: store.cid, name: "John Doe" });

    expect(secondJSON).to.be.not.equal(firstJSON);

    store.unsetAttribute("name");

    expect(store.toJSON()).to.be.eql({ cid: store.cid });
  });

  describe("computed attributes", function() {
    it("recomputes when the specified event got triggered", function() {
      class Store extends Fluxo.ObjectStore {
        fullName () {
          return (this.data.first_name + " " + this.data.last_name);
        }
      }

      Store.computed = {
        fullName: ["change:first_name", "change:last_name"]
      };

      var store = new Store({ first_name: "Samuel", last_name: "Simoes" });

      expect(store.data.fullName).to.be.eql("Samuel Simoes");

      store.setAttribute("first_name", "Neo");

      expect(store.data.fullName).to.be.eql("Neo Simoes");
    });

    it("recomputes everything when reset is called", function() {
      class Store extends Fluxo.ObjectStore {
        isJohn () {
          return this.data.name === "John";
        }

        isAdult () {
          return this.data.age >= 21;
        }
      }

      Store.computed = {
        isJohn: ["change:name"],
        isAdult: ["change:age"]
      };

      var store = new Store({ name: "John", age: 34 });

      expect(store.data.isJohn).to.be.true;
      expect(store.data.isAdult).to.be.true;

      store.reset({ age: 34 });

      expect(store.data.isJohn).to.be.false;
      expect(store.data.isAdult).to.be.true;

      store.reset({});

      expect(store.data.isJohn).to.be.false;
      expect(store.data.isAdult).to.be.false;
    });
  });

  it("attributes parser", function() {
    class Store extends Fluxo.ObjectStore {};

    Store.attributeParsers ={
      count: function(value) {
        return parseInt(value, 10);
      }
    };

    var store = new Store({ count: "1" });

    expect(store.data.count).to.be.eql(1);
  });

  it("#triggerEvent", function() {
    var store = new Fluxo.ObjectStore(),
        callback = chai.spy(),
        wildcardCallback = chai.spy();

    store.on(["myEvent"], callback);
    store.on(["*"], wildcardCallback);

    store.triggerEvent("myEvent", "myArg");

    expect(callback).to.have.been.called.with(store, "myArg");
    expect(wildcardCallback).to.have.been.called.with("myEvent", store, "myArg");
  });

  it("unset", function () {
    var store = new Fluxo.ObjectStore({ name: "Fluxo" });

    expect(store.data).to.contain.all.keys({ name: "Fluxo" });

    store.unsetAttribute("name");

    expect(store.data).to.not.contain.key("name");
  });

  it("reset", function () {
    var store = new Fluxo.ObjectStore({ name: "Fluxo" });

    expect(store.data).to.contain.all.keys({ name: "Fluxo" });

    store.reset({ type: "Object" });

    expect(store.data).to.contain.all.keys({ type: "Object" });
    expect(store.data).to.not.contain.key("name");
  });

  describe("default values", function () {
    it("initialise with default values", function () {
      class Store extends Fluxo.ObjectStore {}

      Store.defaults = {
        name: "Fluxo"
      };

      var store = new Store();

      expect(store.data).to.be.eql({ name: "Fluxo" });
    });

    it("allow to override the default values", function () {
      class Store extends Fluxo.ObjectStore {}

      Store.defaults = {
        name: "Redux"
      };

      var store = new Store({ name: "Fluxo" });

      expect(store.data).to.be.eql({ name: "Fluxo" });
    });
  });
});
