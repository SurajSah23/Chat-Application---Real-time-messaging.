import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('users', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off('message');
      socket.off('users');
    };
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('join', username);
      setIsJoined(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('sendMessage', { username, message });
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 transform perspective-1000 rotate-x-2 rotate-y-2">
        {!isJoined ? (
          <form onSubmit={handleJoin} className="space-y-4">
            <h1 className="text-3xl font-bold text-white text-center">Welcome to 3D Chat</h1>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            <button
              type="submit"
              className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200"
            >
              Join Chat
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 bg-white/5 rounded-lg p-4 h-[500px] overflow-y-auto">
              <h2 className="text-lg font-semibold text-white mb-3">Online Users</h2>
              {users.map((user) => (
                <div
                  key={user.id}
                  className="p-2 bg-indigo-500/20 text-white rounded-lg mb-2 transform hover:scale-105 transition-all"
                >
                  {user.username}
                </div>
              ))}
            </div>
            <div className="col-span-3 flex flex-col">
              <div className="flex-1 bg-white/5 rounded-lg p-4 h-[400px] overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg max-w-[70%] ${
                      msg.username === username
                        ? 'bg-indigo-600 ml-auto'
                        : 'bg-gray-700'
                    } text-white transform hover:-translate-y-1 transition-all`}
                  >
                    <span className="font-semibold">{msg.username}</span>
                    <p>{msg.message}</p>
                    <span className="text-xs opacity-70">{msg.time}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 p-3 rounded-lg bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;