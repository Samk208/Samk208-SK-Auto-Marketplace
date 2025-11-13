import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useTranslation } from '@/hooks/useTranslation';
import type { Car, User, ChatMessage } from '@/types/types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
  seller: User;
  currentUser: User;
}

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
);

export const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, car, seller, currentUser }) => {
    const { t } = useTranslation();
    const initialMessage = t('initial_chat_message').replace('{make}', car.make).replace('{model}', car.model);
    
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: `msg-${Date.now()}`, text: initialMessage, sender: 'user', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    
    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const userMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            text: newMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setNewMessage('');

        // Simulate a seller response
        setTimeout(() => {
            const sellerResponse: ChatMessage = {
                id: `msg-${Date.now() + 1}`,
                text: `Thank you for your interest in the ${car.make} ${car.model}. I'll get back to you shortly.`,
                sender: 'seller',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, sellerResponse]);
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] md:max-w-lg flex flex-col h-[70vh] p-0">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle className="text-base">{t('chat_with_seller').replace('{sellerName}', seller.fullName)}</DialogTitle>
                    <p className="text-sm text-muted-foreground -mt-1">{car.year} {car.make} {car.model}</p>
                </DialogHeader>
                
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'seller' && <img src={seller.avatarUrl} className="w-8 h-8 rounded-full" />}
                            <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-secondary rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70' : 'text-secondary-foreground/70'} text-right`}>{msg.timestamp}</p>
                            </div>
                             {msg.sender === 'user' && <img src={currentUser.avatarUrl} className="w-8 h-8 rounded-full" />}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t bg-background">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <Input 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={t('message_placeholder')}
                            autoComplete="off"
                        />
                        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                            <SendIcon className="w-4 h-4" />
                            <span className="sr-only">{t('send')}</span>
                        </Button>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};