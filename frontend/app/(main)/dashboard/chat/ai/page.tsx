'use client';

import { useState, useEffect, useRef } from 'react';
import { PaperPlaneRight } from "@phosphor-icons/react";
import { Card, Button, TextArea } from '@radix-ui/themes';
import { baseApiUrl } from '@/constants/consts';

const ChatInterface = () => {
	const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
	const [input, setInput] = useState('');
	const [isStreaming, setIsStreaming] = useState(false);
	const chatEndRef = useRef<HTMLDivElement | null>(null);

	const handleSendMessage = async () => {
		if (!input.trim()) return;

		const newMessage = { sender: 'user', text: input };
		setMessages((prev) => [...prev, newMessage]);
		setInput('');
		setIsStreaming(true);

		const response = await fetch(`${baseApiUrl}chat`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ prompt: input })
		});

		if (!response.body) return;
		const reader = response.body.getReader();
		const decoder = new TextDecoder('utf-8');
		let aiMessage = '';

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			aiMessage += decoder.decode(value);
			setMessages((prev) => {
				const updatedMessages = [...prev];
				if (updatedMessages[updatedMessages.length - 1]?.sender === 'ai') {
					updatedMessages[updatedMessages.length - 1].text = aiMessage;
				} else {
					updatedMessages.push({ sender: 'ai', text: aiMessage });
				}
				return updatedMessages;
			});
		}

		setIsStreaming(false);
	};

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<div className="flex flex-col h-screen bg-black text-white">
			<Card className="flex-1 overflow-y-auto p-4 backdrop-blur-lg bg-white/10">
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={`p-2 rounded-2xl max-w-xs ${msg.sender === 'user' ? 'ml-auto bg-green-900 text-white' : 'mr-auto bg-gray-800 text-white'}`}
					>
						{msg.text}
					</div>
				))}
				<div ref={chatEndRef} />
			</Card>
			<div className="p-4 flex items-center gap-2 backdrop-blur-lg bg-white/10">
				<TextArea
					variant='soft'
					placeholder="Type your message..."
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="flex-1 text-black"
					disabled={isStreaming}
				/>
				<Button variant='soft' onClick={handleSendMessage} disabled={isStreaming || !input.trim()}>
					<PaperPlaneRight weight='duotone' size={24} />
				</Button>
			</div>
		</div>
	);
};

export default ChatInterface;
