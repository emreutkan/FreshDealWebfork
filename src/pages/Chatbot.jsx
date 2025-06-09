import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

/**
 * Chatbot Component - A full implementation of the chatbot UI and functionality
 * Based on the Flask routes and ChatbotService implementation
 */
const Chatbot = () => {
  // State for chat messages and interactions
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddressFormVisible, setIsAddressFormVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [currentInputDisabled, setCurrentInputDisabled] = useState(false);
  const [addressForm, setAddressForm] = useState({
    title: '',
    longitude: 0,
    latitude: 0,
    street: '',
    neighborhood: '',
    district: '',
    province: '',
    country: '',
    postalCode: '',
    apartmentNo: 0,
    doorNo: '',
  });

  // References
  const chatContainerRef = useRef(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize the chat when the component mounts
  useEffect(() => {
    startChatbotConversation();
  }, []);

  // API calls matching the Flask backend routes
  const startChatbotConversation = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/chatbot/start');
      const data = response.data;
      
      if (data.success) {
        addBotMessage(data.message, data.options);
      } else {
        setError('Failed to start conversation');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      setError('Failed to connect to the chatbot service');
    } finally {
      setIsLoading(false);
    }
  };

  const getOrderStatus = async () => {
    setIsLoading(true);
    setCurrentInputDisabled(true);
    
    try {
      const response = await axios.get('/api/chatbot/order-status');
      const data = response.data;
      
      if (data.success) {
        // Order found
        addBotMessage("Here's your current order status:", null, {
          status: data.order_status,
          listingId: data.listing_id,
          createdAt: data.created_at
        });
        setCurrentInputDisabled(false);
      } else {
        // No active orders
        addBotMessage(
          data.message || 'No active orders found.',
          ["🛒 I want to check my order status", "🏠 I want to change my address", "🔄 Back to main menu"]
        );
      }
    } catch (error) {
      console.error('Error fetching order status:', error);
      addBotMessage(
        "Sorry, I couldn't retrieve your order status. Please try again later.",
        ["🛒 Try again", "🔄 Back to main menu"]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrder = async () => {
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/chatbot/cancel-order');
      const data = response.data;
      
      setIsCancelModalVisible(false);
      
      addBotMessage(
        data.message,
        ["🛒 Check another order status", "🏠 I want to change my address", "🔄 Back to main menu"],
        null,
        data.success,
        false
      );
    } catch (error) {
      console.error('Error cancelling order:', error);
      setIsCancelModalVisible(false);
      
      addBotMessage(
        "Sorry, I couldn't cancel your order. Please try again later.",
        ["❌ Try again", "🔄 Back to main menu"]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async (addressData) => {
    setIsLoading(true);
    
    try {
      const response = await axios.post('/api/chatbot/update-address', addressData);
      const data = response.data;
      
      setIsAddressFormVisible(false);
      
      addBotMessage(
        data.message,
        ["🛒 Check order status", "❌ I want to cancel my order", "🔄 Back to main menu"],
        null,
        false,
        data.success
      );
      
      // Reset the address form
      setAddressForm({
        title: '',
        longitude: 0,
        latitude: 0,
        street: '',
        neighborhood: '',
        district: '',
        province: '',
        country: '',
        postalCode: '',
        apartmentNo: 0,
        doorNo: '',
      });
    } catch (error) {
      console.error('Error updating address:', error);
      
      addBotMessage(
        "Sorry, I couldn't update your address. Please try again later.",
        ["🏠 Try again", "🔄 Back to main menu"]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to generate a unique ID
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
  };

  // Helper function to add a bot message
  const addBotMessage = (content, options, orderStatus, isOrderCancelled, isAddressUpdated) => {
    const newMessage = {
      id: generateId(),
      content,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      options,
      orderStatus,
      isOrderCancelled,
      isAddressUpdated
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  // Helper function to add a user message
  const addUserMessage = (content) => {
    const newMessage = {
      id: generateId(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  // Event handlers
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    addUserMessage(userInput);
    setUserInput('');
    
    // Handle different user intents based on message content
    if (userInput.toLowerCase().includes('order status')) {
      handleOrderStatusCheck();
    } else if (userInput.toLowerCase().includes('cancel')) {
      handleCancelOrder();
    } else if (userInput.toLowerCase().includes('address')) {
      handleChangeAddress();
    } else {
      // For any other message, just acknowledge and offer options
      setTimeout(() => {
        addBotMessage("I'm not sure how to help with that. Please select an option below.", [
          "🛒 I want to check my order status",
          "❌ I want to cancel my order",
          "🏠 I want to change my address"
        ]);
      }, 500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !currentInputDisabled) {
      handleSendMessage();
    }
  };

  const handleOptionSelect = (option) => {
    if (option.includes('check my order status') || option === 'orderStatus') {
      handleOrderStatusCheck();
    } else if (option.includes('cancel my order') || option === 'cancelOrder') {
      handleCancelOrder();
    } else if (option.includes('change my address') || option === 'changeAddress') {
      handleChangeAddress();
    } else if (option.includes('main menu') || option === 'mainMenu') {
      startChatbotConversation();
    } else {
      // For any other option, send as a user message
      addUserMessage(option);
      // Add simple echo response for demonstration
      setTimeout(() => {
        addBotMessage(`You selected: ${option}`, [
          "🛒 I want to check my order status",
          "❌ I want to cancel my order",
          "🏠 I want to change my address"
        ]);
      }, 500);
    }
  };

  const handleOrderStatusCheck = () => {
    addUserMessage("I want to check my order status");
    getOrderStatus();
  };

  const handleCancelOrder = () => {
    addUserMessage("I want to cancel my order");
    setIsCancelModalVisible(true);
  };

  const handleConfirmCancel = () => {
    cancelOrder();
  };

  const handleChangeAddress = () => {
    addUserMessage("I want to change my address");
    setIsAddressFormVisible(true);
  };

  const updateAddressFormField = (field, value) => {
    setAddressForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitAddress = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!addressForm.title || !addressForm.latitude || !addressForm.longitude) {
      setError("Please fill in all required fields (title, latitude, longitude)");
      return;
    }
    
    updateAddress(addressForm);
  };

  // Format status for display
  const getStatusInfo = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'bi-clock' };
      case 'ACCEPTED':
      case 'IN PREPARATION':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: 'bi-check-circle' };
      case 'COMPLETED':
        return { bg: 'bg-green-700', text: 'text-white', icon: 'bi-check2-circle' };
      case 'CANCELED':
      case 'CANCELLED':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: 'bi-x-circle' };
      case 'REJECTED':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: 'bi-x-circle' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'bi-question-circle' };
    }
  };

  // Time formatter
  const formatTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-3 shadow-sm z-10">
        <div className="flex items-center">
          <button 
            className="w-10 h-10 flex items-center justify-center text-gray-700 rounded-full hover:bg-gray-100 transition"
            onClick={() => window.history.back()}
          >
            <i className="bi bi-arrow-left text-xl"></i>
          </button>
          <h1 className="text-xl font-semibold text-gray-800 flex-1 text-center">Customer Support</h1>
          <div className="w-10"></div>
        </div>
      </header>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 py-5"
      >
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-32 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className="mb-4">
                {/* Chat Message Component */}
                <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'items-start'} mb-4`}>
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2 text-white">
                      <i className="bi bi-robot text-sm"></i>
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${
                    message.sender === 'user' 
                      ? 'bg-primary text-white rounded-t-xl rounded-bl-xl' 
                      : 'bg-white text-neutral-dark rounded-t-xl rounded-br-xl'
                    } p-3 shadow-sm`}
                  >
                    <p className={message.sender === 'user' ? 'text-white' : 'text-neutral-dark'}>
                      {message.content}
                    </p>

                    {/* Order status information */}
                    {message.orderStatus && (
                      <div className="mt-2 bg-gray-100 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="text-neutral-dark font-medium">Status:</span>
                          <span className={`ml-2 px-2 py-1 text-xs rounded-full flex items-center ${getStatusInfo(message.orderStatus?.status || '').bg} ${getStatusInfo(message.orderStatus?.status || '').text}`}>
                            <i className={`bi ${getStatusInfo(message.orderStatus?.status || '').icon} mr-1`}></i>
                            {message.orderStatus?.status?.toUpperCase() || 'UNKNOWN'}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-dark">
                          <i className="bi bi-clock mr-1"></i> Order placed at: {new Date(message.orderStatus?.createdAt || new Date()).toLocaleTimeString()}
                        </p>
                        <p className="text-sm text-neutral-dark mt-1">
                          <i className="bi bi-bag mr-1"></i> Order #{message.orderStatus?.listingId || '0'}
                        </p>
                        <div className="mt-3">
                          <button 
                            className="flex items-center text-sm px-3 py-1 rounded border border-gray-300 bg-white hover:bg-gray-50"
                            onClick={() => window.location.href = `/order/${message.orderStatus?.listingId || '0'}`}
                          >
                            <i className="bi bi-eye mr-1"></i> View Order Details
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Order cancelled success message */}
                    {message.isOrderCancelled && (
                      <div className="flex items-center mt-2 text-green-600">
                        <i className="bi bi-check-circle mr-2"></i>
                        <p className="text-sm font-medium">Order successfully cancelled.</p>
                      </div>
                    )}
                    
                    {/* Address updated success message */}
                    {message.isAddressUpdated && (
                      <div className="flex items-center mt-2 text-green-600">
                        <i className="bi bi-check-circle mr-2"></i>
                        <p className="text-sm font-medium">Address successfully updated.</p>
                      </div>
                    )}
                    
                    <span className="text-xs text-opacity-70 mt-1 block">
                      {formatTimeAgo(message.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Chat Options Component */}
                {message.options && message.sender === 'bot' && (
                  <div className="pl-10 space-y-2 mb-6">
                    {message.options.map((option, index) => (
                      <button
                        key={index}
                        className="block w-full max-w-[80%] justify-start text-left hover:bg-gray-50 border border-gray-300 rounded-lg py-6 px-4 shadow-sm bg-white"
                        onClick={() => handleOptionSelect(option)}
                      >
                        <div className="flex items-center">
                          {option.includes('order status') && <i className="bi bi-cart text-primary mr-2"></i>}
                          {option.includes('cancel') && <i className="bi bi-x-circle text-red-500 mr-2"></i>}
                          {option.includes('address') && <i className="bi bi-house text-primary mr-2"></i>}
                          {option.includes('main menu') && <i className="bi bi-arrow-repeat text-gray-500 mr-2"></i>}
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2 text-white">
                  <i className="bi bi-robot text-sm"></i>
                </div>
                <div className="max-w-[80%] bg-white rounded-t-xl rounded-br-xl p-3 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse delay-75"></div>
                    <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center">
          <input 
            type="text" 
            className="flex-1 rounded-l-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Type your message..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={currentInputDisabled}
          />
          <button 
            className="rounded-r-full bg-primary hover:bg-primary/90 text-white px-4 py-2 border border-primary"
            onClick={handleSendMessage}
            disabled={currentInputDisabled || !userInput.trim()}
          >
            <i className="bi bi-send"></i>
          </button>
        </div>
      </div>

      {/* Address Form Modal */}
      {isAddressFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-end justify-center">
          <div className="bg-white rounded-t-xl w-full max-w-md p-4 shadow-lg transform animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-neutral-dark">Update Your Address</h2>
              <button 
                className="w-8 h-8 flex items-center justify-center text-neutral-dark rounded-full hover:bg-neutral-100 transition"
                onClick={() => setIsAddressFormVisible(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmitAddress} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Address Title</label>
                <input 
                  id="title"
                  name="title"
                  value={addressForm.title}
                  onChange={(e) => updateAddressFormField('title', e.target.value)}
                  placeholder="Home, Work, etc."
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitude</label>
                  <input 
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="0.0001"
                    value={addressForm.latitude || ''}
                    onChange={(e) => updateAddressFormField('latitude', parseFloat(e.target.value))}
                    placeholder="38.4237"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitude</label>
                  <input 
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="0.0001"
                    value={addressForm.longitude || ''}
                    onChange={(e) => updateAddressFormField('longitude', parseFloat(e.target.value))}
                    placeholder="27.1428"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street</label>
                <input 
                  id="street"
                  name="street"
                  value={addressForm.street || ''}
                  onChange={(e) => updateAddressFormField('street', e.target.value)}
                  placeholder="123 Elm St"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">Neighborhood</label>
                  <input 
                    id="neighborhood"
                    name="neighborhood"
                    value={addressForm.neighborhood || ''}
                    onChange={(e) => updateAddressFormField('neighborhood', e.target.value)}
                    placeholder="Sunnydale"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700">District</label>
                  <input 
                    id="district"
                    name="district"
                    value={addressForm.district || ''}
                    onChange={(e) => updateAddressFormField('district', e.target.value)}
                    placeholder="Downtown"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700">Province</label>
                  <input 
                    id="province"
                    name="province"
                    value={addressForm.province || ''}
                    onChange={(e) => updateAddressFormField('province', e.target.value)}
                    placeholder="Izmir"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                  <input 
                    id="country"
                    name="country"
                    value={addressForm.country || ''}
                    onChange={(e) => updateAddressFormField('country', e.target.value)}
                    placeholder="Turkey"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
                  <input 
                    id="postalCode"
                    name="postalCode"
                    value={addressForm.postalCode || ''}
                    onChange={(e) => updateAddressFormField('postalCode', e.target.value)}
                    placeholder="35000"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="apartmentNo" className="block text-sm font-medium text-gray-700">Apt No</label>
                  <input 
                    id="apartmentNo"
                    name="apartmentNo"
                    type="number"
                    value={addressForm.apartmentNo || ''}
                    onChange={(e) => updateAddressFormField('apartmentNo', parseInt(e.target.value))}
                    placeholder="5"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="doorNo" className="block text-sm font-medium text-gray-700">Door No</label>
                  <input 
                    id="doorNo"
                    name="doorNo"
                    value={addressForm.doorNo || ''}
                    onChange={(e) => updateAddressFormField('doorNo', e.target.value)}
                    placeholder="A"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-2">
                <button 
                  type="button" 
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={() => setIsAddressFormVisible(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Save New Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Cancel Order Confirmation Modal */}
      {isCancelModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-sm mx-4 p-5 shadow-lg transform animate-in fade-in duration-300">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <i className="bi bi-exclamation-triangle text-3xl text-red-500"></i>
              </div>
              <h2 className="text-lg font-semibold text-neutral-dark">Cancel Your Order?</h2>
              <p className="text-gray-500 mt-2">This action cannot be undone. Are you sure you want to cancel your order?</p>
            </div>
            
            <div className="flex space-x-3">
              <button 
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                onClick={() => setIsCancelModalVisible(false)}
              >
                No, Keep It
              </button>
              <button 
                className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleConfirmCancel}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error message toast */}
      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 shadow-md">
          <div className="flex items-center">
            <i className="bi bi-exclamation-circle mr-2"></i>
            <span>{error}</span>
            <button 
              className="ml-4 text-red-700 hover:text-red-900" 
              onClick={() => setError(null)}
            >
              <i className="bi bi-x"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
