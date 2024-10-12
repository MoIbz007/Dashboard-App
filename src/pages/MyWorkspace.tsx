import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Mic, Clock, MoreHorizontal, Copy, Mail, Download, Save, Edit, RefreshCw, MessageCircle } from 'lucide-react';

interface Tab {
  id: string;
  title: string;
  type: 'context' | 'note' | 'referral';
  content: string;
}

const MyWorkspace: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', title: 'Context', type: 'context', content: '' },
    { id: '2', title: 'Note', type: 'note', content: '' },
  ]);
  const [activeTab, setActiveTab] = useState<string>('1');
  const [patientName, setPatientName] = useState<string>('');
  const [language, setLanguage] = useState<string>('en');
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const [transcriptionTime, setTranscriptionTime] = useState<number>(0);
  const referralContentRef = useRef<HTMLParagraphElement>(null);
  const transcriptionInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (transcriptionInterval.current) {
        clearInterval(transcriptionInterval.current);
      }
    };
  }, []);

  const addTab = (type: 'context' | 'note' | 'referral' = 'referral') => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: type === 'referral' ? 'Referral letter' : type === 'note' ? 'Note' : 'Context',
      type,
      content: type === 'referral' ? 'Patient presenting with depressive symptoms, currently on Prozac 20mg daily, requires further management strategies.' : '',
    };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  const removeTab = (id: string) => {
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    if (activeTab === id) {
      setActiveTab(newTabs[newTabs.length - 1]?.id || '');
    }
  };

  const updateTabContent = (id: string, content: string) => {
    setTabs(tabs.map(tab => tab.id === id ? { ...tab, content } : tab));
  };

  const copyAllText = () => {
    if (referralContentRef.current) {
      const text = referralContentRef.current.innerText;
      navigator.clipboard.writeText(text).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
    setShowOptions(false);
  };

  const regenerateOutput = () => {
    const newContent = "Updated referral letter: Patient with persistent depressive symptoms, not responding adequately to current Prozac 20mg daily regimen. Recommend psychiatric evaluation for potential medication adjustment and intensive psychotherapy.";
    updateTabContent(activeTab, newContent);
    setShowOptions(false);
  };

  const startTranscribing = () => {
    setIsTranscribing(true);
    setTranscriptionTime(0);
    transcriptionInterval.current = setInterval(() => {
      setTranscriptionTime(prev => prev + 1);
    }, 1000);

    // Simulate transcription by updating the active tab's content after 5 seconds
    setTimeout(() => {
      const transcribedContent = "Transcribed content: Patient reports feeling increasingly depressed over the past month. Sleep disturbances noted, with difficulty falling asleep and early morning awakening. Appetite has decreased, resulting in a 5-pound weight loss. Patient denies suicidal ideation but expresses feelings of hopelessness.";
      updateTabContent(activeTab, transcribedContent);
      stopTranscribing();
    }, 5000);
  };

  const stopTranscribing = () => {
    setIsTranscribing(false);
    if (transcriptionInterval.current) {
      clearInterval(transcriptionInterval.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderTabContent = (tab: Tab) => {
    switch (tab.type) {
      case 'context':
        return (
          <textarea
            className="w-full h-full p-4 resize-none border-none focus:outline-none text-gray-700"
            placeholder="Add any additional context about the patient"
            value={tab.content}
            onChange={(e) => updateTabContent(tab.id, e.target.value)}
          />
        );
      case 'note':
        return (
          <div className="p-4 text-gray-700">
            <h3 className="font-bold mb-2">Subjective:</h3>
            <ul className="list-disc list-inside mb-4 pl-4">
              <li>Feeling low for past few months</li>
              <li>Unable to shake off sadness</li>
              <li>Lack of energy for enjoyable activities</li>
            </ul>
            <h3 className="font-bold mb-2">Objective:</h3>
            <ul className="list-disc list-inside mb-4 pl-4">
              <li>Speech: slow and low in volume</li>
              <li>Affect: blunted</li>
            </ul>
            <h3 className="font-bold mb-2">Assessment:</h3>
            <p className="mb-4 pl-4">Possible depressive episode</p>
            <h3 className="font-bold mb-2">Plan:</h3>
            <ul className="list-disc list-inside pl-4">
              <li>Commence Cognitive Behavioural Therapy</li>
              <li>Consider starting antidepressant: Prozac 20mg daily</li>
            </ul>
          </div>
        );
      case 'referral':
        return (
          <div className="p-4 text-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Referral letter</h2>
              <div className="relative">
                <button 
                  className="p-2 hover:bg-gray-200 rounded"
                  onClick={() => setShowOptions(!showOptions)}
                >
                  <MoreHorizontal />
                </button>
                {showOptions && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      <OptionItem icon={<Copy />} text="Copy all text" onClick={copyAllText} />
                      <OptionItem icon={<Mail />} text="Send as email" onClick={() => console.log('Send as email')} />
                      <OptionItem icon={<Download />} text="Export as" onClick={() => console.log('Export as')} />
                      <OptionItem icon={<Save />} text="Save as new template" onClick={() => console.log('Save as new template')} />
                      <OptionItem icon={<Edit />} text="View / edit template" onClick={() => console.log('View / edit template')} />
                      <OptionItem icon={<RefreshCw />} text="Regenerate output" onClick={regenerateOutput} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <p ref={referralContentRef}>
              {tab.content}
            </p>
            {copySuccess && (
              <div className="mt-2 text-green-500">Text copied to clipboard!</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - adjusted width */}
      <div className="w-48 bg-white shadow-lg">
        {/* Sidebar content */}
      </div>

      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 bg-white shadow-sm">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Patient name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium"
              onClick={() => addTab('referral')}
            >
              Create
            </button>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="text-gray-500 w-4 h-4" />
              <span>{formatTime(transcriptionTime)}</span>
            </div>
            <button 
              className={`${isTranscribing ? 'bg-red-500' : 'bg-green-500'} text-white px-4 py-2 rounded flex items-center text-sm font-medium`}
              onClick={isTranscribing ? stopTranscribing : startTranscribing}
            >
              <Mic className="mr-2 w-4 h-4" />
              {isTranscribing ? 'Stop transcribing' : 'Start transcribing'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-100 px-1">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 cursor-pointer text-sm ${
                activeTab === tab.id
                  ? 'bg-white border-t border-l border-r border-gray-300 rounded-t-lg text-blue-500 font-medium'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.title}
              {tab.id !== '1' && tab.id !== '2' && (
                <X
                  className="ml-2 text-gray-500 hover:text-gray-700 w-4 h-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTab(tab.id);
                  }}
                />
              )}
            </div>
          ))}
          <button
            className="px-4 py-2 text-gray-600 hover:bg-gray-200"
            onClick={() => addTab()}
          >
            <Plus className="text-gray-500 w-4 h-4" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-grow bg-gray-100 p-1 overflow-auto">
          <div className="bg-white rounded-lg shadow-sm h-full">
            {renderTabContent(tabs.find((tab) => tab.id === activeTab)!)}
          </div>
        </div>

        {/* AI Assistant input */}
        <div className="p-1 bg-gray-100 border-t border-gray-300">
          <div className="flex items-center bg-white rounded-lg shadow-sm">
            <div className="p-2 bg-gray-200 rounded-l-lg">
              <MessageCircle className="text-gray-500 w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Ask Heidi to do anything..."
              className="flex-grow px-4 py-2 bg-white rounded-r-lg text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const OptionItem: React.FC<{ icon: React.ReactNode; text: string; onClick: () => void }> = ({ icon, text, onClick }) => (
  <button
    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    role="menuitem"
    onClick={onClick}
  >
    {icon}
    <span className="ml-2">{text}</span>
  </button>
);

export default MyWorkspace;
