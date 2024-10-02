"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";

export default function OfficePakuriko() {
  const [request, setRequest] = useState("");
  const [favSnack, setFavSnack] = useState("");
  const [penName, setPenName] = useState(""); // ペンネーム用の状態を追加
  const [showMessage, setShowMessage] = useState(false); // メッセージ表示用の状態を追加
  const [liked, setLiked] = useState(false); // いいね！ボタンが押されたかどうかを管理

  const handleLike = async () => {
    try {
      const response = await fetch("/api/notify-slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "like" }),
      });
      if (!response.ok) throw new Error("Failed to send like notification");

      // いいねが押されたら状態をtrueにしてメッセージを表示
      setLiked(true);
      setTimeout(() => {
        setLiked(false); // 3秒後にリセット
      }, 3000);
    } catch (error) {
      console.error("Error sending like notification:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/notify-slack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "submit", request, favSnack, penName }), // ペンネームも送信
      });
      if (!response.ok) throw new Error("Failed to send submission");

      // フォームリセット
      setRequest("");
      setFavSnack("");
      setPenName("");

      // メッセージを表示し、数秒後に非表示にする
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000); // 3秒後にメッセージを非表示に
    } catch (error) {
      console.error("Error sending submission:", error);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md text-purple-500">
      <h1 className="text-2xl font-bold mb-6 text-center">OfficePakuriko</h1>

      {/* いいね！ボタンの状態に応じて色とテキストを変更 */}
      <button
        onClick={handleLike}
        className={`w-full mb-4 flex items-center justify-center ${
          liked ? "bg-green-500" : "bg-blue-500"
        } text-white py-2 px-4 rounded hover:bg-blue-600`}
      >
        <ThumbsUp className="mr-2 h-4 w-4" />
        {liked ? "いいね！ありがとうございます" : "いいね！"}
      </button>

      {/* ペンネーム入力欄を追加 */}
      <input
        type="text"
        placeholder="ペンネーム"
        value={penName}
        onChange={(e) => setPenName(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />

      <textarea
        placeholder="要望を入力してください"
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />

      <input
        type="text"
        placeholder="気に入ったお菓子の名前"
        value={favSnack}
        onChange={(e) => setFavSnack(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded"
      />

      <button
        onClick={handleSubmit}
        disabled={!request && !favSnack && !penName} // ペンネームも含めてフォームが空かどうか確認
        className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        送信
      </button>

      {/* 送信完了メッセージを一時的に表示 */}
      {showMessage && (
        <div className="mt-4 text-center text-green-600">
          ご協力ありがとうございます！
        </div>
      )}
    </div>
  );
}
