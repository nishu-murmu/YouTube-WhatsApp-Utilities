import React, { useState, useRef, useEffect } from 'react';
import { Keyboard, RotateCcw } from 'lucide-react';

const KeyboardShortcutManager = () => {
  const [shortcut, setShortcut] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const inputRef = useRef(null);

  const formatKey = (key) => {
    const keyMap = {
      'Control': 'Ctrl',
      'Meta': 'Cmd',
      'Alt': 'Alt',
      'Shift': 'Shift',
      ' ': 'Space',
      'ArrowUp': '↑',
      'ArrowDown': '↓',
      'ArrowLeft': '←',
      'ArrowRight': '→',
      'Escape': 'Esc',
      'Enter': 'Enter',
      'Backspace': 'Backspace',
      'Delete': 'Del',
      'Tab': 'Tab'
    };
    return keyMap[key] || key.toUpperCase();
  };

  const handleKeyDown = (e) => {
    if (!isCapturing) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const key = e.key;
    const newPressedKeys = new Set(pressedKeys);
    
    // Add modifier keys
    if (e.ctrlKey) newPressedKeys.add('Control');
    if (e.metaKey) newPressedKeys.add('Meta');
    if (e.altKey) newPressedKeys.add('Alt');
    if (e.shiftKey) newPressedKeys.add('Shift');
    
    // Don't capture lone modifier keys as the main key
    if (!['Control', 'Meta', 'Alt', 'Shift'].includes(key)) {
      newPressedKeys.add(key);
      
      // Create the shortcut combination
      const modifiers = [];
      if (newPressedKeys.has('Control')) modifiers.push('Control');
      if (newPressedKeys.has('Meta')) modifiers.push('Meta');
      if (newPressedKeys.has('Alt')) modifiers.push('Alt');
      if (newPressedKeys.has('Shift')) modifiers.push('Shift');
      
      const allKeys = [...modifiers, key];
      const combo = allKeys.map(formatKey).join(' + ');
      
      setShortcut(combo);
      setPressedKeys(newPressedKeys);
      
      // Stop capturing after a short delay to show the result
      setTimeout(() => {
        setIsCapturing(false);
        inputRef.current?.blur();
      }, 100);
    } else {
      setPressedKeys(newPressedKeys);
    }
  };

  const handleKeyUp = (e) => {
    if (!isCapturing) return;
    
    const newPressedKeys = new Set(pressedKeys);
    
    // Remove keys that are no longer pressed
    if (!e.ctrlKey) newPressedKeys.delete('Control');
    if (!e.metaKey) newPressedKeys.delete('Meta');
    if (!e.altKey) newPressedKeys.delete('Alt');
    if (!e.shiftKey) newPressedKeys.delete('Shift');
    
    setPressedKeys(newPressedKeys);
  };

  const handleInputFocus = () => {
    setIsCapturing(true);
    setPressedKeys(new Set());
  };

  const handleInputBlur = () => {
    setIsCapturing(false);
    setPressedKeys(new Set());
  };

  const clearShortcut = () => {
    setShortcut('');
    setIsCapturing(false);
    setPressedKeys(new Set());
  };

  const testShortcut = () => {
    if (!shortcut) return;
    alert(`Shortcut triggered: ${shortcut}`);
  };

  // Global event listeners to capture keys even when input loses focus during key combination
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (isCapturing) {
        handleKeyDown(e);
      }
    };

    const handleGlobalKeyUp = (e) => {
      if (isCapturing) {
        handleKeyUp(e);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown, true);
    document.addEventListener('keyup', handleGlobalKeyUp, true);

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown, true);
      document.removeEventListener('keyup', handleGlobalKeyUp, true);
    };
  }, [isCapturing, pressedKeys]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-white text-xl font-medium mb-2 flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcut
          </h1>
          <p className="text-gray-400 text-sm">
            Click the input and press any key combination
          </p>
        </div>

        {/* Main Input */}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={shortcut}
            placeholder="Click here and press keys..."
            readOnly
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className={`w-full px-4 py-3 bg-transparent border-2 rounded-lg text-white placeholder-gray-500 font-mono text-lg cursor-pointer transition-all duration-200 ${
              isCapturing 
                ? 'border-red-500 ring-2 ring-red-500/20 bg-red-950/20' 
                : shortcut 
                  ? 'border-green-500 hover:border-green-400' 
                  : 'border-red-500 hover:border-red-400'
            } focus:outline-none`}
          />
          
          {/* Clear button */}
          {shortcut && (
            <button
              onClick={clearShortcut}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              title="Clear shortcut"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status indicator */}
        <div className="mt-3 text-sm">
          {isCapturing ? (
            <div className="text-red-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              Recording... Press any key combination
            </div>
          ) : shortcut ? (
            <div className="text-green-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Shortcut set: {shortcut}
            </div>
          ) : (
            <div className="text-gray-500">
              No shortcut configured
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutManager;
