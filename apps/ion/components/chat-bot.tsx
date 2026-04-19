'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from 'ai/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Bot, User, Send, X, Terminal, Loader2, Rocket, History, Github } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, reload } = useChat({
    api: '/api/chat',
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-2xl z-50 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-110"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-8 h-8" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[400px] h-[600px] flex flex-col shadow-2xl z-50 border-primary/20 bg-background/95 backdrop-blur-md overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-4 border-b bg-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Ion Bot</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Active Commander</span>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                <div className="bg-primary/5 p-4 rounded-full">
                  <Terminal className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Welcome, Commander</p>
                  <p className="text-xs">Ask me to list your repos or check deployment status.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center pt-2">
                  <Button variant="outline" size="sm" className="text-[10px]" onClick={() => { handleInputChange({ target: { value: 'List my repos' } } as any); }}>
                    <Github className="w-3 h-3 mr-1" /> List Repos
                  </Button>
                  <Button variant="outline" size="sm" className="text-[10px]" onClick={() => { handleInputChange({ target: { value: 'What is my build status?' } } as any); }}>
                    <History className="w-3 h-3 mr-1" /> Check Status
                  </Button>
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-3 animate-in fade-in duration-300",
                  m.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border",
                  m.role === 'user' ? "bg-secondary" : "bg-primary/10 border-primary/20"
                )}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-primary" />}
                </div>
                
                <div className={cn(
                  "max-w-[80%] rounded-2xl p-3 text-sm shadow-sm",
                  m.role === 'user' 
                    ? "bg-primary text-primary-foreground rounded-tr-none" 
                    : "bg-secondary/50 border rounded-tl-none"
                )}>
                  {m.content}
                  
                  {/* Tool rendering if we had specific components for them */}
                  {m.toolInvocations?.map((toolInvocation) => {
                    const { toolName, toolCallId, state } = toolInvocation;

                    if (state === 'result') {
                      if (toolName === 'list_repos') {
                        return (
                          <div key={toolCallId} className="mt-2 space-y-2">
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Discovered Repositories:</p>
                            <div className="grid gap-1">
                              {toolInvocation.result.map((repo: any) => (
                                <div key={repo.name} className="flex items-center justify-between bg-background/50 p-2 rounded-lg border text-xs">
                                  <span className="truncate max-w-[150px] font-mono">{repo.name}</span>
                                  <Button size="sm" className="h-6 text-[10px]" onClick={() => handleInputChange({ target: { value: `Deploy ${repo.name} from ${repo.url}` } } as any)}>
                                    Deploy
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      
                      if (toolName === 'get_deployment_status') {
                        return (
                           <div key={toolCallId} className="mt-2 space-y-1">
                             {toolInvocation.result.map((p: any) => (
                               <div key={p.projectId} className="flex items-center justify-between text-[11px] p-1.5 border-b last:border-0">
                                 <span>{p.name}</span>
                                 <Badge variant={p.status === 'SUCCESS' ? 'default' : 'destructive'} className="text-[8px] h-4">
                                   {p.status}
                                 </Badge>
                               </div>
                             ))}
                           </div>
                        );
                      }
                    } else {
                        return (
                             <div key={toolCallId} className="mt-2 flex items-center gap-2 text-[10px] animate-pulse">
                               <Loader2 className="w-3 h-3 animate-spin" />
                               <span>AI is {toolName.replace('_', ' ')}...</span>
                             </div>
                        );
                    }
                  })}
                </div>
              </div>
            ))}
            
            {isLoading && !messages[messages.length - 1]?.toolInvocations && (
              <div className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-secondary/50 border rounded-2xl rounded-tl-none p-3 max-w-[80%] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form 
            onSubmit={handleSubmit}
            className="p-4 border-t bg-primary/5 flex items-center gap-2"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask Ion Bot..."
              className="bg-background border-primary/10 focus-visible:ring-primary/20"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input} className="shrink-0 transition-transform active:scale-95">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      )}
    </>
  );
}
