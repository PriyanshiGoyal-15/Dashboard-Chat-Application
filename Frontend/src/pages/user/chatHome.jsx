import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {
  const [username, setUsername] = useState(
    localStorage.getItem("chat_user") || ""
  );
  const [isJoined, setIsJoined] = useState(!!localStorage.getItem("chat_user"));
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(
    JSON.parse(localStorage.getItem("chat_messages")) || []
  );
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setChat((prev) => {
        const updated = [...prev, data];
        localStorage.setItem("chat_messages", JSON.stringify(updated));
        return updated;
      });
      socket.emit("message_seen");
    });

    socket.on("user_typing", setTypingUser);
    socket.on("stop_typing", () => setTypingUser(""));

    socket.on("message_seen", () => {
      setChat((prev) =>
        prev.map((msg) =>
          msg.status === "delivered" ? { ...msg, status: "seen" } : msg
        )
      );
    });

    return () => socket.off();
  }, []);

  const joinChat = () => {
    if (username.trim()) {
      localStorage.setItem("chat_user", username);
      socket.emit("join", username);
      setIsJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("send_message", { username, message });
      setMessage("");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  /* JOIN */
  if (!isJoined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-300 via-pink-300 to-violet-300">
        <div className="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-2xl w-96">
          <h2 className="text-3xl font-semibold text-center text-stone-800 mb-6">
            ✨ Join Chat
          </h2>

          <input
            className="w-full px-5 py-3 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400"
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button
            onClick={joinChat}
            className="mt-6 w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-full font-medium transition"
          >
            Enter
          </button>
        </div>
      </div>
    );
  }

  /* CHAT */
  return (
    <div className="min-h-screen bg-stone-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-500 to-violet-500 text-white flex justify-between items-center">
          <h2 className="font-semibold tracking-wide">Group Chat ✨</h2>
          <button
            onClick={logout}
            className="text-sm bg-white/20 px-4 py-1 rounded-full hover:bg-white/30"
          >
            Logout
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-stone-100">
          {chat.map((msg, i) => {
            const isMe = msg.username === username;
            return (
              <div
                key={i}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl text-sm leading-relaxed shadow 
                                    break-words whitespace-pre-wrap overflow-hidden
                                   ${
                                     isMe
                                       ? "bg-rose-500 text-white rounded-br-none"
                                       : "bg-stone-200 text-stone-800 rounded-bl-none"
                                   }`}
                >
                  {!isMe && (
                    <p className="text-xs font-semibold text-stone-600 mb-1">
                      {msg.username}
                    </p>
                  )}
                  {msg.message}

                  {isMe && (
                    <div className="text-right text-xs mt-1 opacity-80">
                      {msg.status === "seen" ? "👁 Seen" : "✔ Delivered"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Typing */}
        {typingUser && (
          <div className="px-6 text-xs text-stone-500 animate-pulse">
            {typingUser} is typing...
          </div>
        )}

        {/* Input */}
        <div className="p-4 bg-white border-t flex gap-3">
          <input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              socket.emit("typing", username);
            }}
            onBlur={() => socket.emit("stop_typing")}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type something nice..."
            className="flex-1 px-5 py-3 rounded-full border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <button
            onClick={sendMessage}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 rounded-full font-medium transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
