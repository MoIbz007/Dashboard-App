import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document } from '../lib/types';
import { FileText, Plus, Search } from 'lucide-react';

const Documents: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data - replace with actual data from your backend
  const [documents] = useState<Document[]>([
    {
      id: '1',
      title: 'Sample Template 1',
      type: 'template',
      content: 'Template content here',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '1',
      tags: ['template', 'medical']
    },
    {
      id: '2',
      title: 'Meeting Notes Template',
      type: 'template',
      content: 'Meeting notes template content',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: '1',
      tags: ['template', 'meeting']
    }
  ]);

  const handleCreateNew = () => {
    navigate('/workspace');
  };

  const handleOpenDocument = (doc: Document) => {
    navigate('/workspace', { state: { document: doc } });
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documents</h1>
        <button
          onClick={handleCreateNew}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4" />
          New Document
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search documents and templates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            onClick={() => handleOpenDocument(doc)}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-md cursor-pointer transition-shadow"
          >
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-purple-600" />
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{doc.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(doc.created_at).toLocaleDateString()}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {doc.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documents;
