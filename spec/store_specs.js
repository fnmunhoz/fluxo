describe("Fluxo.Store", function () {
  context("on an instance", function() {
    it("#setAttribute", function() {
      var store = new Fluxo.Store(),
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
      var store = new Fluxo.Store({ name: "Samuel" }),
          onChangeCallback = chai.spy(),
          onChangeNameCallback = chai.spy();

      store.on(["change"], onChangeCallback);
      store.on(["change:name"], onChangeNameCallback);

      store.set({ name: "Other", email: "fluxo@flux.com" });

      expect(store.data).to.be.eql({ name: "Other", email: "fluxo@flux.com" });
      expect(onChangeCallback).to.have.been.called();
      expect(onChangeNameCallback).to.have.been.called();
    });

    it("#toJSON", function() {
      var store = new Fluxo.Store({ name: "Samuel" });
      expect(store.toJSON()).to.be.eql({ name: "Samuel" });
    });
  });

  context("on a class", function() {
    it("#extend", function() {
      var MyCustomStore = Fluxo.Store.extend({
        myCustomMethod: function() {
          return this.data.name;
        }
      });

      var store = new MyCustomStore({ name: "Samuel" });

      expect(store.myCustomMethod()).to.be.eql("Samuel");
    });
  });
});
