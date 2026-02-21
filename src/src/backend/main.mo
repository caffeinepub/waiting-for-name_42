import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import VarArray "mo:core/VarArray";
import Order "mo:core/Order";

actor {
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
    imageUrl : Text;
    stock : Nat;
    category : Text;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  type CartItem = {
    productId : Nat;
    quantity : Nat;
  };

  type OrderItem = {
    product : Product;
    quantity : Nat;
  };

  type OrderData = {
    id : Nat;
    user : Principal;
    items : [OrderItem];
    total : Nat;
    paymentMethod : Text;
    status : Text;
    timestamp : Int;
  };

  module OrderData {
    public func compare(order1 : OrderData, order2 : OrderData) : Order.Order {
      Nat.compare(order1.id, order2.id);
    };
  };

  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Principal, [CartItem]>();
  let orders = Map.empty<Nat, OrderData>();
  var productIdCounter = 0;
  var orderIdCounter = 0;

  var admin : ?Principal = null;

  // Admin functions
  public shared ({ caller }) func initializeAdmin() : async () {
    if (admin != null) {
      Runtime.trap("Admin already initialized");
    };
    admin := ?caller;
  };

  func assertAdmin(caller : Principal) {
    if (admin == null or caller != admin) {
      Runtime.trap("Unauthorized");
    };
  };

  // Product management
  public shared ({ caller }) func createProduct(name : Text, description : Text, price : Nat, imageUrl : Text, stock : Nat, category : Text) : async Nat {
    assertAdmin(caller);

    let id = productIdCounter;
    productIdCounter += 1;

    let product : Product = {
      id;
      name;
      description;
      price;
      imageUrl;
      stock;
      category;
    };

    products.add(id, product);
    id;
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func searchProductsByName(name : Text) : async [Product] {
    products.values().toArray().filter(func(p) { p.name.contains(#text name) });
  };

  public query ({ caller }) func searchProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(func(p) { p.category == category });
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, description : Text, price : Nat, imageUrl : Text, stock : Nat, category : Text) : async () {
    assertAdmin(caller);

    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let updatedProduct : Product = {
          id;
          name;
          description;
          price;
          imageUrl;
          stock;
          category;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    assertAdmin(caller);
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    products.remove(id);
  };

  // Shopping cart
  public shared ({ caller }) func addToCart(productId : Nat, quantity : Nat) : async () {
    switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let cart = switch (carts.get(caller)) {
          case (null) { [] };
          case (?items) { items };
        };

        let existingItem = cart.find(func(item) { item.productId == productId });
        switch (existingItem) {
          case (?_) {
            let newCart = cart.map(
              func(item) {
                if (item.productId == productId) {
                  { productId; quantity = item.quantity + quantity };
                } else {
                  item;
                };
              }
            );
            carts.add(caller, newCart);
          };
          case (null) {
            let newItem : CartItem = { productId; quantity };
            carts.add(caller, cart.concat([newItem]));
          };
        };
      };
    };
  };

  public shared ({ caller }) func updateCartItem(productId : Nat, quantity : Nat) : async () {
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) {
        let updatedCart = cart.map(
          func(item) {
            if (item.productId == productId) {
              { productId; quantity };
            } else { item };
          }
        );
        carts.add(caller, updatedCart);
      };
    };
  };

  public shared ({ caller }) func removeFromCart(productId : Nat) : async () {
    switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?cart) {
        let updatedCart = cart.filter(func(item) { item.productId != productId });
        carts.add(caller, updatedCart);
      };
    };
  };

  public query ({ caller }) func getCart() : async [CartItem] {
    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart };
    };
  };

  // Order management
  public shared ({ caller }) func createOrder(paymentMethod : Text) : async Nat {
    let cart = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?items) { items };
    };

    if (cart.size() == 0) {
      Runtime.trap("Cart is empty");
    };

    let orderItemsVar : [var OrderItem] = VarArray.repeat<OrderItem>(
      { product = { id = 0; name = ""; description = ""; price = 0; imageUrl = ""; stock = 0; category = "" }; quantity = 0 },
      cart.size(),
    );

    var total = 0;
    var i = 0;

    for (item in cart.values()) {
      switch (products.get(item.productId)) {
        case (null) { Runtime.trap("Product not found") };
        case (?product) {
          if (product.stock < item.quantity) {
            Runtime.trap("Insufficient stock for product: " # product.name);
          };

          orderItemsVar[i] := { product; quantity = item.quantity };
          total += product.price * item.quantity;
        };
      };
      i += 1;
    };

    let orderId = orderIdCounter;
    orderIdCounter += 1;

    let order : OrderData = {
      id = orderId;
      user = caller;
      items = orderItemsVar.toArray();
      total;
      paymentMethod;
      status = "pending";
      timestamp = Time.now();
    };

    orders.add(orderId, order);
    carts.remove(caller);

    orderId;
  };

  public query ({ caller }) func getOrder(id : Nat) : async OrderData {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };

  public query ({ caller }) func getUserOrders() : async [OrderData] {
    orders.values().toArray().filter(func(o) { o.user == caller }).sort();
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, status : Text) : async () {
    assertAdmin(caller);

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder : OrderData = {
          id = order.id;
          user = order.user;
          items = order.items;
          total = order.total;
          paymentMethod = order.paymentMethod;
          status;
          timestamp = order.timestamp;
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public shared ({ caller }) func deleteOrder(orderId : Nat) : async () {
    assertAdmin(caller);
    if (not orders.containsKey(orderId)) {
      Runtime.trap("Order not found");
    };
    orders.remove(orderId);
  };
};
