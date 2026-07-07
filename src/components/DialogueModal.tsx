import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const DialogueModal: React.FC = () => {
  const { dialogueText, dialogueOptions, dialogueResponse, answerDialogue, closeDialogue } = useGameStore();

  return (
    <div className="modal-backdrop z-[200]" onClick={closeDialogue}>
      <div className="glass-panel w-[400px] max-w-[92vw] p-6 animate-slideUp z-[201]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-ice-300/30 flex items-center justify-center">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-white/40">你的宠物说</p>
            <p className="text-sm text-white/70 font-medium">"{dialogueText}"</p>
          </div>
        </div>

        {dialogueResponse ? (
          <div className="text-center">
            <p className="text-white/80 text-sm mb-1">{dialogueResponse}</p>
            <button className="glass-btn mt-3" onClick={closeDialogue}>好的! 🤝</button>
          </div>
        ) : (
          <div className="grid gap-2.5">
            {dialogueOptions.map((opt, i) => (
              <button
                key={i}
                className="glass-panel px-4 py-3 text-left text-sm text-white/80 hover:bg-white/18 transition-all"
                onClick={() => answerDialogue(i)}
              >
                {String.fromCharCode(65 + i)}. {opt.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
