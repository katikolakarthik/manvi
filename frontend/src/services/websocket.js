class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.listeners = new Map();
  }

  connect() {
    try {
      // For now, we'll use a simple approach with custom events
      // In a production environment, you would connect to a WebSocket server
      console.log('WebSocket service initialized (using custom events for now)');
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Subscribe to order updates
  subscribeToOrders(callback) {
    const eventId = 'order-updates';
    if (!this.listeners.has(eventId)) {
      this.listeners.set(eventId, []);
    }
    this.listeners.get(eventId).push(callback);
  }

  // Subscribe to payment updates
  subscribeToPayments(callback) {
    const eventId = 'payment-updates';
    if (!this.listeners.has(eventId)) {
      this.listeners.set(eventId, []);
    }
    this.listeners.get(eventId).push(callback);
  }

  // Unsubscribe from updates
  unsubscribe(eventId, callback) {
    if (this.listeners.has(eventId)) {
      const callbacks = this.listeners.get(eventId);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  // Emit order update (called by payment success handlers)
  emitOrderUpdate(orderData) {
    const callbacks = this.listeners.get('order-updates') || [];
    callbacks.forEach(callback => {
      try {
        callback(orderData);
      } catch (error) {
        console.error('Error in order update callback:', error);
      }
    });
  }

  // Emit payment update
  emitPaymentUpdate(paymentData) {
    const callbacks = this.listeners.get('payment-updates') || [];
    callbacks.forEach(callback => {
      try {
        callback(paymentData);
      } catch (error) {
        console.error('Error in payment update callback:', error);
      }
    });
  }
}

// Create singleton instance
const websocketService = new WebSocketService();
websocketService.connect();

export default websocketService; 